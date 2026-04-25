import React, { useEffect, useState } from 'react'
import PaymentReceipt from './PaymentReceipt.jsx'

const CreateInvoice = () => {
  const [form, setForm] = useState({ customerId: '', costType: '', paymentMode: '', invoiceNo: '', date: '', endDate: '', amount: '', advancePayment: '', inclusions: '', termsConditions: '', paymentPolicy: '', gstInvoiceType: '', gstNumber: '', bankId: '', bankName: '' })
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [referenceIds, setReferenceIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('create')
  const [formRefId, setFormRefId] = useState('');
  const [origin,setOrigin] = useState('');
  const [banks, setBanks] = useState([])
  const [bankSearch, setBankSearch] = useState('')
  const [filteredBanks, setFilteredBanks] = useState([])
  const [showBankDropdown, setShowBankDropdown] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      setError('')
      try {
        const url = activeTab === 'b2b' ? 'http://localhost:4000/b2b-operation-leads/' : 'http://localhost:4000/employeelead/transfer/all'
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch leads')
        const json = await res.json()
        const rows = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : [])
        const list = rows.map((l) => {
          const id = l._id || l.id || (l._id && String(l._id)) || ''
          const companyFallback = l.companyName || l.company_name || l.company || l.clientName || l.client_name || l.name || l.fullName || l.full_name
          const display = activeTab === 'b2b' ? (companyFallback || l.phone || 'Unknown') : (l.name || l.fullName || l.phone || 'Unknown')
          return { id, display, fullData: l }
        })
        setCustomers(list)
      } catch (err) {
        console.error(err)
        setError(err.message || 'Error')
      } finally {
        setLoading(false)
      }
    }

    // reset form/selection when switching tabs
    setForm({ customerId: '', costType: '', paymentMode: '', invoiceNo: '', date: '', endDate: '', amount: '', advancePayment: '', inclusions: '', termsConditions: '', paymentPolicy: '', gstInvoiceType: '', gstNumber: '', bankId: '', bankName: '' })
    setSelectedCustomer(null)
    fetchCustomers()
  }, [activeTab])

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch('http://localhost:4000/bank/')
        if (!res.ok) throw new Error('Failed to fetch banks')
        const json = await res.json()
        const bankList = Array.isArray(json) ? json : (json.data ? json.data : [])
        setBanks(bankList)
      } catch (err) {
        console.error('Error fetching banks:', err)
      }
    }
    fetchBanks()
  }, [])

  useEffect(() => {
    if (bankSearch.trim() === '') {
      setFilteredBanks(banks)
    } else {
      const filtered = banks.filter((bank) =>
        bank.bankName.toLowerCase().includes(bankSearch.toLowerCase())
      )
      setFilteredBanks(filtered)
    }
  }, [bankSearch, banks])

  useEffect(() => {
    const handleClickOutside = (event) => {
      const bankElement = document.querySelector('[data-bank-dropdown]')
      if (bankElement && !bankElement.contains(event.target)) {
        setShowBankDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const generateInvoiceNumber = async () => {
    try {
      const currentYear = new Date().getFullYear()
      const nextYear = currentYear + 1
      const yearSuffix = `${String(currentYear).slice(-2)}-${String(nextYear).slice(-2)}`

      // Fetch the last invoice number from the backend
      const res = await fetch('http://localhost:4000/invoice/last-number')
      let nextNumber = 1

      if (res.ok) {
        const json = await res.json()
        if (json.lastNumber) {
          // Extract the numeric part from the last invoice number
          const match = json.lastNumber.match(/\/(\d+)$/)
          if (match) {
            nextNumber = parseInt(match[1], 10) + 1
          }
        }
      }

      // Format the number with leading zeros (6 digits)
      const formattedNumber = String(nextNumber).padStart(6, '0')
      const invoiceNumber = `AD/${yearSuffix}/${formattedNumber}`
      
      return invoiceNumber
    } catch (err) {
      console.error('Error generating invoice number:', err)
      return null
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...form, [name]: value }

    // If customer changed, find and set the full customer data
    if (name === 'customerId') {
      const customer = customers.find((c) => c.id === value)
      const raw = customer ? customer.fullData : null
      const normalizedCustomer = raw ? normalizeLead(raw, activeTab === 'b2b') : null
      setSelectedCustomer(normalizedCustomer)
      setFormRefId('')
      setReferenceIds([])
      // If B2B, fetch reference IDs from the selected lead
      if (activeTab === 'b2b' && raw && raw._id) {
        const refIds = (raw.referenceId || raw.reference_id || raw.refIds || raw.ref_ids || '').toString().split(',').map(r => r.trim()).filter(r => r)
        setReferenceIds(refIds)
      }
      updatedForm.costType = 'land'
      updatedForm.gstInvoiceType = ''
      updatedForm.gstNumber = ''

      // Auto-populate amount and advance payment for land cost type
      if (normalizedCustomer) {
        const amount = (parseFloat(normalizedCustomer.totalAmount || 0) - parseFloat(normalizedCustomer.discount || 0)).toFixed(2)
        const advancePayment = normalizedCustomer.advanceRequired || 0
        updatedForm.amount = amount
        updatedForm.advancePayment = advancePayment.toString()
      } else {
        updatedForm.amount = ''
        updatedForm.advancePayment = ''
      }

      updatedForm.endDate = ''
      updatedForm.inclusions = ''
      updatedForm.termsConditions = ''
      updatedForm.paymentPolicy = ''

      // Auto-generate invoice number when customer is selected
      if (value) {
        generateInvoiceNumber().then((invoiceNo) => {
          if (invoiceNo) {
            setForm((prevForm) => ({ ...prevForm, invoiceNo }))
          }
        })
      }
    }

    // If cost type changed, auto-populate amount and advance payment from customer data
    if (name === 'costType' && selectedCustomer) {
      if (value === 'land') {
        const amount = (parseFloat(selectedCustomer.totalAmount || 0) - parseFloat(selectedCustomer.discount || 0)).toFixed(2)
        const advancePayment = selectedCustomer.advanceRequired || 0
        updatedForm.amount = amount
        updatedForm.advancePayment = advancePayment.toString()
      } else if (value === 'airfare') {
        const amount = (parseFloat(selectedCustomer.totalAirfare || 0) - parseFloat(selectedCustomer.discountAirfare || 0)).toFixed(2)
        const advancePayment = selectedCustomer.advanceAirfare || 0
        updatedForm.amount = amount
        updatedForm.advancePayment = advancePayment.toString()
      } else if (value === 'combo') {
        const landAmount = parseFloat(selectedCustomer.totalAmount || 0) - parseFloat(selectedCustomer.discount || 0)
        const airfareAmount = parseFloat(selectedCustomer.totalAirfare || 0) - parseFloat(selectedCustomer.discountAirfare || 0)
        const totalAmount = (landAmount + airfareAmount).toFixed(2)
        const advancePayment = (parseFloat(selectedCustomer.advanceRequired || 0) + parseFloat(selectedCustomer.advanceAirfare || 0)).toFixed(2)
        updatedForm.amount = totalAmount
        updatedForm.advancePayment = advancePayment
      }
    }

    setForm(updatedForm)
  }

  const handleRefIdChange = (e) => {
    setFormRefId(e.target.value)
  }

  const handleBankSelect = (bank) => {
    setForm({ ...form, bankId: bank._id, bankName: bank.bankName })
    setBankSearch(bank.bankName)
    setShowBankDropdown(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedCustomer) {
      alert('Please select a customer')
      return
    }
    try {
      // Use normalized fields from selectedCustomer (set by normalizeLead)
      const payload = {
        invoiceNo: form.invoiceNo,
        customerId: form.customerId,
        origin: origin,
        customerName: (selectedCustomer && (selectedCustomer.normalizedName || selectedCustomer.name)) || 'Unknown',
        customerEmail: (selectedCustomer && (selectedCustomer.normalizedEmail || selectedCustomer.email)) || '',
        customerPhone: (selectedCustomer && (selectedCustomer.normalizedPhone || selectedCustomer.phone)) || '',
        customerSnapshot: selectedCustomer && selectedCustomer.__raw ? selectedCustomer.__raw : selectedCustomer,
        date: form.date,
        endDate: form.endDate,
        amount: parseFloat(form.amount),
        advancePayment: parseFloat(form.advancePayment || 0),
        costType: form.costType,
        paymentMode: form.paymentMode,
        inclusions: form.inclusions,
        termsConditions: form.termsConditions,
        paymentPolicy: form.paymentPolicy,
        gstInvoiceType: form.gstInvoiceType,
        gstNumber: form.gstInvoiceType === 'with-gst' ? form.gstNumber : '',
        bankId: form.bankId,
        bankName: form.bankName
      }
      const res = await fetch('http://localhost:4000/invoice/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed to create invoice')
      alert('Invoice created successfully!')
      // Reset form
      setForm({ customerId: '', costType: '', paymentMode: '', invoiceNo: '', date: '', amount: '', inclusions: '', termsConditions: '', paymentPolicy: '', gstInvoiceType: '', gstNumber: '', bankId: '', bankName: '' })
      setBankSearch('')
      setSelectedCustomer(null)
    } catch (err) {
      alert('Error: ' + (err.message || 'Failed to create invoice'))
      console.error(err)
    }
  }
  // console.log(activeTab);
  
  useEffect(() => {
    if (activeTab === 'b2b') {
      setOrigin('b2b')
    } else if (activeTab === 'create') {
      setOrigin('sales')
    }
  }, [activeTab])
  // console.log(origin);

  // Normalize raw lead data to predictable fields used by invoice form
  function normalizeLead(raw, isB2B) {
    if (!raw) return null
    const n = { __raw: raw, ...raw }
    n.normalizedName = isB2B ? (raw.companyName || raw.company || raw.name) : (raw.name || raw.fullName || raw.companyName)
    n.normalizedEmail = isB2B ? (raw.companyEmail || raw.email) : (raw.email || raw.companyEmail)
    n.normalizedPhone = isB2B ? (raw.companyPhone || raw.phone) : (raw.phone || raw.companyPhone)
    // amounts: try a few common field names, fallback to 0
    n.totalAmount = raw.totalAmount ?? raw.total_land_amount ?? (raw.total || 0)
    n.discount = raw.discount ?? raw.discount_land ?? 0
    n.totalAirfare = raw.totalAirfare ?? raw.total_airfare ?? raw.airfare_total ?? 0
    n.discountAirfare = raw.discountAirfare ?? raw.discount_airfare ?? 0
    n.advanceRequired = raw.advanceRequired ?? raw.advance_required ?? (raw.advance || 0)
    n.advanceAirfare = raw.advanceAirfare ?? raw.advance_airfare ?? 0
    return n
  }
  // console.log(origin);
  
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">{activeTab === 'b2b' ? 'B2B Invoice' : 'Create Invoice'}</h2>
            <p className="text-sm text-gray-500 mt-1">{activeTab === 'b2b' ? 'Create invoices for B2B transfer leads.' : 'Generate invoices quickly for customers and transfers.'}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-full font-semibold shadow-sm transition ${activeTab === 'create' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            >
              Sales Invoice
            </button>
            <button
              onClick={() => setActiveTab('b2b')}
              className={`px-4 py-2 rounded-full font-semibold shadow-sm transition ${activeTab === 'b2b' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            >
              B2B Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Form Section */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">{activeTab === 'b2b' ? 'Customer (Company Name)' : 'Customer'}</label>
                  {loading ? (
                    <div className="text-sm text-gray-500">Loading customers...</div>
                  ) : error ? (
                    <div className="text-sm text-red-500">{error}</div>
                  ) : (
                    <select
                      name="customerId"
                      value={form.customerId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 bg-white text-gray-800"
                    >
                      <option value="">Select customer</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>{c.display}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">GST Invoice Type</label>
                  <select
                    name="gstInvoiceType"
                    value={form.gstInvoiceType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 bg-white text-gray-800"
                  >
                    <option value="">Select GST Invoice Type</option>
                    <option value="with-gst">With GST Invoice</option>
                    <option value="without-gst">Without GST Invoice</option>
                  </select>
                </div>

                {form.gstInvoiceType === 'with-gst' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">GST Number</label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={form.gstNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 placeholder-gray-400"
                      placeholder="e.g., 18AABCT1234H1Z0"
                    />
                  </div>
                )}

                {activeTab === 'b2b' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Reference ID</label>
                    <select
                      value={formRefId}
                      onChange={handleRefIdChange}
                      disabled={!form.customerId}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:bg-gray-50 disabled:cursor-not-allowed bg-white text-gray-800"
                    >
                      <option value="">Select Reference ID</option>
                      {referenceIds.map((refId, idx) => (
                        <option key={idx} value={refId}>{refId}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Cost Type</label>
                  <select
                    name="costType"
                    value={form.costType}
                    onChange={handleChange}
                    disabled={!selectedCustomer}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:bg-gray-50 disabled:cursor-not-allowed bg-white text-gray-800"
                  >
                    <option value="">Select cost type</option>
                    <option value="land">Land Package Cost</option>
                    <option value="airfare">Airfare / Train Fare Cost</option>
                    <option value="combo">Combo (Land Package + Airfare/Train Fare)</option>
                  </select>
                </div>

                <div className="relative" data-bank-dropdown>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Bank</label>
                  <input
                    type="text"
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    onFocus={() => setShowBankDropdown(true)}
                    placeholder="Search and select bank..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 placeholder-gray-400"
                  />
                  {showBankDropdown && filteredBanks.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                      {filteredBanks.map((bank) => (
                        <div
                          key={bank._id}
                          onClick={() => handleBankSelect(bank)}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-800 border-b border-gray-100 last:border-b-0"
                        >
                          {bank.bankName}
                        </div>
                      ))}
                    </div>
                  )}
                  {showBankDropdown && bankSearch.trim() !== '' && filteredBanks.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-3">
                      <p className="text-sm text-gray-500 text-center">No banks found</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Payment Mode</label>
                  <select
                    name="paymentMode"
                    value={form.paymentMode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 bg-white text-gray-800"
                  >
                    <option value="">Select payment mode</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="NetBanking">NetBanking</option>
                    <option value="NEFT">NEFT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Invoice No</label>
                  <input
                    name="invoiceNo"
                    value={form.invoiceNo}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 placeholder-gray-400 bg-gray-50 cursor-not-allowed text-gray-800"
                    placeholder="Auto-generated"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Advance Payment</label>
                  <input
                    type="number"
                    name="advancePayment"
                    value={form.advancePayment}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Inclusions (max 2000 chars)</label>
                  <textarea
                    name="inclusions"
                    value={form.inclusions}
                    onChange={handleChange}
                    maxLength="2000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 resize-none placeholder-gray-400"
                    placeholder="Enter inclusions"
                    rows="3"
                  />
                  <div className="text-xs text-gray-400 mt-1">{form.inclusions.length}/2000</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Terms & Conditions (max 2000 chars)</label>
                  <textarea
                    name="termsConditions"
                    value={form.termsConditions}
                    onChange={handleChange}
                    maxLength="2000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 resize-none placeholder-gray-400"
                    placeholder="Enter terms and conditions"
                    rows="3"
                  />
                  <div className="text-xs text-gray-400 mt-1">{form.termsConditions.length}/2000</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Payment Policy (max 2000 chars)</label>
                  <textarea
                    name="paymentPolicy"
                    value={form.paymentPolicy}
                    onChange={handleChange}
                    maxLength="2000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 resize-none placeholder-gray-400"
                    placeholder="Enter payment policy"
                    rows="3"
                  />
                  <div className="text-xs text-gray-400 mt-1">{form.paymentPolicy.length}/2000</div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl shadow-md hover:opacity-95 transition"
                  >
                    Create Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const content = document.getElementById('receipt-to-print')
                      if (!content) return window.print()
                      const printWindow = window.open('', '_blank')
                      printWindow.document.open()
                      printWindow.document.write(`<!doctype html><html><head><title>Receipt</title></head><body>${content.innerHTML}</body></html>`)
                      printWindow.document.close()
                      printWindow.focus()
                      printWindow.onload = () => {
                        printWindow.print()
                        setTimeout(() => { printWindow.close() }, 500)
                      }
                    }}
                    disabled={!selectedCustomer}
                    className="flex-1 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-sm hover:shadow transition disabled:opacity-50"
                  >
                    Print
                  </button>
                </div>
              </form>
            </div>

            {/* Receipt Preview Section */}
            <div>
              {selectedCustomer ? (
                <div id="receipt-to-print" className="bg-white p-6 rounded-2xl shadow-inner border border-gray-50">
                  <PaymentReceipt
                    customer={selectedCustomer}
                    invoiceNo={form.invoiceNo}
                    date={form.date}
                    endDate={form.endDate}
                    amount={form.amount}
                    advancePayment={form.advancePayment ? parseFloat(form.advancePayment) : 0}
                    paymentMode={form.paymentMode}
                    costType={form.costType}
                    inclusions={form.inclusions}
                    termsConditions={form.termsConditions}
                    paymentPolicy={form.paymentPolicy}
                    isB2B={activeTab === 'b2b'}
                    referenceId={formRefId}
                    gstInvoiceType={form.gstInvoiceType}
                    gstNumber={form.gstNumber}
                    bankName={form.bankName}
                  />
                </div>
              ) : (
                <div className="bg-white p-8 rounded-2xl text-center text-gray-400 border border-gray-50">
                  <p className="text-lg font-semibold text-gray-700">Select a customer to preview receipt</p>
                  <p className="text-sm mt-2">Receipt preview will appear here once a customer is selected.</p>
                </div>
              )}
            </div>
          </div>
        
      </div>
    </div>
  )
}

export default CreateInvoice

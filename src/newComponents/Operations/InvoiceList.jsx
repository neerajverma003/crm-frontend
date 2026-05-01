import React, { useEffect, useState, useRef } from 'react'
import PaymentReceipt from './PaymentReceipt.jsx'

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [expandedCustomers, setExpandedCustomers] = useState({})
  const receiptRef = useRef(null)
  const [activeTab, setActiveTab] = useState('sales')

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:4000/invoice/all')
      if (!res.ok) throw new Error('Failed to fetch invoices')
      const json = await res.json()
      setInvoices(json.data || [])
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error fetching invoices')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  const handleView = async (invoiceId) => {
    setModalLoading(true)
    try {
      const res = await fetch(`http://localhost:4000/invoice/${invoiceId}`)
      if (!res.ok) throw new Error('Failed to fetch invoice')
      const json = await res.json()
      setSelectedInvoice(json.data || null)
    } catch (err) {
      console.error(err)
      const inv = invoices.find((i) => i._id === invoiceId)
      setSelectedInvoice(inv || null)
    } finally {
      setModalLoading(false)
    }
  }

  const handlePrint = () => {
    if (!receiptRef.current) return
    const printWindow = window.open('', '_blank')
    printWindow.document.open()
    printWindow.document.write(`<!doctype html><html><head><title>Invoice</title></head><body>${receiptRef.current.innerHTML}</body></html>`)
    printWindow.document.close()
    printWindow.focus()
    printWindow.onload = () => {
      printWindow.print()
      setTimeout(() => { printWindow.close() }, 500)
    }
  }

  const toggleCustomerExpand = (customerId) => {
    setExpandedCustomers((prev) => ({
      ...prev,
      [customerId]: !prev[customerId]
    }))
  }

  console.log(invoices);


  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Invoice List</h2>
        <button
          onClick={fetchInvoices}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {loading ? (
        <div className="text-gray-500">Loading invoices...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : invoices.length === 0 ? (
        <div className="text-gray-500">No invoices yet.</div>
      ) : (
        <div>

          <div className="flex items-center justify-between mb-6">

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('sales')}
                className={`px-4 py-2 rounded-full font-semibold shadow-sm transition ${activeTab === 'sales' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(
              invoices.filter(inv => inv.origin === activeTab).reduce((groups, inv) => {
                // const customerKey = inv.customerId?._id || inv.customerId || 'unknown'
                const customerKey = (inv.customerPhone || 'unknown')
                  .trim()
                  .toLowerCase()
                // console.log(customerKey, inv);

                if (!groups[customerKey]) {
                  groups[customerKey] = {
                    customerName: inv.customerName || 'Unknown Customer',
                    customerEmail: inv.customerEmail || '',
                    customerPhone: inv.customerPhone || '',
                    invoices: []
                  }
                }
                groups[customerKey].invoices.push(inv)
                console.log(groups);

                return groups
              }, {})
            ).map(([customerId, groupData]) => (
              <div
                key={customerId}
                onClick={() => toggleCustomerExpand(customerId)}
                className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between p-7 h-80"
              >
                {/* Top Section - Customer Info */}
                <div className="mb-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{groupData.customerName}</h3>
                  <div className="space-y-2.5">
                    {groupData.customerEmail && (
                      <div className="flex items-center gap-2.5">
                        <span className="text-indigo-500 text-sm">✉</span>
                        <span className="text-sm font-medium text-gray-700 truncate hover:text-indigo-600 transition">{groupData.customerEmail}</span>
                      </div>
                    )}
                    {groupData.customerPhone && (
                      <div className="flex items-center gap-2.5">
                        <span className="text-indigo-500 text-sm">☎</span>
                        <span className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">{groupData.customerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Middle Section - Land & Air Costs */}
                <div className="flex gap-2 flex-1">
                  {(() => {
                    const landInvoice = groupData.invoices.find((inv) => inv.costType && inv.costType.toLowerCase().includes('land'));
                    const airTrainInvoice = groupData.invoices.find((inv) => inv.costType && (inv.costType.toLowerCase().includes('air') || inv.costType.toLowerCase().includes('train')));

                    const landCost = landInvoice ? parseFloat(landInvoice.amount || 0) : 0;
                    const airTrainCost = airTrainInvoice ? parseFloat(airTrainInvoice.amount || 0) : 0;

                    const formatAmount = (num) => {
                      return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
                    };

                    return (
                      <>
                        {landInvoice && (
                          <div className="bg-gray-50 rounded p-2 border border-gray-100 flex-1">
                            <p className="text-xs font-semibold text-gray-600 uppercase mb-0.5">Land Cost</p>
                            <p className="text-lg font-bold text-gray-900">₹{formatAmount(landCost)}</p>
                          </div>
                        )}
                        {airTrainInvoice && (
                          <div className="bg-gray-50 rounded p-2 border border-gray-100 flex-1">
                            <p className="text-xs font-semibold text-gray-600 uppercase mb-0.5">Air/Train Fare</p>
                            <p className="text-lg font-bold text-gray-900">₹{formatAmount(airTrainCost)}</p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Bottom - Expand Indicator */}
                <div className="flex items-center justify-center pt-4 border-t border-gray-100 text-gray-600 hover:text-gray-900 transition">
                  <span className="text-sm font-semibold">{expandedCustomers[customerId] ? '▲ Hide' : '▼ View Invoices'}</span>
                </div>

                {/* Expanded Nested Cards Modal */}
                {expandedCustomers[customerId] && (
                  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 overflow-auto max-h-[85vh] border border-gray-200">
                      {/* Modal Header */}
                      <div className="sticky top-0 bg-white p-6 flex justify-between items-center border-b border-gray-100 z-50">
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900">{groupData.customerName}</h2>
                          <p className="text-sm text-gray-500 mt-1">{groupData.invoices.length} invoices</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleCustomerExpand(customerId)
                          }}
                          className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold hover:bg-gray-200 transition"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Invoice Cards Grid */}
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                        {groupData.invoices.map((inv) => (
                          <div key={inv._id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <p className="text-base font-semibold text-gray-900">{inv.invoiceNo}</p>
                                <p className="text-sm text-gray-500 mt-1">{formatDate(inv.date)}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-md text-white text-xs font-semibold ${inv.status === 'issued' ? 'bg-gray-600' :
                                inv.status === 'paid' ? 'bg-emerald-600' :
                                  inv.status === 'overdue' ? 'bg-rose-600' :
                                    'bg-gray-500'
                                }`}>
                                {inv.status || 'draft'}
                              </span>
                            </div>

                            <div className="space-y-3 mb-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                              <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Amount</p>
                                <p className="text-xl font-bold text-gray-900">₹ {parseFloat(inv.amount).toFixed(2)}</p>
                              </div>
                              {inv.advancePayment > 0 && (
                                <div className="pt-3 border-t border-gray-100">
                                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Advance Payment</p>
                                  <p className="text-lg font-bold text-indigo-600">₹ {parseFloat(inv.advancePayment).toFixed(2)}</p>
                                </div>
                              )}
                              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                                <div>
                                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Type</p>
                                  <p className="text-sm font-semibold capitalize text-gray-800">{inv.costType}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Mode</p>
                                  <p className="text-sm font-semibold text-gray-800">{inv.paymentMode}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleView(inv._id)
                                }}
                                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold text-sm"
                              >
                                View Receipt
                              </button>
                              <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-sm">
                                Edit
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 overflow-auto" style={{ maxHeight: '90vh' }}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Invoice Receipt</h3>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm font-medium">
                  Print
                </button>

                <button onClick={() => setSelectedInvoice(null)} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition text-sm font-medium">
                  Close
                </button>
              </div>
            </div>
            <div className="p-4" ref={receiptRef}>
              {modalLoading ? (
                <div className="text-center p-8">Loading receipt...</div>
              ) : (
                <PaymentReceipt
                  customer={selectedInvoice.customerSnapshot || selectedInvoice.customerId || { name: selectedInvoice.customerName, email: selectedInvoice.customerEmail, phone: selectedInvoice.customerPhone }}
                  invoiceNo={selectedInvoice.invoiceNo}
                  date={selectedInvoice.date}
                  endDate={selectedInvoice.endDate}
                  amount={selectedInvoice.amount}
                  advancePayment={selectedInvoice.advancePayment}
                  paymentMode={selectedInvoice.paymentMode}
                  costType={selectedInvoice.costType}
                  inclusions={selectedInvoice.inclusions}
                  termsConditions={selectedInvoice.termsConditions}
                  paymentPolicy={selectedInvoice.paymentPolicy}
                  isB2B={selectedInvoice.origin === 'b2b'}
                  referenceId={selectedInvoice.referenceId || ''}
                  gstInvoiceType={selectedInvoice.gstInvoiceType}
                  gstNumber={selectedInvoice.gstNumber}
                  bankName={selectedInvoice.bankName}
                  gstPercentage={selectedInvoice.gstPercentage}
                  gstAmount={selectedInvoice.gstAmount}
                  totalPreviousAdvancePayment={selectedInvoice.totalPreviousAdvancePayment || 0}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceList

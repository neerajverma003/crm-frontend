import { Bold } from 'lucide-react'
import React from 'react'

const PaymentReceipt = ({ customer, invoiceNo, date, endDate, amount, advancePayment, paymentMode, costType, inclusions, termsConditions, paymentPolicy, isB2B, referenceId }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  // Calculate total quantity as persons + children
  const totalQty = isB2B 
    ? (parseInt(customer?.noOfPerson || customer?.no_of_person || 0, 10) + parseInt(customer?.noOfChild || customer?.no_of_child || 0, 10))
    : (parseInt(customer?.noOfPerson || 0, 10) + parseInt(customer?.noOfChild || 0, 10))



  // Build travellers display: show adults and optional children (no 0), and child ages if present
  const travellersDisplay = (() => {
    const adults = parseInt(customer?.noOfPerson || 0, 10)
    const children = parseInt(customer?.noOfChild || 0, 10)
    const ages = Array.isArray(customer?.childAges) ? customer.childAges.filter(Boolean) : []
    let text = `${adults} Adult`
    if (children) text += ` + ${children} Child`
    if (ages && ages.length) text += ` (${ages.map((a) => `${a}yrs`).join(', ')})`
    return text
  })()

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
          padding: 20px;
        }

        .container {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          background-color: white;
          padding: 15mm;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        .header {
          text-align: center;
          border-bottom: 1px solid #000;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }

        .logo {
          position: relative;
          display: inline-block;
          margin-bottom: 10px;
        }

        .company-info {
          font-size: 11px;
          line-height: 1.5;
          color: #000;
          margin-top: 10px;
        }

        .receipt-title {
          text-align: center;
          font-size: 22px;
          font-weight: bold;
          text-decoration: underline;
          margin: 25px 0 20px 0;
        }

        .top-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 11px;
        }

        .left-info {
          width: 65%;
        }

        .left-info div {
          margin-bottom: 3px;
        }

        .right-info {
          width: 30%;
          text-align: right;
        }

        .right-info div {
          margin-bottom: 3px;
        }

        .description-title {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          text-decoration: underline;
          margin: 25px 0 15px 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          table-layout: fixed;
        }

        table, th, td {
          border: 1px solid #000;
        }

        th {
          padding: 8px;
          text-align: center;
          font-weight: bold;
          background-color: #fff;
        }

        td {
          padding: 8px;
          text-align: center;
          word-break: break-word;
          white-space: normal;
        }

        .main-cell {
          height: 180px;
          min-height: 180px;
          vertical-align: top;
        }

        .summary-row td:first-child {
          text-align: right;
          padding-right: 20px;
        }

        .col-num { width: 5%; }
        .col-particular { width: 40%; text-align: left; }
        .col-payment-mode { width: 15%; }
        .col-qty { width: 10%; }
        .col-value { width: 15%; }
        .col-payment { width: 15%; }

        .page-break-container {
          page-break-before: always;
          margin-top: 20px;
          padding-top: 20px;
        }

        @media print {
          .page-break-container {
            page-break-before: always;
            margin-top: 0;
            padding-top: 0;
          }
        }
          body {
            background-color: white;
            padding: 0;
          }

          .container {
            box-shadow: none;
            padding: 10mm;
          }
        }
      `}</style>

      <div className="container">
        <div className="header">
          <div className="logo">
            <img
              src="http://admireholidays.com/assets/AdmireLogo-D4RLcMNu.png"
              alt="Admire Holidays"
              style={{
                maxWidth: '300px',
                height: 'auto'
              }}
            />
          </div>

          <div className="company-info">
            <strong>Address:</strong> Plot No.34 ( First Floor), Sewak Park, Dwarka
            More, Delhi . 110059
            <br />
            <strong>Phone:</strong> 01140612834 / 18001214252
            <br />
            <strong>Mail:</strong> info@admireholidays.com /
            accounts@admireholidays.com
            <br />
            <strong>Website:</strong> www.admireholidays.com
            <br />
            <strong>GSTIN:</strong> 07AAXCA9254E1Z7
          </div>
        </div>

        <div className="receipt-title">Payment Receipt</div>

        <div className="top-section">
          <div className="left-info">
            <div><strong>Bill To/ Invoice No</strong></div>
            <div><strong>Name :</strong> {isB2B ? (customer?.normalizedName || customer?.name || 'N/A') : (customer?.name || 'N/A')}</div>
            <div><strong>Reference ID :</strong> {referenceId || 'N/A'}</div>
            <div><strong>Email :</strong> {isB2B ? (customer?.normalizedEmail || customer?.email || 'N/A') : (customer?.email || 'N/A')}</div>
            <div><strong>Address :</strong> {customer?.departureCity || 'N/A'}</div>
            <div><strong>Mob :</strong> {customer?.phone || 'N/A'}</div>
            <div><strong>Service Type :</strong> {customer?.tripType || 'Tour'}</div>
            <div><strong>Start Date :</strong> {formatDate(customer?.expectedTravelDate)}</div>
            <div><strong>End Date :</strong> {endDate ? formatDate(endDate) : (customer?.noOfDays ? `${customer.noOfDays} days` : 'N/A')}</div>
          </div>

          <div className="right-info">
            <div><strong>Invoice Date :</strong> {formatDate(date)}</div>
            {/* <div><strong>Advance Payment :</strong> ₹{parseFloat(advancePayment || 0).toFixed(2)}</div> */}
            <div style={{ marginTop: '100px' }}>
              <strong>Invoice No :</strong> {invoiceNo || 'N/A'}
            </div>
          </div>
        </div>

        <div className="description-title">Description Details</div>

        <table>
          <thead>
            <tr>
              <th className="col-num">#</th>
              <th className="col-particular">Particular</th>
              <th className="col-payment-mode">Payment<br />Mode</th>
              <th className="col-qty">Qty</th>
              <th className="col-value">Value</th>
              <th className="col-payment">Payment</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="main-cell">1</td>
              <td className="main-cell" style={{ textAlign: 'left', width: '100%', overflow: 'visible' }}>
                <div style={{ fontWeight: '600', width: '100%' }}>{customer?.destination || 'Land'} Tour Package</div>
                <div style={{ marginTop: '6px', fontSize: '11px', color: '#333', width: '100%' }}>
                  <strong>Travellers :</strong> {travellersDisplay}
                </div>
                {inclusions && (
                  <div style={{ marginTop: '12px', fontSize: '12px', color: '#555', whiteSpace: 'pre-wrap', wordBreak: 'break-word', width: '100%', display: 'block' }}>
                    <strong>Inclusions :</strong>
                    <div style={{ marginTop: '6px', width: '100%', display: 'block' }}>{inclusions}</div>
                  </div>
                )}
              </td>
              <td className="main-cell">{paymentMode || '-'}</td>
              <td className="main-cell">{totalQty}</td>
              <td className="main-cell">₹ {totalQty > 0 ? (amount / totalQty).toFixed(2) : '0'}</td>
              <td className="main-cell">₹ {amount || '0'}</td>
            </tr>

            <tr className="summary-row">
              <td colSpan="5"><strong>Total Balance</strong></td>
              <td>₹ {amount || '0'}</td>
            </tr>

            <tr className="summary-row">
              <td colSpan="5"><strong>Other Charges</strong></td>
              <td>₹ 0</td>
            </tr>

            <tr className="summary-row">
              <td colSpan="5"><strong>Advance Payment</strong></td>
              <td>₹ {advancePayment}</td>
            </tr>

            <tr className="summary-row">
              <td colSpan="5"><strong>Balance Due</strong></td>
              <td>₹ {Math.max(0, (parseFloat(amount || 0) - parseFloat(advancePayment || 0)).toFixed(2))}</td>
            </tr>
          </tbody>
        </table>

        <div className="page-break-container">
          {termsConditions && (
            <div style={{ marginTop: '16px', fontSize: '12px', color: '#333', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              <strong>Terms & Conditions :</strong>
              <div style={{ marginTop: '6px' }}>{termsConditions}</div>
            </div>
          )}

          {paymentPolicy && (
            <div style={{ marginTop: '16px', fontSize: '12px', color: '#333', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              <strong>Payment Policy :</strong>
              <div style={{ marginTop: '6px' }}>{paymentPolicy}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default PaymentReceipt

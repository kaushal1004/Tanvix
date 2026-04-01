import React, { useState } from "react";

const Fees = ({ fees }) => {
  const [paymentAmount, setPaymentAmount] = useState("");

  const handlePayment = () => {
    // Payment logic
    console.log("Processing payment", paymentAmount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">💳 Fees / Payments</h2>
      <p>
        <strong>Status:</strong>{" "}
        <span
          className={`px-2 py-1 rounded ${fees.status === "Paid" ? "bg-green-200" : "bg-red-200"}`}
        >
          {fees.status}
        </span>
      </p>
      <h3 className="font-semibold mt-4">Payment History</h3>
      <ul className="list-disc list-inside mb-4">
        {fees.history.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      {fees.status === "Pending" && (
        <div className="border rounded p-4">
          <h3 className="font-semibold">Make Payment</h3>
          <input
            type="number"
            placeholder="Amount"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button
            onClick={handlePayment}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Pay Now
          </button>
        </div>
      )}
      {fees.invoiceDownload && (
        <button className="bg-gray-500 text-white px-4 py-2 rounded mt-4">
          Download Invoice
        </button>
      )}
    </div>
  );
};

export default Fees;

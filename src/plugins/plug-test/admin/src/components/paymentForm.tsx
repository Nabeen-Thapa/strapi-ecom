// PaymentForm.tsx
import React, { useState } from "react";

// Type for form data
export interface PaymentFormData {
  name: string;
  email: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  amount: number;
}

// Type for form errors
interface PaymentFormErrors {
  name?: string;
  email?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  amount?: string;
}

// Props for the component
interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    amount: 0,
  });

  const [errors, setErrors] = useState<PaymentFormErrors>({});

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  // Validate form fields
  const validate = (): boolean => {
    const newErrors: PaymentFormErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.cardNumber) newErrors.cardNumber = "Card number is required";
    if (!formData.expiry) newErrors.expiry = "Expiry is required";
    if (!formData.cvv) newErrors.cvv = "CVV is required";
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Amount must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(formData);
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Payment Form, send money get product
        </h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Card Number */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            Card Number
          </label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            maxLength={16}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
          )}
        </div>

        {/* Expiry & CVV */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">Expiry</label>
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={formData.expiry}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.expiry && (
              <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
            )}
          </div>

          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">CVV</label>
            <input
              type="password"
              name="cvv"
              maxLength={4}
              value={formData.cvv}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.cvv && (
              <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            min={1}
            value={formData.amount}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
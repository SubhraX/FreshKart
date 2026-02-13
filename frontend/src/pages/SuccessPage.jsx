import React, { useEffect } from "react";

const SuccessPage = ({ cartItems, onAddToCart, setView }) => {

  useEffect(() => {
    cartItems.forEach(item => onAddToCart(item, 0));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        Payment Successful 🎉
      </h1>
      <p className="text-gray-600 mb-6">
        Your order has been placed successfully.
      </p>
      <button
        onClick={() => setView({ name: 'home' })}
        className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default SuccessPage;

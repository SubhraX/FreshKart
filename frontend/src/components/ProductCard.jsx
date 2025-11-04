import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(0);

    const handleIncrement = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onAddToCart(product, newQuantity);
    };

    const handleDecrement = () => {
        if (quantity > 0) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            onAddToCart(product, newQuantity);
        }
    };

    const handleImageClick = () => {
        if (product.absoluteUrl) {
            window.open(product.absoluteUrl, '_blank');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 flex flex-col">
            <img
                src={product.imageUrl}
                alt={product.productName}
                className="w-full h-48 object-contain mb-3 cursor-pointer"
                onClick={handleImageClick}
            />
            
            <div className="flex-grow">
                <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 min-h-[40px]">
                    {product.productName}
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">
                        ₹{product.discountedPrice}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                        ₹{product.price}
                    </span>
                </div>
            </div>

            {quantity === 0 ? (
                <button
                    onClick={handleIncrement}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                >
                    Add to Cart
                </button>
            ) : (
                <div className="flex items-center justify-between bg-green-50 border-2 border-green-600 rounded-lg p-2">
                    <button
                        onClick={handleDecrement}
                        className="text-green-600 hover:bg-green-100 rounded p-1 transition-colors"
                    >
                        <Minus size={18} />
                    </button>
                    <span className="font-bold text-green-700">{quantity}</span>
                    <button
                        onClick={handleIncrement}
                        className="text-green-600 hover:bg-green-100 rounded p-1 transition-colors"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
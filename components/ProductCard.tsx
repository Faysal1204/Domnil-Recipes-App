import React from 'react';
import type { Product } from '../types';

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="relative">
            <img className="w-full h-48 object-contain p-2 bg-white" src={product.image} alt={product.title} loading="lazy"/>
        </div>
        <div className="p-4 border-t">
            <h3 className="font-semibold text-sm text-gray-800 h-10 truncate">{product.title}</h3>
        </div>
    </div>
  );
};

export default ProductCard;
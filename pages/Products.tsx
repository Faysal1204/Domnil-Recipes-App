import React, { useState } from 'react';
import { spoonacularService } from '../services/spoonacularService';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Products = () => {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query.trim()) {
            setError("Please enter a product name to search.");
            return;
        }

        setLoading(true);
        setError(null);
        setSearched(true);
        setProducts([]);

        try {
            const data = await spoonacularService.searchProducts(query);
            setProducts(data.products);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-gray-800">Find Food Products</h1>
                <p className="mt-1 text-gray-600">Search for packaged food products and nutritional information.</p>
            </header>

            <div className="bg-white p-4 rounded-xl shadow-md">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., greek yogurt, protein bars..."
                        className="flex-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    />
                    <button type="submit" className="w-full sm:w-auto bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300" disabled={loading}>
                        {loading ? '...' : 'Search'}
                    </button>
                </form>
            </div>

            {loading && <Loader />}
            {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

            {!loading && !error && searched && products.length === 0 && (
                <p className="text-center text-gray-600 mt-8">No products found. Try a different search term!</p>
            )}

            {!loading && !error && products.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;
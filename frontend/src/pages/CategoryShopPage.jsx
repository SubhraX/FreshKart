import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../utils/axios';
import ProductCard from '../components/ProductCard';

const CategoryShopPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'Baby Care',
    'Bakery, Cakes & Dairy',
    'Beauty & Hygiene',
    'Beverages',
    'Cleaning & Household',
    'Eggs, Meat & Fish',
    'Foodgrains, Oil & Masala',
    'Fruits & Vegetables',
    'Snacks & Branded Foods'
  ];

  const categoryToUrl = (cat) => {
    return cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const urlToCategory = (url) => {
    return categories.find(cat => categoryToUrl(cat) === url) || null;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/items/get-all-items');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (category) {
      const actualCategory = urlToCategory(category);
      setSelectedCategory(actualCategory || 'all');
    } else {
      setSelectedCategory('all');
    }
  }, [category]);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'all' && selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  const handleCategoryClick = (cat) => {
    if (cat === 'all') {
      setSelectedCategory('all');
      window.history.pushState({}, '', '/categories');
    } else {
      const urlCategory = categoryToUrl(cat);
      setSelectedCategory(cat);
      window.history.pushState({}, '', `/categories/${urlCategory}`);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Shop by Category</h1>
          </div>

          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryClick('all')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-green-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  All Products ({products.length})
                </button>
                {categories.map((cat) => {
                  const categoryProductCount = products.filter(
                    product => product.category === cat
                  ).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat
                          ? 'bg-green-500 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {cat} ({categoryProductCount})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500 text-lg">
                  {searchQuery 
                    ? 'No products found matching your search.'
                    : 'No products found in this category.'}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-gray-600">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                  {selectedCategory !== 'all' && (
                    <span className="ml-2 text-green-600 font-medium">
                      in {selectedCategory}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product._id || product.id} 
                      product={product} 
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryShopPage;
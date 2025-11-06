import React, { useState, useEffect, useMemo } from 'react';
import { axiosInstance } from '../utils/axios';

// Import our new components
import ShopHeader from '../components/ShopHeader';
import CategorySidebar from '../components/CategorySidebar';
import ProductGrid from '../components/ProductGrid';

const CategoryShopPage = ({ categoryName, setView, onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // We explicitly set 'all' if no categoryName is passed, for the /shop route
  const selectedCategory = categoryName || 'all';

  // Dynamically create the category list from product data
  // This helps ensure accurate counts and category names
  const categories = useMemo(() => {
    const categoryMap = new Map();
    products.forEach(product => {
      // Ensure product.category exists and is a string
      if (product.category && typeof product.category === 'string') {
        categoryMap.set(product.category, (categoryMap.get(product.category) || 0) + 1);
      }
    });

    // Sort categories alphabetically
    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  // Effect to fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/items/get-all-items');
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on state
  const filteredProducts = useMemo(() => {
    let currentFiltered = products; // Use a different variable name to avoid confusion

    // Filter by selected category
    if (selectedCategory !== 'all') {
      currentFiltered = currentFiltered.filter(product =>
        // Ensure product.category is checked safely
        product.category && typeof product.category === 'string' && product.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      currentFiltered = currentFiltered.filter(product =>
        // Safely check product fields for search query
        (product.name && product.name.toLowerCase().includes(query)) ||
        (product.title && product.title.toLowerCase().includes(query)) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.brand && product.brand.toLowerCase().includes(query)) // Added brand to search
      );
    }
    return currentFiltered;
  }, [selectedCategory, searchQuery, products]);

  // Handlers
  const handleCategoryClick = (cat) => {
    if (cat === 'all') {
      setView({ name: 'shop', categoryName: 'all' }); // Navigate to /shop
    } else {
      setView({ name: 'shop', categoryName: cat }); // Navigate to /category/:slug
    }
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);

  // When clicking the back arrow on the shop page, go to the home page
  const handleBack = () => setView({ name: 'home' });

  // Render Logic
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onBack={handleBack}
      />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6"> {/* Enable flex-row on large screens */}
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
            totalProducts={products.length}
          />
          <div className="flex-1">
            <ProductGrid
              products={filteredProducts}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onAddToCart={onAddToCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryShopPage;
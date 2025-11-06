import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react'; // Keep for the cart page example

import Header from './components/Header';
import HomePage from './pages/HomePage';
import CategoryShopPage from './pages/CategoryShopPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const [view, setView] = useState({ name: 'home' });

  // Helper to convert URL slug to readable category name
  const slugToName = (slug) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Effect to read initial URL path on first load
  useEffect(() => {
    const path = window.location.pathname;
    
    if (path === '/login') {
      setView({ name: 'login' });
    } else if (path === '/cart') {
      setView({ name: 'cart' });
    } else if (path === '/shop') { // Specific route for "All Products"
      setView({ name: 'shop', categoryName: 'all' }); // Explicitly set 'all'
    } else if (path.startsWith('/category/')) {
      const categorySlug = path.replace('/category/', '');
      const categoryName = slugToName(categorySlug);
      setView({ name: 'shop', categoryName: categoryName });
    } else {
      setView({ name: 'home' }); // Default to home (categories selection)
    }
  }, []);

  // Effect to handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      
      if (path === '/login') {
        setView({ name: 'login' });
      } else if (path === '/cart') {
        setView({ name: 'cart' });
      } else if (path === '/shop') { // Specific route for "All Products"
        setView({ name: 'shop', categoryName: 'all' }); // Explicitly set 'all'
      } else if (path.startsWith('/category/')) {
        const categorySlug = path.replace('/category/', '');
        const categoryName = slugToName(categorySlug);
        setView({ name: 'shop', categoryName: categoryName });
      } else {
        setView({ name: 'home' }); // Default to home
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Custom navigation function
  const navigate = (newView) => {
    setView(newView);
    
    let path = '/';
    if (newView.name === 'login') {
      path = '/login';
    } else if (newView.name === 'cart') {
      path = '/cart';
    } else if (newView.name === 'shop') {
      if (newView.categoryName && newView.categoryName !== 'all') { // If a specific category is selected
        const slug = newView.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        path = `/category/${slug}`;
      } else {
        path = '/shop'; // Route for "All Products"
      }
    }
    // If newView.name is 'home', path remains '/'
    
    window.history.pushState({}, '', path);
  };

  const handleAddToCart = (product, newQuantity) => {
    console.log(`Updated cart: ${product.ProductName}, Qty: ${newQuantity}`);
  };

  const renderView = () => {
    switch (view.name) {
      case 'shop':
        return <CategoryShopPage categoryName={view.categoryName} setView={navigate} onAddToCart={handleAddToCart} />;
      case 'login':
        return <LoginPage setView={navigate} />;
      case 'cart':
        return (
            <div className="pt-24 pb-12 max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-2xl mt-10 text-center">
                <h2 className="text-4xl font-extrabold text-green-700 mb-6">Shopping Cart & Payment (Next Step)</h2>
                <p className="text-gray-600 mb-8">This page will display cart items and payment options.</p>
                <button
                    onClick={() => navigate({ name: 'home' })}
                    className="flex items-center mx-auto text-sm text-green-600 hover:text-green-700 transition-colors font-medium"
                >
                    <ChevronLeft size={16} className="mr-1" /> Back to Home
                </button>
            </div>
        );
      case 'home':
      default:
        return <HomePage setView={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
      
      <Header setView={navigate} />
      
      <main className="min-h-[calc(100vh-64px)]">
        {renderView()}
      </main>
      
      <footer className="mt-12 pt-6 pb-6 border-t border-gray-200 text-center text-xs text-gray-400 max-w-6xl mx-auto px-4">
        <p>FreshCart Frontend: Refactored to component-based architecture.</p>
      </footer>
    </div>
  );
}
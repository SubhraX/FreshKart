import React from 'react';

const CategorySidebar = ({ categories, selectedCategory, onCategoryClick, totalProducts }) => {
  return (
    <div className="hidden lg:block lg:w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Categories</h2>
        <div className="space-y-2">
          
          {/* All Products button */}
          <button
            onClick={() => onCategoryClick('all')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium 
                        transition-colors duration-300 ease-out 
                        ${selectedCategory === 'all'
                            ? 'bg-green-600 text-white' 
                            : 'text-gray-700 hover:bg-green-100 hover:text-green-800'
                        }`}
          >
            All Products ({totalProducts})
          </button>

          {/* Individual Category buttons */}
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onCategoryClick(cat.name)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium
                          transition-colors duration-300 ease-out
                          ${selectedCategory === cat.name
                              ? 'bg-green-600 text-white' 
                              : 'text-gray-700 hover:bg-green-100 hover:text-green-800'
                          }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
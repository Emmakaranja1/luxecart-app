import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, Category, ProductFilters, SortOption } from '@/types';
import { productsApi, categoriesApi } from '@/services/api';
import { ProductGrid } from '@/components/product';
import { Button } from '@/components/common';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<ProductFilters>({
    categoryId: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    inStock: searchParams.get('inStock') === 'true' || undefined,
  });

  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) || 'newest'
  );

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters, sortBy]);

  const loadCategories = async () => {
    try {
      const cats = await categoriesApi.getAll();
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const prods = await productsApi.getAll(filters, sortBy);
      setProducts(prods);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateSearchParams(newFilters, sortBy);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    updateSearchParams(filters, sort);
  };

  const updateSearchParams = (f: ProductFilters, s: SortOption) => {
    const params = new URLSearchParams();
    if (f.categoryId) params.set('category', f.categoryId);
    if (f.search) params.set('search', f.search);
    if (f.inStock) params.set('inStock', 'true');
    params.set('sort', s);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({});
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters = filters.categoryId || filters.search || filters.inStock;

  return (
    <div className="page-transition">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-black text-gradient-hero mb-4">
            ALL PRODUCTS
          </h1>
          <p className="text-gray-400 text-lg">
            Discover {products.length} premium products
          </p>
        </div>

        {/* Filter Bar */}
        <div className="card-glass p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>

            {/* Category Filter - Desktop */}
            <div className="hidden md:block">
              <select
                value={filters.categoryId || ''}
                onChange={(e) => handleFilterChange('categoryId', e.target.value || undefined)}
                className="px-4 py-2 bg-dark-card border-2 border-primary/30 rounded-lg text-white focus:border-primary focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* In Stock Filter - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <input
                type="checkbox"
                id="inStock"
                checked={filters.inStock || false}
                onChange={(e) => handleFilterChange('inStock', e.target.checked || undefined)}
                className="w-5 h-5 rounded border-primary/30 bg-dark-card text-primary focus:ring-primary"
              />
              <label htmlFor="inStock" className="text-white cursor-pointer">
                In Stock Only
              </label>
            </div>

            {/* Sort */}
            <div className="ml-auto flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="px-4 py-2 bg-dark-card border-2 border-primary/30 rounded-lg text-white focus:border-primary focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-auto md:ml-0"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card-glass p-6 mb-8 md:hidden space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  value={filters.categoryId || ''}
                  onChange={(e) => handleFilterChange('categoryId', e.target.value || undefined)}
                  className="w-full px-4 py-2 bg-dark-card border-2 border-primary/30 rounded-lg text-white focus:border-primary focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStock-mobile"
                  checked={filters.inStock || false}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked || undefined)}
                  className="w-5 h-5 rounded border-primary/30 bg-dark-card text-primary focus:ring-primary"
                />
                <label htmlFor="inStock-mobile" className="text-white cursor-pointer">
                  In Stock Only
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </div>
  );
};

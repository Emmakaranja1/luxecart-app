import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common';
import { adminApi } from '@/services/adminApi';
import { productsApi, categoriesApi } from '@/services/api';
import { ProductFormData, Category } from '@/types';
import toast from 'react-hot-toast';

export const AdminProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category_id: '',
    description: '',
    price: 0,
    compare_at_price: undefined,
    stock: 0,
    featured: false,
    image_url: '',
    images: [],
  });

  useEffect(() => {
    loadCategories();
    if (id) loadProduct();
  }, [id]);

  const loadCategories = async () => {
    const cats = await categoriesApi.getAll();
    setCategories(cats);
  };

  const loadProduct = async () => {
    if (!id) return;
    const product = await productsApi.getById(id);
    if (product) {
      setFormData({
        name: product.name,
        category_id: product.category_id,
        description: product.description,
        price: product.price,
        compare_at_price: product.compare_at_price,
        stock: product.stock,
        featured: product.featured,
        image_url: product.image_url,
        images: product.images,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (id) {
        await adminApi.updateProduct(id, formData);
        toast.success('Product updated successfully');
      } else {
        await adminApi.createProduct(formData);
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 :
              type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              value
    }));
  };

  return (
    <div className="max-w-4xl">
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center text-primary hover:text-primary-light mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </button>

      <h1 className="text-3xl font-display font-black text-gradient-hero mb-8">
        {id ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="card-glass p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Category *</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="input-field"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Compare at Price</label>
            <input
              type="number"
              name="compare_at_price"
              value={formData.compare_at_price || ''}
              onChange={handleChange}
              step="0.01"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Stock *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Image URL *</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="input-field"
            placeholder="https://example.com/image.jpg"
            required
          />
          <p className="text-sm text-gray-400 mt-1">
            Use Unsplash or similar for product images
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-5 h-5 rounded border-primary/30 bg-dark-card text-primary"
          />
          <label htmlFor="featured" className="text-white cursor-pointer">
            Featured Product
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            variant="hero"
            size="lg"
            isLoading={isLoading}
          >
            {id ? 'Update Product' : 'Create Product'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

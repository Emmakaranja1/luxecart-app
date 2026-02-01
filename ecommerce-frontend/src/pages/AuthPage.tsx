import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/common';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/api';
import { isValidEmail } from '@/utils/helpers';
import toast from 'react-hot-toast';

type AuthMode = 'signin' | 'signup';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'signup') {
      if (!formData.first_name) newErrors.first_name = 'First name is required';
      if (!formData.last_name) newErrors.last_name = 'Last name is required';
      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let response;
      if (mode === 'signin') {
        response = await authApi.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await authApi.signup({
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          confirm_password: formData.confirm_password,
        });
      }

      setAuth(response.user, response.token);
      toast.success(`Welcome ${mode === 'signin' ? 'back' : ''}!`);

      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-transition min-h-screen flex items-center justify-center py-12">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="card-glass p-8">
            {/* Tab Toggle */}
            <div className="flex gap-2 mb-8 p-1 bg-dark-card rounded-lg">
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 py-3 rounded-lg font-display font-bold uppercase transition-all ${
                  mode === 'signin'
                    ? 'bg-gradient-primary text-dark shadow-glow-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-3 rounded-lg font-display font-bold uppercase transition-all ${
                  mode === 'signup'
                    ? 'bg-gradient-secondary text-dark shadow-glow-secondary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-2">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="John"
                    />
                    {errors.first_name && (
                      <p className="text-red-400 text-sm mt-1">{errors.first_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Doe"
                    />
                    {errors.last_name && (
                      <p className="text-red-400 text-sm mt-1">{errors.last_name}</p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-field pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="••••••••"
                  />
                  {errors.confirm_password && (
                    <p className="text-red-400 text-sm mt-1">{errors.confirm_password}</p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                variant={mode === 'signin' ? 'hero' : 'accent'}
                size="lg"
                isLoading={isLoading}
                className="w-full mt-6"
              >
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

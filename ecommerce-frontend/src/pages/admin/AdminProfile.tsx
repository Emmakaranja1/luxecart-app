import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Save } from 'lucide-react';
import { Button, Skeleton } from '@/components/common';
import { adminApi } from '@/services/adminApi';
import { AdminUser } from '@/types/admin';
import toast from 'react-hot-toast';

export const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await adminApi.getAdminProfile();
      setProfile(data);
      setFormData({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await adminApi.updateAdminProfile(formData);
      toast.success('Profile updated successfully');
      loadProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-display font-black text-gradient-hero mb-8">
        Admin Profile
      </h1>

      {/* Profile Header */}
      <div className="card-glass p-8 mb-6 text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
          <User className="w-12 h-12 text-dark" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">
          {profile?.first_name} {profile?.last_name}
        </h2>
        <p className="text-gray-400 mb-2">{profile?.email}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-semibold uppercase">{profile?.role}</span>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="card-glass p-8 space-y-6">
        <h3 className="text-xl font-display font-bold text-white mb-4">
          Edit Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field pl-12"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="hero"
          size="lg"
          isLoading={isSaving}
        >
          <Save className="w-5 h-5 mr-2" />
          Save Changes
        </Button>
      </form>
    </div>
  );
};

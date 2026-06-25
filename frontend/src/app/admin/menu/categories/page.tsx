'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import { menuApi } from '@/lib/api';
import { Category } from '@/types';
import { Edit2, Trash2, Plus, RefreshCw, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface CategoryFormInputs {
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  image: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormInputs>();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Pass all=true to get inactive ones as well
      const res = await menuApi.getCategories({ all: true });
      if (res.data?.success) {
        setCategories(res.data.categories || res.data.data || []);
      }
    } catch (err) {
      // Fallback mocks on error
      setCategories([
        {
          id: 'cat1',
          name: 'Main Course',
          slug: 'main-course',
          description: 'Michelin-inspired main dishes prepared by world-class chefs.',
          sortOrder: 1,
          isActive: true,
          image: '',
        },
        {
          id: 'cat2',
          name: 'Desserts',
          slug: 'desserts',
          description: 'Decadent sweets, pastries, and artisanal confections.',
          sortOrder: 2,
          isActive: true,
          image: '',
        },
        {
          id: 'cat3',
          name: 'Appetizers',
          slug: 'appetizers',
          description: 'Delicate starters to begin your culinary journey.',
          sortOrder: 0,
          isActive: true,
          image: '',
        },
        {
          id: 'cat4',
          name: 'Beverages',
          slug: 'beverages',
          description: 'Artisanal mocktails, fine wines, and premium pairings.',
          sortOrder: 3,
          isActive: false,
          image: '',
        },
      ] as Category[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleActive = async (row: Category) => {
    const updatedStatus = !row.isActive;
    try {
      await menuApi.updateCategory(row.id, { isActive: updatedStatus });
      toast.success(`Category "${row.name}" is now ${updatedStatus ? 'Active' : 'Inactive'}.`);
      fetchCategories();
    } catch {
      // Local fallback for demo
      setCategories((prev) =>
        prev.map((c) => (c.id === row.id ? { ...c, isActive: updatedStatus } : c))
      );
      toast.success(`Demo status for "${row.name}" updated successfully!`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All menu items under this category should be reassigned first.')) return;
    try {
      await menuApi.deleteCategory(id);
      toast.success('Category deleted successfully.');
      fetchCategories();
    } catch (err: any) {
      // If backend throws an validation error (e.g. category has menu items)
      if (err.message && err.message.includes('linked to menu items')) {
        toast.error(err.message);
        return;
      }
      // Otherwise trigger mock deletion
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success('Demo Category deleted successfully.');
    }
  };

  const handleOpenEdit = (category: Category) => {
    setEditCategory(category);
    setValue('name', category.name);
    setValue('description', category.description || '');
    setValue('sortOrder', category.sortOrder);
    setValue('isActive', category.isActive);
    setValue('image', category.image || '');
    setModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditCategory(null);
    reset({
      name: '',
      description: '',
      sortOrder: categories.length > 0 ? Math.max(...categories.map((c) => c.sortOrder)) + 1 : 0,
      isActive: true,
      image: '',
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: CategoryFormInputs) => {
    setSubmitting(true);
    try {
      if (editCategory) {
        await menuApi.updateCategory(editCategory.id, data);
        toast.success('Category updated successfully!');
      } else {
        await menuApi.createCategory(data);
        toast.success('Category created successfully!');
      }
      setModalOpen(false);
      fetchCategories();
    } catch {
      // Mock local actions for demo
      if (editCategory) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editCategory.id
              ? ({
                  ...c,
                  name: data.name,
                  slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  description: data.description,
                  sortOrder: Number(data.sortOrder),
                  isActive: data.isActive,
                  image: data.image,
                } as Category)
              : c
          )
        );
        toast.success('Demo Category updated successfully!');
      } else {
        const newCat: Category = {
          id: 'mock_cat_' + Math.random(),
          name: data.name,
          slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: data.description,
          sortOrder: Number(data.sortOrder),
          isActive: data.isActive,
          image: data.image || '',
        };
        setCategories((prev) => [...prev, newCat]);
        toast.success('Demo Category created successfully!');
      }
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<Category>[] = [
    {
      key: 'name',
      label: 'Category Name',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-white">{String(val)}</span>
          <span className="block text-[10px] text-gray-500 font-mono">/{row.slug}</span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (val) => (
        <span className="text-xs text-gray-400 max-w-xs block truncate" title={String(val || '')}>
          {String(val || '—')}
        </span>
      ),
    },
    {
      key: 'sortOrder',
      label: 'Sort Order',
      sortable: true,
      render: (val) => <span className="font-mono text-[#C9A84C]">{Number(val)}</span>,
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (val, row) => (
        <button
          onClick={() => handleToggleActive(row)}
          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
        >
          {val ? (
            <span className="flex items-center gap-1">
              <ToggleRight className="w-6 h-6 text-[#C9A84C]" />
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Active</span>
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <ToggleLeft className="w-6 h-6 text-gray-600" />
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Inactive</span>
            </span>
          )}
        </button>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 border border-white/10 text-gray-400 hover:text-[#C9A84C] hover:bg-white/5 rounded transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 border border-red-500/20 text-red-500 hover:bg-red-500/5 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Menu Categories</h1>
          <p className="text-xs text-gray-400 font-medium">Manage and organize food plates into structural menu categories.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchCategories}
            className="p-2.5 border border-white/10 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="bg-[#C9A84C] text-black font-semibold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-white transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </div>

      <div className="bg-[#111111] p-6 rounded-xl border border-white/10">
        <DataTable columns={columns} data={categories} loading={loading} />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 w-full max-w-lg rounded-lg overflow-hidden shadow-2xl relative">
            <div className="px-6 py-4 bg-[#0D0D0D] border-b border-white/10 flex justify-between items-center">
              <h3 className="font-display text-lg text-white">
                {editCategory ? `Edit Category: ${editCategory.name}` : 'Create New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-1">Category Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'Category name is required' })}
                  className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                  placeholder="e.g. Appetizers"
                />
                {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-1">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded p-3 text-white text-xs outline-none resize-none"
                  placeholder="Describe this category section..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1">Sort Order</label>
                  <input
                    type="number"
                    {...register('sortOrder', { required: true, min: 0 })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                    placeholder="e.g. 0"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1">Image URL (Optional)</label>
                  <input
                    type="text"
                    {...register('image')}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="bg-[#0D0D0D] p-4 border border-white/5 rounded flex items-center justify-between text-xs">
                <span className="text-gray-300 font-medium">Set Category to Active Status</span>
                <input type="checkbox" id="isActive" {...register('isActive')} className="w-4 h-4 rounded accent-[#C9A84C]" />
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-white/10 hover:border-white rounded text-white text-xs font-semibold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#C9A84C] hover:bg-white text-black font-semibold text-xs uppercase rounded transition-colors"
                >
                  {editCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

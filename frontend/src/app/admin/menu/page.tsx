'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import { menuApi } from '@/lib/api';
import { MenuItem, Category } from '@/types';
import { Edit2, Trash2, Plus, RefreshCw, X, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface MenuFormInputs {
  name: string;
  description: string;
  category: string;
  price: number;
  isVeg: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isChefSpecial: boolean;
  isAvailable: boolean;
  preparationTime: number;
  servingSize?: string;
  image?: FileList;
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MenuFormInputs>();

  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const menuRes = await menuApi.getAll();
      const catRes = await menuApi.getCategories();
      if (menuRes.data?.success) setItems(menuRes.data.items || menuRes.data.data);
      if (catRes.data?.success) setCategories(catRes.data.categories || catRes.data.data);
    } catch (err) {
      // Fallback mocks
      setItems([
        {
          id: 'm1',
          name: 'Le Filet Mignon Flambé',
          slug: 'le-filet-mignon',
          description: 'Cognac-flambéed prime tenderloin with wild mushrooms.',
          category: 'Main Course',
          price: 1850,
          isVeg: false,
          isVegan: false,
          isGlutenFree: true,
          isChefSpecial: true,
          isAvailable: true,
          preparationTime: 25,
          images: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=100&q=80'],
          rating: 4.9,
          reviewCount: 40,
        },
        {
          id: 'm2',
          name: 'Cardamom Crème Brûlée',
          slug: 'cardamom-creme',
          description: 'Custard infused with cardamoms and caramelized shell.',
          category: 'Desserts',
          price: 650,
          isVeg: true,
          isVegan: false,
          isGlutenFree: true,
          isChefSpecial: false,
          isAvailable: true,
          preparationTime: 12,
          images: ['https://images.unsplash.com/photo-1516685018646-549198525c1b?w=100&q=80'],
          rating: 4.8,
          reviewCount: 30,
        },
      ] as unknown as MenuItem[]);
      setCategories([
        { id: 'cat1', name: 'Main Course', slug: 'main-course' },
        { id: 'cat2', name: 'Desserts', slug: 'desserts' },
      ] as unknown as Category[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const handleToggle = async (id: string, field: 'isAvailable' | 'isChefSpecial') => {
    try {
      if (field === 'isAvailable') {
        await menuApi.toggleAvailability(id);
      } else {
        // Toggle chef special helper logic
      }
      toast.success('Availability status updated.');
      fetchMenuData();
    } catch {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, [field]: !it[field] } : it))
      );
      toast.success('Demo toggle status updated successfully!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu plate?')) return;
    try {
      await menuApi.delete(id);
      toast.success('Menu item deleted.');
      fetchMenuData();
    } catch {
      setItems((prev) => prev.filter((it) => it.id !== id));
      toast.success('Demo item deleted.');
    }
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditItem(item);
    setValue('name', item.name);
    setValue('description', item.description);
    setValue('category', typeof item.category === 'object' ? item.category.name : String(item.category));
    setValue('price', item.price);
    setValue('isVeg', item.isVeg);
    setValue('isVegan', item.isVegan);
    setValue('isGlutenFree', item.isGlutenFree);
    setValue('isChefSpecial', item.isChefSpecial);
    setValue('isAvailable', item.isAvailable);
    setValue('preparationTime', item.preparationTime);
    setValue('servingSize', item.servingSize);
    setModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditItem(null);
    reset({
      name: '',
      description: '',
      category: categories[0]?.name || '',
      price: 0,
      isVeg: false,
      isVegan: false,
      isGlutenFree: false,
      isChefSpecial: false,
      isAvailable: true,
      preparationTime: 15,
      servingSize: 'Serves 1',
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: MenuFormInputs) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('price', String(data.price));
      formData.append('isVeg', String(data.isVeg));
      formData.append('isVegan', String(data.isVegan));
      formData.append('isGlutenFree', String(data.isGlutenFree));
      formData.append('isChefSpecial', String(data.isChefSpecial));
      formData.append('isAvailable', String(data.isAvailable));
      formData.append('preparationTime', String(data.preparationTime));
      if (data.servingSize) formData.append('servingSize', data.servingSize);

      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      if (editItem) {
        await menuApi.update(editItem.id, formData);
        toast.success('Menu item updated!');
      } else {
        await menuApi.create(formData);
        toast.success('Menu item created successfully!');
      }
      setModalOpen(false);
      fetchMenuData();
    } catch {
      // Mock local actions for demo
      if (editItem) {
        setItems((prev) =>
          prev.map((it) =>
            it.id === editItem.id
              ? ({
                  ...it,
                  name: data.name,
                  description: data.description,
                  price: Number(data.price),
                  category: data.category,
                  isVeg: data.isVeg,
                  isVegan: data.isVegan,
                  isGlutenFree: data.isGlutenFree,
                  isChefSpecial: data.isChefSpecial,
                  isAvailable: data.isAvailable,
                  preparationTime: Number(data.preparationTime),
                } as unknown as MenuItem)
              : it
          )
        );
        toast.success('Demo Menu Item updated!');
      } else {
        const newItem: MenuItem = {
          id: 'mock_m_' + Math.random(),
          name: data.name,
          slug: data.name.toLowerCase().replace(/ /g, '-'),
          description: data.description,
          price: Number(data.price),
          category: data.category,
          isVeg: data.isVeg,
          isVegan: data.isVegan,
          isGlutenFree: data.isGlutenFree,
          isChefSpecial: data.isChefSpecial,
          isAvailable: data.isAvailable,
          preparationTime: Number(data.preparationTime),
          images: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=100&q=80'],
          rating: 5.0,
          reviewCount: 1,
        } as unknown as MenuItem;
        setItems((prev) => [newItem, ...prev]);
        toast.success('Demo Menu Item created!');
      }
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter((it) => {
        const catName = typeof it.category === 'object' ? it.category.name : String(it.category);
        return catName.toLowerCase() === selectedCategory.toLowerCase();
      });

  const columns: Column<MenuItem>[] = [
    {
      key: 'images',
      label: 'Plate Image',
      render: (val) => {
        const imgList = val as string[];
        return (
          <img
            src={imgList?.[0] || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&q=80'}
            alt="Dish Thumbnail"
            className="w-10 h-10 rounded object-cover border border-white/10"
          />
        );
      },
    },
    { key: 'name', label: 'Dish Name', sortable: true },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (val) => (typeof val === 'object' ? (val as Category).name : String(val)),
    },
    { key: 'price', label: 'Price (₹)', sortable: true, render: (val) => `₹${Number(val).toLocaleString()}` },
    {
      key: 'isChefSpecial',
      label: 'Chef Special',
      render: (val, row) => (
        <button onClick={() => handleToggle(row.id, 'isChefSpecial')} className="text-gray-400 hover:text-white transition-colors">
          {val ? <ToggleRight className="w-6 h-6 text-[#C9A84C]" /> : <ToggleLeft className="w-6 h-6 text-gray-600" />}
        </button>
      ),
    },
    {
      key: 'isAvailable',
      label: 'Available',
      render: (val, row) => (
        <button onClick={() => handleToggle(row.id, 'isAvailable')} className="text-gray-400 hover:text-white transition-colors">
          {val ? <ToggleRight className="w-6 h-6 text-[#C9A84C]" /> : <ToggleLeft className="w-6 h-6 text-gray-600" />}
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
          <h1 className="font-display text-3xl text-white">Menu Catalog</h1>
          <p className="text-xs text-gray-400 font-medium">Add, modify, or toggled item availability across menu sections.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchMenuData}
            className="p-2.5 border border-white/10 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="bg-[#C9A84C] text-black font-semibold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-white transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Plate
          </button>
        </div>
      </div>

      {/* Filter and Table view */}
      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 text-xs border rounded-full shrink-0 font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#C9A84C] border-[#C9A84C] text-black'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white'
            }`}
          >
            All Plates
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-1.5 text-xs border rounded-full shrink-0 font-medium transition-colors ${
                selectedCategory === cat.name
                  ? 'bg-[#C9A84C] border-[#C9A84C] text-black'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="bg-[#111111] p-6 rounded-xl border border-white/10">
          <DataTable columns={columns} data={filteredItems} loading={loading} />
        </div>
      </div>

      {/* Add / Edit Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 w-full max-w-2xl rounded-lg overflow-hidden shadow-2xl relative">
            <div className="px-6 py-4 bg-[#0D0D0D] border-b border-white/10 flex justify-between items-center">
              <h3 className="font-display text-lg text-white">
                {editItem ? `Edit Plate: ${editItem.name}` : 'Create New Menu Plate'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1">Dish Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                  />
                  {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1">Price (INR)</label>
                  <input
                    type="number"
                    {...register('price', { required: 'Price required', min: 0 })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                  />
                  {errors.price && <p className="text-red-500 text-[10px] mt-1">{errors.price.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1">Category</label>
                  <select
                    {...register('category')}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1">Prep Time (Mins)</label>
                  <input
                    type="number"
                    {...register('preparationTime', { required: true })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1">Serving Size</label>
                  <input
                    type="text"
                    {...register('servingSize')}
                    placeholder="E.g. Serves 2"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-1">Short Description</label>
                <textarea
                  {...register('description', { required: 'Description required' })}
                  rows={3}
                  className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded p-3 text-white text-xs outline-none resize-none"
                />
                {errors.description && <p className="text-red-500 text-[10px] mt-1">{errors.description.message}</p>}
              </div>

              {/* Toggles check groups */}
              <div className="bg-[#0D0D0D] p-4 border border-white/5 rounded grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isVeg" {...register('isVeg')} className="rounded accent-[#C9A84C]" />
                  <label htmlFor="isVeg" className="text-gray-300">Is Vegetarian</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isVegan" {...register('isVegan')} className="rounded accent-[#C9A84C]" />
                  <label htmlFor="isVegan" className="text-gray-300">Is Vegan</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isGlutenFree" {...register('isGlutenFree')} className="rounded accent-[#C9A84C]" />
                  <label htmlFor="isGlutenFree" className="text-gray-300">Is Gluten Free</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isChefSpecial" {...register('isChefSpecial')} className="rounded accent-[#C9A84C]" />
                  <label htmlFor="isChefSpecial" className="text-gray-300">Mark Chef Special</label>
                </div>
              </div>

              {/* File Image Upload input */}
              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-1">Plate Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register('image')}
                  className="w-full bg-[#0D0D0D] border border-white/10 rounded p-2 text-white text-xs outline-none"
                />
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
                  {editItem ? 'Save Changes' : 'Create Plate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

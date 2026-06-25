'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import { blogApi } from '@/lib/api';
import { Blog } from '@/types';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, RefreshCw, X, Calendar, BookOpen } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface BlogFormInputs {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  readTime: string;
  isFeatured: boolean;
  isPublished: boolean;
  image?: FileList;
}

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BlogFormInputs>();

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await blogApi.getAll();
      if (response.data?.success && response.data.blogs) {
        setBlogs(response.data.blogs);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Mock blog records fallback
      setBlogs([
        {
          id: 'b1',
          title: 'The Delicate Art of Plating Modern French Cuisine',
          slug: 'art-of-plating-french-cuisine',
          excerpt: 'Plating is not merely presenting food; it is an act of architecture, painting, and love combined.',
          category: 'chef-notes',
          author: { name: 'Chef Antoine Dubois' },
          coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&q=80',
          isPublished: true,
          isFeatured: true,
          publishedAt: '2026-05-15T10:00:00.000Z',
          readTime: '6 min read',
        },
      ] as unknown as Blog[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleTogglePublish = async (id: string) => {
    try {
      await blogApi.togglePublish(id);
      toast.success('Publish status changed.');
      fetchBlogs();
    } catch {
      setBlogs((prev) =>
        prev.map((b) => (b.id === id ? { ...b, isPublished: !b.isPublished } : b))
      );
      toast.success('Demo: blog state toggled.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await blogApi.delete(id);
      toast.success('Article deleted.');
      fetchBlogs();
    } catch {
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success('Demo: article deleted.');
    }
  };

  const handleOpenEdit = (blog: Blog) => {
    setEditBlog(blog);
    setValue('title', blog.title);
    setValue('category', blog.category);
    setValue('excerpt', blog.excerpt);
    setValue('content', blog.content);
    setValue('readTime', blog.readTime);
    setValue('isFeatured', blog.isFeatured);
    setValue('isPublished', blog.isPublished);
    setModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditBlog(null);
    reset({
      title: '',
      category: 'recipes',
      excerpt: '',
      content: '',
      readTime: '5 min read',
      isFeatured: false,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: BlogFormInputs) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('excerpt', data.excerpt);
      formData.append('content', data.content);
      formData.append('readTime', data.readTime);
      formData.append('isFeatured', String(data.isFeatured));
      formData.append('isPublished', String(data.isPublished));

      if (data.image && data.image[0]) {
        formData.append('coverImage', data.image[0]);
      }

      if (editBlog) {
        await blogApi.update(editBlog.id, formData);
        toast.success('Article updated!');
      } else {
        await blogApi.create(formData);
        toast.success('Article published!');
      }
      setModalOpen(false);
      fetchBlogs();
    } catch {
      // Mock local actions
      if (editBlog) {
        setBlogs((prev) =>
          prev.map((b) =>
            b.id === editBlog.id
              ? ({
                  ...b,
                  title: data.title,
                  category: data.category,
                  excerpt: data.excerpt,
                  content: data.content,
                  readTime: data.readTime,
                  isFeatured: data.isFeatured,
                  isPublished: data.isPublished,
                } as unknown as Blog)
              : b
          )
        );
        toast.success('Demo: article updated.');
      } else {
        const newBlog: Blog = {
          id: 'mock_b_' + Math.random(),
          title: data.title,
          slug: data.title.toLowerCase().replace(/ /g, '-'),
          excerpt: data.excerpt,
          content: data.content,
          category: data.category,
          author: { name: 'Admin Staff' },
          coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&q=80',
          isPublished: data.isPublished,
          isFeatured: data.isFeatured,
          publishedAt: new Date().toISOString(),
          readTime: data.readTime,
        } as unknown as Blog;
        setBlogs((prev) => [newBlog, ...prev]);
        toast.success('Demo: article created.');
      }
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<Blog>[] = [
    {
      key: 'coverImage',
      label: 'Cover',
      render: (val) => (
        <img
          src={String(val || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&q=80')}
          alt="Blog Thumbnail"
          className="w-10 h-7 rounded object-cover border border-white/10"
        />
      ),
    },
    { key: 'title', label: 'Article Title', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'author',
      label: 'Author',
      render: (val) => (val as { name: string })?.name || 'Lumiere Staff',
    },
    {
      key: 'publishedAt',
      label: 'Publish Date',
      sortable: true,
      render: (val) => (val ? new Date(String(val)).toLocaleDateString() : 'Draft'),
    },
    {
      key: 'isPublished',
      label: 'Published',
      render: (val, row) => (
        <button onClick={() => handleTogglePublish(row.id)} className="text-gray-400 hover:text-white transition-colors">
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
          <h1 className="font-display text-3xl text-white">Culinary Stories</h1>
          <p className="text-xs text-gray-400">Publish gastronomer guidelines, kitchen recipes, and sommelier reports.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchBlogs}
            className="p-2.5 border border-white/10 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="bg-[#C9A84C] text-black font-semibold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-white transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Article
          </button>
        </div>
      </div>

      <div className="bg-[#111111] p-6 rounded-xl border border-white/10">
        <DataTable columns={columns} data={blogs} loading={loading} />
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 w-full max-w-3xl rounded-lg overflow-hidden shadow-2xl relative">
            <div className="px-6 py-4 bg-[#0D0D0D] border-b border-white/10 flex justify-between items-center">
              <h3 className="font-display text-lg text-white">
                {editBlog ? 'Edit Article' : 'Publish Culinary Article'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1">Article Title</label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                  />
                  {errors.title && <p className="text-red-500 text-[10px] mt-1">{errors.title.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 mb-1">Category</label>
                    <select
                      {...register('category')}
                      className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                    >
                      <option value="recipes">Recipes</option>
                      <option value="chef-notes">Chef Notes</option>
                      <option value="wine">Wine Pairing</option>
                      <option value="ingredients">Ingredients</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 mb-1">Read Time</label>
                    <input
                      type="text"
                      {...register('readTime')}
                      placeholder="E.g. 5 min read"
                      className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-1">Summary / Excerpt</label>
                <input
                  type="text"
                  {...register('excerpt', { required: 'Excerpt required' })}
                  className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-1">Body Content (HTML/Markdown)</label>
                <textarea
                  {...register('content', { required: 'Content required' })}
                  rows={8}
                  placeholder="<p>Write your detailed story here...</p>"
                  className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded p-3 text-white text-xs outline-none resize-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1">Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register('image')}
                    className="w-full bg-[#0D0D0D] border border-white/10 rounded p-1 text-white text-xs outline-none"
                  />
                </div>
                <div className="flex gap-4 items-center pt-6 text-xs text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <input type="checkbox" id="isFeatured" {...register('isFeatured')} className="rounded accent-[#C9A84C]" />
                    <label htmlFor="isFeatured">Featured Article</label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input type="checkbox" id="isPublished" {...register('isPublished')} className="rounded accent-[#C9A84C]" />
                    <label htmlFor="isPublished">Publish Status</label>
                  </div>
                </div>
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
                  {editBlog ? 'Save Draft' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

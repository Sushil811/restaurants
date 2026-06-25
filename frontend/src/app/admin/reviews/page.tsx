'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import { reviewsApi } from '@/lib/api';
import { Review } from '@/types';
import { Check, Trash2, Reply, MessageSquare, Star, RefreshCw, X, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReviewModerationItem extends Review {
  menuItemName: string;
  status: 'approved' | 'pending';
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyReviewId, setReplyReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewsApi.getAll();
      if (response.data?.success && response.data.reviews) {
        setReviews(response.data.reviews);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Mock review data for moderation dashboard
      setReviews([
        {
          id: 'rev1',
          user: { name: 'Sushil Kumar' },
          menuItem: 'm1',
          menuItemName: 'Le Filet Mignon Flambé',
          rating: 5,
          comment: 'Absolutely spectacular dish. The cognac sauce pull was perfect.',
          status: 'pending',
          adminReply: '',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'rev2',
          user: { name: 'Priya Patel' },
          menuItem: 'm2',
          menuItemName: 'Cardamom Crème Brûlée',
          rating: 4,
          comment: 'Very tasty, but a bit too sweet for my palate.',
          status: 'approved',
          adminReply: 'Thank you Priya, we will look into the sugar levels!',
          createdAt: new Date().toISOString(),
        },
      ] as unknown as ReviewModerationItem[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await reviewsApi.approve(id);
      toast.success('Review approved.');
      fetchReviews();
    } catch {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
      );
      toast.success('Demo: review approved.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewsApi.delete(id);
      toast.success('Review deleted.');
      fetchReviews();
    } catch {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success('Demo: review deleted.');
    }
  };

  const handleSendReply = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      await reviewsApi.reply(id, replyText);
      toast.success('Reply submitted.');
      setReplyReviewId(null);
      setReplyText('');
      fetchReviews();
    } catch {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, adminReply: replyText } : r))
      );
      toast.success('Demo: inline reply submitted.');
      setReplyReviewId(null);
      setReplyText('');
    }
  };

  const columns: Column<ReviewModerationItem>[] = [
    {
      key: 'user',
      label: 'Reviewer',
      sortable: true,
      render: (val) => (val as { name: string })?.name || 'Anonymous',
    },
    { key: 'menuItemName', label: 'Dish Ordered', sortable: true },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (val) => (
        <span className="flex items-center gap-0.5 text-yellow-500 font-semibold text-xs">
          {Number(val)} <Star className="w-3.5 h-3.5 fill-yellow-500" />
        </span>
      ),
    },
    {
      key: 'body',
      label: 'Comment',
      width: 'w-80',
      render: (val, row) => {
        const text = String(val || row.body || (row as any).comment || '');
        const replyText = row.adminReply
          ? typeof row.adminReply === 'string'
            ? row.adminReply
            : (row.adminReply as any).text
          : '';
        return (
          <div className="space-y-1 text-xs">
            <p className="text-gray-300 italic">"{text}"</p>
            {replyText && (
              <p className="text-[#C9A84C] font-semibold">
                ↳ Response: <span className="text-gray-400 font-normal italic">"{replyText}"</span>
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => {
        const status = String(val);
        return (
          <span
            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
              status === 'approved'
                ? 'text-green-400 bg-green-500/10 border-green-500/20'
                : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          {row.status === 'pending' && (
            <button
              onClick={() => handleApprove(row.id)}
              className="p-1 text-green-400 hover:bg-green-500/10 rounded transition-colors"
              title="Approve Review"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => {
              setReplyReviewId(row.id);
              setReplyText(row.adminReply || '');
            }}
            className="p-1 text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded transition-colors"
            title="Post Response"
          >
            <Reply className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
            title="Delete Review"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Review Moderation</h1>
          <p className="text-xs text-gray-400">Approve user comments, write inline feedback answers, or moderate records.</p>
        </div>

        <button
          onClick={fetchReviews}
          className="self-start sm:self-auto p-2.5 border border-white/10 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
        >
          <RefreshCw className="w-4 h-4" /> Refresh list
        </button>
      </div>

      <div className="bg-[#111111] p-6 rounded-xl border border-white/10">
        <DataTable columns={columns} data={reviews} loading={loading} />
      </div>

      {/* Reply modal input overlay */}
      {replyReviewId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 w-full max-w-md rounded-lg overflow-hidden shadow-2xl relative">
            <div className="px-6 py-4 bg-[#0D0D0D] border-b border-white/10 flex justify-between items-center">
              <h3 className="font-display text-base text-white">Submit Admin Response</h3>
              <button onClick={() => setReplyReviewId(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-2">Your Reply Message</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  placeholder="E.g. Thank you for your feedback! We look forward to serving you again..."
                  className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded p-3 text-white text-xs outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReplyReviewId(null)}
                  className="px-4 py-2 border border-white/10 hover:border-white rounded text-white text-xs font-semibold uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSendReply(replyReviewId)}
                  className="px-5 py-2 bg-[#C9A84C] hover:bg-white text-black font-semibold text-xs uppercase rounded transition-colors flex items-center gap-1.5"
                >
                  Send Reply <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

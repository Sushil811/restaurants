'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { Award, Gift, Copy, Check, Users, Sparkles, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoyaltyTransaction {
  id: string;
  type: 'credit' | 'debit';
  points: number;
  description: string;
  date: string;
}

export default function LoyaltyPage() {
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);

  const points = user?.loyaltyPoints || 340; // Fallback for representation
  
  // Calculate tier
  const getTier = (pts: number) => {
    if (pts >= 1000) return { name: 'Platinum', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', nextMin: 2000 };
    if (pts >= 500) return { name: 'Gold', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', nextMin: 1000 };
    if (pts >= 200) return { name: 'Silver', color: 'text-slate-300 bg-slate-500/10 border-slate-500/20', nextMin: 500 };
    return { name: 'Bronze', color: 'text-amber-600 bg-amber-700/10 border-amber-700/20', nextMin: 200 };
  };

  const tier = getTier(points);
  const progressPercent = Math.min(100, Math.round((points / tier.nextMin) * 100));

  useEffect(() => {
    // Simulated loyalty ledger
    setTransactions([
      {
        id: 't1',
        type: 'credit',
        points: 240,
        description: 'Points earned for Order #ORD_984532',
        date: '2026-06-01',
      },
      {
        id: 't2',
        type: 'credit',
        points: 100,
        description: 'New account registration welcome bonus',
        date: '2026-05-18',
      },
    ]);
  }, []);

  const handleCopyLink = () => {
    const referralCode = `LUMIERE-${user?.id || 'REF999'}`;
    const referralUrl = `https://lumiere.restaurant/register?ref=${referralCode}`;
    
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0D0D0D] text-white pt-28 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-white mb-2">Lumiere Circle</h1>
        <p className="text-[#F5ECD7]/50 text-sm mb-8">Unlock luxury perks, complimentary tastings, and earn points on every dining experience.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Points Balance and Progress Card */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#111111] border border-[#C9A84C]/25 rounded-lg p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#C9A84C]/5 rounded-bl-full pointer-events-none" />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#F5ECD7]/45">Gourmet Points Balance</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-5xl font-display font-bold text-[#C9A84C]">{points}</span>
                    <span className="text-xs text-[#F5ECD7]/50">Circle Points</span>
                  </div>
                </div>

                <div className={`px-4 py-2 border rounded font-semibold text-xs uppercase tracking-wider flex items-center gap-2 ${tier.color}`}>
                  <Award className="w-4.5 h-4.5" /> {tier.name} Member
                </div>
              </div>

              {/* Progress bar towards next tier */}
              <div className="mt-8 space-y-2">
                <div className="flex justify-between text-xs text-[#F5ECD7]/50">
                  <span>Current Tier Progress</span>
                  <span>{points} / {tier.nextMin} Points for next Tier</span>
                </div>
                <div className="w-full bg-[#0D0D0D] h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="bg-[#C9A84C] h-full transition-all duration-1000 shadow-[0_0_10px_rgba(201,168,76,0.5)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Loyalty Transactions ledger */}
            <div className="bg-[#111111] border border-[#C9A84C]/15 rounded-lg p-6 sm:p-8">
              <h2 className="font-display text-xl text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#C9A84C]" /> Points Ledger History
              </h2>

              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center text-xs pb-3 border-b border-white/5 last:border-0 last:pb-0">
                    <div>
                      <p className="text-white font-medium">{tx.description}</p>
                      <p className="text-[#F5ECD7]/40 text-[10px] mt-1">
                        {new Date(tx.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className={`font-semibold text-sm ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{tx.points} PTS
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Referral Sidebar Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#111111] border border-[#C9A84C]/20 rounded-lg p-6 shadow-xl space-y-6">
              <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#C9A84C]" />
              </div>
              <div>
                <h3 className="font-display text-lg text-white">Refer A Friend</h3>
                <p className="text-xs text-[#F5ECD7]/50 mt-1 leading-relaxed">
                  Gift your friends 250 welcome points, and earn 150 points for yourself when they place their first order.
                </p>
              </div>

              {/* Share Code Link input */}
              <div className="space-y-3">
                <span className="block text-[10px] uppercase tracking-wider text-[#F5ECD7]/60">Your Referral Invite Link</span>
                <div className="flex gap-1.5 bg-[#0D0D0D] border border-[#C9A84C]/25 rounded p-1.5 items-center">
                  <span className="flex-1 text-[10px] text-[#F5ECD7]/60 overflow-x-auto whitespace-nowrap pl-1 scrollbar-none">
                    lumiere.restaurant/reg?ref=LUMIERE-{(user?.id || 'REF999').substring(0, 6)}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="p-2 bg-[#C9A84C] text-[#0D0D0D] hover:bg-white rounded transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="bg-[#0D0D0D]/60 p-4 rounded border border-white/5 text-[10px] text-[#F5ECD7]/45 leading-relaxed space-y-2">
                <p className="font-semibold text-white flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" /> Membership Perks:
                </p>
                <ul className="list-disc pl-3.5 space-y-1">
                  <li>Silver: 5% off online order checkout</li>
                  <li>Gold: Priority tables + free dessert on birthday</li>
                  <li>Platinum: VIP tasting bookings + Chef table access</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

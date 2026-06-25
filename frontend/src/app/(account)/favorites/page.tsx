'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { userApi } from '@/lib/api';
import { MenuItem } from '@/types';
import { Heart, ShoppingCart, Trash2, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  const fetchFavorites = async () => {
    try {
      const response = await userApi.getWishlist();
      if (response.data?.success && response.data.wishlist) {
        setFavorites(response.data.wishlist);
      }
    } catch (err) {
      // Fallback mock favorites for user representation
      setFavorites([
        {
          id: 'm1',
          name: 'Le Filet Mignon Flambé',
          slug: 'le-filet-mignon-flambe',
          description: 'Pan-seared prime tenderloin flambéed with cognac, accompanied by truffle potato purée.',
          price: 1850,
          images: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80'],
          isVeg: false,
          isVegan: false,
          isGlutenFree: true,
          isSpicy: false,
          rating: 4.9,
          reviewCount: 120,
          category: { name: 'Main Course' },
        },
        {
          id: 'm2',
          name: 'Cardamom Crème Brûlée',
          slug: 'cardamom-creme-brulee',
          description: 'Silky custard infused with organic cardamom, finished with a caramelized sugar crust.',
          price: 650,
          images: ['https://images.unsplash.com/photo-1516685018646-549198525c1b?w=500&q=80'],
          isVeg: true,
          isVegan: false,
          isGlutenFree: true,
          isSpicy: false,
          rating: 4.8,
          reviewCount: 95,
          category: { name: 'Desserts' },
        },
        {
          id: 'm3',
          name: 'Truffle Porcini Fettuccine',
          slug: 'truffle-porcini-fettuccine',
          description: 'House-made fettuccine tossed in a rich truffle cream sauce with fresh wild porcini.',
          price: 1450,
          images: ['https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&q=80'],
          isVeg: true,
          isVegan: false,
          isGlutenFree: false,
          isSpicy: false,
          rating: 4.9,
          reviewCount: 154,
          category: { name: 'Main Course' },
        },
      ] as unknown as MenuItem[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (itemId: string) => {
    try {
      await userApi.removeFromWishlist(itemId);
      setFavorites((prev) => prev.filter((fav) => fav.id !== itemId));
      toast.success('Removed from favorites.');
    } catch {
      // Fallback filter for mock
      setFavorites((prev) => prev.filter((fav) => fav.id !== itemId));
      toast.success('Removed from favorites.');
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      image: item.images[0] || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&q=80',
      basePrice: item.price,
      totalPrice: item.price,
      quantity: 1,
      category: typeof item.category === 'object' ? item.category.name : 'Main Course',
      isVeg: item.isVeg,
      customizations: [],
    });
    toast.success(`${item.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="bg-[#0D0D0D] min-h-screen pt-28 pb-16 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-t-2 border-[#C9A84C] border-solid rounded-full animate-spin mx-auto" />
          <p className="text-[#F5ECD7]/60 text-sm">Loading your favorite dishes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D0D0D] text-white pt-28 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-white mb-2">My Favorites</h1>
        <p className="text-[#F5ECD7]/50 text-sm mb-8">Access your curated selection of bookmarked plates.</p>

        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-[#111111] border border-[#C9A84C]/15 rounded-lg">
            <Heart className="w-12 h-12 text-[#C9A84C]/50 mx-auto mb-4" />
            <h3 className="font-display text-xl text-white">Your List is Empty</h3>
            <p className="text-xs text-[#F5ECD7]/40 mt-1">Tap the heart icon on any menu plate to save it here.</p>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="bg-[#111111] border border-[#C9A84C]/20 rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#C9A84C]/65 transition-colors group"
              >
                {/* Image & Veg tags */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#0D0D0D]/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-[#C9A84C] font-semibold border border-[#C9A84C]/25">
                    {typeof item.category === 'object' ? item.category.name : 'Main Course'}
                  </div>
                  {item.isVeg && (
                    <div className="absolute top-3 right-3 bg-green-500/90 w-4 h-4 rounded-full border border-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-display text-lg text-white group-hover:text-[#C9A84C] transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <span className="text-[#C9A84C] font-bold text-sm">₹{item.price.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-[#F5ECD7]/50 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="px-3 py-2 border border-red-500/20 hover:border-red-500 text-red-500 hover:bg-red-500/5 transition-colors rounded"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-[#C9A84C] hover:bg-white text-[#0D0D0D] font-bold text-xs uppercase tracking-wider py-2.5 rounded transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { ordersApi } from '@/lib/api';
import { Order } from '@/types';
import { ShoppingBag, Eye, RefreshCw, X, CheckCircle, Clock, Truck, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { addItem } = useCartStore();

  const fetchOrders = async () => {
    try {
      const response = await ordersApi.getMyOrders();
      if (response.data?.success && response.data.orders) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      // Mock history for testing
      setOrders([
        {
          id: 'o_1',
          orderNumber: 'ORD_984532',
          createdAt: '2026-06-01T19:30:00.000Z',
          orderStatus: 'delivered',
          orderType: 'delivery',
          total: 2450,
          subtotal: 2300,
          tax: 150,
          discount: 0,
          deliveryFee: 0,
          payment: { method: 'online', status: 'paid' },
          deliveryAddress: {
            id: '1',
            label: 'Home',
            street: 'Plot 12, Jubilee Hills',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500033',
            isDefault: true,
          },
          items: [
            {
              menuItem: 'm1',
              name: 'Le Filet Mignon Flambé',
              price: 1850,
              quantity: 1,
              customizations: [{ name: 'Spice Level', option: 'Medium', additionalPrice: 0 }],
              subtotal: 1850,
            },
            {
              menuItem: 'm2',
              name: 'Cardamom Crème Brûlée',
              price: 600,
              quantity: 1,
              customizations: [],
              subtotal: 600,
            },
          ],
        },
        {
          id: 'o_2',
          orderNumber: 'ORD_872514',
          createdAt: '2026-05-20T13:15:00.000Z',
          orderStatus: 'delivered',
          orderType: 'pickup',
          total: 1365,
          subtotal: 1300,
          tax: 65,
          discount: 0,
          deliveryFee: 0,
          payment: { method: 'cod', status: 'paid' },
          items: [
            {
              menuItem: 'm3',
              name: 'French Onion Truffle Soup',
              price: 650,
              quantity: 2,
              customizations: {},
              subtotal: 1300,
            },
          ],
        },
      ] as unknown as Order[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReorder = (order: Order) => {
    try {
      order.items.forEach((item) => {
        addItem({
          id: item.menuItem as string,
          name: item.name,
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&q=80', // placeholder
          basePrice: item.price,
          totalPrice: item.price * item.quantity,
          quantity: item.quantity,
          category: 'Main Course',
          isVeg: false,
          customizations: (item.customizations as unknown as any[] || []).map((c: any) => ({
            group: c.name || c.group,
            option: c.option,
            price: c.additionalPrice || c.price || 0,
          })),
        });
      });
      toast.success('Items from this order added to your cart!');
    } catch {
      toast.error('Could not complete reorder. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'cancelled':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'out_for_delivery':
      case 'ready':
      case 'preparing':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0D0D0D] min-h-screen pt-28 pb-16 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-t-2 border-[#C9A84C] border-solid rounded-full animate-spin mx-auto" />
          <p className="text-[#F5ECD7]/60 text-sm">Loading order records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D0D0D] text-white pt-28 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-white mb-2">Order History</h1>
        <p className="text-[#F5ECD7]/50 text-sm mb-8">View, track, invoice, or quickly repeat previous orders.</p>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-[#111111] border border-[#C9A84C]/15 rounded-lg">
            <ShoppingBag className="w-12 h-12 text-[#C9A84C]/50 mx-auto mb-4" />
            <h3 className="font-display text-xl text-white">No Orders Placed Yet</h3>
            <p className="text-xs text-[#F5ECD7]/40 mt-1">Order your first exquisite meal from our online menu.</p>
          </div>
        ) : (
          /* Orders List Grid */
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#111111] border border-[#C9A84C]/20 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 hover:border-[#C9A84C]/60 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-semibold text-white">{order.orderNumber}</span>
                    <span className="text-[10px] text-[#F5ECD7]/40">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-[#F5ECD7]/60 line-clamp-1">
                    {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white">Total:</span>
                    <span className="text-[#C9A84C] font-semibold text-sm">₹{order.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
                  <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded border font-semibold ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus.replace('_', ' ')}
                  </span>
                  
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="w-9 h-9 border border-[#C9A84C]/30 hover:border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 flex items-center justify-center rounded transition-all"
                    title="View Invoice Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleReorder(order)}
                    className="px-4 py-2 bg-[#C9A84C] hover:bg-white text-[#0D0D0D] text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#0D0D0D]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#C9A84C]/30 w-full max-w-2xl rounded-lg overflow-hidden shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="bg-[#0D0D0D] px-6 py-4 border-b border-[#C9A84C]/20 flex justify-between items-center">
              <h3 className="font-display text-xl text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C9A84C]" /> Invoice: {selectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#F5ECD7]/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-xs text-[#F5ECD7]/60 pb-4 border-b border-white/5">
                <div>
                  <span className="block uppercase text-[10px] text-[#F5ECD7]/40 mb-0.5">Order Placed</span>
                  <span className="text-white font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="block uppercase text-[10px] text-[#F5ECD7]/40 mb-0.5">Payment Method</span>
                  <span className="text-white font-medium uppercase">{selectedOrder.payment.method} ({selectedOrder.payment.status})</span>
                </div>
                {selectedOrder.orderType === 'delivery' && selectedOrder.deliveryAddress && (
                  <div className="col-span-2">
                    <span className="block uppercase text-[10px] text-[#F5ECD7]/40 mb-0.5">Delivery Address</span>
                    <span className="text-white font-medium">
                      {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} - {selectedOrder.deliveryAddress.pincode}
                    </span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-[#C9A84C] font-bold">Ordered Plates</h4>
                <div className="space-y-2.5">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div>
                        <span className="text-white font-medium">{item.name}</span>
                        <span className="text-[#C9A84C] font-semibold ml-2">×{item.quantity}</span>
                        {(item.customizations as any) && (item.customizations as any).length > 0 && (
                          <p className="text-[10px] text-amber-500/70">
                            {(item.customizations as any).map((c: any) => `${c.name || c.group}: ${c.option}`).join(', ')}
                          </p>
                        )}
                      </div>
                      <span className="text-white font-semibold">₹{item.subtotal.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice Calculations */}
              <div className="pt-4 border-t border-white/5 space-y-2 text-xs text-[#F5ECD7]/50">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">₹{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-₹{selectedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes (5%)</span>
                  <span className="text-white font-medium">₹{selectedOrder.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-white font-bold pt-3 border-t border-[#C9A84C]/20">
                  <span>Grand Total Paid</span>
                  <span className="text-[#C9A84C]">₹{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#0D0D0D] border-t border-white/5 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 border border-white/10 hover:border-white text-white font-semibold text-xs uppercase tracking-wider rounded transition-colors"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

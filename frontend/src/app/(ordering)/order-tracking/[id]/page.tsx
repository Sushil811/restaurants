'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle, ChefHat, Package, CheckCircle2, MapPin, Clock, Navigation } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import { Order, OrderStatus } from '@/types';
import toast from 'react-hot-toast';

const statuses: Array<{ status: OrderStatus; label: string; desc: string; icon: any }> = [
  {
    status: 'pending',
    label: 'Order Placed',
    desc: 'We have received your exquisite culinary order.',
    icon: CheckCircle2,
  },
  {
    status: 'confirmed',
    label: 'Confirmed',
    desc: 'Our chefs have accepted and queued the order.',
    icon: Package,
  },
  {
    status: 'preparing',
    label: 'Preparing',
    desc: 'Gourmet meal is being cooked and plated with passion.',
    icon: ChefHat,
  },
  {
    status: 'ready',
    label: 'Ready for Pickup',
    desc: 'Double-checked and packed in thermal insulated containers.',
    icon: CheckCircle,
  },
  {
    status: 'out_for_delivery',
    label: 'Out for Delivery',
    desc: 'Lumiere delivery partner is navigating to your address.',
    icon: Truck,
  },
  {
    status: 'delivered',
    label: 'Delivered',
    desc: 'Bon appétit! Enjoy your Michelin-inspired experience.',
    icon: Navigation,
  },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.id as string) || 'MOCK_ORDER_123';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Poll for simulated tracking updates
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await ordersApi.getById(orderId);
        if (response.data?.success) {
          const fetchedOrder = response.data.order;
          setOrder(fetchedOrder);
          const idx = statuses.findIndex((s) => s.status === fetchedOrder.orderStatus);
          setCurrentStepIndex(idx >= 0 ? idx : 0);
        }
      } catch (err) {
        // Mock fallback order
        const mockOrder: Order = {
          id: orderId,
          orderNumber: orderId.startsWith('ORD_') ? orderId : 'ORD_786524',
          orderType: 'delivery',
          deliveryAddress: {
            id: '1',
            label: 'Home',
            street: 'Plot No. 12, Phase-II, Jubilee Hills',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500033',
            isDefault: true,
          },
          items: [
            {
              menuItem: '1',
              name: 'Le Filet Mignon Flambé',
              price: 1850,
              quantity: 1,
              customizations: {},
              subtotal: 1850,
            },
          ],
          subtotal: 1850,
          discount: 0,
          deliveryFee: 49,
          tax: 93,
          total: 1992,
          payment: {
            method: 'online',
            status: 'paid',
          },
          orderStatus: 'preparing', // Default mock status
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          statusHistory: [],
        } as unknown as Order;

        setOrder(mockOrder);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Setup a simulation interval to progress the steps for demonstration purposes
    const simInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < statuses.length - 1) {
          return prev + 1;
        }
        clearInterval(simInterval);
        return prev;
      });
    }, 12000); // Progress step every 12 seconds

    return () => clearInterval(simInterval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-[#0D0D0D] min-h-screen pt-28 pb-16 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-t-2 border-[#C9A84C] border-solid rounded-full animate-spin mx-auto" />
          <p className="text-[#F5ECD7]/60 text-sm">Initializing real-time tracking...</p>
        </div>
      </div>
    );
  }

  const activeStatus = statuses[currentStepIndex];

  return (
    <div className="bg-[#0D0D0D] min-h-screen pt-28 pb-16 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl text-white">Track Order</h1>
            <p className="text-sm text-[#F5ECD7]/50 mt-1">
              Order ID: <span className="text-[#C9A84C] font-semibold">{order?.orderNumber}</span>
            </p>
          </div>
          {currentStepIndex < statuses.length - 1 && (
            <div className="bg-[#111111] border border-[#C9A84C]/25 rounded px-4 py-2 flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#C9A84C]" />
              <div className="text-xs">
                <span className="text-[#F5ECD7]/45 block uppercase">Estimated Delivery</span>
                <span className="text-white font-semibold">Arriving in ~25-30 mins</span>
              </div>
            </div>
          )}
        </div>

        {/* Tracking Main View */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Timeline */}
          <div className="md:col-span-8 bg-[#111111] border border-[#C9A84C]/20 rounded-lg p-6 sm:p-8 space-y-8">
            <div className="relative">
              {/* Vertical line indicator */}
              <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-white/10" />

              {/* Progress dynamic filler */}
              <div
                className="absolute left-6 top-3 w-0.5 bg-[#C9A84C] transition-all duration-1000"
                style={{
                  height: `${(currentStepIndex / (statuses.length - 1)) * 100}%`,
                }}
              />

              {/* Timeline nodes */}
              <div className="space-y-8">
                {statuses.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx < currentStepIndex;
                  const isActive = idx === currentStepIndex;
                  const isFuture = idx > currentStepIndex;

                  return (
                    <div key={step.status} className="flex gap-6 relative">
                      {/* Node circle */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border z-10 transition-colors ${
                          isCompleted
                            ? 'bg-[#C9A84C] border-[#C9A84C] text-[#0D0D0D]'
                            : isActive
                            ? 'bg-[#0D0D0D] border-[#C9A84C] text-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.3)] animate-pulse'
                            : 'bg-[#0D0D0D] border-white/20 text-white/35'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content block */}
                      <div className="flex-1 pt-1">
                        <h3
                          className={`text-base font-semibold transition-colors ${
                            isActive ? 'text-[#C9A84C]' : isFuture ? 'text-white/40' : 'text-white'
                          }`}
                        >
                          {step.label}
                        </h3>
                        <p
                          className={`text-xs mt-1 leading-relaxed transition-colors ${
                            isFuture ? 'text-white/25' : 'text-[#F5ECD7]/55'
                          }`}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="md:col-span-4 space-y-6">
            {/* Delivery address card */}
            <div className="bg-[#111111] border border-[#C9A84C]/25 rounded-lg p-6">
              <h3 className="font-display text-lg text-white mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C9A84C]" /> Destination Address
              </h3>
              {order?.orderType === 'delivery' && order.deliveryAddress ? (
                <div className="text-xs text-[#F5ECD7]/70 space-y-1.5 leading-relaxed">
                  <p className="font-bold text-white">Sushil Kumar</p>
                  <p>{order.deliveryAddress.street}</p>
                  <p>
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                  </p>
                  <p className="pt-2 text-[#C9A84C] italic font-semibold">Instructions: Ring doorbell on arrival</p>
                </div>
              ) : (
                <div className="text-xs text-[#F5ECD7]/70 leading-relaxed">
                  <p className="font-bold text-white">Lumiere Restaurant</p>
                  <p>Road No. 12, Banjara Hills, Hyderabad, 500034</p>
                  <p className="pt-2 text-amber-500 font-semibold">Self-pickup requested.</p>
                </div>
              )}
            </div>

            {/* Helpline support */}
            <div className="bg-[#111111] border border-[#C9A84C]/20 rounded-lg p-6 text-center">
              <p className="text-xs text-[#F5ECD7]/50 mb-3">Need assistance with your delivery?</p>
              <a
                href="tel:+914023301234"
                className="inline-flex items-center justify-center w-full py-2.5 bg-[#C9A84C]/10 border border-[#C9A84C]/35 text-[#C9A84C] font-semibold text-xs tracking-wider uppercase hover:bg-[#C9A84C] hover:text-[#0D0D0D] transition-colors rounded"
              >
                Contact Concierge
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

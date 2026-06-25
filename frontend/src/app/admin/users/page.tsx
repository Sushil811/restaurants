'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import { adminApi } from '@/lib/api';
import { User } from '@/types';
import { RefreshCw, UserCheck, ShieldAlert, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Direct API invoke if available in adminApi, else mock
      const response = await adminApi.getUsers();
      if (response.data?.success && (response.data.data || response.data.users)) {
        setUsers(response.data.data || response.data.users);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Mock data lists
      setUsers([
        {
          id: 'usr1',
          name: 'Sushil Kumar',
          email: 'sushil@example.com',
          phone: '+91 98765 43210',
          role: 'admin',
          loyaltyPoints: 340,
          isEmailVerified: true,
          createdAt: '2026-05-18T10:00:00.000Z',
        },
        {
          id: 'usr2',
          name: 'Amit Patel',
          email: 'amit@example.com',
          phone: '+91 88888 99999',
          role: 'user',
          loyaltyPoints: 120,
          isEmailVerified: true,
          createdAt: '2026-05-20T14:30:00.000Z',
        },
        {
          id: 'usr3',
          name: 'Chef Jean-Pierre',
          email: 'jean@lumiere.restaurant',
          phone: '+91 77777 66666',
          role: 'chef',
          loyaltyPoints: 0,
          isEmailVerified: true,
          createdAt: '2026-05-15T09:00:00.000Z',
        },
      ] as unknown as User[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}.`);
      fetchUsers();
    } catch {
      // Mock update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u))
      );
      toast.success(`Demo: user role switched to ${newRole}.`);
    }
  };

  const columns: Column<User>[] = [
    { key: 'name', label: 'User Name', sortable: true },
    { key: 'email', label: 'Email Address', sortable: true },
    { key: 'phone', label: 'Contact Phone' },
    {
      key: 'loyaltyPoints',
      label: 'Loyalty Points',
      sortable: true,
      render: (val) => (
        <span className="flex items-center gap-1 text-xs text-[#C9A84C]">
          <Award className="w-3.5 h-3.5" /> {Number(val)} PTS
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined Date',
      sortable: true,
      render: (val) => new Date(String(val)).toLocaleDateString(),
    },
    {
      key: 'role',
      label: 'System Access Role',
      sortable: true,
      render: (val, row) => (
        <select
          value={String(val)}
          onChange={(e) => handleRoleChange(row.id, e.target.value)}
          className="bg-[#0D0D0D] text-xs text-[#C9A84C] border border-[#C9A84C]/25 rounded px-2.5 py-1 focus:outline-none focus:border-[#C9A84C]"
        >
          <option value="user">User / Guest</option>
          <option value="chef">Chef / Kitchen</option>
          <option value="driver">Driver / Delivery</option>
          <option value="admin">System Admin</option>
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Guest Accounts</h1>
          <p className="text-xs text-gray-400">Moderate system access levels, check loyalty points, and review registrations.</p>
        </div>

        <button
          onClick={fetchUsers}
          className="self-start sm:self-auto p-2.5 border border-white/10 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Users
        </button>
      </div>

      <div className="bg-[#111111] p-6 rounded-xl border border-white/10">
        <DataTable columns={columns} data={users} loading={loading} />
      </div>
    </div>
  );
}

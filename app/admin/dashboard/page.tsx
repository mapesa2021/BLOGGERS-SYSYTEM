'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCreators: 0,
    activeCreators: 0,
    totalPages: 0,
    totalViews: 0
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage creators, landing pages, and analytics</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Creators</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalCreators}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Active Creators</h3>
            <p className="text-3xl font-bold text-green-600">{stats.activeCreators}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Landing Pages</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalPages}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Views</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.totalViews}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/creators/new" className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50">
              <h4 className="font-medium text-gray-900">Add Creator</h4>
              <p className="text-sm text-gray-500">Register new creator account</p>
            </Link>
            <Link href="/admin/landing-pages/new" className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50">
              <h4 className="font-medium text-gray-900">Create Landing Page</h4>
              <p className="text-sm text-gray-500">Build new landing page</p>
            </Link>
            <Link href="/admin/analytics" className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50">
              <h4 className="font-medium text-gray-900">View Analytics</h4>
              <p className="text-sm text-gray-500">Performance insights</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

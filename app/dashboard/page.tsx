'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const stats = [
    { label: 'Active Monitors', value: '24', change: '+2', positive: true },
    { label: 'Satellite Feeds', value: '15', change: '+3', positive: true },
    { label: 'Alerts Today', value: '8', change: '-1', positive: false },
    { label: 'Data Points', value: '1.2M', change: '+450K', positive: true },
  ]

  const recentActivity = [
    { time: '2 hours ago', event: 'New flood alert detected in Gujarat', type: 'alert' },
    { time: '4 hours ago', event: 'Satellite data updated for Maharashtra', type: 'update' },
    { time: '6 hours ago', event: 'System maintenance completed', type: 'system' },
    { time: '8 hours ago', event: 'New monitoring zone added', type: 'config' },
  ]

  return (
    <main className="pt-24 px-6 sm:px-8 lg:px-12 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                <span className="text-gradient">Dashboard</span>
              </h1>
              <p className="mt-2 text-white/70">
                Welcome back, {user.name}. Here's your monitoring overview.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/satellite-data"
                className="px-4 py-2 text-sm font-medium border border-white/15 hover:border-cyan-accent/40 text-white/85 hover:text-cyan-accent transition-colors bg-white/5 rounded-lg"
              >
                View Satellite Data
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors rounded-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'alert' ? 'bg-red-400' :
                      activity.type === 'update' ? 'bg-blue-400' :
                      activity.type === 'system' ? 'bg-yellow-400' : 'bg-green-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-white/80">{activity.event}</p>
                      <p className="text-xs text-white/50 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/live-map"
                  className="block px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                >
                  View Live Map
                </Link>
                <Link
                  href="/analytics"
                  className="block px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                >
                  Analytics Dashboard
                </Link>
                <Link
                  href="/satellite-data"
                  className="block px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                >
                  Satellite Data
                </Link>
                <Link
                  href="/research"
                  className="block px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                >
                  Research & Tech
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-white/60">Name</p>
                <p className="text-white mt-1">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Email</p>
                <p className="text-white mt-1">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Member Since</p>
                <p className="text-white mt-1">{new Date(user.loginTime).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

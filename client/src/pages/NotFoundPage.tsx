import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, Compass, Map } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <h1 className="text-[200px] md:text-[300px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-none">
              404
            </h1>
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Compass className="w-32 h-32 md:w-48 md:h-48 text-purple-400 opacity-20" />
            </motion.div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-lg text-gray-400">
            It might have been moved or deleted.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all"
            >
              <Home className="w-6 h-6" />
              Go Home
            </motion.button>
          </Link>

          <Link href="/search/advanced">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
            >
              <Search className="w-6 h-6" />
              Search
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
            Go Back
          </motion.button>
        </motion.div>

        {/* Popular Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-16"
        >
          <p className="text-gray-400 mb-6">Popular Pages:</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: 'Marketplace', href: '/marketplace' },
              { label: 'Live Auctions', href: '/auctions' },
              { label: 'My Artworks', href: '/artworks/my' },
              { label: 'Analytics', href: '/analytics/dashboard' },
              { label: 'Profile', href: '/profile/me' },
              { label: 'Settings', href: '/settings' },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 hover:text-white transition-all text-sm"
                >
                  {link.label}
                </motion.a>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          />
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'wouter';
import {
  Heart, Mail, MapPin, Phone, Facebook, Twitter,
  Instagram, Linkedin, Youtube, Send
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: 'About Us', href: '/about' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Blog', href: '/blog' },
    ],
    marketplace: [
      { label: 'Browse Artworks', href: '/marketplace' },
      { label: 'Advanced Search', href: '/search/advanced' },
      { label: 'Live Auctions', href: '/auctions' },
      { label: 'Artists', href: '/artists' },
    ],
    resources: [
      { label: 'Help Center', href: '/help' },
      { label: 'Guidelines', href: '/guidelines' },
      { label: 'FAQs', href: '/faq' },
      { label: 'Contact Support', href: '/support' },
    ],
    legal: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Refund Policy', href: '/refunds' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:text-pink-600' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-blue-700' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube', color: 'hover:text-red-600' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white mt-auto">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-gray-300">Subscribe to get the latest artworks and exclusive offers</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-blue-400 focus:outline-none placeholder-gray-400"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                <Send className="w-5 h-5" />
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
              <span className="text-2xl font-bold">ART BANK</span>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              The world's premier digital art marketplace connecting artists, collectors, and galleries.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>New York, USA</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@artbank.com" className="hover:text-blue-400">
                  hello@artbank.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <a href="tel:+1234567890" className="hover:text-blue-400">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-lg mb-4">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-gray-300 hover:text-white transition-colors text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Marketplace</h4>
            <ul className="space-y-2">
              {footerLinks.marketplace.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-gray-300 hover:text-white transition-colors text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-gray-300 hover:text-white transition-colors text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-gray-300 hover:text-white transition-colors text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-300 text-sm">
              © {currentYear} ART BANK Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-300 ${social.color} transition-colors`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="text-xs text-gray-400">🔒 Secure Payments</div>
            <div className="text-xs text-gray-400">✓ Verified Artists</div>
            <div className="text-xs text-gray-400">🛡️ Buyer Protection</div>
            <div className="text-xs text-gray-400">🌍 Worldwide Shipping</div>
            <div className="text-xs text-gray-400">💎 Authenticity Guaranteed</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

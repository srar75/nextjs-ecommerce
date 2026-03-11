import Link from 'next/link';
import { Package, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <Package className="h-6 w-6" />
            <span>ShopNext</span>
          </div>
          <p className="text-sm">Your modern shopping destination. Quality products, fast delivery.</p>
          <div className="flex gap-3">
            <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
              <span className="text-xs font-bold">f</span>
            </a>
            <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
              <span className="text-xs font-bold">t</span>
            </a>
            <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
              <span className="text-xs font-bold">in</span>
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link href="/products?category=electronics" className="hover:text-white transition-colors">Electronics</Link></li>
            <li><Link href="/products?category=clothing" className="hover:text-white transition-colors">Clothing</Link></li>
            <li><Link href="/products?category=sports" className="hover:text-white transition-colors">Sports</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Account</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
            <li><Link href="/profile/orders" className="hover:text-white transition-colors">My Orders</Link></li>
            <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@shopnext.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 (555) 123-4567</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> 123 Commerce St</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-2 text-sm">
          <p>© 2026 ShopNext. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

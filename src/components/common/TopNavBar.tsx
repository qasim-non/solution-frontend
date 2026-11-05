import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { PushNotificationToggle } from './PushNotificationToggle';

export const TopNavBar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full top-0 sticky bg-[#f7f9fb] dark:bg-[#191c1e] border-b border-[#c3c6d7]/40 z-50 transition-all duration-200">
      <div className="flex justify-between items-center px-6 py-4 max-w-[1200px] mx-auto rtl">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-[#004ac6] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            &lt;&gt;
          </div>
          <div className="font-bold text-xl text-[#004ac6] dark:text-[#b4c5ff] group-hover:opacity-90 transition-opacity">
           حلول برمجية
          </div>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-base font-medium">
          <Link
            to="/"
            className={`transition-all duration-200 cursor-pointer active:scale-95 ${
              isActive('/')
                ? 'text-[#004ac6] font-bold border-b-2 border-[#004ac6] pb-1'
                : 'text-[#434655] hover:text-[#004ac6]'
            }`}
          >
            الرئيسية
          </Link>
          <Link
            to="/services"
            className={`transition-all duration-200 cursor-pointer active:scale-95 ${
              isActive('/services')
                ? 'text-[#004ac6] font-bold border-b-2 border-[#004ac6] pb-1'
                : 'text-[#434655] hover:text-[#004ac6]'
            }`}
          >
            خدماتنا
          </Link>
          <Link
            to="/contact"
            className={`transition-all duration-200 cursor-pointer active:scale-95 ${
              isActive('/contact')
                ? 'text-[#004ac6] font-bold border-b-2 border-[#004ac6] pb-1'
                : 'text-[#434655] hover:text-[#004ac6]'
            }`}
          >
            تواصل معنا
          </Link>
        </nav>

        {/* Trailing Action */}
        <div className="flex items-center gap-3">
          <PushNotificationToggle />

          <Link
            to="/request"
            className="hidden sm:inline-flex items-center justify-center bg-[#2563eb] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#004ac6] transition-all duration-200 active:scale-95 shadow-sm gap-2"
          >
            <span>اطلب مشروعك</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#434655] hover:bg-[#eceef0] rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#c3c6d7]/30 bg-[#ffffff] px-6 py-4 space-y-3 rtl animate-in slide-in-from-top duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-[#191c1e] hover:text-[#004ac6]"
          >
            الرئيسية
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-[#191c1e] hover:text-[#004ac6]"
          >
            خدماتنا
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-[#191c1e] hover:text-[#004ac6]"
          >
            تواصل معنا
          </Link>
          <Link
            to="/request"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full mt-2 inline-flex items-center justify-center bg-[#2563eb] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#004ac6] transition-all text-center gap-2"
          >
            اطلب مشروعك الأن
          </Link>
        </div>
      )}
    </header>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#ffffff] border-t border-[#c3c6d7]/30 mt-auto">
      <div
        dir="rtl"
        className="flex flex-col md:flex-row justify-between items-center px-6 py-8 max-w-[1200px] mx-auto gap-4"
      >
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link to="/" dir="rtl" className="flex items-center gap-2 font-bold text-xl text-[#004ac6]">
            <img
              src="/solution-logo-dark-bg.png"
              alt="حلول برمجية"
              className="h-8 w-auto object-contain"
            />
            <span>حلول برمجية</span>
          </Link>
          <p className="text-xs text-[#434655]">
            رواد الهندسة البرمجية في المنطقة، نصنع المستقبل برؤية تقنية طموحة
          </p>
        </div>

        <div className="flex gap-6 text-sm text-[#434655]">
          <Link to="/services" className="hover:text-[#004ac6] transition-colors">
            خدماتنا
          </Link>
          <Link
            to="/developer-network"
            className="hover:text-[#004ac6] transition-colors"
          >
            شبكة المطورين
          </Link>
          <Link to="/contact" className="hover:text-[#004ac6] transition-colors">
            تواصل معنا
          </Link>
        </div>

        <div className="text-xs text-[#434655] text-center md:text-left">
          <span dir="rtl" style={{ unicodeBidi: 'isolate' }}>
            © 2026 جميع الحقوق محفوظة
          </span>
        </div>
      </div>
    </footer>
  );
};

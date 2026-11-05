import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#ffffff] border-t border-[#c3c6d7]/30 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-8 max-w-[1200px] mx-auto rtl gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link to="/" className="font-bold text-xl text-[#004ac6]">
           حلول برمجية
          </Link>
          <p className="text-xs text-[#434655]">
            رواد الهندسة البرمجية في المنطقة، نصنع المستقبل برؤية تقنية طموحة.
          </p>
        </div>

        <div className="flex gap-6 text-sm text-[#434655]">
          <Link to="/services" className="hover:text-[#004ac6] transition-colors">
            خدماتنا
          </Link>
          <Link to="/contact" className="hover:text-[#004ac6] transition-colors">
            تواصل معنا
          </Link>
          <Link to="/login" className="hover:text-[#004ac6] transition-colors">
            بوابة الإدارة
          </Link>
        </div>

        <div className="text-xs text-[#434655] text-center md:text-left">
          © {new Date().getFullYear()}{' '}
          <span dir="rtl" style={{ unicodeBidi: 'isolate', direction: 'rtl' }}>
            حلول برمجية
          </span>
          . جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
};

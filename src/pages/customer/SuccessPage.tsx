import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Home } from 'lucide-react';

export const SuccessPage: React.FC = () => {
  return (
    <div className="flex-grow flex items-center justify-center py-20 px-6 relative overflow-hidden rtl">
      {/* Background Ambient Accents */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#dbe1ff] opacity-40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#e2dfff] opacity-30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Success Card */}
      <div className="bg-[#ffffff] border border-[#c3c6d7]/40 rounded-2xl p-8 md:p-12 shadow-lg text-center max-w-xl w-full mx-auto flex flex-col items-center relative overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 rounded-full bg-[#dbe1ff] flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-[#004ac6] opacity-10 animate-ping"></div>
          <CheckCircle2 className="w-16 h-16 text-[#004ac6] relative z-10" />
        </div>

        <h1 className="text-3xl font-extrabold text-[#191c1e] mb-3">
          تم إرسال طلبك بنجاح
        </h1>

        <p className="text-base text-[#434655] mb-8 max-w-md leading-relaxed">
          شكراً لك. تم استلام طلبك وسنقوم بمراجعته والتواصل معك عبر الواتساب أو الهاتف في أقرب وقت.
        </p>

        <Link
          to="/"
          className="bg-[#004ac6] text-white font-semibold text-sm py-3 px-8 rounded-xl hover:bg-[#2563eb] transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </Link>
      </div>
    </div>
  );
};

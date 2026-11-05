import React from 'react';
import { Link } from 'react-router-dom';
import { User, FileText, Send, PhoneCall, ArrowLeft } from 'lucide-react';

export const AccountPage: React.FC = () => {
  return (
    <div className="py-12 px-4 md:px-8 max-w-[1200px] mx-auto w-full rtl space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-[#c3c6d7]/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#004ac6] text-white flex items-center justify-center font-bold text-2xl shadow-md">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#191c1e]">بوابة العميل</h1>
            <p className="text-sm text-[#434655]">مرحباً بك في منصة تتبع طلباتك واستفساراتك البرمجية.</p>
          </div>
        </div>

        <Link
          to="/request"
          className="bg-[#2563eb] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#004ac6] transition-all flex items-center gap-2 active:scale-95 shadow-sm"
        >
          <span>تقديم طلب جديد</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/40 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#191c1e]">متابعة طلب مشروع</h3>
          <p className="text-xs text-[#434655] leading-relaxed">
            تمت إضافة آلية تتبع تلقائية لجميع المشاريع المقدمة عبر رقم الواتساب المسجل.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/40 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#e2dfff] text-[#4b41e1] flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#191c1e]">المراسلات والدعم</h3>
          <p className="text-xs text-[#434655] leading-relaxed">
            يمكنك إرسال الاستفسارات الفنية مباشرة لفريق الاستشارات البرمجية عبر صفحة الاتصال.
          </p>
          <Link to="/contact" className="text-xs font-bold text-[#004ac6] hover:underline inline-block">
            إرسال استفسار ←
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/40 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#dae2fd] text-[#4d556b] flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#191c1e]">التواصل المباشر</h3>
          <p className="text-xs text-[#434655] leading-relaxed">
            فريقنا متاح للرد المباشر عبر الواتساب على +971 54 544 5786
          </p>
        </div>
      </div>
    </div>
  );
};

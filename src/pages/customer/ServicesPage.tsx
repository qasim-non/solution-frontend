import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Smartphone, Monitor, Palette, Brain, Layers, CheckCircle, Headphones, ArrowLeft } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  return (
    <div className="py-12 px-6 max-w-[1200px] mx-auto rtl space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="inline-block px-4 py-1 bg-[#004ac6]/10 text-[#004ac6] text-xs font-semibold rounded-full">
          <span dir="rtl" style={{ unicodeBidi: 'isolate', direction: 'rtl' }}>
            حلول برمجية متكاملة
          </span>
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#191c1e]">خدماتنا المتميزة</h1>
        <p className="text-base text-[#434655] max-w-2xl mx-auto">
          نحول أفكارك الطموحة إلى واقع رقمي ملموس من خلال هندسة برمجية دقيقة وتصاميم عصرية تلبي احتياجات سوق العمل.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/40 shadow-xs hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#004ac6]/10 flex items-center justify-center text-[#004ac6] mb-4">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#191c1e] mb-2">تطوير المواقع</h3>
          <p className="text-sm text-[#434655] leading-relaxed">
            بناء منصات ويب متطورة، سريعة، ومتوافقة مع كافة الشاشات باستخدام أحدث تقنيات الويب العالمية.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/40 shadow-xs hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#4b41e1]/10 flex items-center justify-center text-[#4b41e1] mb-4">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#191c1e] mb-2">تطبيقات الجوال</h3>
          <p className="text-sm text-[#434655] leading-relaxed">
            تطوير تطبيقات iOS و Android أصلية ومبتكرة توفر تجربة مستخدم سلسة وأداءً تقنياً عالياً.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/40 shadow-xs hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#4d556b]/10 flex items-center justify-center text-[#4d556b] mb-4">
            <Monitor className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#191c1e] mb-2">برامج سطح المكتب</h3>
          <p className="text-sm text-[#434655] leading-relaxed">
            <span dir="rtl" style={{ unicodeBidi: 'isolate', direction: 'rtl' }}>حلول برمجية متكاملة</span> لكافة أنظمة التشغيل لإدارة العمليات المعقدة بكفاءة وموثوقية تامة.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/40 shadow-xs hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#004ac6]/10 flex items-center justify-center text-[#004ac6] mb-4">
            <Palette className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#191c1e] mb-2">تصميم واجهات المستخدم</h3>
          <p className="text-sm text-[#434655] leading-relaxed">
            تصميم واجهات عصرية تركز على سهولة الاستخدام وجمال التفاصيل لخلق تجربة رقمية لا تُنسى.
          </p>
        </div>
      </div>

      {/* How We Work Bento Grid */}
      <div className="space-y-8 pt-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#191c1e]">كيف نعمل؟</h2>
          <p className="text-sm text-[#434655]">
            مسار عمل مدروس يضمن تحويل رؤيتك إلى منتج استثنائي.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 md:row-span-2 bg-[#004ac6] text-white rounded-3xl p-8 flex flex-col justify-between shadow-md">
            <div className="space-y-4">
              <Brain className="w-12 h-12 text-[#b4c5ff]" />
              <h3 className="text-xl font-bold">01. التحليل والاستراتيجية</h3>
              <p className="text-sm text-white/90 leading-relaxed">
                نبدأ بفهم عميق لأهداف عملك، تحديد الجمهور المستهدف، ورسم خارطة الطريق التقنية الأكثر فعالية.
              </p>
            </div>
            <div className="pt-8 text-xs text-[#b4c5ff]">مرحلة التخطيط المتقدم</div>
          </div>

          <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-[#c3c6d7]/40 shadow-xs flex flex-col justify-center space-y-3">
            <div className="flex items-center gap-3">
              <Layers className="w-8 h-8 text-[#004ac6]" />
              <h3 className="text-xl font-bold text-[#191c1e]">02. التصميم والتطوير</h3>
            </div>
            <p className="text-sm text-[#434655] leading-relaxed">
              عملية متوازية بين الإبداع البصري والهندسة البرمجية لبناء واجهات جذابة وأنظمة سريعة الاستجابة.
            </p>
          </div>

          <div className="md:col-span-1 bg-[#4b41e1] text-white rounded-3xl p-8 flex flex-col justify-center space-y-3 shadow-xs">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-white" />
              <h3 className="text-xl font-bold">03. الجودة والتدقيق</h3>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              اختبارات دقيقة وشاملة لضمان خلو النظام من الثغرات والأخطاء البرمجية قبل الإطلاق الرسمي.
            </p>
          </div>

          <div className="md:col-span-1 bg-[#eceef0] text-[#191c1e] rounded-3xl p-8 border border-[#c3c6d7]/40 flex flex-col justify-center space-y-3 shadow-xs">
            <div className="flex items-center gap-3">
              <Headphones className="w-8 h-8 text-[#004ac6]" />
              <h3 className="text-xl font-bold">04. الإطلاق والدعم</h3>
            </div>
            <p className="text-sm text-[#434655] leading-relaxed">
              نرافقك في لحظة الإطلاق ونقدم دعماً فنياً مستمراً لضمان استقرار ونمو مشروعك الرقمي.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-8">
        <Link
          to="/request"
          className="inline-flex items-center gap-2 bg-[#2563eb] text-white text-base font-semibold px-8 py-3.5 rounded-xl hover:bg-[#004ac6] transition-all shadow-md active:scale-95"
        >
          <span>اطلب مشروعك الآن</span>
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

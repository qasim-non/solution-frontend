import React, { useState, useEffect } from 'react';
import { customerApi } from '../../api/customer';
import { Mail, Phone, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [contactEmail, setContactEmail] = useState('yqtasheel@gmail.com');
  const [contactPhone, setContactPhone] = useState('+971 54 544 5786');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [textMessage, setTextMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    customerApi
      .getContactInfo()
      .then((res) => {
        if (res.data) {
          res.data.forEach((item) => {
            if (item.type === 'email') setContactEmail(item.value);
            if (item.type === 'mobile' || item.type === 'phone') setContactPhone(item.value);
          });
        }
      })
      .catch(() => {
        // Keep defaults
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !textMessage.trim()) {
      setErrorMsg('يرجى تعبئة جميع الحقول المطلوبة.');
      return;
    }

    setIsSubmitting(true);

    try {
      await customerApi.sendContactMessage({
        full_name: fullName.trim(),
        email: email.trim(),
        text_message: textMessage.trim(),
      });
      setSubmitted(true);
      setFullName('');
      setEmail('');
      setTextMessage('');
    } catch {
      setErrorMsg('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4 md:px-8 max-w-[1200px] mx-auto w-full rtl space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#004ac6]">تواصل معنا</h1>
        <p className="text-base text-[#434655] max-w-2xl mx-auto leading-relaxed">
          نحن هنا لمساعدتك في تحويل رؤيتك التقنية إلى واقع ملموس. فريقنا المتخصص جاهز للرد على استفساراتك.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Contact Info */}
        <div className="space-y-6">
          <div className="bg-[#f2f4f6] p-8 rounded-2xl border border-[#c3c6d7]/40 shadow-xs space-y-8">
            <h2 className="text-xl font-bold text-[#4b41e1]">معلومات الاتصال</h2>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-[#dbe1ff] flex items-center justify-center text-[#004ac6] transition-transform group-hover:scale-105">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#434655]">البريد الإلكتروني</p>
                  <p className="text-lg font-bold text-[#191c1e]" dir="ltr">
                    {contactEmail}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-[#e2dfff] flex items-center justify-center text-[#4b41e1] transition-transform group-hover:scale-105">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#434655]">الهاتف / الواتساب</p>
                  <p className="text-lg font-bold text-[#191c1e]" dir="ltr">
                    {contactPhone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="bg-white p-8 rounded-2xl border border-[#c3c6d7]/40 shadow-xs">
          <h2 className="text-xl font-bold text-[#004ac6] mb-6">أرسل لنا رسالة</h2>

          {submitted ? (
            <div className="p-6 bg-[#dbe1ff] text-[#004ac6] rounded-xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 mx-auto" />
              <h3 className="text-lg font-bold">شكراً لتواصلك!</h3>
              <p className="text-sm">تم استلام رسالتك وسنقوم بالرد عليك في أقرب وقت.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-bold underline cursor-pointer"
              >
                إرسال رسالة أخرى
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3.5 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-sm font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#434655]">الاسم الكامل</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: أحمد محمد"
                  className="w-full bg-[#f2f4f6] border border-[#c3c6d7]/60 rounded-xl p-3.5 text-sm text-[#191c1e] focus:ring-2 focus:ring-[#004ac6]/20 focus:border-[#004ac6] outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#434655]">البريد الإلكتروني</label>
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full bg-[#f2f4f6] border border-[#c3c6d7]/60 rounded-xl p-3.5 text-sm text-[#191c1e] focus:ring-2 focus:ring-[#004ac6]/20 focus:border-[#004ac6] outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#434655]">الرسالة</label>
                <textarea
                  rows={5}
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  placeholder="كيف يمكننا مساعدتك؟"
                  className="w-full bg-[#f2f4f6] border border-[#c3c6d7]/60 rounded-xl p-3.5 text-sm text-[#191c1e] focus:ring-2 focus:ring-[#004ac6]/20 focus:border-[#004ac6] outline-none transition-all resize-y"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#004ac6] text-white font-bold text-base py-3.5 rounded-xl hover:bg-[#2563eb] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

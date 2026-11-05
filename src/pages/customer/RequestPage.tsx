import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerApi } from '../../api/customer';
import { adminApi } from '../../api/admin';
import { SystemType } from '../../types/api';
import { Send, ChevronUp, ChevronDown, Info, Computer, Globe, Smartphone } from 'lucide-react';

export const RequestPage: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [projectName, setProjectName] = useState('');
  const [countryCode, setCountryCode] = useState('+966');
  const [phone, setPhone] = useState('');
  const [selectedSystemTypes, setSelectedSystemTypes] = useState<number[]>([]);
  const [description, setDescription] = useState('');
  const [socialLinks, setSocialMedia] = useState<{ [key: string]: string }>({
    '1': '', // Instagram
    '2': '', // Facebook
    '3': '', // TikTok
    '4': '', // YouTube
  });

  const [showSocialFields, setShowSocialFields] = useState(true);
  const [systemTypes, setSystemTypes] = useState<SystemType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Fetch system categories
    adminApi
      .getSystemTypes()
      .then((res) => {
        setSystemTypes(res.types || []);
      })
      .catch(() => {
        setSystemTypes([
          { id: 1, name: 'برنامج مكتبي (Desktop)' },
          { id: 2, name: 'نظام سحابي (Web)' },
          { id: 3, name: 'تطبيق جوال (Mobile)' },
        ]);
      })
      .finally(() => setLoadingTypes(false));
  }, []);

  const toggleSystemType = (id: number) => {
    if (selectedSystemTypes.includes(id)) {
      setSelectedSystemTypes(selectedSystemTypes.filter((item) => item !== id));
    } else {
      setSelectedSystemTypes([...selectedSystemTypes, id]);
    }
  };

  const handleSocialChange = (platformId: string, val: string) => {
    setSocialMedia({
      ...socialLinks,
      [platformId]: val,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!projectName.trim()) {
      setErrorMsg('يرجى إدخال اسم المشروع أو المتجر');
      return;
    }

    if (!phone.trim()) {
      setErrorMsg('يرجى إدخال رقم الواتساب الخاص بك');
      return;
    }

    if (selectedSystemTypes.length === 0) {
      setErrorMsg('يرجى اختيار نوع النظام المطلوب واحد على الأقل');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullMobile = `${countryCode}${phone.trim()}`;

      // Clean social media object (only non-empty values)
      const cleanedSocial: Record<string, string> = {};
      Object.entries(socialLinks).forEach(([key, value]: [string, string]) => {
        if (value && typeof value === 'string' && value.trim()) {
          cleanedSocial[key] = value.trim();
        }
      });

      await customerApi.createProjectRequest({
        project_name: projectName.trim(),
        mobile: fullMobile,
        description: description.trim() || undefined,
        system_types: selectedSystemTypes,
        social_media: Object.keys(cleanedSocial).length ? cleanedSocial : undefined,
      });

      navigate('/success');
    } catch (err: unknown) {
      const responseData = (
        err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }
      )?.response?.data;

      if (responseData?.errors) {
        // Show the actual validation message(s) from Laravel instead of a
        // generic error, so the user can see what needs fixing.
        const messages = Object.values(responseData.errors).flat();
        setErrorMsg(messages.join(' '));
      } else {
        setErrorMsg(
          responseData?.message || 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSystemIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('desktop') || lower.includes('مكتبي')) return <Computer className="w-6 h-6" />;
    if (lower.includes('web') || lower.includes('سحابي') || lower.includes('موقع')) return <Globe className="w-6 h-6" />;
    return <Smartphone className="w-6 h-6" />;
  };

  return (
    <div dir="rtl" className="py-12 px-4 md:px-8 max-w-[1200px] mx-auto w-full rtl">
      <div className="max-w-3xl mx-auto bg-[#ffffff] rounded-2xl border border-[#c3c6d7]/40 shadow-sm overflow-hidden">
        {/* Header / Progress */}
        <div className="bg-[#f2f4f6] p-6 border-b border-[#c3c6d7]/30 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#191c1e]">طلب مشروع جديد</h1>
            <p className="text-sm text-[#434655] mt-1">
              قم بتعبئة التفاصيل أدناه لنتمكن من فهم متطلباتك بوضوح.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[#004ac6] font-semibold text-sm">
            <span>بيانات المشروع</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-sm font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#191c1e]" htmlFor="projectName">
                اسم المشروع أو المتجر <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="أدخل اسم المشروع"
                className="w-full bg-[#f7f9fb] border border-[#c3c6d7]/60 rounded-xl px-4 py-3 text-sm text-[#191c1e] focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] outline-none transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#191c1e]" htmlFor="whatsapp">
                رقم الواتساب <span className="text-[#ba1a1a]">*</span>
              </label>
              <div className="flex" dir="rtl">
                <div className="flex-shrink-0 relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    dir="rtl"
                    className="h-full bg-[#eceef0] border border-[#c3c6d7]/60 border-l-0 rounded-r-xl px-3 text-sm text-[#434655] outline-none focus:border-[#004ac6] appearance-none pl-8 pr-3 rtl:pl-8 rtl:pr-3"
                  >
                    <option value="+966">السعودية 🇸🇦 +966</option>
                    <option value="+971">الإمارات 🇦🇪 +971</option>
                    <option value="+20">مصر 🇪🇬 +20</option>
                    <option value="+962">الأردن 🇯🇴 +962</option>
                    <option value="+964">العراق 🇮🇶 +964</option>
                    <option value="+963">سوريا 🇸🇾 +963</option>
                    <option value="+961">لبنان 🇱🇧 +961</option>
                    <option value="+970">فلسطين 🇵🇸 +970</option>
                    <option value="+974">قطر 🇶🇦 +974</option>
                    <option value="+973">البحرين 🇧🇭 +973</option>
                    <option value="+965">الكويت 🇰🇼 +965</option>
                    <option value="+968">عمان 🇴🇲 +968</option>
                    <option value="+967">اليمن 🇾🇪 +967</option>
                    <option value="+249">السودان 🇸🇩 +249</option>
                    <option value="+218">ليبيا 🇱🇾 +218</option>
                    <option value="+216">تونس 🇹🇳 +216</option>
                    <option value="+213">الجزائر 🇩🇿 +213</option>
                    <option value="+212">المغرب 🇲🇦 +212</option>
                    <option value="+222">موريتانيا 🇲🇷 +222</option>
                    <option value="+221">السنغال 🇸🇳 +221</option>
                    <option value="+252">الصومال 🇸🇴 +252</option>
                    <option value="+211">جنوب السودان 🇸🇸 +211</option>
                    <option value="+253">جيبوتي 🇩🇯 +253</option>
                    <option value="+269">جزر القمر 🇰🇲 +269</option>
                  </select>
                </div>
                <input
                  id="whatsapp"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="5X XXX XXXX"
                  dir="ltr"
                  className="w-full bg-[#f7f9fb] border border-[#c3c6d7]/60 rounded-l-xl px-4 py-3 text-sm text-[#191c1e] text-left focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] outline-none transition-colors rtl:rounded-l-none rtl:rounded-l-xl rtl:border-r-0"
                  required
                />
              </div>
            </div>
          </div>

          {/* System Type Section */}
          <div className="pt-4 border-t border-[#c3c6d7]/30">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-[#191c1e] mb-1">
                نوع النظام المطلوب <span className="text-[#ba1a1a]">*</span>
              </h2>
              <p className="text-xs text-[#434655]">يمكنك اختيار أكثر من خيار.</p>
            </div>

            {loadingTypes ? (
              <div className="py-4 text-center text-sm text-[#004ac6]">جاري تحميل الخيارات...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {systemTypes.map((type) => {
                  const isSelected = selectedSystemTypes.includes(type.id);
                  return (
                    <div
                      key={type.id}
                      onClick={() => toggleSystemType(type.id)}
                      className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-[#004ac6] bg-[#f7f9fb] ring-2 ring-[#004ac6]/20'
                          : 'border-[#c3c6d7]/60 hover:border-[#004ac6] bg-white'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                          isSelected ? 'bg-[#004ac6] text-white' : 'bg-[#e6e8ea] text-[#434655]'
                        }`}
                      >
                        {getSystemIcon(type.name)}
                      </div>
                      <span className="text-sm font-bold text-[#191c1e] text-center">
                        {type.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Social Media Section */}
          <div className="pt-4 border-t border-[#c3c6d7]/30">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-sm font-bold text-[#191c1e]">حسابات التواصل الاجتماعي</h2>
              <button
                type="button"
                onClick={() => setShowSocialFields(!showSocialFields)}
                className="text-[#004ac6] text-xs font-semibold hover:underline flex items-center gap-1"
              >
                <span>{showSocialFields ? 'إخفاء الحقول' : 'إظهار الحقول'}</span>
                {showSocialFields ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showSocialFields && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f2f4f6] p-4 rounded-xl border border-[#c3c6d7]/40">
                <div className="flex items-center bg-white border border-[#c3c6d7]/60 rounded-xl overflow-hidden focus-within:border-[#004ac6]">
                  <span className="px-3 py-2.5 bg-[#e6e8ea] text-xs font-bold text-[#434655] border-l border-[#c3c6d7]/40">
                    Instagram
                  </span>
                  <input
                    type="text"
                    value={socialLinks['1']}
                    onChange={(e) => handleSocialChange('1', e.target.value)}
                    placeholder="@username"
                    className="w-full bg-transparent px-3 py-2 text-sm text-[#191c1e] outline-none"
                  />
                </div>

                <div className="flex items-center bg-white border border-[#c3c6d7]/60 rounded-xl overflow-hidden focus-within:border-[#004ac6]">
                  <span className="px-3 py-2.5 bg-[#e6e8ea] text-xs font-bold text-[#434655] border-l border-[#c3c6d7]/40">
                    Facebook
                  </span>
                  <input
                    type="text"
                    value={socialLinks['2']}
                    onChange={(e) => handleSocialChange('2', e.target.value)}
                    placeholder="username/page"
                    className="w-full bg-transparent px-3 py-2 text-sm text-[#191c1e] outline-none"
                  />
                </div>

                <div className="flex items-center bg-white border border-[#c3c6d7]/60 rounded-xl overflow-hidden focus-within:border-[#004ac6]">
                  <span className="px-3 py-2.5 bg-[#e6e8ea] text-xs font-bold text-[#434655] border-l border-[#c3c6d7]/40">
                    TikTok
                  </span>
                  <input
                    type="text"
                    value={socialLinks['3']}
                    onChange={(e) => handleSocialChange('3', e.target.value)}
                    placeholder="@username"
                    className="w-full bg-transparent px-3 py-2 text-sm text-[#191c1e] outline-none"
                  />
                </div>

                <div className="flex items-center bg-white border border-[#c3c6d7]/60 rounded-xl overflow-hidden focus-within:border-[#004ac6]">
                  <span className="px-3 py-2.5 bg-[#e6e8ea] text-xs font-bold text-[#434655] border-l border-[#c3c6d7]/40">
                    YouTube
                  </span>
                  <input
                    type="text"
                    value={socialLinks['4']}
                    onChange={(e) => handleSocialChange('4', e.target.value)}
                    placeholder="@channel"
                    className="w-full bg-transparent px-3 py-2 text-sm text-[#191c1e] outline-none"
                  />
                </div>
              </div>
            )}
            <p className="text-xs text-[#434655] mt-2 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#004ac6]" />
              <span>أضف واحداً على الأقل إن وُجد.</span>
            </p>
          </div>

          {/* Notes Section */}
          <div className="pt-4 border-t border-[#c3c6d7]/30">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#191c1e]" htmlFor="notes">
                ملاحظات إضافية <span className="text-xs font-normal text-[#434655]">(اختياري)</span>
              </label>
              <textarea
                id="notes"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="أضف أي تفاصيل أخرى ترغب في مشاركتها..."
                className="w-full bg-[#f7f9fb] border border-[#c3c6d7]/60 rounded-xl p-3 text-sm text-[#191c1e] focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] outline-none transition-colors resize-y"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#004ac6] text-white font-bold text-base px-8 py-3.5 rounded-xl hover:bg-[#2563eb] transition-all shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال الطلب'}</span>
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

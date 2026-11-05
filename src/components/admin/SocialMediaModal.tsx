import React from 'react';
import { X, ExternalLink, Instagram, Facebook, Youtube, Share2 } from 'lucide-react';
import { SocialMediaAccountItem } from '../../types/api';

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
  accounts: SocialMediaAccountItem[];
  isLoading?: boolean;
}

export const SocialMediaModal: React.FC<SocialMediaModalProps> = ({
  isOpen,
  onClose,
  projectName = 'نظم التقنية',
  accounts,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getPlatformIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('instagram')) return <Instagram className="w-5 h-5 text-pink-600" />;
    if (lower.includes('facebook')) return <Facebook className="w-5 h-5 text-blue-600" />;
    if (lower.includes('youtube')) return <Youtube className="w-5 h-5 text-red-600" />;
    return <Share2 className="w-5 h-5 text-gray-700" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm rtl animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-[500px] rounded-2xl shadow-xl border border-[#c3c6d7]/30 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#c3c6d7]/30 flex justify-between items-center bg-[#f7f9fb]">
          <h2 className="text-lg font-bold text-[#004ac6]">تفاصيل حسابات التواصل</h2>
          <button
            onClick={onClose}
            className="p-1 text-[#434655] hover:bg-[#eceef0] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="mb-2">
            <p className="text-xs text-[#434655]">اسم المشروع / المتجر</p>
            <h3 className="text-lg font-bold text-[#191c1e]">{projectName}</h3>
          </div>

          {isLoading ? (
            <div className="py-8 flex justify-center text-[#004ac6]">
              <div className="w-8 h-8 border-4 border-[#004ac6] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : accounts.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#434655]">
              لا توجد حسابات تواصل مضافة لهذا الطلب.
            </p>
          ) : (
            <div className="space-y-3">
              {accounts.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-[#f7f9fb] rounded-xl border border-[#c3c6d7]/30 hover:border-[#004ac6] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#c3c6d7]/30 shadow-xs">
                      {getPlatformIcon(item.platform?.name || '')}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#191c1e]">
                        {item.platform?.name || 'منصة تواصل'}
                      </h4>
                      <p className="text-xs text-[#434655] truncate max-w-[220px]" dir="ltr">
                        {item.url}
                      </p>
                    </div>
                  </div>

                  <a
                    href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-[#004ac6] hover:bg-[#dbe1ff] rounded-lg transition-colors"
                    title="فتح الرابط"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#c3c6d7]/30 flex justify-end bg-[#f2f4f6]">
          <button
            onClick={onClose}
            className="bg-[#004ac6] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-[#2563eb] transition-all"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

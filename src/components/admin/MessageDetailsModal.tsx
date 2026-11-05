import React from 'react';
import { X, User, Mail, Calendar } from 'lucide-react';
import { ContactMessage } from '../../types/api';

interface MessageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ContactMessage | null;
}

export const MessageDetailsModal: React.FC<MessageDetailsModalProps> = ({
  isOpen,
  onClose,
  message,
}) => {
  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm rtl animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-lg rounded-2xl shadow-xl border border-[#c3c6d7]/30 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#c3c6d7]/30 bg-[#f7f9fb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#191c1e]">{message.full_name}</h2>
              <p className="text-xs text-[#434655] flex items-center gap-1" dir="ltr">
                <Mail className="w-3 h-3" />
                {message.email}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#434655] hover:bg-[#eceef0] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#737686]">
            <Calendar className="w-4 h-4" />
            <span>تاريخ الإرسال: {new Date(message.created_at || Date.now()).toLocaleString('ar-SA')}</span>
          </div>

          <div className="p-4 bg-[#f7f9fb] rounded-xl border border-[#c3c6d7]/30 text-sm text-[#191c1e] leading-relaxed whitespace-pre-wrap">
            {message.text_message}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#c3c6d7]/30 flex justify-end bg-[#f2f4f6]">
          <button
            onClick={onClose}
            className="bg-[#ffffff] text-[#191c1e] border border-[#c3c6d7] hover:bg-[#eceef0] text-sm font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

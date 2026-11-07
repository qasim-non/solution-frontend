import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { MessageDetailsModal } from '../../components/admin/MessageDetailsModal';
import { ContactMessage } from '../../types/api';
import { Mail, Inbox, Eye, Calendar, User } from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal State
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    adminApi
      .getMessages()
      .then((res) => {
        setMessages(res.data || []);
      })
      .catch(() => {
        setErrorMsg('تعذر تحميل الرسائل. قد تكون الجلسة منتهية — يرجى تسجيل الدخول من جديد.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const openMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);
  };

  return (
    <div className="rtl space-y-8">
      <AdminHeader
        title="الرسائل الاستفسارية"
        subtitle="بريد رسائل تواصل معنا الواردة من الموقع الرسمي."
      />

      <section className="bg-[#ffffff] border border-[#c3c6d7]/40 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#c3c6d7]/30 flex justify-between items-center bg-[#f2f4f6]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#dbe1ff] rounded-xl text-[#004ac6]">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#191c1e]">بريد تواصل معنا</h3>
              <p className="text-xs text-[#434655]">إدارة الاستفسارات الواردة</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#004ac6] bg-[#dbe1ff] px-3 py-1 rounded-full">
            {messages.length} رسائل
          </span>
        </div>

        {errorMsg ? (
          <div className="py-12 text-center text-[#ba1a1a] text-sm font-semibold px-6">
            {errorMsg}
          </div>
        ) : isLoading ? (
          <div className="py-12 text-center text-[#004ac6]">
            <div className="w-8 h-8 border-4 border-[#004ac6] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm font-semibold">جاري تحميل البريد الوارد...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-[#434655] text-sm">
            لا توجد رسائل واردة حالياً.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-[#f7f9fb] text-[#434655] border-b border-[#c3c6d7]/40 font-bold">
                <tr>
                  <th className="p-4">الاسم</th>
                  <th className="p-4">البريد الإلكتروني</th>
                  <th className="p-4">محتوى الرسالة</th>
                  <th className="p-4">التاريخ</th>
                  <th className="p-4">عرض</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c3c6d7]/30">
                {messages.map((msg, idx) => (
                  <tr
                    key={idx}
                    onClick={() => openMessage(msg)}
                    className="hover:bg-[#f7f9fb] transition-colors cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center font-bold text-sm">
                          {msg.full_name?.charAt(0) || 'ع'}
                        </div>
                        <span className="font-bold text-[#191c1e]">{msg.full_name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#434655] font-mono" dir="ltr">
                      {msg.email}
                    </td>
                    <td className="p-4 text-[#191c1e] max-w-xs truncate">
                      {msg.text_message}
                    </td>
                    <td className="p-4 text-[#434655] whitespace-nowrap">
                      {new Date(msg.created_at || Date.now()).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openMessage(msg);
                        }}
                        className="p-1.5 text-[#004ac6] hover:bg-[#dbe1ff] rounded-lg transition-colors"
                        title="عرض كامل الرسالة"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Full Message Details Modal */}
      <MessageDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={selectedMessage}
      />
    </div>
  );
};

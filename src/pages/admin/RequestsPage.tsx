import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../api/admin';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { SocialMediaModal } from '../../components/admin/SocialMediaModal';
import { ProjectRequest, SocialMediaAccountItem, SystemType } from '../../types/api';
import { Search, Filter, Eye, CheckCircle2, RotateCcw, Calendar, MessageSquare, Phone } from 'lucide-react';

export const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [systemTypes, setSystemTypes] = useState<SystemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Social Media Modal state
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [selectedRequestName, setSelectedRequestName] = useState('');
  const [socialAccounts, setSocialAccounts] = useState<SocialMediaAccountItem[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    // The API requires both dates together (required_with), so only send a
    // range when both are filled in — otherwise it returns 422 and the table
    // silently looks empty.
    const hasDateRange = Boolean(startDate && endDate);

    try {
      const res = await adminApi.getRequests({
        search: searchTerm.trim() || undefined,
        system_type: selectedType !== 'all' ? Number(selectedType) : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        start_date: hasDateRange ? startDate : undefined,
        end_date: hasDateRange ? endDate : undefined,
      });
      setRequests(res.data || []);
    } catch {
      setRequests([]);
      setErrorMsg('تعذر تحميل الطلبات. قد تكون الجلسة منتهية — يرجى تحديث الصفحة وتسجيل الدخول من جديد.');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedType, selectedStatus, startDate, endDate]);

  useEffect(() => {
    // Initial fetch of requests and system categories
    adminApi
      .getSystemTypes()
      .then((res) => setSystemTypes(res.data || []))
      .catch(() => setSystemTypes([]));
    fetchRequests();
  }, [fetchRequests]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRequests();
  };

  const handleViewSocialAccounts = async (req: ProjectRequest) => {
    setSelectedRequestName(req.project_name);
    setIsSocialModalOpen(true);
    setLoadingAccounts(true);

    try {
      const res = await adminApi.getSocialMediaAccounts(req.id);
      setSocialAccounts(res.data || []);
    } catch {
      setSocialAccounts([]);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await adminApi.completeRequest(id);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'completed' } : r))
      );
    } catch {
      setErrorMsg('تعذر تحديث حالة الطلب. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleRevert = async (id: number) => {
    try {
      await adminApi.revertRequest(id);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'pending' } : r))
      );
    } catch {
      setErrorMsg('تعذر تحديث حالة الطلب. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="rtl space-y-8">
      <AdminHeader
        title="طلبات المشاريع"
        subtitle="إدارة ومتابعة كافة طلبات البرمجيات والتطبيقات المقدمة من العملاء."
      />

      {/* Filter Section */}
      <section className="bg-[#ffffff] border border-[#c3c6d7]/40 rounded-2xl p-6 shadow-xs">
        <form onSubmit={handleFilterSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search by project name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#434655]" htmlFor="search">
                اسم المشروع
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-[#737686]" />
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="بحث باسم المشروع..."
                  className="w-full pl-3 pr-10 py-2.5 bg-[#f7f9fb] border border-[#c3c6d7]/60 rounded-xl text-sm text-[#191c1e] outline-none focus:border-[#004ac6]"
                />
              </div>
            </div>

            {/* System Type Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#434655]" htmlFor="type">
                نوع النظام
              </label>
              <select
                id="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#f7f9fb] border border-[#c3c6d7]/60 rounded-xl text-sm text-[#191c1e] outline-none focus:border-[#004ac6]"
              >
                <option value="all">جميع الأنظمة</option>
                {systemTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#434655]" htmlFor="status">
                الحالة
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#f7f9fb] border border-[#c3c6d7]/60 rounded-xl text-sm text-[#191c1e] outline-none focus:border-[#004ac6]"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="completed">تمت المراجعة</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#434655]" htmlFor="start-date">
                تاريخ البدء
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#f7f9fb] border border-[#c3c6d7]/60 rounded-xl text-sm text-[#191c1e] outline-none focus:border-[#004ac6]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#434655]" htmlFor="end-date">
                تاريخ الانتهاء
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#f7f9fb] border border-[#c3c6d7]/60 rounded-xl text-sm text-[#191c1e] outline-none focus:border-[#004ac6]"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-[#004ac6] text-white font-bold py-2.5 px-4 rounded-xl text-sm hover:bg-[#2563eb] transition-colors flex items-center justify-center gap-2"
              >
                <Filter className="w-4 h-4" />
                <span>تطبيق الفلتر</span>
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Requests Table */}
      <section className="bg-[#ffffff] border border-[#c3c6d7]/40 rounded-2xl shadow-xs overflow-hidden">
        {errorMsg ? (
          <div className="py-12 text-center text-[#ba1a1a] text-sm font-semibold px-6">
            {errorMsg}
          </div>
        ) : isLoading ? (
          <div className="py-12 text-center text-[#004ac6]">
            <div className="w-8 h-8 border-4 border-[#004ac6] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm font-semibold">جاري تحميل الطلبات...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center text-[#434655] text-sm">
            لا توجد طلبات تطابق خيارات الفلترة المحددة.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-[#f2f4f6] text-[#434655] border-b border-[#c3c6d7]/40 font-bold">
                <tr>
                  <th className="p-4">المعرف</th>
                  <th className="p-4">اسم المشروع</th>
                  <th className="p-4">الوصف</th>
                  <th className="p-4">رقم الواتساب</th>
                  <th className="p-4">نوع النظام</th>
                  <th className="p-4">حسابات التواصل</th>
                  <th className="p-4">التاريخ</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">الإجراء الإداري</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c3c6d7]/30">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#f7f9fb] transition-colors">
                    <td className="p-4 font-mono font-bold text-[#004ac6]">#{req.id}</td>
                    <td className="p-4 font-bold text-[#191c1e]">{req.project_name}</td>
                    <td className="p-4 text-[#434655] max-w-[240px]">
                      <span className="line-clamp-2">{req.description || '—'}</span>
                    </td>
                    <td className="p-4 text-[#434655] font-mono" dir="ltr">
                      {req.mobile || '+966 50 123 4567'}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 flex-wrap justify-end">
                        {(req.system_types || []).map((st, i) => {
                          const name = st.name || '';
                          let label = name;
                          let styleClass = 'bg-[#e0e3e5] text-[#434655]';

                          if (name === 'Web') {
                            label = 'موقع إلكتروني';
                            styleClass = 'bg-[#dbe1ff] text-[#004ac6]';
                          } else if (name === 'Mobile App') {
                            label = 'تطبيق جوال';
                            styleClass = 'bg-[#f3e8ff] text-[#6b21a8]';
                          } else if (name === 'Desktop Application') {
                            label = 'تطبيق مكتبي';
                            styleClass = 'bg-[#dff6e9] text-[#047857]';
                          }

                          return (
                            <span
                              key={i}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${styleClass}`}
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleViewSocialAccounts(req)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#004ac6]/10 text-[#004ac6] hover:bg-[#004ac6] hover:text-white transition-colors rounded-lg text-xs font-bold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>عرض الحسابات</span>
                      </button>
                    </td>
                    <td className="p-4 text-[#434655]">
                      {new Date(req.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          req.status === 'completed'
                            ? 'bg-[#dbe1ff] text-[#004ac6]'
                            : 'bg-[#e0e3e5] text-[#434655]'
                        }`}
                      >
                        {req.status === 'completed' ? 'تمت المراجعة' : 'قيد الانتظار'}
                      </span>
                    </td>
                    <td className="p-4">
                      {req.status === 'completed' ? (
                        <button
                          onClick={() => handleRevert(req.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eceef0] text-[#434655] hover:bg-[#e0e3e5] transition-colors rounded-lg text-xs font-semibold"
                          title="إعادة إلى قيد الانتظار"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>إعادة للانتظار</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleComplete(req.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#004ac6] text-white hover:bg-[#2563eb] transition-colors rounded-lg text-xs font-semibold shadow-xs"
                          title="تحديد كـ تمت المراجعة"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>تمت المراجعة</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Social Media Modal */}
      <SocialMediaModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        projectName={selectedRequestName}
        accounts={socialAccounts}
        isLoading={loadingAccounts}
      />
    </div>
  );
};

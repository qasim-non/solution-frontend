import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { DashboardData, OldestRequestSummary } from '../../types/api';
import { Database, Calendar, Clock, CheckCircle2, X, Eye } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Side Drawer State for Viewing Request Detail
  const [selectedRequest, setSelectedRequest] = useState<OldestRequestSummary | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    adminApi
      .getDashboard()
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        setErrorMsg('تعذر تحميل إحصائيات لوحة التحكم. قد تكون الجلسة منتهية — يرجى تسجيل الدخول من جديد.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const openDrawer = (req: OldestRequestSummary) => {
    setSelectedRequest(req);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="rtl space-y-8">
      <AdminHeader
        title="مرحباً بك في لوحة التحكم"
        subtitle="إدارة الطلبات والعمليات اليومية بشكل سريع ومباشر."
      />

      {errorMsg && (
        <div className="p-4 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-sm font-semibold">
          {errorMsg}
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-[#004ac6]">
          <div className="w-10 h-10 border-4 border-[#004ac6] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold">جاري تحميل إحصائيات لوحة التحكم...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#c3c6d7]/40 shadow-xs">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-bold text-[#434655]">إجمالي الطلبات</p>
                <div className="p-2 rounded-xl bg-[#dbe1ff] text-[#004ac6]">
                  <Database className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#191c1e]">{data?.total_requests ?? 0}</p>
              <p className="text-xs text-[#004ac6] mt-2">+12% من الشهر الماضي</p>
            </div>

            <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#c3c6d7]/40 shadow-xs">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-bold text-[#434655]">طلبات اليوم</p>
                <div className="p-2 rounded-xl bg-[#e2dfff] text-[#4b41e1]">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#191c1e]">{data?.recent_requests ?? 0}</p>
              <p className="text-xs text-[#4b41e1] mt-2">5 بانتظار المراجعة</p>
            </div>

            <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#c3c6d7]/40 shadow-xs">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-bold text-[#434655]">قيد الانتظار</p>
                <div className="p-2 rounded-xl bg-[#dae2fd] text-[#4d556b]">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#191c1e]">{data?.pending_requests ?? 0}</p>
              <p className="text-xs text-[#4d556b] mt-2">تتطلب إجراء سريع</p>
            </div>

            <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#c3c6d7]/40 shadow-xs">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-bold text-[#434655]">تمت المراجعة</p>
                <div className="p-2 rounded-xl bg-[#dbe1ff] text-[#004ac6]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#191c1e]">{data?.completed_requests ?? 0}</p>
              <p className="text-xs text-[#004ac6] mt-2">98% معدل إنجاز</p>
            </div>
          </section>

          {/* Main Data Table Area - Shows only last 5 requests per user requirement */}
          <section className="bg-[#ffffff] rounded-2xl border border-[#c3c6d7]/40 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-[#c3c6d7]/30 flex justify-between items-center bg-[#f2f4f6]">
              <h3 className="text-lg font-bold text-[#191c1e]">أحدث الطلبات (آخر 5 طلبات)</h3>
              <span className="text-xs text-[#434655] font-semibold">عرض سريعي</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-[#f7f9fb] text-[#434655] border-b border-[#c3c6d7]/40 font-bold">
                  <tr>
                    <th className="p-4">رقم الطلب</th>
                    <th className="p-4">اسم المشروع</th>
                    <th className="p-4">الوصف</th>
                    <th className="p-4">التاريخ</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c3c6d7]/30">
                  {!data?.oldest_requests?.length && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#434655] text-sm">
                        لا توجد طلبات بعد.
                      </td>
                    </tr>
                  )}
                  {data?.oldest_requests?.slice(0, 5).map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-[#f7f9fb] transition-colors cursor-pointer"
                      onClick={() => openDrawer(req)}
                    >
                      <td className="p-4 font-mono font-bold text-[#004ac6]">#{req.id}</td>
                      <td className="p-4 font-bold text-[#191c1e]">{req.project_name}</td>
                      <td className="p-4 text-[#434655] max-w-xs truncate">{req.description}</td>
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDrawer(req);
                          }}
                          className="p-1.5 text-[#004ac6] hover:bg-[#dbe1ff] rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* Side Drawer for Request Details */}
      {drawerOpen && selectedRequest && (
        <>
          <div
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 transition-opacity"
          />
          <div className="fixed top-0 left-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transition-transform duration-300 rtl border-r border-[#c3c6d7]/40 flex flex-col">
            <div className="p-6 border-b border-[#c3c6d7]/30 flex justify-between items-center bg-[#f7f9fb]">
              <h3 className="text-lg font-bold text-[#191c1e]">تفاصيل الطلب #{selectedRequest.id}</h3>
              <button
                onClick={closeDrawer}
                className="p-1.5 text-[#434655] hover:bg-[#eceef0] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="bg-[#f2f4f6] p-4 rounded-xl border border-[#c3c6d7]/40">
                <h4 className="text-base font-bold text-[#191c1e] mb-1">
                  {selectedRequest.project_name}
                </h4>
                <p className="text-xs text-[#434655] mb-3">
                  تاريخ الطلب: {new Date(selectedRequest.created_at).toLocaleDateString('ar-SA')}
                </p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedRequest.status === 'completed'
                      ? 'bg-[#dbe1ff] text-[#004ac6]'
                      : 'bg-[#e0e3e5] text-[#434655]'
                  }`}
                >
                  {selectedRequest.status === 'completed' ? 'تمت المراجعة' : 'قيد الانتظار'}
                </span>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-[#434655]">وصف المشروع / الملاحظات</h5>
                <div className="bg-[#f7f9fb] p-4 rounded-xl border border-[#c3c6d7]/40 text-sm text-[#191c1e] leading-relaxed">
                  {selectedRequest.description || 'لا يوجد وصف مضاف.'}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#c3c6d7]/30 bg-[#f7f9fb]">
              <button
                onClick={closeDrawer}
                className="w-full bg-[#004ac6] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#2563eb] transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

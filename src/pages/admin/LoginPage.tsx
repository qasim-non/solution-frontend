import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Settings, User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim() || !password.trim()) {
      setErrorMsg('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setLoading(true);

    try {
      await login({ username: username.trim(), password }, rememberMe);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response) {
        const data = err.response.data as { message?: string };
        setErrorMsg(data.message || 'اسم المستخدم أو كلمة المرور غير صحيحة');
      } else {
        setErrorMsg('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-12 rtl">
      {/* Branding Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#004ac6] text-white rounded-2xl mb-4 shadow-md">
          <Settings className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-[#191c1e] mb-1">بوابة الإدارة</h1>
        <p className="text-sm text-[#434655]">برمجية حلول</p>
      </div>

      {/* Login Card */}
      <div className="bg-[#ffffff] border border-[#c3c6d7]/40 rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-sm font-semibold text-center">
              {errorMsg}
            </div>
          )}

          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#434655] block" htmlFor="username">
              اسم المستخدم
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#737686]">
                <User className="w-5 h-5" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="w-full bg-[#f2f4f6] border border-[#c3c6d7]/60 text-[#191c1e] rounded-xl py-3 pr-11 pl-4 focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20 focus:border-[#004ac6] transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#434655] block" htmlFor="password">
                كلمة المرور
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#737686]">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f2f4f6] border border-[#c3c6d7]/60 text-[#191c1e] rounded-xl py-3 pr-11 pl-11 focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20 focus:border-[#004ac6] transition-all text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#737686] hover:text-[#191c1e] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-[#004ac6] border-[#c3c6d7] rounded focus:ring-[#004ac6]"
            />
            <label htmlFor="remember" className="text-xs font-semibold text-[#434655] cursor-pointer">
              تذكرني على هذا الجهاز
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#004ac6] text-white font-bold text-sm py-3.5 px-6 rounded-xl hover:bg-[#2563eb] active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>تسجيل الدخول</span>
            )}
          </button>
        </form>

        {/* No client-side fallback credentials or demo login flows. Authentication
            relies exclusively on the backend API response. */}
      </div>
    </div>
  );
};

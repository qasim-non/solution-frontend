import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Palette, Zap, Award, Gauge, Code2, Headset, ArrowLeft } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vs = `attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }`;

    const fs = `precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;
      void main() {
        vec2 uv = v_texCoord;
        vec3 color1 = vec3(0.97, 0.98, 1.0); // Light surface
        vec3 color2 = vec3(0.86, 0.90, 1.0); // Soft primary accent
        float wave = sin(uv.x * 6.0 + u_time * 0.8) * cos(uv.y * 6.0 + u_time * 0.8);
        vec3 finalColor = mix(color1, color2, wave * 0.25 + 0.25);
        gl_FragColor = vec4(finalColor, 1.0);
      }`;

    const createShader = (type: number, source: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, vs);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    let animId: number;

    const render = (t: number) => {
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth || 1280;
        canvas.height = canvas.clientHeight || 720;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen rtl">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden py-16 px-6 bg-[#f7f9fb]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
        />

        <div className="relative z-10 max-w-[1200px] mx-auto text-center flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#004ac6]/10 text-[#004ac6] rounded-full text-xs font-semibold">
            <span dir="rtl" style={{ unicodeBidi: 'isolate', direction: 'rtl' }}>
              حلول برمجية متكاملة ومبتكرة
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-[#191c1e] max-w-3xl leading-tight">
            نحوّل أفكارك إلى أنظمة احترافية تنجح أعمالك
          </h1>

          <p className="text-lg text-[#434655] max-w-2xl leading-relaxed">
            نصمم ونطور أنظمة ويب وتطبيقات جوال وبرامج سطح مكتب بجودة عالية وتجربة استخدام مميزة تناسب احتياجات مشروعك.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              to="/request"
              className="bg-[#2563eb] text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-[#004ac6] transition-all shadow-md active:scale-95 text-center flex items-center justify-center gap-2"
            >
              <span>اطلب نظامك الأن</span>
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link
              to="/services"
              className="bg-white text-[#191c1e] border border-[#c3c6d7] px-8 py-3.5 rounded-xl font-medium text-base hover:bg-[#eceef0] transition-all text-center"
            >
              تعرّف على خدماتنا
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#ffffff]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#f7f9fb] p-8 rounded-2xl border border-[#e0e3e5] flex flex-col gap-4 shadow-xs hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-[#dbe1ff] flex items-center justify-center text-[#004ac6]">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#191c1e]">تطوير احترافي</h3>
              <p className="text-sm text-[#434655] leading-relaxed">
                نبني أنظمة قوية وقابلة للتوسع باستخدام أحدث التقنيات وأفضل الممارسات البرمجية.
              </p>
            </div>

            <div className="bg-[#f7f9fb] p-8 rounded-2xl border border-[#e0e3e5] flex flex-col gap-4 shadow-xs hover:-translate-y-1 transition-transform md:translate-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#e2dfff] flex items-center justify-center text-[#4b41e1]">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#191c1e]">تصميم مميز</h3>
              <p className="text-sm text-[#434655] leading-relaxed">
                واجهات عصرية وتجربة استخدام سهلة ومريحة تناسب هوية علامتك التجارية.
              </p>
            </div>

            <div className="bg-[#f7f9fb] p-8 rounded-2xl border border-[#e0e3e5] flex flex-col gap-4 shadow-xs hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-[#dae2fd] flex items-center justify-center text-[#4d556b]">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#191c1e]">حلول مخصصة</h3>
              <p className="text-sm text-[#434655] leading-relaxed">
                كل مشروع يتم تصميمه وتطويره خصيصاً بما يناسب طبيعة متطلباتك ونشاطك التجاري.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-[#f7f9fb]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-[#191c1e] mb-12">
            لماذا يختارنا العملاء؟
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Award className="w-10 h-10 text-[#004ac6]" />
              <span className="font-semibold text-sm text-[#191c1e]">جودة عالية</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Gauge className="w-10 h-10 text-[#004ac6]" />
              <span className="font-semibold text-sm text-[#191c1e]">سرعة في التنفيذ</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Code2 className="w-10 h-10 text-[#004ac6]" />
              <span className="font-semibold text-sm text-[#191c1e]">هندسة برمجية متطورة</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Headset className="w-10 h-10 text-[#004ac6]" />
              <span className="font-semibold text-sm text-[#191c1e]">دعم متواصل</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-[#ffffff] border-y border-[#e0e3e5]">
        <div className="max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold text-[#191c1e]">هل لديك فكرة مشروع؟</h2>
          <p className="text-base text-[#434655]">
            ابدأ الآن وأرسل تفاصيل مشروعك وسنتواصل معك في أقرب وقت.
          </p>
          <Link
            to="/request"
            className="bg-[#2563eb] text-white text-lg font-semibold px-10 py-4 rounded-xl shadow-lg hover:bg-[#004ac6] transition-all active:scale-95 flex items-center gap-3"
          >
            <span>إرسال طلب جديد</span>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

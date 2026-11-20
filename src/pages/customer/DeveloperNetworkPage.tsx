import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Code2,
  Laptop,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { PublicStatisticsBar } from '../../components/common/PublicStatisticsBar';

const benefits = [
  {
    icon: Code2,
    title: 'مشاريع حقيقية ومستمرة',
    description:
      'فرص عمل برمجية جاهزة للتنفيذ في مجالات الويب، التطبيقات والأنظمة دون الحاجة للبحث عن عملاء أو التفاوض المرهق',
    iconClassName: 'bg-primary-fixed text-primary',
  },
  {
    icon: Wallet,
    title: 'عوائد مالية مجزية وموثوقة',
    description:
      'دفعات نقدية واضحة ومضمونة ومحولة فور تسليم المهام مع اتفاقيات مالية شفافة، عادلة وبدون تأخيرات بنكية',
    iconClassName: 'bg-tertiary-fixed text-tertiary-container',
  },
  {
    icon: Laptop,
    title: 'مرونة كاملة عن بُعد',
    description:
      'اعمل من أي مكان وفي الأوقات التي تناسب جدولك، سواء بدوام جزئي مرن أو تفرغ هندسي كامل حسب رغبتك',
    iconClassName: 'bg-secondary-fixed text-secondary',
  },
] as const;

export const DeveloperNetworkPage: React.FC = () => {
  return (
    <div dir="rtl" className="flex flex-col bg-surface text-on-surface">
      <section className="relative overflow-hidden px-5 pb-24 pt-10 sm:px-8 md:pt-16">
        <div className="pointer-events-none absolute inset-0 flex justify-center opacity-60">
          <div className="h-[450px] w-[850px] -translate-y-24 rounded-full bg-gradient-to-b from-primary-fixed-dim/40 via-surface-container/30 to-transparent blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-[1200px] flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-surface-container-high px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            فرص عمل وشراكات هندسية مرنة
          </div>

          <h1 className="mb-4 max-w-4xl text-3xl font-bold leading-[1.35] tracking-tight text-on-surface md:text-5xl md:leading-[1.25]">
            ابنِ مشاريع برمجية حقيقية وحقق دخلاً مجزياً{' '}
            <span className="text-primary underline decoration-primary/20 decoration-wavy decoration-2 underline-offset-8">
              بشروطك
            </span>
          </h1>

          <p className="mb-8 max-w-2xl text-base leading-relaxed text-on-surface-variant md:text-lg md:leading-7">
            انضم إلى نخبة المهندسين والمطورين في «حلول برمجية» واستلم مهام تقنية
            ومشاريع واضحة بعقود موثوقة وعوائد فورية دون تعقيد
          </p>

          <div className="flex w-full max-w-sm flex-col items-center gap-2">
            <Link
              id="register"
              to="/join-developer"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-bold text-on-primary shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-xl active:translate-y-0"
            >
              انضم كمطور الآن
              <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1.5" />
            </Link>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-[11px] text-on-surface-variant/80">
              <ShieldCheck className="h-4 w-4 text-tertiary" />
              التسجيل يستغرق أقل من دقيقتين • بدون متطلبات معقدة
            </p>
          </div>

          <PublicStatisticsBar className="mt-16 w-full max-w-3xl" />
        </div>
      </section>

      <section className="bg-surface-container-low/60 py-20 md:py-24">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-5 sm:px-8">
          <div className="flex flex-col items-center text-center">
            <span className="mb-2 text-[11px] font-bold uppercase tracking-widest text-primary">
              امتيازات الشبكة
            </span>
            <h2 className="text-2xl font-bold text-on-surface md:text-[32px] md:leading-[44px]">
              لماذا تنضم إلى «حلول برمجية»؟
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-on-surface-variant">
              بيئة هندسية احترافية صُممت لتمكين المطور من الإبداع دون الانشغال
              بإدارة العلاقات التجارية
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article
                  key={benefit.title}
                  className="group flex flex-col rounded-2xl bg-surface-container-lowest p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <span
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${benefit.iconClassName}`}
                  >
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mb-3 text-lg font-bold text-on-surface">
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface px-5 py-20 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-3xl border border-primary/10 bg-surface-container-lowest px-6 py-12 text-center shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
            <BadgeCheck className="h-6 w-6" />
          </span>
          <h2 className="text-2xl font-bold text-on-surface md:text-3xl">
            جاهز للانضمام إلى شبكة المطورين؟
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-on-surface-variant md:text-base">
            سجّل بياناتك وخبراتك التقنية، وسيقوم فريقنا بمراجعة ملفك والتواصل معك
            عند توفر مشاريع مناسبة
          </p>
          <Link
            to="/join-developer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-bold text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-95"
          >
            ابدأ التسجيل الآن
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

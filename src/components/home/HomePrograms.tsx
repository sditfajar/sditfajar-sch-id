import {
  BookOpen,
  Compass,
  Heart,
  Utensils,
  Store,
  Moon,
  Sun,
  Sunrise,
  CheckCircle2,
  Mic,
  Sparkle,
  Award,
} from "lucide-react";

export function HomePrograms() {
  const programs = [
    {
      icon: BookOpen,
      iconBg: "bg-[#ECFDF5]",
      iconColor: "text-[#047857]",
      title: "Pembelajaran Al-Qur'an dengan Metode \"Tilawati\"",
      desc: "Pembelajaran Al-Qur'an bersistem dan bertahap dengan nada rost khas metode Tilawati, melatih kelancaran membaca, makharijul huruf, serta tajwid secara menyenangkan.",
      checkText: "Metode Tilawati Terstandar",
      checkColor: "text-[#1D4ED8]",
    },
    {
      icon: Compass,
      iconBg: "bg-[#DCE1FF]",
      iconColor: "text-[#1D4ED8]",
      title: "Education Field Trip",
      desc: "Kunjungan belajar edukatif di luar kelas untuk memperluas cakrawala pengetahuan, mengenalkan sains di alam terbuka, dan membangun kebersamaan santri.",
      checkText: "Eksplorasi Lapangan Nyata",
      checkColor: "text-[#1D4ED8]",
    },
    {
      icon: Heart,
      iconBg: "bg-[#FFDBCA]",
      iconColor: "text-[#9D4300]",
      title: "Pembinaan Karakter Siswa Sesuai Ajaran Islam",
      desc: "Penanaman adab kesantunan, kejujuran, disiplin, berbakti kepada orang tua, serta keteladanan akhlak Rasulullah SAW dalam keseharian.",
      checkText: "Adab Sebelum Ilmu",
      checkColor: "text-[#9D4300]",
    },
    {
      icon: Utensils,
      iconBg: "bg-[#FFDBCA]",
      iconColor: "text-[#9D4300]",
      title: "Lifeskill melalui Kegiatan Cookingday",
      desc: "Aktivitas seru memasak bersama untuk melatih kemandirian, motorik halus, higienitas makanan halal dan toyyib, serta kekompakan kelompok.",
      checkText: "Kecakapan Hidup Praktis",
      checkColor: "text-[#9D4300]",
    },
    {
      icon: Store,
      iconBg: "bg-[#DCE1FF]",
      iconColor: "text-[#1D4ED8]",
      title: "Marketday (Entrepreneurship)",
      desc: "Simulasi bazar mini sekolah untuk menumbuhkan jiwa wirausaha muda, pemahaman transaksi jual beli yang syar'i, percaya diri, dan hitungan matematika kontekstual.",
      checkText: "Kewirausahaan Cilik",
      checkColor: "text-[#1D4ED8]",
    },
    {
      icon: Moon,
      iconBg: "bg-[#ECFDF5]",
      iconColor: "text-[#047857]",
      title: "Pembiasaan Ibadah",
      desc: "Pembiasaan sholat berjamaah, doa-doa harian, hafalan hadits, serta keteladanan ibadah sunnah untuk membiasakan kecintaan kepada Allah sejak belia.",
      checkText: "Rutinitas Harian Rabbani",
      checkColor: "text-[#047857]",
    },
  ];

  const morningActivities = [
    {
      icon: Sunrise,
      iconBg: "bg-[#1D4ED8]",
      iconColor: "text-white",
      borderColor: "border-[#DCE1FF]",
      title: "Shalat Dhuha",
      subtitle: "Berjamaah setiap pagi",
    },
    {
      icon: BookOpen,
      iconBg: "bg-[#F97316]",
      iconColor: "text-[#0F172A]",
      borderColor: "border-[#FFDBCA]",
      title: "Dzikir Pagi",
      subtitle: "Al-Ma'tsurat bersama",
    },
    {
      icon: Mic,
      iconBg: "bg-[#047857]",
      iconColor: "text-white",
      borderColor: "border-[#A7F3D0]",
      title: "Muroja'ah Yaumiyah",
      subtitle: "Mengulang hafalan surat",
    },
    {
      icon: Sparkle,
      iconBg: "bg-[#DAE2FD]",
      iconColor: "text-[#1D4ED8]",
      borderColor: "border-[#C4C5D7]",
      title: "Jum'at Bersih",
      subtitle: "Gerakan peduli lingkungan",
    },
  ];

  return (
    <section className="bg-[#EAEDFF] py-14 sm:py-20 px-4 sm:px-6" id="program-unggulan">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white shadow-sm text-[#9D4300] text-xs sm:text-sm font-bold border border-slate-100">
            <Award className="w-4 h-4 text-[#F97316]" />
            PROGRAM UNGGULAN
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Program Unggulan SDIT Fajar Depok
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-[#434655] leading-relaxed">
            Kurikulum SDIT Fajar dirancang untuk membangun generasi Islami yang berkarakter, kreatif,
            mandiri, dan berprestasi global. Melalui pendekatan terpadu antara kurikulum nasional,
            pendidikan Al-Qur’an, serta pembiasaan ibadah harian, SDIT Fajar berkomitmen mencetak
            siswa-siswi yang cerdas secara intelektual, emosional, dan spiritual.
          </p>
        </div>

        {/* 6 Program Unggulan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-slate-200/70"
              >
                <div className="space-y-3.5">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${p.iconBg} ${p.iconColor} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#434655] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className={`pt-4 sm:pt-5 flex items-center gap-2 ${p.checkColor} text-xs sm:text-sm font-semibold`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{p.checkText}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Morning Activity Highlight Sub-Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-slate-200/70 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDBCA] text-[#783200] text-xs font-bold">
                <Sun className="w-3.5 h-3.5 text-[#F97316]" />
                RUTINITAS PAGI HARI
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] mt-1.5">
                Morning Activity SDIT Fajar
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#434655] max-w-md">
              Mengawali hari belajar dengan keberkahan rohani, kesegaran raga, dan kebersihan lingkungan sekolah.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {morningActivities.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  className={`p-4 sm:p-5 rounded-2xl bg-[#F2F3FF] border ${m.borderColor} flex items-center gap-3.5 hover:bg-[#E2E7FF] transition-colors`}
                >
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${m.iconBg} ${m.iconColor} flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[#0F172A]">
                      {m.title}
                    </h4>
                    <p className="text-xs text-[#434655]">{m.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


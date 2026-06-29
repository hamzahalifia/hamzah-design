import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Navbar from './Navbar';
import FooterReveal from './FooterReveal';
import { RollingText } from './magicui/RollingText';

const CASE_STUDIES = {
  'work-1': {
    category: 'HRMIS Portal',
    readingTime: '10 min read',
    title: 'Resolving a 40% Efficiency Loss in HR Timeshift Management',
    desc: 'In 2025, PT Neuronworks Indonesia suffered from fragmented manual shift permit tracking that cost productive work hours every month. Here is how we transformed the operational workflow with a story-data approach.',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
    company: 'Neuronworks Indonesia',
    role: 'UI/UX Designer',
    year: '2025',
  },
  'work-2': {
    category: 'Enterprise Dashboard',
    readingTime: '8 min read',
    title: 'Story-Data Enterprise Dashboard Transformation',
    desc: 'Streamlining real-time data visual hierarchy for multi-tier management reporting, reducing decision latency by 35%.',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
    company: 'Neuron Tech',
    role: 'Lead Product Designer',
    year: '2025',
  },
  'work-3': {
    category: 'Design Systems',
    readingTime: '12 min read',
    title: 'Scalable Design System & Component Infrastructure',
    desc: 'Unifying design language across 12+ enterprise platforms with high-density component libraries and automated token sync.',
    heroImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1400&q=80',
    company: 'Telkom Indonesia',
    role: 'Design System Architect',
    year: '2024',
  }
};

export default function WorkDetail() {
  const { workId } = useParams();
  const activeKey = CASE_STUDIES[workId] ? workId : 'work-1';
  const data = CASE_STUDIES[activeKey];

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#080809] text-attio-text-primary-light dark:text-attio-text-primary-dark flex flex-col justify-between">
      <Navbar />

      {/* Main Container Matching App.jsx Layout Architecture */}
      <main className="relative z-10 bg-[#FAFAF9] dark:bg-[#080809] flex-1 border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-0 lg:px-6">
          <div className="border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark flex flex-col lg:flex-row justify-between min-h-full bg-white dark:bg-[#0A0A0B]">
            
            {/* Left Side Strip with Diagonal Pattern & Dashed Line on LG */}
            <div className="hidden lg:block w-[120px] xl:w-[160px] flex-shrink-0 border-r border-attio-border-light dark:border-attio-border-dark relative overflow-hidden bg-neutral-50/40 dark:bg-neutral-900/20 select-none">
              <div className="absolute inset-0 opacity-70 dark:opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_7px,rgba(0,0,0,0.05)_7px,rgba(0,0,0,0.05)_8px)] dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_7px,rgba(255,255,255,0.05)_7px,rgba(255,255,255,0.05)_8px)]" />
              <div className="border-t border-dashed border-attio-border-light dark:border-attio-border-dark w-full h-12 relative z-10" />
            </div>

            {/* Central Case Study Content Area with 24px (p-6) Padding */}
            <div className="flex-1 p-6">
              <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12">
                
                {/* Back Navigation Button */}
                <div>
                  <Link
                    to="/work"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all border border-attio-border-light dark:border-attio-border-dark cursor-pointer"
                  >
                    <Icon icon="solar:alt-arrow-left-linear" className="w-4 h-4" />
                    <RollingText>Back to Work Showcase</RollingText>
                  </Link>
                </div>

                {/* Case Study Header Section */}
                <div className="space-y-6">
                  {/* Badge Chip Success + Reading Time */}
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-800/80 select-none">
                      {data.category}
                    </span>
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      • {data.readingTime}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-4">
                    <h1 className="font-serif-attio text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight tracking-tight text-neutral-900 dark:text-white">
                      {data.title}
                    </h1>
                    <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                      {data.desc}
                    </p>
                  </div>

                  {/* Hero Thumbnail Image */}
                  <div className="rounded-2xl overflow-hidden border border-attio-border-light dark:border-attio-border-dark bg-neutral-100 dark:bg-neutral-900 shadow-xl">
                    <img
                      src={data.heroImage}
                      alt={data.title}
                      className="w-full h-auto object-cover max-h-[520px]"
                    />
                  </div>

                  {/* 3-Grid Info List (Company, Role, Year) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 sm:p-6 rounded-xl border border-attio-border-light dark:border-attio-border-dark bg-neutral-50/80 dark:bg-neutral-900/50">
                    <div>
                      <div className="text-xs font-mono font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Company</div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-white mt-1">{data.company}</div>
                    </div>
                    <div>
                      <div className="text-xs font-mono font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Role</div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-white mt-1">{data.role}</div>
                    </div>
                    <div>
                      <div className="text-xs font-mono font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Year</div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-white mt-1">{data.year}</div>
                    </div>
                  </div>
                </div>

                {/* Detailed Case Study Article Content */}
                {activeKey === 'work-1' ? (
                  <div className="space-y-10 text-neutral-700 dark:text-neutral-300 leading-relaxed text-base">
                    
                    {/* Section 1: It Started Here... */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                        It Started Here...
                      </h2>
                      <p>
                        DOOR adalah platform HRMIS yang berfungsi sebagai ekosistem terpusat untuk seluruh operasional karyawan di perusahaan. Namun, di balik layar, tim operasional menghadapi masalah skalabilitas yang serius.
                      </p>
                      <p>
                        Sistem manajemen shift manual yang terfragmentasi menghabiskan 40-50 jam kerja produktif perusahaan setiap bulannya. Jadwal yang tidak sinkron ini memicu margin kesalahan sebesar 5-8% dalam rekapitulasi kehadiran, yang berisiko menyebabkan kerugian finansial yang signifikan akibat kelebihan pembayaran payroll yang tidak valid.
                      </p>

                      <div className="p-4 rounded-xl border-l-4 border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 text-sm font-medium">
                        Sederhananya: Tidak ada Single Source of Truth. Komunikasi manual menyebabkan jadwal yang terlewat dan persetujuan yang tidak tercatat.
                      </div>
                    </div>

                    <hr className="border-attio-border-light dark:border-attio-border-dark border-dashed" />

                    {/* Section 2: Understanding Up Close: The Core Friction */}
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                        Understanding Up Close: The Core Friction
                      </h2>
                      <p>
                        Untuk memahami di mana letak kerusakannya, saya memetakan gesekan alur kerja di tiga level pengguna:
                      </p>

                      <div className="grid grid-cols-1 gap-3 pl-2">
                        <div className="p-4 rounded-xl border border-attio-border-light dark:border-attio-border-dark bg-neutral-50/50 dark:bg-neutral-900/30">
                          <span className="font-bold text-neutral-900 dark:text-white">1. Employee:</span> Membutuhkan transparansi dan persetujuan perubahan shift yang cepat tanpa birokrasi yang berlapis.
                        </div>
                        <div className="p-4 rounded-xl border border-attio-border-light dark:border-attio-border-dark bg-neutral-50/50 dark:bg-neutral-900/30">
                          <span className="font-bold text-neutral-900 dark:text-white">2. Team Leader:</span> Mengalami kelebihan beban kognitif (cognitive overload) karena harus melacak permintaan manual yang tersebar melalui chat.
                        </div>
                        <div className="p-4 rounded-xl border border-attio-border-light dark:border-attio-border-dark bg-neutral-50/50 dark:bg-neutral-900/30">
                          <span className="font-bold text-neutral-900 dark:text-white">3. Human Resource:</span> Menghadapi risiko tinggi dari kesalahan human error akibat data entry manual untuk payroll bulanan.
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                          The Pivot:
                        </h3>
                        <p>
                          Awalnya, asumsi solusi yang muncul adalah membangun fitur self-request yang kompleks untuk karyawan. Namun, saya memutuskan untuk memutar arah solusi. Alih-alih membebani sistem dengan request berlapis, saya mendigitalkan kontrol langsung ke tangan Team Leader dan HR. Birokrasi dipangkas tanpa mengorbankan akurasi; karyawan bisa berkoordinasi secara verbal, sementara eksekusi dan pelacakan dilakukan 100% digital, instan, dan terpusat di DOOR.
                        </p>
                      </div>
                    </div>

                    <hr className="border-attio-border-light dark:border-attio-border-dark border-dashed" />

                    {/* Section 3: The Change and How I Did It */}
                    <div className="space-y-8">
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                        The Change and How I Did It
                      </h2>

                      {/* Dummy Image 1 */}
                      <div className="rounded-xl overflow-hidden border border-attio-border-light dark:border-attio-border-dark bg-neutral-100 dark:bg-neutral-900">
                        <img
                          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
                          alt="Bulk Shift Interface Design"
                          className="w-full h-[320px] object-cover"
                        />
                      </div>

                      {/* Subsection 1 */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                          1. Bulk Week Edit untuk Team Leader
                        </h3>
                        
                        <div className="space-y-2">
                          <div className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">The Problem:</div>
                          <blockquote className="italic border-l-2 border-neutral-300 dark:border-neutral-700 pl-4 text-neutral-800 dark:text-neutral-200 font-serif-attio">
                            "Saya butuh cara cepat untuk mengubah jadwal harian setiap orang selama satu minggu penuh." Mengubah shift satu per satu per hari sangat tidak efisien dan rentan terjadi kesalahan input.
                          </blockquote>
                        </div>

                        <div className="space-y-2 pt-2">
                          <div className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">The Solution:</div>
                          <p>Saya merancang interaksi Bulk Change Shift (1W).</p>
                          <ul className="list-disc list-inside space-y-2 pl-2">
                            <li><span className="font-semibold text-neutral-900 dark:text-white">Visual Feedback:</span> Pengguna kini bisa langsung melihat chips hari mana saja yang sedang aktif dan memperkirakan hari mana yang akan diubah jadwalnya.</li>
                            <li><span className="font-semibold text-neutral-900 dark:text-white">Simplicity in Input:</span> Hanya ada dua input utama di dalam modal: shift baru yang akan menimpa data sebelumnya, dan satu checkbox krusial untuk mengecualikan hari libur reguler (Exclude Weekend).</li>
                            <li><span className="font-semibold text-neutral-900 dark:text-white">Constraint:</span> Kini, Team Leader dapat mengubah shift anggota tim mereka setiap minggu, tetapi sistem mengunci kemampuan mereka untuk mengubah jadwal hari ini atau tanggal yang sudah lewat (backdate) demi menjaga integritas data.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Dummy Image 2 */}
                      <div className="rounded-xl overflow-hidden border border-attio-border-light dark:border-attio-border-dark bg-neutral-100 dark:bg-neutral-900">
                        <img
                          src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80"
                          alt="Batch Upload HR Interface"
                          className="w-full h-[320px] object-cover"
                        />
                      </div>

                      {/* Subsection 2 */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                          2. Division-Wide Batch Upload untuk HR
                        </h3>
                        
                        <div className="space-y-2">
                          <div className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">The Problem:</div>
                          <blockquote className="italic border-l-2 border-neutral-300 dark:border-neutral-700 pl-4 text-neutral-800 dark:text-neutral-200 font-serif-attio">
                            "Bagaimana cara mengubah jadwal shift untuk seluruh karyawan atau beberapa orang di divisi yang berbeda secara bersamaan?"
                          </blockquote>
                        </div>

                        <div className="space-y-2 pt-2">
                          <div className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">The Solution:</div>
                          <p>Membangun alur Upload Shift Batch yang berpusat pada mental model HR yang terbiasa dengan pengolahan data tabular.</p>
                          <ul className="list-disc list-inside space-y-2 pl-2">
                            <li><span className="font-semibold text-neutral-900 dark:text-white">Workflow Alignment:</span> Saya memisahkan tab modal menjadi dua bagian agar sesuai dengan alur kerja natural HR: mengunduh template custom, mengeditnya secara eksternal (di Excel/Spreadsheet), lalu mengunggahnya kembali.</li>
                            <li><span className="font-semibold text-neutral-900 dark:text-white">Scalability:</span> Sekarang HR dapat mengubah jadwal massal (bulk) secara langsung—baik untuk seluruh karyawan, divisi tertentu, atau bahkan karyawan spesifik di divisi yang berbeda—hanya melalui import file .csv</li>
                          </ul>
                        </div>
                      </div>

                      {/* Dummy Image 3 */}
                      <div className="rounded-xl overflow-hidden border border-attio-border-light dark:border-attio-border-dark bg-neutral-100 dark:bg-neutral-900">
                        <img
                          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
                          alt="Analytics Dashboard Summary"
                          className="w-full h-[320px] object-cover"
                        />
                      </div>
                    </div>

                    <hr className="border-attio-border-light dark:border-attio-border-dark border-dashed" />

                    {/* Section 4: Business Impact (Table 4 Columns) */}
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                        Business Impact
                      </h2>
                      <p>
                        Memberikan nilai bisnis yang terukur dan efisiensi operasional bukan sekadar pelengkap, melainkan tujuan utama dari perancangan ulang sistem B2B ini.
                      </p>

                      {/* Table 4 Columns */}
                      <div className="overflow-x-auto rounded-xl border border-attio-border-light dark:border-attio-border-dark">
                        <table className="w-full text-left text-xs sm:text-sm border-collapse">
                          <thead>
                            <tr className="bg-neutral-100 dark:bg-neutral-800/80 border-b border-attio-border-light dark:border-attio-border-dark text-neutral-900 dark:text-white font-semibold">
                              <th className="p-3.5 sm:p-4">Metric</th>
                              <th className="p-3.5 sm:p-4">Before</th>
                              <th className="p-3.5 sm:p-4">After</th>
                              <th className="p-3.5 sm:p-4">Impact Detail</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-attio-border-light dark:divide-attio-border-dark bg-white dark:bg-neutral-900/40">
                            <tr>
                              <td className="p-3.5 sm:p-4 font-semibold text-neutral-900 dark:text-white">Operational Efficiency</td>
                              <td className="p-3.5 sm:p-4 text-neutral-500 dark:text-neutral-400">Manual / Scattered</td>
                              <td className="p-3.5 sm:p-4 text-emerald-600 dark:text-emerald-400 font-medium">Centralized & Streamlined</td>
                              <td className="p-3.5 sm:p-4 text-neutral-700 dark:text-neutral-300">+40% efficiency. Menghemat puluhan jam kerja HR dan Leader setiap bulannya.</td>
                            </tr>
                            <tr>
                              <td className="p-3.5 sm:p-4 font-semibold text-neutral-900 dark:text-white">Payroll Discrepancies</td>
                              <td className="p-3.5 sm:p-4 text-neutral-500 dark:text-neutral-400">5-8% Error Margin</td>
                              <td className="p-3.5 sm:p-4 text-emerald-600 dark:text-emerald-400 font-medium">0% Error Margin</td>
                              <td className="p-3.5 sm:p-4 text-neutral-700 dark:text-neutral-300">Sinkronisasi data real-time memastikan nol margin kesalahan pada perhitungan lembur dan potongan.</td>
                            </tr>
                            <tr>
                              <td className="p-3.5 sm:p-4 font-semibold text-neutral-900 dark:text-white">Time Spent by Leaders</td>
                              <td className="p-3.5 sm:p-4 text-neutral-500 dark:text-neutral-400">10 Hours / week</td>
                              <td className="p-3.5 sm:p-4 text-emerald-600 dark:text-emerald-400 font-medium">6 Hours / week</td>
                              <td className="p-3.5 sm:p-4 text-neutral-700 dark:text-neutral-300">Waktu yang dihabiskan Leader untuk mengelola jadwal berkurang per divisi.</td>
                            </tr>
                            <tr>
                              <td className="p-3.5 sm:p-4 font-semibold text-neutral-900 dark:text-white">Employee Complaints</td>
                              <td className="p-3.5 sm:p-4 text-neutral-500 dark:text-neutral-400">8% of total inquiries</td>
                              <td className="p-3.5 sm:p-4 text-emerald-600 dark:text-emerald-400 font-medium">0%</td>
                              <td className="p-3.5 sm:p-4 text-neutral-700 dark:text-neutral-300">Validasi melalui Post-Launch Ticketing Analytics menunjukkan tidak ada lagi keluhan terkait kesalahan penjadwalan pasca-implementasi.</td>
                            </tr>
                            <tr>
                              <td className="p-3.5 sm:p-4 font-semibold text-neutral-900 dark:text-white">Task Success Rate</td>
                              <td className="p-3.5 sm:p-4 text-neutral-500 dark:text-neutral-400">Unknown</td>
                              <td className="p-3.5 sm:p-4 text-emerald-600 dark:text-emerald-400 font-medium">99%</td>
                              <td className="p-3.5 sm:p-4 text-neutral-700 dark:text-neutral-300">Diukur selama UAT; 99 dari 100 modifikasi jadwal massal diselesaikan tanpa kesalahan pengguna.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <hr className="border-attio-border-light dark:border-attio-border-dark border-dashed" />

                    {/* Section 5: What I Learned */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                        What I Learned
                      </h2>
                      <p>
                        Merancang alat operasional enterprise (B2B) sangat berbeda dengan aplikasi konsumer. Proyek ini mengajarkan saya bahwa merancang untuk operasional berarti kita mengoptimalkan batasan, alur kerja, dan realitas fisik di lapangan, bukan sekadar interaksi yang cantik di atas kanvas Figma.
                      </p>
                      <p>
                        Dengan memprioritaskan fungsi, hierarki informasi yang ketat, serta mendengarkan langsung apa yang membebani kognitif pengguna di meja kerja mereka, kita tidak hanya memperbaiki antarmuka—kita menata ulang sistem operasi yang memengaruhi bagaimana puluhan orang melakukan pekerjaan mereka setiap hari.
                      </p>
                    </div>

                  </div>
                ) : (
                  /* Fallback layout for other work cards */
                  <div className="space-y-8 text-neutral-700 dark:text-neutral-300 leading-relaxed text-base pt-4">
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                        Overview & Objective
                      </h2>
                      <p>
                        Detailed documentation for this case study is currently being compiled. It explores enterprise user experience optimizations, story-data approaches, and system design token synchronization.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Right Side Strip with Diagonal Pattern & Dashed Line on LG */}
            <div className="hidden lg:block w-[120px] xl:w-[160px] flex-shrink-0 border-l border-attio-border-light dark:border-attio-border-dark relative overflow-hidden bg-neutral-50/40 dark:bg-neutral-900/20 select-none">
              <div className="absolute inset-0 opacity-70 dark:opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_7px,rgba(0,0,0,0.05)_7px,rgba(0,0,0,0.05)_8px)] dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_7px,rgba(255,255,255,0.05)_7px,rgba(255,255,255,0.05)_8px)]" />
              <div className="border-t border-dashed border-attio-border-light dark:border-attio-border-dark w-full h-12 relative z-10" />
            </div>

          </div>
        </div>
      </main>

      <FooterReveal />
    </div>
  );
}

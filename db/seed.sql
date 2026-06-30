-- Seeding Case Studies (Works)
INSERT INTO case_studies (slug, category, reading_time, title, desc, hero_image, logo, live_url, company, design_stack, industry, year, sections, content)
VALUES (
  'resolving-40-percent-efficiency-loss-in-hr-timeshift-management',
  'DOOR V3',
  '10 min read',
  'Resolving a 40% Efficiency Loss in HR Timeshift Management',
  'In 2025, PT Neuronworks Indonesia suffered from fragmented manual shift permit tracking that cost productive work hours every month. Here is how we transformed the operational workflow with a story-data approach.',
  '/images/work/thumbnail-door.webp',
  '/images/client_logo/clientlogo_door.svg',
  'https://www.neuronworks.co.id/en/solusi-digital/door-hrmis/',
  'PT Neuronworks Indonesia',
  '[{"name":"Figma","icon":"devicon:figma"},{"name":"Lottiefiles","icon":"simple-icons:lottiefiles","color":"#00DDB3"},{"name":"Maze","icon":"gg:maze","color":"#FC0A70"},{"name":"Notion","icon":"devicon:notion"}]',
  '["HRMIS"]',
  '2025',
  '[{"id":"it-started-here","title":"It Started Here..."},{"id":"core-friction","title":"Understanding the Core Friction"},{"id":"the-change","title":"The Change and How I Did It"},{"id":"business-impact","title":"Business Impact"},{"id":"what-i-learned","title":"What I Learned"}]',
  '<h2 id="it-started-here">It Started Here...</h2>
<p>DOOR adalah platform HRMIS yang berfungsi sebagai ekosistem terpusat untuk seluruh operasional karyawan di perusahaan. Namun, di balik layar, tim operasional menghadapi masalah skalabilitas yang serius.</p>
<p>Sistem manajemen shift manual yang terfragmentasi menghabiskan 40-50 jam kerja produktif perusahaan setiap bulannya. Jadwal yang tidak sinkron ini memicu margin kesalahan sebesar 5-8% dalam rekapitulasi kehadiran, yang berisiko menyebabkan kerugian finansial yang signifikan akibat kelebihan pembayaran payroll yang tidak valid.</p>
<div class="p-5 rounded-xl border-l-2 border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 text-neutral-800 dark:text-neutral-200 text-sm font-medium">Sederhananya: Tidak ada Single Source of Truth. Komunikasi manual menyebabkan jadwal yang terlewat dan persetujuan yang tidak tercatat.</div>

<h2 id="core-friction">Understanding the Core Friction</h2>
<p>Untuk memahami di mana letak kerusakannya, saya memetakan gesekan alur kerja di tiga level pengguna:</p>
<div class="space-y-3 my-4">
  <div class="p-4 rounded-xl border border-attio-border-light dark:border-attio-border-dark bg-neutral-50/50 dark:bg-neutral-900/30"><span class="font-bold text-[#111827] dark:text-white">1. Employee:</span> Membutuhkan transparansi dan persetujuan perubahan shift yang cepat tanpa birokrasi yang berlapis.</div>
  <div class="p-4 rounded-xl border border-attio-border-light dark:border-attio-border-dark bg-neutral-50/50 dark:bg-neutral-900/30"><span class="font-bold text-[#111827] dark:text-white">2. Team Leader:</span> Mengalami kelebihan beban kognitif (cognitive overload) karena harus melacak permintaan manual yang tersebar melalui chat.</div>
  <div class="p-4 rounded-xl border border-attio-border-light dark:border-attio-border-dark bg-neutral-50/50 dark:bg-neutral-900/30"><span class="font-bold text-[#111827] dark:text-white">3. Human Resource:</span> Menghadapi risiko tinggi dari kesalahan human error akibat data entry manual untuk payroll bulanan.</div>
</div>
<h3>The Pivot:</h3>
<p>Awalnya, asumsi solusi yang muncul adalah membangun fitur self-request yang kompleks untuk karyawan. Namun, saya memutuskan untuk memutar arah solusi. Alih-alih membebani sistem dengan request berlapis, saya mendigitalkan kontrol langsung ke tangan Team Leader dan HR. Birokrasi dipangkas tanpa mengorbankan akurasi; karyawan bisa berkoordinasi secara verbal, sementara eksekusi dan pelacakan dilakukan 100% digital, instan, dan terpusat di DOOR.</p>

<h2 id="the-change">The Change and How I Did It</h2>
<div class="rounded-xl overflow-hidden border border-attio-border-light dark:border-attio-border-dark bg-neutral-100 dark:bg-neutral-900 mb-6">
  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" alt="Bulk Shift Interface Design" class="w-full h-[320px] object-cover" />
</div>
<h3>1. Bulk Week Edit untuk Team Leader</h3>
<blockquote class="border-l-2 border-neutral-300 dark:border-neutral-700 pl-5 my-6 text-neutral-600 dark:text-neutral-400 italic">
  <p class="mb-1">"Saya butuh cara cepat untuk mengubah jadwal harian setiap orang selama satu minggu penuh."</p>
  <cite class="not-italic text-xs text-neutral-400 dark:text-neutral-500">— Team Leader Feedback</cite>
</blockquote>
<p>Mengubah shift satu per satu per hari sangat tidak efisien dan rentan terjadi kesalahan input. Saya merancang interaksi Bulk Change Shift (1W):</p>
<ul class="list-disc list-inside space-y-2 pl-2">
  <li><strong>Visual Feedback:</strong> Pengguna kini bisa langsung melihat chips hari mana saja yang sedang aktif dan memperkirakan hari mana yang akan diubah jadwalnya.</li>
  <li><strong>Simplicity in Input:</strong> Hanya ada dua input utama di dalam modal: shift baru yang akan menimpa data sebelumnya, dan satu checkbox krusial untuk mengecualikan hari libur reguler (Exclude Weekend).</li>
  <li><strong>Constraint:</strong> Kini, Team Leader dapat mengubah shift anggota tim mereka setiap minggu, tetapi sistem mengunci kemampuan mereka untuk mengubah jadwal hari ini atau tanggal yang sudah lewat (backdate) demi menjaga integritas data.</li>
</ul>

<div class="rounded-xl overflow-hidden border border-attio-border-light dark:border-attio-border-dark bg-neutral-100 dark:bg-neutral-900 my-6">
  <img src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80" alt="Batch Upload HR Interface" class="w-full h-[320px] object-cover" />
</div>
<h3>2. Division-Wide Batch Upload untuk HR</h3>
<blockquote class="border-l-2 border-neutral-300 dark:border-neutral-700 pl-5 my-6 text-neutral-600 dark:text-neutral-400 italic">
  <p class="mb-1">"Bagaimana cara mengubah jadwal shift untuk seluruh karyawan atau beberapa orang di divisi yang berbeda secara bersamaan?"</p>
  <cite class="not-italic text-xs text-neutral-400 dark:text-neutral-500">— HR Operations Manager</cite>
</blockquote>
<p>Membangun alur Upload Shift Batch yang berpusat pada mental model HR yang terbiasa dengan pengolahan data tabular. HR dapat mengunduh template custom, mengeditnya secara eksternal (di Excel/Spreadsheet), lalu mengunggahnya kembali.</p>
<ul class="list-disc list-inside space-y-2 pl-2">
  <li><strong>Workflow Alignment:</strong> Saya memisahkan tab modal menjadi dua bagian agar sesuai dengan alur kerja natural HR: mengunduh template custom, mengeditnya, lalu mengunggahnya kembali.</li>
  <li><strong>Scalability:</strong> Sekarang HR dapat mengubah jadwal massal secara langsung—baik untuk seluruh karyawan, divisi tertentu, atau bahkan karyawan spesifik di divisi yang berbeda—hanya melalui import file .csv.</li>
</ul>

<div class="rounded-xl overflow-hidden border border-attio-border-light dark:border-attio-border-dark bg-neutral-100 dark:bg-neutral-900 my-6">
  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" alt="Analytics Dashboard Summary" class="w-full h-[320px] object-cover" />
</div>

<h2 id="business-impact">Business Impact</h2>
<p>Memberikan nilai bisnis yang terukur dan efisiensi operasional bukan sekadar pelengkap, melainkan tujuan utama dari perancangan ulang sistem B2B ini.</p>
<div class="overflow-x-auto rounded-xl border border-attio-border-light dark:border-attio-border-dark my-4">
  <table class="w-full text-left text-xs sm:text-sm border-collapse">
    <thead>
      <tr class="bg-neutral-100 dark:bg-neutral-800/80 border-b border-attio-border-light dark:border-attio-border-dark text-neutral-900 dark:text-white font-semibold">
        <th class="p-3.5 sm:p-4">Metric</th>
        <th class="p-3.5 sm:p-4">Before</th>
        <th class="p-3.5 sm:p-4">After</th>
        <th class="p-3.5 sm:p-4">Impact Detail</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-attio-border-light dark:divide-attio-border-dark bg-white dark:bg-neutral-900/40">
      <tr>
        <td class="p-3.5 sm:p-4 font-semibold text-neutral-900 dark:text-white">Operational Efficiency</td>
        <td class="p-3.5 sm:p-4 text-neutral-500 dark:text-neutral-400">Manual / Scattered</td>
        <td class="p-3.5 sm:p-4 text-emerald-600 dark:text-emerald-400 font-medium">Centralized & Streamlined</td>
        <td class="p-3.5 sm:p-4 text-neutral-700 dark:text-neutral-300">+40% efficiency. Menghemat puluhan jam kerja HR dan Leader setiap bulannya.</td>
      </tr>
      <tr>
        <td class="p-3.5 sm:p-4 font-semibold text-neutral-900 dark:text-white">Payroll Discrepancies</td>
        <td class="p-3.5 sm:p-4 text-neutral-500 dark:text-neutral-400">5-8% Error Margin</td>
        <td class="p-3.5 sm:p-4 text-emerald-600 dark:text-emerald-400 font-medium">0% Error Margin</td>
        <td class="p-3.5 sm:p-4 text-neutral-700 dark:text-neutral-300">Sinkronisasi data real-time memastikan nol margin kesalahan pada perhitungan lembur dan potongan.</td>
      </tr>
      <tr>
        <td class="p-3.5 sm:p-4 font-semibold text-neutral-900 dark:text-white">Time Spent by Leaders</td>
        <td class="p-3.5 sm:p-4 text-neutral-500 dark:text-neutral-400">10 Hours / week</td>
        <td class="p-3.5 sm:p-4 text-emerald-600 dark:text-emerald-400 font-medium">6 Hours / week</td>
        <td class="p-3.5 sm:p-4 text-neutral-700 dark:text-neutral-300">Waktu yang dihabiskan Leader untuk mengelola jadwal berkurang per divisi.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="what-i-learned">What I Learned</h2>
<p>Merancang alat operasional enterprise (B2B) sangat berbeda dengan aplikasi konsumer. Proyek ini mengajarkan saya bahwa merancang untuk operasional berarti kita mengoptimalkan batasan, alur kerja, dan realitas fisik di lapangan, bukan sekadar interaksi yang cantik di atas kanvas Figma.</p>
<p>Dengan memprioritaskan fungsi, hierarki informasi yang ketat, serta mendengarkan langsung apa yang membebani kognitif pengguna di meja kerja mereka, kita tidak hanya memperbaiki antarmuka—kita menata ulang sistem operasi yang memengaruhi bagaimana puluhan orang melakukan pekerjaan mereka setiap hari.</p>'
);

INSERT INTO case_studies (slug, category, reading_time, title, desc, hero_image, logo, live_url, company, design_stack, industry, year, sections, content)
VALUES (
  'work-2',
  'Enterprise Dashboard',
  '8 min read',
  'Story-Data Enterprise Dashboard Transformation',
  'Streamlining real-time data visual hierarchy for multi-tier management reporting, reducing decision latency by 35%.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
  '/images/testimoni_logo/logo-neuron.webp',
  'https://dashboard.neuronworks.co.id',
  'Neuron Tech',
  '[{"name":"Figma","icon":"devicon:figma"},{"name":"React","icon":"simple-icons:react","color":"#61DAFB"},{"name":"TailwindCSS","icon":"simple-icons:tailwindcss","color":"#06B6D4"}]',
  '["Enterprise","Analytics","Fintech"]',
  '2025',
  '[{"id":"overview","title":"Overview & Objective"}]',
  '<h2 id="overview">Overview & Objective</h2><p>Detailed documentation for this case study is currently being compiled. It explores enterprise user experience optimizations, story-data approaches, and system design token synchronization.</p>'
);

INSERT INTO case_studies (slug, category, reading_time, title, desc, hero_image, logo, live_url, company, design_stack, industry, year, sections, content)
VALUES (
  'work-3',
  'Design Systems',
  '12 min read',
  'Scalable Design System & Component Infrastructure',
  'Unifying design language across 12+ enterprise platforms with high-density component libraries and automated token sync.',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1400&q=80',
  '/images/client_logo/clientlogo_telkomindonesia.webp',
  'https://design.telkom.co.id',
  'Telkom Indonesia',
  '[{"name":"Figma","icon":"devicon:figma"},{"name":"React","icon":"simple-icons:react","color":"#61DAFB"},{"name":"Storybook","icon":"simple-icons:storybook","color":"#FF4785"},{"name":"TailwindCSS","icon":"simple-icons:tailwindcss","color":"#06B6D4"}]',
  '["Design Tools","Enterprise","Infrastructure"]',
  '2024',
  '[{"id":"overview","title":"Overview & Objective"}]',
  '<h2 id="overview">Overview & Objective</h2><p>Detailed component documentation and scalable design system workflows. It explores unifying design languages across multiple sub-brands and platforms.</p>'
);

-- Seeding Explorations
INSERT INTO explorations (title, category, description, image)
VALUES (
  'AI Prompt Flow Canvas',
  'Generative UI & Graph Nodes',
  'An experimental canvas interface designed for configuring complex multi-agent LLM chains visually with real-time token telemetry.',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
);

INSERT INTO explorations (title, category, description, image)
VALUES (
  'Dark Mode Data Widget Studio',
  'Design System & Components',
  'A high-density widget ecosystem tailored for enterprise financial risk monitors, featuring custom HSL monochromatic themes.',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
);

INSERT INTO explorations (title, category, description, image)
VALUES (
  'Spatial Analytics Control Room',
  '3D Visualizations & GIS',
  'Real-time spatial data rendering engine built for logistics dispatchers to monitor fleet telematics across global hubs.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'
);

INSERT INTO explorations (title, category, description, image)
VALUES (
  'Micro-Interaction Prototyping',
  'Motion & UI Engineering',
  'Exploration of spring physics-based gestures and tactile feedback components for high-frequency trading web terminals.',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
);

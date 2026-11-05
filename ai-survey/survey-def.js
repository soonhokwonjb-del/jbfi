/* JB Finance Indonesia — Survei Lingkungan Kerja & Penggunaan AI
 * 문항 정의 파일 (한국어 검토용 ko / 실제 설문 id / 영문 en)
 * 코드값(G1, RT01, R05 …)은 응답 시트·분석 코드표와 동일하게 유지함. 코드 변경 시 분석표도 함께 바꿀 것.
 */
(function (root) {
  "use strict";

  // 코어시스템 호칭 [확인 필요: 직원 호칭이 Buffin인지 MBS인지 확인 후 수정]
  var CORE = { ko: "코어시스템", id: "core system", en: "core system" };
  function c(s, l) { return s.replace(/\{CORE\}/g, CORE[l]); }
  function T(ko, id, en) { return { ko: c(ko, "ko"), id: c(id, "id"), en: c(en, "en") }; }
  function O(code, ko, id, en, extra) {
    var o = { code: code, t: T(ko, id, en) };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  // 부서별 반복 업무(Q6)용 기타: 최대 2개까지 직접 입력 (XX99 = 기타 업무 1, XX98 = 기타 업무 2)
  var OTHER_TASKS = function (pre) {
    return [O(pre + "99", "기타 업무 1(직접 입력)", "Pekerjaan lainnya 1 (tuliskan)", "Other task 1 (please specify)", { other: true }),
            O(pre + "98", "기타 업무 2(직접 입력)", "Pekerjaan lainnya 2 (tuliskan)", "Other task 2 (please specify)", { other: true })];
  };
  var OTHER = function (code) { return O(code || "OTH", "기타(직접 입력)", "Lainnya (tuliskan)", "Other (please specify)", { other: true }); };

  /* ── 안내 ───────────────────────────────────────── */
  var TEXT = {
    eyebrow: T("JB Finance Indonesia", "JB Finance Indonesia", "JB Finance Indonesia"),
    title: T("임직원 업무환경·AI 활용 실태 설문", "Survei Lingkungan Kerja dan Penggunaan AI", "Work Environment and AI Use Survey"),
    lead: T(
      "이 설문은 임직원의 일상 업무 부담과 업무 중 AI 도구 사용 현황을 파악해 회사의 업무 환경 개선 계획에 반영하기 위한 것입니다.",
      "Survei ini bertujuan memahami beban kerja harian karyawan dan penggunaan alat AI dalam pekerjaan. Hasilnya akan menjadi masukan bagi perusahaan dalam merencanakan perbaikan lingkungan kerja.",
      "This survey aims to understand daily workload and the use of AI tools at work, to help the company plan improvements to the work environment."),
    anon: T(
      "익명으로 진행되며 이름, 사번, 이메일은 수집하지 않고 결과는 전체 합산 형태로만 보고됩니다. 정답이나 오답은 없으며 응답 내용은 인사평가에 영향을 주지 않습니다.",
      "Survei ini bersifat anonim: nama, nomor induk karyawan, dan email tidak diisi, dan hasilnya hanya dilaporkan dalam bentuk gabungan. Tidak ada jawaban benar atau salah, dan jawaban Anda tidak memengaruhi penilaian kinerja.",
      "The survey is anonymous: no name, employee ID or email is collected, and results are reported only in aggregate. There are no right or wrong answers, and your answers will not affect performance evaluation."),
    // 경영진 결정 후 사용 여부 결정 (index.html 의 SHOW_JOB_NOTE)
    jobNote: T(
      "이번 조사는 업무 부담을 줄이기 위한 지원 방안을 찾기 위한 것이며 인력 조정과는 관련이 없습니다.",
      "Survei ini dilakukan untuk mencari bentuk dukungan yang dapat mengurangi beban kerja karyawan dan tidak berkaitan dengan penyesuaian atau pengurangan jumlah karyawan.",
      "This survey is intended to find support measures that reduce employee workload and is not related to any staffing adjustment or reduction."),
    f1: T("약 10분", "Sekitar 10 menit", "About 10 minutes"),
    f2: T("익명", "Anonim", "Anonymous"),
    f3: T("휴대폰 응답 가능", "Bisa diisi lewat ponsel", "Works on mobile"),
    codeLabel: T("설문 접속 코드", "Kode akses survei", "Survey access code"),
    codeHelp: T("부서장에게 안내받은 접속 코드를 입력해 주십시오.", "Masukkan kode akses yang disampaikan oleh atasan Anda.", "Enter the access code given by your manager."),
    codeErr: T("접속 코드가 맞지 않습니다.", "Kode akses tidak sesuai.", "The access code is not correct."),
    start: T("시작하기", "Mulai", "Start"),
    resume: T("이어서 응답하기", "Lanjutkan pengisian", "Continue"),
    restart: T("처음부터 다시 하기", "Mulai dari awal", "Start over"),
    resumeNote: T("작성 중인 응답이 있습니다.", "Ada jawaban yang belum selesai.", "You have an unfinished response."),
    next: T("다음", "Berikutnya", "Next"),
    back: T("이전", "Kembali", "Back"),
    submit: T("제출하기", "Kirim jawaban", "Submit"),
    optional: T("선택 문항", "Opsional", "Optional"),
    pickOne: T("하나를 골라 주십시오.", "Pilih satu jawaban.", "Please choose one."),
    pickSome: T("하나 이상 골라 주십시오.", "Pilih minimal satu jawaban.", "Please choose at least one."),
    maxN: T("최대 {n}개까지 고를 수 있습니다.", "Anda dapat memilih paling banyak {n}.", "You can choose up to {n}."),
    upToN: T("최대 {n}개 선택", "Pilih maksimal {n}", "Choose up to {n}"),
    multiAll: T("해당하는 것을 모두 선택", "Pilih semua yang sesuai", "Select all that apply"),
    rankHelp: T("원하는 순서대로 3개까지 눌러 주십시오. 다시 누르면 취소됩니다.", "Pilih dengan klik paling banyak 3 pilihan sesuai urutan yang Anda inginkan. Klik lagi untuk membatalkan.", "Tap up to 3 options in order. Tap again to cancel."),
    rankErr: T("하나 이상 골라 주십시오.", "Pilih minimal satu jawaban.", "Please choose at least one."),
    gridErr: T("모든 항목에 답해 주십시오.", "Mohon jawab semua pertanyaan.", "Please answer every row."),
    otherErr: T("기타 내용을 적어 주십시오.", "Tuliskan isi jawaban \"Lainnya\".", "Please specify \"Other\"."),
    otherPh: T("직접 입력", "Tuliskan di sini", "Type here"),
    taskOf: T("업무 {i} / {n}", "Pekerjaan {i} dari {n}", "Task {i} of {n}"),
    timeQ: T("이 업무에 일주일에 드는 시간", "Waktu per minggu untuk pekerjaan ini", "Time per week for this task"),
    reasonQ: T("시간이 오래 걸리는 가장 큰 이유", "Penyebab utama pekerjaan ini memakan waktu", "Main reason this task takes time"),
    saving: T("응답을 저장하고 있습니다…", "Menyimpan jawaban…", "Saving your answers…"),
    doneTitle: T("응답해 주셔서 감사합니다", "Terima kasih atas partisipasi Anda", "Thank you for your response"),
    saved: T("응답이 저장되었습니다.", "Jawaban Anda sudah tersimpan.", "Your answers have been saved."),
    saveFail: T("응답을 저장하지 못했습니다. 인터넷 연결을 확인한 뒤 다시 시도해 주십시오.", "Jawaban gagal disimpan. Periksa koneksi internet, lalu coba lagi.", "Your answers could not be saved. Please check your connection and try again."),
    retry: T("다시 시도", "Coba lagi", "Try again"),
    already: T("이 기기에서 이미 설문에 응답하셨습니다. 감사합니다.", "Anda sudah mengisi survei ini dari perangkat ini. Terima kasih.", "You have already completed this survey on this device. Thank you."),
    pilotTitle: T("AI 도구 시범 참여 신청 (선택)", "Pendaftaran uji coba alat AI (opsional)", "AI tool pilot sign-up (optional)"),
    pilotLead: T(
      "회사가 AI 도구를 시범 도입할 때 참여를 원하시면 이름과 부서를 적어 주십시오. 이 정보는 설문 응답과 분리해 따로 저장되며 응답 내용과 연결되지 않습니다.",
      "Jika Anda ingin ikut serta saat perusahaan melakukan uji coba alat AI, tuliskan nama dan divisi Anda. Data ini disimpan terpisah dari jawaban survei dan tidak dihubungkan dengan jawaban Anda.",
      "If you would like to join when the company pilots an AI tool, enter your name and department. This information is stored separately from your survey answers and is not linked to them."),
    pilotName: T("이름", "Nama", "Name"),
    pilotDept: T("부서·지점", "Divisi / Cabang", "Department / branch"),
    pilotSend: T("신청하기", "Daftar", "Sign up"),
    pilotSkip: T("신청하지 않음", "Tidak, terima kasih", "No, thanks"),
    pilotDone: T("신청이 접수되었습니다. 창을 닫으셔도 됩니다.", "Pendaftaran diterima. Anda boleh menutup halaman ini.", "Sign-up received. You may close this page."),
    closeOk: T("창을 닫으셔도 됩니다.", "Anda boleh menutup halaman ini.", "You may close this page."),
    pilotErr: T("이름과 부서를 적어 주십시오.", "Isi nama dan divisi.", "Please enter your name and department."),
    testBadge: T("점검 모드 — 시트에 저장하지 않음", "MODE UJI — tidak disimpan", "TEST MODE — not saved"),
    testSave: T("점검 모드 — 점검응답 시트에 저장", "MODE UJI — disimpan ke lembar uji", "TEST MODE — saved to test sheet")
  };

  /* ── 공통 척도 ─────────────────────────────────── */
  var DAY_TIME = [
    O("D0", "없음", "Tidak ada", "None"),
    O("D1", "1시간 미만", "Kurang dari 1 jam", "Less than 1 hr"),
    O("D2", "1시간 이상~2시간 미만", "1 jam – kurang dari 2 jam", "1 – under 2 hrs"),
    O("D3", "2시간 이상~4시간 미만", "2 jam – kurang dari 4 jam", "2 – under 4 hrs"),
    O("D4", "4시간 이상", "4 jam atau lebih", "4 hrs or more")
  ];
  var WEEK_TIME = [
    O("W1", "1시간 미만", "Kurang dari 1 jam", "Less than 1 hr"),
    O("W2", "1시간 이상~3시간 미만", "1 jam – kurang dari 3 jam", "1 – under 3 hrs"),
    O("W3", "3시간 이상~5시간 미만", "3 jam – kurang dari 5 jam", "3 – under 5 hrs"),
    O("W4", "5시간 이상~10시간 미만", "5 jam – kurang dari 10 jam", "5 – under 10 hrs"),
    O("W5", "10시간 이상", "10 jam atau lebih", "10 hrs or more")
  ];

  /* ── 공통 AI 활용 업무 목록 (Q13, Q16) ─────────── */
  var AI_TASKS = [
    O("A01", "이메일·공문·메모·회의록·SOP 작성", "Menulis email, surat, memo, notulen rapat, atau SOP", "Writing emails, letters, memos, meeting minutes or SOPs"),
    O("A02", "인니어 ↔ 영어 번역", "Menerjemahkan bahasa Indonesia ↔ bahasa Inggris", "Translating Indonesian ↔ English"),
    O("A03", "인니어 내용을 영어 보고서·이메일로 작성", "Menulis laporan atau email berbahasa Inggris berdasarkan bahan berbahasa Indonesia", "Writing English reports or emails from Indonesian content"),
    O("A04", "정기 보고서·회의자료·발표자료 작성", "Menyusun laporan rutin, bahan rapat, atau bahan presentasi", "Preparing routine reports, meeting materials or presentations"),
    O("A06", "엑셀 수식·집계표 작성, 데이터 정리", "Membuat rumus Excel, tabel rekap, atau merapikan data", "Excel formulas, summary tables, cleaning data"),
    O("A07", "문서·규정·계약서 요약과 검토, SOP·OJK 규정에서 필요한 내용 찾기", "Meringkas dan mengkaji dokumen, peraturan, atau perjanjian, serta mencari isi yang dibutuhkan dari SOP atau peraturan OJK", "Summarising and reviewing documents, regulations or contracts, and finding answers in SOPs or OJK rules"),
    O("A09", "재무제표·은행 거래내역 분석 보조", "Membantu menganalisis laporan keuangan atau mutasi rekening bank", "Helping analyse financial statements or bank statements"),
    O("A10", "여신 심사 메모·현장조사 보고서 초안 작성", "Menyusun draf credit memo atau laporan survei lapangan", "Drafting credit memos or field survey reports"),
    O("A11", "고객 문의·민원·연체 안내 문구 작성", "Menyusun teks balasan untuk pertanyaan atau pengaduan konsumen, serta pemberitahuan tunggakan", "Drafting replies to customer inquiries, complaints or overdue notices"),
    O("A13", "시장·경쟁사 자료 조사", "Mencari informasi pasar dan pesaing", "Researching market and competitor information"),
    OTHER("A99")
  ];

  /* ── 소속 그룹 (Q2) ───────────────────────────── */
  var GROUPS = [
    O("G1", "리테일 영업 (CMO, Marketing Head, Area Manager, Retail·딜러금융, 샤리아 사업부)",
      "Bisnis Ritel (CMO, Marketing Head, Area Manager, Retail & Dealer Financing, UUS Syariah)",
      "Retail Business (CMO, Marketing Head, Area Manager, retail & dealer financing, Sharia unit)"),
    O("G2", "Corporate·Fleet 영업과 사업개발 (Account Manager, 상용차·중장비, AIZEN B2B, Business Development)",
      "Corporate/Fleet & Business Development (Account Manager, kendaraan komersial, alat berat, AIZEN B2B, BD)",
      "Corporate/Fleet & Business Development (Account Manager, commercial vehicles, heavy equipment, AIZEN B2B, BD)"),
    O("G3", "심사 (Credit Management)", "Kredit (Credit Management)", "Credit (Credit Management)"),
    O("G4", "리스크·컴플라이언스·법무·내부감사", "Risiko, Kepatuhan, Legal, dan Audit Internal", "Risk, Compliance, Legal and Internal Audit"),
    O("G5", "채권관리 (Collection & Remedial)", "Penagihan & Remedial (Collection)", "Collection & Remedial"),
    O("G6", "오퍼레이션 (Admin Pembiayaan, Admin Grha, Loan Document·Custody, 수납·고객지원, 보험, AMU, 시스템·절차)",
      "Operasional (Admin Pembiayaan, Admin Grha, Loan Document & Custody, Payment Control & Customer Care, Asuransi, AMU, Sisdur)",
      "Operations (financing admin, Grha admin, loan documents & custody, payment control & customer care, insurance, AMU, Systems & Procedures)"),
    O("G7", "회계·재무·자금", "Akuntansi, Keuangan & Treasury", "Accounting, Finance & Treasury"),
    O("G8", "인사·Corsec·IT·총무 (OB·Messenger·Driver 제외)", "HR, Corporate Secretary, IT & GA (selain OB, Messenger, Driver)", "HR, Corporate Secretary, IT & GA (excluding OB, messenger, driver)"),
    O("G9", "OB·Messenger·Driver", "OB, Messenger, dan Driver", "OB, messenger and driver"),
    OTHER("G99")
  ];

  /* ── 부서별 반복 업무 (Q6) — ai: 연결 AI 업무 코드 ── */
  function TK(code, ai, ko, id, en) { return O(code, ko, id, en, { ai: ai }); }
  var DEPT_TASKS = {
    G1: [
      TK("RT01", "A06,A13", "차량 시세(MRP) 조사와 월 납입액 계산", "Mencari harga pasar kendaraan (MRP) dan menghitung angsuran bulanan", "Checking vehicle market price (MRP) and calculating monthly instalments"),
      TK("RT02", "", "Mobile CMO 앱으로 신청 입력, 사무실에 돌아와 자료 보완 입력", "Menginput pengajuan di aplikasi Mobile CMO, lalu kembali ke kantor untuk melengkapi data", "Entering applications in the Mobile CMO app, then returning to the office to complete the data"),
      TK("RT03", "", "고객 서류(KTP, KK, 급여명세서, BPKB, STNK, 차량 사진) 수집과 확인", "Mengumpulkan dan memeriksa dokumen konsumen (KTP, KK, slip gaji, BPKB, STNK, foto kendaraan)", "Collecting and checking customer documents (KTP, KK, payslip, BPKB, STNK, vehicle photos)"),
      TK("RT04", "", "고객 정보 중복과 타사 거래 여부 확인", "Memeriksa duplikasi data konsumen dan riwayat pembiayaan di perusahaan lain", "Checking duplicate customer data and financing history at other companies"),
      TK("RT05", "", "심사 진행상황 확인과 보완 자료 제출", "Memantau status analisa kredit dan mengirim kekurangan dokumen", "Following up credit review status and sending missing documents"),
      TK("RT06", "", "딜러 방문과 딜러 관계 관리", "Mengunjungi dealer dan membina hubungan dengan dealer", "Visiting dealers and managing dealer relationships"),
      TK("RT07", "A04", "딜러금융 재고실사 보고서(차량 사진, 미보유 사유) 작성", "Menyusun laporan stock opname pembiayaan dealer (foto kendaraan, alasan unit tidak ada)", "Preparing dealer financing stock check reports (vehicle photos, reasons for missing units)"),
      TK("RT08", "A04,A06", "일일 영업 실적 보고(상품·CMO·지점·딜러별)", "Laporan harian hasil penjualan (per produk, CMO, cabang, dealer)", "Daily sales reports (by product, CMO, branch, dealer)"),
      TK("RT09", "A04", "주간·월간 영업 회의자료 작성", "Menyusun bahan rapat penjualan mingguan dan bulanan", "Preparing weekly and monthly sales meeting materials"),
      TK("RT10", "A13", "경쟁사(Adira, BCAF, BFI 등) 금리·LTV·정책 조사", "Mencari informasi suku bunga, LTV, dan kebijakan pesaing (Adira, BCAF, BFI, dll.)", "Researching competitor rates, LTV and policies (Adira, BCAF, BFI, etc.)"),
      TK("RT11", "A01", "샤리아 계약(Akad) 서류 작성", "Menyiapkan dokumen akad syariah", "Preparing sharia contract (akad) documents"),
      OTHER_TASKS("RT")[0], OTHER_TASKS("RT")[1]
    ],
    G2: [
      TK("FB01", "A01", "법인 고객 자료 수집과 신청 자료(정해진 양식) 작성·송부", "Mengumpulkan data customer korporat, menyusun berkas pengajuan sesuai format, lalu mengirimkannya", "Collecting corporate customer data, preparing the application file in the set format and sending it"),
      TK("FB02", "A06", "금융구조·상환 스케줄(체증·체감·거치) 엑셀 계산", "Menghitung struktur pembiayaan dan jadwal angsuran (step-up, step-down, grace period) di Excel", "Calculating financing structures and repayment schedules (step-up, step-down, grace period) in Excel"),
      TK("FB03", "A06", "한도·수수료 엑셀 관리", "Mengelola limit dan fee di Excel", "Managing limits and fees in Excel"),
      TK("FB04", "", "심사 진행 확인과 추가 자료 대응", "Memantau proses analisa kredit dan menanggapi permintaan data tambahan", "Following up credit review and responding to requests for more data"),
      TK("FB05", "A04", "주간 파이프라인 보고서 작성", "Menyusun laporan pipeline mingguan", "Preparing the weekly pipeline report"),
      TK("FB06", "A13", "업종·시장 조사(중장비, SME 등)", "Riset industri dan pasar (alat berat, UMKM, dll.)", "Industry and market research (heavy equipment, SME, etc.)"),
      TK("FB07", "A06", "{CORE} 실적을 내려받아 일일 실적 공유", "Mengunduh data realisasi dari {CORE} dan membagikan laporan harian", "Downloading results from the {CORE} and sharing daily reports"),
      TK("FB08", "A01", "가격 가이드라인과 내부 메모 작성", "Menyusun pricing guideline dan memo internal", "Writing pricing guidelines and internal memos"),
      TK("FB09", "A06", "영업 인센티브 산정", "Menghitung insentif penjualan", "Calculating sales incentives"),
      TK("FB10", "A04", "월간 경영회의 자료, WALR·원금 상환 스케줄(Rundown)·취급계획 보고서 작성", "Menyusun bahan rapat manajemen bulanan, laporan WALR, rundown pokok, dan rencana pembiayaan baru", "Preparing monthly management meeting materials, WALR, principal rundown and new financing plan reports"),
      TK("FB11", "A13", "동종사 실적·금리 비교", "Membandingkan kinerja dan suku bunga perusahaan sejenis", "Comparing peer companies’ performance and rates"),
      OTHER_TASKS("FB")[0], OTHER_TASKS("FB")[1]
    ],
    G3: [
      TK("CR01", "A09", "재무제표·은행 거래내역·현금흐름 분석(AIFORESEE 결과 포함)", "Menganalisis laporan keuangan, mutasi rekening bank, dan arus kas (termasuk hasil AIFORESEE)", "Analysing financial statements, bank statements and cash flow (including AIFORESEE results)"),
      TK("CR02", "A10", "영업이 보낸 자료로 여신 신청서 작성(Fleet)", "Menyusun formulir pengajuan kredit dari data yang dikirim tim marketing (Fleet)", "Preparing credit application forms from data sent by the marketing team (Fleet)"),
      TK("CR03", "A10", "여신 심사 메모(Credit memo) 작성", "Menyusun credit memo", "Writing credit memos"),
      TK("CR04", "", "SLIK·PEFINDO 조회와 결과 정리", "Melakukan pengecekan SLIK dan PEFINDO serta merangkum hasilnya", "Checking SLIK and PEFINDO and summarising the results"),
      TK("CR05", "", "신청 서류 검증", "Memverifikasi dokumen pengajuan", "Verifying application documents"),
      TK("CR06", "A04", "여신위원회·월간 경영회의 자료 작성", "Menyusun bahan rapat Komite Kredit dan rapat manajemen bulanan", "Preparing Credit Committee and monthly management meeting materials"),
      TK("CR07", "A06", "한도 사용률 모니터링과 조기경보 보고", "Memantau tingkat pemakaian limit dan melaporkan early warning", "Monitoring limit usage and reporting early warnings"),
      TK("CR08", "A01", "여신 정책 메모·회람 작성과 영업점 전파", "Menyusun memo atau edaran kebijakan kredit dan menyosialisasikannya ke cabang", "Writing credit policy memos or circulars and sharing them with branches"),
      TK("CR09", "A07", "RASSA·Tiptronic·Fast Engine 사용자 문의 대응", "Menjawab pertanyaan pengguna RASSA, Tiptronic, dan Fast Engine", "Answering user questions on RASSA, Tiptronic and Fast Engine"),
      TK("CR10", "", "승인 후 조건 이행 확인", "Memeriksa pemenuhan syarat setelah persetujuan", "Checking fulfilment of conditions after approval"),
      OTHER_TASKS("CR")[0], OTHER_TASKS("CR")[1]
    ],
    G4: [
      TK("RL01", "A06", "OJK 등 규제 보고 제출기한 관리와 부서별 제출 독촉", "Memantau tenggat waktu laporan OJK dan regulator lain serta mengirimkan pengingat ke divisi terkait", "Tracking OJK and other regulatory report deadlines and reminding departments"),
      TK("RL02", "A04", "규제 보고서 작성·제출(APOLO, SLIK, goAML, SIPESAT)", "Menyusun dan mengirim laporan regulator (APOLO, SLIK, goAML, SIPESAT)", "Preparing and submitting regulatory reports (APOLO, SLIK, goAML, SIPESAT)"),
      TK("RL03", "", "SLIK 데이터 검증과 영업점 정정 협의", "Memvalidasi data SLIK dan berkoordinasi dengan cabang untuk koreksi", "Validating SLIK data and coordinating corrections with branches"),
      TK("RL04", "A04,A06", "RCSA·KRI·리스크 프로파일 자료 취합과 작성", "Mengumpulkan dan menyusun data RCSA, KRI, dan profil risiko", "Collecting and preparing RCSA, KRI and risk profile data"),
      TK("RL05", "A06", "업종·여신 한도 준수 점검 보고", "Memeriksa dan melaporkan kepatuhan atas batas sektor industri dan limit pembiayaan", "Checking and reporting compliance with industry and financing limits"),
      TK("RL06", "A07", "OJK 규정·내부 규정 검토와 해석", "Mengkaji dan menafsirkan peraturan OJK dan ketentuan internal", "Reviewing and interpreting OJK regulations and internal rules"),
      TK("RL07", "A07", "계약서(금융·제휴·NDA) 검토와 초안 작성", "Mengkaji dan menyusun draf perjanjian (pembiayaan, kerja sama, NDA)", "Reviewing and drafting agreements (financing, partnership, NDA)"),
      TK("RL08", "A06", "Fidusia 등록 확인과 공증인 제출용 차주 자료 정리", "Memeriksa pendaftaran fidusia dan menyiapkan data debitur untuk notaris", "Checking fiduciary (fidusia) registration and preparing debtor data for the notary"),
      TK("RL09", "A01,A07", "내용증명(Somasi)·소송 서류 작성과 소송 진행 보고", "Menyusun somasi dan dokumen perkara, serta melaporkan perkembangan perkara", "Drafting somasi and case documents, and reporting case progress"),
      TK("RL10", "A04", "감사 프로그램·감사조서·감사보고서 작성", "Menyusun program audit, kertas kerja audit, dan laporan audit", "Preparing audit programmes, working papers and audit reports"),
      TK("RL11", "", "감사 지적사항 이행 점검", "Memantau tindak lanjut temuan audit", "Monitoring follow-up of audit findings"),
      OTHER_TASKS("RL")[0], OTHER_TASKS("RL")[1]
    ],
    G5: [
      TK("CO01", "A06", "{CORE} 연체 자료를 내려받아 엑셀로 실적·순위·대시보드 작성", "Mengunduh data tunggakan dari {CORE} lalu membuat laporan kinerja, peringkat, dan dashboard di Excel", "Downloading overdue data from the {CORE} and building performance reports, rankings and dashboards in Excel"),
      TK("CO02", "A04,A06", "일일 연체구간별 현황과 회수 성과 보고(PIC·Grha·지역별)", "Laporan harian posisi tunggakan per bucket dan hasil penagihan (per PIC, Grha, wilayah)", "Daily reports on overdue buckets and collection results (by PIC, Grha, region)"),
      TK("CO03", "A06", "일일 방문추심명단(DKHC) 작성과 MCS 방문 결과 입력", "Menyusun daftar kunjungan harian (DKHC) dan menginput hasil kunjungan di MCS", "Preparing the daily visit list (DKHC) and entering visit results in MCS"),
      TK("CO04", "A11", "연체 고객 전화·메시지 연락", "Menghubungi konsumen yang menunggak melalui telepon atau pesan", "Contacting overdue customers by phone or message"),
      TK("CO05", "", "현장 방문과 차량 회수", "Kunjungan lapangan dan penarikan kendaraan", "Field visits and vehicle repossession"),
      TK("CO06", "A04", "주간·월간 회수 성과 보고와 회의자료 작성", "Menyusun laporan dan bahan rapat kinerja penagihan mingguan dan bulanan", "Preparing weekly and monthly collection performance reports and meeting materials"),
      TK("CO07", "A04", "외부 추심업체 관리와 평가 보고", "Mengelola vendor penagihan eksternal dan melaporkan hasil evaluasinya", "Managing external collection agencies and reporting their evaluation"),
      TK("CO08", "A01", "경고장·내용증명 발송 준비", "Menyiapkan pengiriman surat peringatan dan somasi", "Preparing warning letters and somasi"),
      TK("CO09", "A06", "공동금융(JF)·자체·Channeling 계좌 구분 작업", "Memisahkan rekening joint financing (JF), self-financing, dan channeling", "Separating joint financing (JF), self-financing and channeling accounts"),
      TK("CO10", "A04", "워치리스트·재조정 건 검토 자료 작성", "Menyusun bahan kajian untuk akun watchlist dan restrukturisasi", "Preparing review materials for watchlist and restructured accounts"),
      OTHER_TASKS("CO")[0], OTHER_TASKS("CO")[1]
    ],
    G6: [
      TK("OP01", "", "신청 서류 검증과 서류 완비 확인", "Memverifikasi dokumen pengajuan dan memeriksa kelengkapannya", "Verifying application documents and checking completeness"),
      TK("OP02", "", "Mobile CMO 앱·RASSA 등록 건을 {CORE}에 다시 입력하거나 보완 입력", "Menginput ulang atau melengkapi data pengajuan dari Mobile CMO/RASSA ke {CORE}", "Re-entering or completing Mobile CMO/RASSA applications in the {CORE}"),
      TK("OP03", "", "계약서 출력과 서명 준비", "Mencetak kontrak dan menyiapkan penandatanganan", "Printing contracts and preparing signing"),
      TK("OP04", "", "지로·송금 입금 확인과 재무팀 전달", "Memeriksa pembayaran giro dan transfer lalu meneruskannya ke tim keuangan", "Checking giro and transfer payments and passing them to Finance"),
      TK("OP05", "", "수납 누락 확인과 청구 관리", "Memeriksa pembayaran yang belum tercatat dan mengelola penagihan (billing)", "Checking unposted payments and managing billing"),
      TK("OP06", "", "BPKB·증서 입출고와 보관 관리(은행 보관분 포함)", "Mengelola keluar-masuk dan penyimpanan BPKB serta dokumen (termasuk yang disimpan di bank)", "Managing BPKB and document movement and storage (including those held at banks)"),
      TK("OP07", "", "경고장 출력과 발송", "Mencetak dan mengirim surat peringatan", "Printing and sending warning letters"),
      TK("OP08", "A04", "회수 차량 최저매각가 신청과 경매 자료 작성", "Menyusun pengajuan harga jual minimum dan dokumen lelang kendaraan hasil penarikan", "Preparing minimum sale price requests and auction documents for repossessed vehicles"),
      TK("OP09", "A06", "월말 데이터 엑셀 처리와 보고", "Mengolah data akhir bulan di Excel dan melaporkannya", "Processing month-end data in Excel and reporting it"),
      TK("OP10", "A11", "고객 민원 접수와 답변", "Menerima dan menjawab pengaduan konsumen", "Receiving and answering customer complaints"),
      TK("OP11", "A01", "SOP·업무 절차 문서 작성과 검토", "Menyusun dan mengkaji SOP serta dokumen prosedur kerja", "Writing and reviewing SOPs and procedure documents"),
      OTHER_TASKS("OP")[0], OTHER_TASKS("OP")[1]
    ],
    G7: [
      TK("FA01", "", "은행 거래내역(20개 이상 계좌)과 시스템 대사", "Rekonsiliasi mutasi rekening bank (lebih dari 20 rekening) dengan sistem", "Reconciling bank statements (more than 20 accounts) with the system"),
      TK("FA02", "", "고객 현금·이체 입금 내역 수기 입력", "Menginput manual pembayaran tunai dan transfer dari konsumen", "Manually entering customer cash and transfer payments"),
      TK("FA03", "A06", "공동금융(JF) 비중을 수작업으로 제외·배분", "Mengeluarkan dan mengalokasikan porsi joint financing (JF) secara manual", "Manually excluding and allocating the joint financing (JF) portion"),
      TK("FA04", "A06", "공동금융·Channeling 파트너별 정산", "Melakukan settlement dengan setiap mitra joint financing dan channeling", "Settlement per joint financing and channeling partner"),
      TK("FA05", "A06", "SILARAS 보고서(일반·샤리아) 엑셀 작성", "Menyusun laporan SILARAS (konvensional dan syariah) di Excel", "Preparing SILARAS reports (conventional and sharia) in Excel"),
      TK("FA06", "A06", "은행별 담보 채권 목록 작성과 교체", "Menyusun daftar piutang yang dijaminkan ke setiap bank dan melakukan penggantian piutang", "Preparing and replacing pledged receivables lists per bank"),
      TK("FA07", "A04,A06", "은행 제출 정기 자료(재무제표, Aging, NPF 등)를 은행 양식별로 가공", "Mengolah laporan berkala untuk bank (laporan keuangan, aging, NPF, dll.) sesuai format masing-masing bank", "Preparing periodic bank reports (financial statements, aging, NPF, etc.) in each bank’s format"),
      TK("FA08", "", "일일 유동성·자금수지 관리와 자금 이체", "Mengelola likuiditas harian dan arus kas serta melakukan transfer dana", "Managing daily liquidity and cash flow and making fund transfers"),
      TK("FA09", "", "월 결산과 재무제표 작성", "Tutup buku bulanan dan penyusunan laporan keuangan", "Monthly closing and preparing financial statements"),
      TK("FA10", "A07", "세무 신고(PPh, PPN, e-Faktur)와 세무조사 대응 자료 작성", "Pelaporan pajak (PPh, PPN, e-Faktur) dan penyiapan data pemeriksaan pajak", "Tax filing (PPh, VAT, e-Faktur) and preparing tax audit data"),
      TK("FA11", "A03,A04", "본사(그룹) 보고 자료 작성", "Menyusun laporan untuk perusahaan induk (grup)", "Preparing reports for the parent company (group)"),
      TK("FA12", "A06", "충당금(CKPN) 산출 파일 처리", "Memproses file perhitungan CKPN", "Processing CKPN (impairment) calculation files"),
      OTHER_TASKS("FA")[0], OTHER_TASKS("FA")[1]
    ],
    G8: [
      TK("HG01", "A06", "급여 계산·지급과 공제 처리", "Menghitung dan membayar gaji serta memproses potongan", "Calculating and paying salaries and processing deductions"),
      TK("HG02", "", "PPh 21·BPJS 신고", "Pelaporan PPh 21 dan BPJS", "PPh 21 and BPJS reporting"),
      TK("HG03", "A01,A06", "근태 집계·보고와 경고장 처리", "Merekap dan melaporkan absensi serta memproses surat peringatan", "Compiling and reporting attendance and processing warning letters"),
      TK("HG04", "A01,A04", "채용 진행과 현황 보고", "Proses rekrutmen dan laporan perkembangannya", "Running recruitment and reporting its progress"),
      TK("HG05", "A06", "직원 데이터 보고(리스크·회계 앞)", "Laporan data karyawan (ke divisi Risiko dan Akuntansi)", "Employee data reports (to Risk and Accounting)"),
      TK("HG06", "A01,A04", "이사회·주총·OJK 제출 서류 작성(Corsec)", "Menyusun dokumen rapat Direksi/Dewan Komisaris, RUPS, dan laporan ke OJK (Corsec)", "Preparing Board of Directors/Commissioners, GMS and OJK documents (Corsec)"),
      TK("HG07", "A07", "수발신 공문 회람과 처리", "Mengedarkan dan menindaklanjuti surat masuk dan keluar", "Circulating and following up incoming and outgoing letters"),
      TK("HG08", "A01", "금융문해력·포용금융 SNS 게시물 작성과 보고", "Menyusun dan melaporkan konten media sosial literasi dan inklusi keuangan", "Creating and reporting financial literacy social media posts"),
      TK("HG09", "A06", "KPI 양식 배포와 취합", "Membagikan dan merekap formulir KPI", "Distributing and compiling KPI forms"),
      TK("HG10", "A07", "IT 사용자 문의 대응과 장비 지원", "Menangani pertanyaan pengguna IT dan dukungan perangkat", "Handling IT user questions and device support"),
      TK("HG11", "", "총무 업무(시설, 구매, 외주 인력 관리)", "Urusan umum (fasilitas, pengadaan, pengelolaan tenaga alih daya)", "General affairs (facilities, procurement, outsourced staff)"),
      OTHER_TASKS("HG")[0], OTHER_TASKS("HG")[1]
    ],
    G9: [
      TK("SP01", "", "문서 전달, 복사, 스캔", "Mengantar, memfotokopi, dan memindai dokumen", "Delivering, copying and scanning documents"),
      TK("SP02", "", "차량 운행과 운행 기록·비용 정리", "Mengemudi serta mencatat perjalanan dan biaya kendaraan", "Driving and recording trips and vehicle costs"),
      TK("SP03", "", "자료 정리와 입력 보조", "Merapikan data dan membantu input data", "Organising data and helping with data entry"),
      TK("SP04", "", "회의실·사무실 지원", "Menyiapkan ruang rapat dan membantu keperluan kantor", "Meeting room and office support"),
      OTHER_TASKS("SP")[0], OTHER_TASKS("SP")[1]
    ]
  };
  // Q2 = 기타(G99) 일 때: Q5 업무 유형 a~i 를 보기로 사용
  // Q5 행의 only / except: 소속 그룹(Q2)에 따라 표시 여부 결정. G99(기타)는 전체 표시. 미표시 행은 응답 시트에 NA 저장
  var GENERIC_TASKS = null; // Q5 정의 후 채움

  var REASONS = [
    O("R01", "문서·메모 작성이나 번역에 시간이 걸림", "Butuh waktu untuk menulis dokumen atau memo, atau untuk menerjemahkan", "Writing documents or memos, or translating, takes time", { cls: "AI" }),
    O("R02", "규정·자료를 찾아 읽고 정리하는 데 시간이 걸림", "Butuh waktu untuk mencari, membaca, dan merangkum peraturan atau data", "Finding, reading and summarising rules or data takes time", { cls: "AI" }),
    O("R03", "시스템 자료를 엑셀로 옮겨 다시 계산·집계함", "Harus memindahkan data sistem ke Excel lalu menghitung atau merekap ulang", "System data must be moved to Excel and recalculated or summarised", { cls: "MIX" }),
    O("R04", "검토·결재 과정에서 수정이 반복됨", "Sering ada revisi berulang saat review atau persetujuan", "Revisions are repeated during review or approval", { cls: "MIX" }),
    O("R05", "같은 내용을 다른 시스템·양식에 다시 입력함", "Harus memasukkan ulang data yang sama ke sistem atau format lain", "The same data must be re-entered in another system or format", { cls: "SYS" }),
    O("R06", "시스템 기능·조회 권한이 없거나 자료가 종이로만 있음", "Sistem tidak memiliki fitur atau hak akses yang dibutuhkan, atau data hanya ada dalam bentuk kertas", "The system lacks the needed feature or access, or data is only on paper", { cls: "SYS" }),
    O("R07", "다른 부서나 외부에서 자료를 기다림", "Harus menunggu data dari divisi lain atau pihak luar", "Waiting for data from other departments or outside parties", { cls: "SYS" }),
    O("R08", "현장 이동과 방문에 시간이 걸림", "Perjalanan dan kunjungan lapangan memakan waktu", "Travel and field visits take time", { cls: "FIELD" }),
    O("R09", "처리해야 할 건수 자체가 많음", "Jumlah kasus atau transaksi yang harus diproses memang banyak", "The volume of cases or transactions is high", { cls: "VOL" }),
    O("R99", "기타(직접 입력)", "Lainnya (tuliskan)", "Other (please specify)", { other: true, cls: "ETC" })
  ];

  /* ── 섹션 ──────────────────────────────────────── */
  var SEC = {
    A: T("응답자 구분", "Data responden", "About you"),
    B: T("업무 부담과 수작업", "Beban kerja dan pekerjaan manual", "Workload and manual work"),
    C: T("영어 업무 여건", "Penggunaan bahasa Inggris", "English at work"),
    D: T("AI 사용 실태", "Penggunaan AI saat ini", "Current AI use"),
    E: T("AI 수요와 업무 환경", "Kebutuhan AI dan lingkungan kerja", "AI needs and work environment"),
    F: T("의견", "Komentar atau Masukan", "Comments")
  };
  var AI_DEF = T(
    "AI 도구란 ChatGPT, Gemini, Microsoft Copilot, Meta AI(WhatsApp), Claude, DeepSeek 같은 서비스를 말합니다.",
    "Alat AI adalah layanan seperti ChatGPT, Gemini, Microsoft Copilot, Meta AI (WhatsApp), Claude, dan DeepSeek.",
    "AI tools are services such as ChatGPT, Gemini, Microsoft Copilot, Meta AI (WhatsApp), Claude and DeepSeek.");

  /* ── 문항 ──────────────────────────────────────── */
  var Q = [
    { id: "Q1", sec: "A", type: "single",
      q: T("근무지", "Lokasi kerja", "Work location"),
      opts: [O("L1", "본사(Kantor Pusat, 샤리아 사업부 포함)", "Kantor Pusat (termasuk UUS Syariah)", "Head Office (including Sharia unit)"),
             O("L2", "지점·Grha (자카르타 DKI Grha 포함)", "Cabang atau Grha (termasuk Grha DKI Jakarta)", "Branch or Grha (including Grha DKI Jakarta)"), OTHER("L99")] },
    { id: "Q2", sec: "A", type: "single",
      q: T("소속", "Divisi atau bagian Anda", "Your department"),
      opts: GROUPS },
    { id: "Q3", sec: "A", type: "single",
      q: T("직급", "Level jabatan", "Position level"),
      opts: [O("P1", "Staff·Non Staff", "Staff atau Non Staff", "Staff or non-staff"),
             O("P2", "SPV 이상 (SPV, Account Manager, Marketing Head, Pimpinan Grha, Manager, Kepala Divisi, GM)", "Mulai dari SPV ke atas (SPV, Account Manager, Marketing Head, Pimpinan Grha, Manager, Kepala Divisi, GM)", "SPV and above (SPV, Account Manager, Marketing Head, Grha Head, Manager, Division Head, GM)"),
             OTHER("P99")] },

    { id: "Q4", sec: "B", type: "single",
      q: T("평소 근무일에 하루 몇 시간 일합니까? 초과근무를 포함해 주십시오.",
           "Pada hari kerja, berapa jam biasanya Anda bekerja dalam sehari? Isi termasuk jam lembur.",
           "On a typical workday, how many hours do you work, including overtime?"),
      opts: [O("H1", "8시간 미만", "Kurang dari 8 jam", "Less than 8 hours"),
             O("H2", "8시간 이상~9시간 미만", "8 – kurang dari 9 jam", "8 – under 9 hours"),
             O("H3", "9시간 이상~10시간 미만", "9 – kurang dari 10 jam", "9 – under 10 hours"),
             O("H4", "10시간 이상", "10 jam atau lebih", "10 hours or more")] },
    { id: "Q5", sec: "B", type: "grid", skip: ["G9"],
      q: T("평소 근무일에 다음 업무에 각각 얼마나 시간을 씁니까?",
           "Pada hari kerja biasa, berapa lama waktu yang Anda gunakan untuk setiap pekerjaan berikut?",
           "On a typical workday, how much time do you spend on each of the following?"),
      help: T("하나의 업무는 가장 가까운 항목 한 곳에만 포함해 주십시오. 목록에 없는 업무는 다음 문항(Q6)에서 기타로 적어 주십시오.",
              "Hitung setiap kegiatan satu kali saja, pada kategori yang paling sesuai. Pekerjaan yang tidak ada di daftar dapat Anda tuliskan sebagai \"Pekerjaan lainnya\" pada pertanyaan berikutnya (Q6).",
              "Count each activity only once, in the category that fits best. Tasks not on this list can be entered as \"Other task\" in the next question (Q6)."),
      rows: [
        O("a", "이메일·공문·메모 작성", "Menulis email, surat, atau memo", "Writing emails, letters or memos"),
        O("b", "번역(인니어 ↔ 영어)", "Menerjemahkan (bahasa Indonesia ↔ bahasa Inggris)", "Translating (Indonesian ↔ English)"),
        O("c", "정기 보고서·회의자료·발표자료 작성", "Menyusun laporan rutin, bahan rapat, atau bahan presentasi", "Preparing routine reports, meeting materials or presentations", { except: ["G9"] }),
        O("d", "{CORE} 등에서 자료를 내려받아 엑셀로 정리·집계", "Mengunduh data dari {CORE} atau sistem lain, lalu mengolah dan merekapnya di Excel", "Downloading data from the {CORE} or other systems and processing it in Excel", { except: ["G9"] }),
        O("e", "같은 내용을 다른 시스템이나 양식에 다시 입력", "Memasukkan ulang data yang sama ke sistem atau format lain", "Re-entering the same data in another system or format", { except: ["G9"] }),
        O("f", "은행 거래내역·입금 내역 대조, 숫자 맞추기", "Mencocokkan mutasi rekening bank atau data pembayaran dan memeriksa kesesuaian angka", "Matching bank statements or payment data and checking figures", { only: ["G5", "G6", "G7"] }),
        O("g", "고객·차주 서류 확인과 검증", "Memeriksa dan memverifikasi dokumen konsumen atau debitur", "Checking and verifying customer or debtor documents", { only: ["G1", "G2", "G3", "G4", "G5", "G6"] }),
        O("h", "규정·SOP·OJK 규정을 찾아 확인", "Mencari dan memeriksa peraturan, SOP, atau ketentuan OJK", "Looking up rules, SOPs or OJK regulations", { except: ["G9"] }),
        O("i", "고객·딜러 상담, 현장 방문(이동 포함)", "Melayani konsumen atau dealer dan kunjungan lapangan (termasuk perjalanan)", "Serving customers or dealers and field visits (including travel)", { only: ["G1", "G2", "G3", "G4", "G5", "G6"] })
      ],
      scale: DAY_TIME },
    { id: "Q6", sec: "B", type: "tasks", max: 3,
      q: T("다음 중 시간이 가장 많이 드는 반복 업무를 최대 3개까지 골라 주십시오.",
           "Pilih paling banyak 3 pekerjaan rutin yang paling banyak menyita waktu Anda.",
           "Choose up to 3 repetitive tasks that take up most of your time.") },
    { id: "Q6_1", sec: "B", type: "taskDetail",
      q: T("고른 업무별로 일주일에 드는 시간과 가장 큰 이유를 골라 주십시오.",
           "Untuk setiap pekerjaan yang Anda pilih, pilih waktu per minggu dan alasan utamanya.",
           "For each task you chose, select the time per week and the main reason.") },
    { id: "Q7", sec: "B", type: "multi",
      q: T("평소 업무에서 다음과 같은 일이 있습니까?", "Apakah hal-hal berikut terjadi dalam pekerjaan Anda sehari-hari?", "Do any of the following happen in your daily work?"),
      opts: [
        O("M01", "CMO 앱·RASSA 신청 건을 {CORE}에 다시 입력함", "Menginput ulang data pengajuan dari Mobile CMO/RASSA ke {CORE}", "Re-entering Mobile CMO/RASSA applications in the {CORE}"),
        O("M02", "{CORE} 자료를 내려받아 엑셀로 보고서를 만듦", "Mengunduh data {CORE} untuk membuat laporan di Excel", "Downloading {CORE} data to build reports in Excel"),
        O("M03", "은행·지로·송금 입금 내역을 {CORE}과 수기로 맞춤", "Mencocokkan data bank, giro, atau transfer dengan {CORE} secara manual", "Manually matching bank, giro or transfer payments with the {CORE}"),
        O("M04", "상환 스케줄·한도·수수료를 엑셀로 계산해 {CORE}에 입력함", "Menghitung jadwal angsuran, limit, atau fee di Excel lalu menginputnya ke {CORE}", "Calculating schedules, limits or fees in Excel and entering them in the {CORE}"),
        O("M05", "MCS(회수앱)와 {CORE} 자료가 달라 따로 확인함", "Mengecek secara terpisah karena data MCS (aplikasi penagihan) dan {CORE} berbeda", "Checking separately because MCS (collection app) and {CORE} data differ"),
        O("M06", "SLIK·SILARAS·은행·본사 보고서를 양식별로 엑셀로 다시 만듦", "Membuat ulang laporan SLIK, SILARAS, bank, atau perusahaan induk di Excel sesuai format masing-masing", "Rebuilding SLIK, SILARAS, bank or parent-company reports in Excel for each format"),
        O("M07", "BPKB·Fidusia·증서 정보를 종이나 엑셀로 따로 관리함", "Mencatat data BPKB, fidusia, atau dokumen secara terpisah di kertas atau Excel", "Keeping BPKB, fiduciary (fidusia) or document records separately on paper or in Excel"),
        O("M08", "공동금융(JF)·Channeling 계좌를 엑셀로 구분·배분함", "Memisahkan atau mengalokasikan rekening joint financing (JF) atau channeling di Excel", "Separating or allocating joint financing (JF) or channeling accounts in Excel"),
        O("M09", "조회 권한이 없어 다른 부서에 시스템 조회를 요청함", "Meminta divisi lain mengecek sistem karena tidak punya hak akses", "Asking another department to check the system because of missing access"),
        O("M10", "해당 없음", "Tidak ada yang sesuai", "None of these", { excl: true }),
        OTHER("M99")
      ] },

    { id: "Q8", sec: "C", type: "single",
      q: T("현재 업무상 영어로 소통(이메일, 문서, 회의, 메시지)해야 하는 일이 얼마나 자주 있습니까?",
           "Saat ini, seberapa sering pekerjaan Anda membutuhkan komunikasi dalam bahasa Inggris (email, dokumen, rapat, pesan)?",
           "How often does your work currently require communication in English (emails, documents, meetings, messages)?"),
      opts: [O("E0", "없음", "Tidak pernah", "Never"), O("E1", "한 달에 몇 번", "Beberapa kali sebulan", "A few times a month"),
             O("E2", "일주일에 몇 번", "Beberapa kali seminggu", "A few times a week"), O("E3", "매일", "Setiap hari", "Every day")] },
    { id: "Q9", sec: "C", type: "grid", skip: ["G9"],
      q: T("다음 업무를 영어로 해야 한다면 현재 어느 정도 할 수 있습니까?",
           "Jika pekerjaan berikut harus dilakukan dalam bahasa Inggris, sejauh mana Anda bisa melakukannya saat ini?",
           "If the following had to be done in English, how well could you do it now?"),
      rows: [
        O("a", "영어 이메일을 읽고 내용 이해하기", "Membaca dan memahami email berbahasa Inggris", "Reading and understanding English emails"),
        O("b", "영어로 짧은 업무 이메일 쓰기", "Menulis email kerja singkat dalam bahasa Inggris", "Writing a short work email in English"),
        O("c", "영어로 1~2쪽 분량의 보고서 쓰기", "Menulis laporan 1–2 halaman dalam bahasa Inggris", "Writing a 1–2 page report in English"),
        O("d", "영어 회의에서 의견 말하기", "Menyampaikan pendapat dalam rapat berbahasa Inggris", "Giving your opinion in an English meeting")
      ],
      scale: [O("S1", "혼자 할 수 있음", "Bisa sendiri", "I can do it alone"),
              O("S2", "번역기·AI 도움이 있으면 할 수 있음", "Bisa dengan bantuan aplikasi penerjemah/AI", "With help from a translation app/AI"),
              O("S3", "동료 도움이 있으면 할 수 있음", "Bisa dengan bantuan rekan kerja", "With help from a colleague"),
              O("S4", "도움을 받아도 하기 어려움", "Sulit dilakukan, meskipun dengan bantuan", "Difficult even with help")] },
    { id: "Q10", sec: "C", type: "multi", max: 2, skip: ["G9"],
      q: T("업무에서 영어를 써야 하는 일이 늘어난다면 가장 부담되는 업무는 무엇입니까?",
           "Jika pekerjaan yang membutuhkan bahasa Inggris bertambah, pekerjaan apa yang paling berat bagi Anda?",
           "If more of your work required English, which tasks would be hardest for you?"),
      opts: [O("B1", "이메일·메시지 작성", "Menulis email dan pesan", "Writing emails and messages"),
             O("B2", "정기 보고서 작성", "Menyusun laporan rutin", "Preparing routine reports"),
             O("B3", "발표자료 작성", "Menyusun bahan presentasi", "Preparing presentations"),
             O("B4", "회의 참석과 발언", "Mengikuti rapat dan menyampaikan pendapat", "Attending meetings and speaking"),
             O("B5", "영어 규정·지침 읽기", "Membaca peraturan dan pedoman berbahasa Inggris", "Reading rules and guidelines in English"),
             O("B6", "부담 없음", "Tidak ada yang berat", "None would be hard", { excl: true }),
             OTHER("B99")] },

    { id: "Q11", sec: "D", type: "single", note: AI_DEF,
      q: T("최근 한 달 동안 업무에 AI 도구를 얼마나 자주 사용했습니까?",
           "Dalam 1 bulan terakhir, seberapa sering Anda menggunakan alat AI untuk pekerjaan?",
           "In the past month, how often did you use AI tools for work?"),
      opts: [O("U0", "한 번도 사용한 적 없음", "Tidak pernah sama sekali", "Never used"),
             O("U1", "사용해 본 적은 있으나 최근 한 달은 없음", "Pernah, tetapi tidak dalam 1 bulan terakhir", "Used before, but not in the past month"),
             O("U2", "한 달에 1~3회", "1–3 kali dalam sebulan", "1–3 times in the past month"),
             O("U3", "일주일에 1~2회", "1–2 kali seminggu", "1–2 times a week"),
             O("U4", "일주일에 3회 이상", "3 kali atau lebih seminggu", "3 or more times a week"),
             O("U5", "거의 매일", "Hampir setiap hari", "Almost every day")] },
    { id: "Q12", sec: "D", type: "combo", when: "used",
      q: T("업무에 사용하는 AI 도구와 비용 부담 방식을 골라 주십시오.",
           "Alat AI apa yang Anda gunakan untuk pekerjaan, dan bagaimana pembayarannya?",
           "Which AI tools do you use for work, and how are they paid for?"),
      parts: [
        { id: "tool", type: "multi", label: T("도구", "Alat", "Tools"),
          opts: [O("T1", "ChatGPT", "ChatGPT", "ChatGPT"), O("T2", "Gemini", "Gemini", "Gemini"),
                 O("T3", "Microsoft Copilot", "Microsoft Copilot", "Microsoft Copilot"), O("T4", "Meta AI (WhatsApp)", "Meta AI (WhatsApp)", "Meta AI (WhatsApp)"),
                 O("T5", "Claude", "Claude", "Claude"), O("T6", "DeepSeek", "DeepSeek", "DeepSeek"), OTHER("T99")] },
        { id: "pay", type: "multi", label: T("비용", "Biaya", "Payment"),
          opts: [O("C1", "무료 버전", "Versi gratis", "Free version"), O("C2", "본인 부담 유료 버전", "Versi berbayar, dibayar sendiri", "Paid version, paid by me"),
                 O("C3", "회사 제공 계정", "Akun dari perusahaan", "Company-provided account"), OTHER("C99")] }
      ] },
    { id: "Q13", sec: "D", type: "multi", when: "used",
      q: T("다음 중 AI 도구를 사용해 본 업무를 모두 골라 주십시오.",
           "Untuk pekerjaan apa saja Anda pernah menggunakan alat AI?",
           "Which of these tasks have you used AI tools for?"),
      opts: AI_TASKS },
    { id: "Q14", sec: "D", type: "single", when: "recent",
      q: T("AI를 사용해서 일주일에 몇 시간 정도 절약된다고 생각합니까?",
           "Menurut perkiraan Anda, berapa jam per minggu yang Anda hemat dengan menggunakan AI?",
           "By your estimate, how many hours per week do you save by using AI?"),
      opts: [O("V0", "절약되지 않음", "Tidak menghemat waktu", "No time saved"), O("V1", "1시간 미만", "Kurang dari 1 jam", "Less than 1 hour"),
             O("V2", "1시간 이상~3시간 미만", "1 jam – kurang dari 3 jam", "1 – under 3 hours"), O("V3", "3시간 이상~5시간 미만", "3 jam – kurang dari 5 jam", "3 – under 5 hours"),
             O("V4", "5시간 이상", "5 jam atau lebih", "5 hours or more")] },
    { id: "Q15", sec: "E", type: "rank", n: 3,
      q: T("회사가 회사 자료를 안전하게 다룰 수 있는 공식 AI 도구를 제공한다면 어떤 업무에 가장 쓰고 싶습니까? 3개까지 골라 순서를 매겨 주십시오.",
           "Jika perusahaan menyediakan bantuan alat AI resmi yang aman untuk data perusahaan, untuk pekerjaan apa Anda paling ingin menggunakannya? Pilih paling banyak 3 dan urutkan.",
           "If the company provided an official AI tool that is safe for company data, what would you most want to use it for? Choose up to 3 and rank them."),
      opts: AI_TASKS.concat([O("A00", "AI를 쓰고 싶은 업무 없음", "Tidak ada pekerjaan yang ingin saya kerjakan dengan AI", "No task I would use AI for", { excl: true })]) },
    { id: "Q16", sec: "E", type: "single",
      q: T("그런 도구가 제공된다면 얼마나 자주 사용하겠습니까?", "Jika alat tersebut disediakan, seberapa sering Anda akan menggunakannya?", "If such a tool were provided, how often would you use it?"),
      opts: [O("F1", "거의 매일", "Hampir setiap hari", "Almost every day"), O("F2", "일주일에 몇 번", "Beberapa kali seminggu", "A few times a week"),
             O("F3", "한 달에 몇 번", "Beberapa kali sebulan", "A few times a month"), O("F4", "사용하지 않을 것 같음", "Kemungkinan tidak akan menggunakan", "Probably would not use it")] },
    { id: "Q17", sec: "E", type: "multi", max: 3,
      q: T("업무에 AI를 사용할 때 가장 큰 걸림돌은 무엇입니까?", "Apa hambatan terbesar Anda dalam menggunakan AI untuk pekerjaan?", "What are your biggest obstacles to using AI at work?"),
      opts: [O("K1", "아직 잘 쓰는 방법을 모름", "Belum tahu cara menggunakannya dengan baik", "I don’t know how to use it well"),
             O("K2", "회사가 허용하는지 확실하지 않음", "Tidak yakin apakah perusahaan mengizinkan", "Not sure whether the company allows it"),
             O("K3", "결과가 틀릴까 걱정됨", "Khawatir hasilnya salah", "Worried the results may be wrong"),
             O("K5", "회사·고객 정보 보안이 걱정됨", "Khawatir soal keamanan data perusahaan dan konsumen", "Worried about company and customer data security"),
             O("K6", "내 업무가 대체될까 걱정됨", "Khawatir pekerjaan saya tergantikan", "Worried my job may be replaced"),
             O("K7", "업무용 노트북이나 컴퓨터가 없음", "Tidak punya laptop atau komputer kerja", "No work laptop or computer"),
             O("K8", "인터넷 연결이 불안정함", "Koneksi internet tidak stabil", "Unstable internet connection"),
             O("K10", "배울 시간이 없음", "Tidak ada waktu untuk mempelajarinya", "No time to learn it"),
             O("K11", "유료 버전 비용이 부담됨", "Biaya versi berbayar memberatkan", "The cost of a paid version is a burden"),
             O("K9", "걸림돌 없음", "Tidak ada hambatan", "No obstacles", { excl: true }),
             OTHER("K99")] },
    { id: "Q18", sec: "E", type: "combo",
      q: T("업무 환경에 대해 답해 주십시오.", "Lingkungan kerja Anda", "Your work environment"),
      parts: [
        { id: "dev", type: "single", label: T("업무에 가장 많이 사용하는 기기", "Perangkat yang paling sering digunakan untuk bekerja", "Device you use most for work"),
          opts: [O("DV1", "회사 노트북·PC", "Laptop/PC kantor", "Company laptop/PC"), O("DV2", "개인 노트북·PC", "Laptop/PC pribadi", "Personal laptop/PC"),
                 O("DV3", "주로 휴대폰", "Terutama ponsel", "Mainly a mobile phone"), OTHER("DV99")] },
        { id: "mail", type: "single", label: T("회사 이메일 계정", "Akun email kantor", "Company email account"),
          opts: [O("Y", "있음", "Punya", "Yes"), O("N", "없음", "Tidak punya", "No"), O("U", "모르겠음", "Tidak tahu", "Not sure")] }
      ] },

    { id: "Q19", sec: "F", type: "text", optional: true,
      q: T("업무 부담을 줄이거나 AI를 업무에 활용하는 데 필요하다고 생각하는 점을 자유롭게 적어 주십시오.",
           "Tuliskan secara bebas hal-hal yang menurut Anda dibutuhkan untuk mengurangi beban kerja atau menggunakan AI dalam pekerjaan.",
           "Please share anything you think is needed to reduce workload or use AI at work.") }
  ];

  GENERIC_TASKS = Q[4].rows.map(function (r) { return O("X" + r.code, r.t.ko, r.t.id, r.t.en, { ai: "" }); }).concat(OTHER_TASKS("X"));
  DEPT_TASKS.G99 = GENERIC_TASKS;

  var DEF = { version: "v1-2026-11", TEXT: TEXT, SEC: SEC, Q: Q, DEPT_TASKS: DEPT_TASKS, REASONS: REASONS, WEEK_TIME: WEEK_TIME, AI_TASKS: AI_TASKS, CORE: CORE };
  if (typeof module !== "undefined" && module.exports) module.exports = DEF; else root.SURVEY = DEF;
})(this);

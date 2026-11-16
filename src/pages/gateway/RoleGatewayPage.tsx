import { useMemo } from "react";
import { Icon } from "@/components/shared/Icon";
import { ROLE_LABELS, ROLE_DASHBOARD_MAP } from "@/lib/constants";
import { Role, type User } from "@/lib/types";

export interface RoleGatewayPageProps {
  currentUser: User;
  onNavigate: (page: string) => void;
  onSwitchRole?: (roleKey: string) => void;
}

interface ModuleItem {
  id: string;
  name: string;
  category: string;
  route: string;
  icon: string;
  description: string;
  allowedRoles: Role[];
  tags: string[];
}

const SIMRS_MODULES: ModuleItem[] = [
  {
    id: "admisi",
    name: "Admisi & Antrean Pasien",
    category: "Pelayanan Terdepan",
    route: "Admisi & Antrian",
    icon: "users",
    description: "Pendaftaran pasien umum & BPJS, alokasi nomor antrean poli, dan bridging VClaim.",
    allowedRoles: [Role.ADMIN, Role.DIREKTUR, Role.ADMISI],
    tags: ["Antrean Online", "Bridging BPJS", "Data Pasien (NIK)"],
  },
  {
    id: "emr",
    name: "Rekam Medis Elektronik (RME)",
    category: "Pelayanan Medis",
    route: "Rekam Medis",
    icon: "clipboard",
    description: "Pencatatan klinis SOAP, riwayat kunjungan, diagnosa ICD-10, dan integrasi SatuSehat.",
    allowedRoles: [Role.ADMIN, Role.DIREKTUR, Role.DOKTER, Role.PERAWAT],
    tags: ["SOAP Klinis", "ICD-10", "SatuSehat Kemenkes"],
  },
  {
    id: "farmasi",
    name: "Instalasi Farmasi & Depo Obat",
    category: "Penunjang Medis",
    route: "Farmasi",
    icon: "pill",
    description: "Verifikasi e-Resep, peracikan obat, kontrol stok FIFO, dan peringatan kedaluwarsa.",
    allowedRoles: [Role.ADMIN, Role.DIREKTUR, Role.APOTEKER],
    tags: ["e-Resep Dokter", "Stok Depo", "Etiket Obat"],
  },
  {
    id: "laboratorium",
    name: "Laboratorium & Radiologi",
    category: "Penunjang Medis",
    route: "Laboratorium",
    icon: "flask",
    description: "Order tes darah, kimia klinik, patologi, dan validasi digital hasil radiologi.",
    allowedRoles: [Role.ADMIN, Role.DIREKTUR, Role.ANALIS_LAB, Role.RADIOGRAFER],
    tags: ["Kimia Klinik", "Hematologi", "Hasil Lab Digital"],
  },
  {
    id: "kasir",
    name: "Kasir, Billing & Klaim BPJS",
    category: "Keuangan & Kasir",
    route: "Kasir & Billing",
    icon: "wallet",
    description: "Kalkulasi total tagihan, adjustment klaim INA-CBG BPJS, dan cetak kuitansi kasir.",
    allowedRoles: [Role.ADMIN, Role.DIREKTUR, Role.KASIR],
    tags: ["Invoice Pasien", "Klaim INA-CBG", "Pelunasan"],
  },
  {
    id: "rawat_inap",
    name: "Bangsal Rawat Inap & Bed Monitoring",
    category: "Pelayanan Rawat Inap",
    route: "Rawat Inap",
    icon: "bed",
    description: "Pemantauan status bed, sensus harian ruangan, jadwal visite, dan ronde perawat.",
    allowedRoles: [Role.ADMIN, Role.DIREKTUR, Role.PERAWAT, Role.DOKTER],
    tags: ["Status Kamar", "BOR Harian", "Ronde Pasien"],
  },
  {
    id: "igd_logistik",
    name: "IGD, Ambulans & Sentral CSSD",
    category: "Gawat Darurat & Armada",
    route: "IGD & Logistik",
    icon: "ambulance",
    description: "Pelayanan darurat 24 jam, tracking dispatch ambulans, dan sterilisasi instrumen CSSD.",
    allowedRoles: [Role.ADMIN, Role.DIREKTUR, Role.DRIVER, Role.CSSD, Role.PERAWAT],
    tags: ["Dispatch 119", "Sterilisasi CSSD", "Triase IGD"],
  },
  {
    id: "dokter_staff",
    name: "Direktori Dokter & Tenaga Medis",
    category: "SDM & Kepegawaian",
    route: "Dokter & Staff",
    icon: "stethoscope",
    description: "Database NIP/SIP dokter spesialis, jadwal praktik poliklinik, dan master kepegawaian.",
    allowedRoles: [Role.ADMIN, Role.DIREKTUR, Role.IT_SUPPORT],
    tags: ["Jadwal Praktik", "Surat Izin Praktik (SIP)", "Staff Keperawatan"],
  },
  {
    id: "laporan",
    name: "Laporan & Analitik Direksi",
    category: "Manajemen Eksekutif",
    route: "Laporan",
    icon: "activity",
    description: "Rekapitulasi BOR, LOS, TOI, ringkasan pendapatan harian, dan pelaporan Kemenkes RL.",
    allowedRoles: [Role.ADMIN, Role.DIREKTUR, Role.KASIR],
    tags: ["Indikator RS", "Rekap Finansial", "RL Kemenkes"],
  },
  {
    id: "pengaturan",
    name: "Pengaturan SIMRS & Konfigurasi",
    category: "Administrasi Sistem",
    route: "Pengaturan",
    icon: "settings",
    description: "Audit trail, hak akses matrix RBAC 13 peran, bridging API, dan parameter sistem.",
    allowedRoles: [Role.ADMIN, Role.DIREKTUR, Role.IT_SUPPORT],
    tags: ["Matrix RBAC", "Audit Log", "Database Sync"],
  },
];

export function RoleGatewayPage({
  currentUser,
  onNavigate,
  onSwitchRole,
}: RoleGatewayPageProps) {
  const userRole = (currentUser.role_id || currentUser.role || Role.ADMIN) as Role;
  const isSuperUser = userRole === Role.ADMIN || userRole === Role.DIREKTUR;

  const defaultLanding = ROLE_DASHBOARD_MAP[userRole] || "Overview";

  // Compute permission status for all modules
  const processedModules = useMemo(() => {
    return SIMRS_MODULES.map((mod) => {
      const isAllowed = isSuperUser || mod.allowedRoles.includes(userRole);
      return {
        ...mod,
        isAllowed,
      };
    });
  }, [userRole, isSuperUser]);

  const accessibleCount = processedModules.filter((m) => m.isAllowed).length;
  const roleLabel = ROLE_LABELS[userRole] || userRole;

  return (
    <div className="space-y-6 pb-8">
      {/* ================= TOP WELCOME & PROFILE BANNER ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#091728] via-[#0d2a45] to-[#0a3847] text-white p-6 sm:p-8 shadow-md">
        {/* Ambient radial blur */}
        <div
          className="absolute -top-16 -right-16 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-teal-400/20 text-teal-300 border border-teal-400/30">
                Portal Departemen SIMRS
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Sesi Terverifikasi HIPAA
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white pt-1">
              Selamat Datang, {currentUser.name || currentUser.nama_lengkap || "Staff Medis"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Anda terautentikasi sebagai <span className="font-semibold text-teal-300">{roleLabel}</span>.
              Pilih departemen kerja di bawah ini untuk mengakses modul layanan sesuai hak otorisasi Anda.
            </p>
          </div>

          {/* Quick Metrics & Direct Jump */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
            <div className="text-right sm:text-right hidden sm:block">
              <span className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                Otorisasi Departemen
              </span>
              <span className="text-xl font-extrabold text-teal-300 font-mono">
                {accessibleCount} / {SIMRS_MODULES.length} Modul Terbuka
              </span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(defaultLanding)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer active:scale-95"
            >
              <span>Buka Dashboard Utama ({defaultLanding})</span>
              <Icon name="arrowRight" size={15} />
            </button>
          </div>
        </div>

        {/* User Badges Strip */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Icon name="shield" size={14} className="text-teal-400" />
            <span className="text-slate-400">Peran:</span>
            <strong className="text-white capitalize">{userRole}</strong>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <Icon name="users" size={14} className="text-teal-400" />
            <span className="text-slate-400">Email:</span>
            <strong className="text-white">{currentUser.email}</strong>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <Icon name="check-circle" size={14} className="text-emerald-400" />
            <span className="text-slate-400">Database:</span>
            <strong className="text-white">MySQL (14 Tabel Aktif)</strong>
          </div>
        </div>
      </div>

      {/* ================= DEPARTMENT MODULES GRID ================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Katalog Modul Departemen Rumah Sakit
            </h2>
            <p className="text-xs text-slate-500">
              Modul ditandai dengan status hak akses RBAC berdasarkan kredensial aktif Anda.
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
            Total 10 Modul Terintegrasi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {processedModules.map((module) => {
            return (
              <div
                key={module.id}
                className={`flex flex-col justify-between rounded-xl border p-5 transition-all duration-200 ${
                  module.isAllowed
                    ? "bg-white border-slate-200/90 hover:border-teal-400 hover:shadow-md group"
                    : "bg-slate-50/70 border-slate-200/50 opacity-75"
                }`}
              >
                <div>
                  {/* Card Header: Icon + Category + Permission Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                          module.isAllowed
                            ? "bg-teal-50 text-teal-600 group-hover:scale-105"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Icon name={module.icon} size={20} />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {module.category}
                        </span>
                        <h3
                          className={`text-sm font-bold leading-tight ${
                            module.isAllowed
                              ? "text-slate-900 group-hover:text-teal-700 transition-colors"
                              : "text-slate-600"
                          }`}
                        >
                          {module.name}
                        </h3>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {module.isAllowed ? (
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ Akses Terbuka
                      </span>
                    ) : (
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1">
                        <Icon name="lock" size={10} />
                        Akses Dibatasi
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {module.description}
                  </p>

                  {/* Feature Sub-tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {module.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-3 border-t border-slate-100 mt-auto">
                  {module.isAllowed ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(module.route)}
                      className="w-full py-2 px-3 rounded-lg bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs group-hover:bg-teal-600 group-hover:text-white"
                    >
                      <span>Buka Modul Departemen</span>
                      <Icon name="arrowRight" size={14} />
                    </button>
                  ) : (
                    <div className="w-full py-2 px-3 rounded-lg bg-slate-100 text-slate-400 font-medium text-xs flex items-center justify-center gap-1.5 cursor-not-allowed select-none">
                      <Icon name="lock" size={12} />
                      <span>Memerlukan Hak Akses Khusus</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= OPTIONAL ROLE SWITCHER BAR (FOR AUDIT & TESTING) ================= */}
      {onSwitchRole && (
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900">
                Uji Cepat Hak Akses RBAC (13 Peran Rumah Sakit)
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Role Aktif: <strong className="text-teal-700">{userRole}</strong>
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { key: "admin", label: "Admin RS" },
              { key: "direktur", label: "Direktur RS" },
              { key: "dokter", label: "Dokter Spesialis" },
              { key: "perawat", label: "Perawat Medis" },
              { key: "apoteker", label: "Apoteker" },
              { key: "analis_lab", label: "Analis Lab" },
              { key: "radiografer", label: "Radiografer" },
              { key: "kasir", label: "Kasir & Billing" },
              { key: "admisi", label: "Admisi & Antrean" },
              { key: "driver", label: "Driver Ambulans" },
              { key: "cssd", label: "Petugas CSSD" },
              { key: "it_support", label: "IT Support" },
              { key: "pasien", label: "Pasien Mandiri" },
            ].map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => onSwitchRole(r.key)}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition-all cursor-pointer ${
                  userRole === r.key
                    ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RoleGatewayPage;

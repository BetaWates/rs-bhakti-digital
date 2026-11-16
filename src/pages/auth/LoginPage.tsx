import { useState, useEffect, useRef, type FormEvent } from "react";
import logoOfficial from "@/assets/logo.png";
import thmDrk from "@/assets/thmdrk.jpg";
import thmLght from "@/assets/thmlght.jpg";
import { useAuth, DEMO_CREDENTIALS } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { api } from "@/lib/api";
import { Icon } from "@/components/shared/Icon";
import { DEMO_USERS, APP_VERSION } from "@/lib/constants";
import type { User } from "@/lib/types";
import { translations, type Language } from "@/lib/i18n";

export interface LoginPageProps {
  onSuccess?: (user?: User) => void;
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const { login, quickLogin } = useAuth();

  // Form input states
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Register mode state
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // RBAC 13-Role Drawer state
  const [isAllRolesOpen, setIsAllRolesOpen] = useState(false);

  // Secure Simulated SSO Modal state
  const [isSsoModalOpen, setIsSsoModalOpen] = useState(false);
  const [ssoNipOrEmail, setSsoNipOrEmail] = useState("198507152010121003@rsbhaktidigital.id");
  const [ssoSelectedRole, setSsoSelectedRole] = useState("dokter");
  const [ssoLoading, setSsoLoading] = useState(false);
  const [ssoStatusText, setSsoStatusText] = useState("");

  // Global Theme Context
  const { theme, toggleTheme } = useTheme();
  const leftBgImage = theme === "dark" ? thmDrk : thmLght;

  // Language Switcher: Clean 'id' or 'en'
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("rsbd_lang");
      if (stored === "id" || stored === "en") return stored;
    }
    return "id";
  });

  const t = translations[lang] || translations.id;


  // Sync language selection
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("rsbd_lang", lang);
    }
  }, [lang]);


  const toggleLanguage = () => {
    setLang((prev) => (prev === "id" ? "en" : "id"));
  };

  // Language Dropdown state & outside click handler
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 4 Primary visible role cards for the bottom RBAC panel
  const primaryRoleCards = [
    {
      key: "admin",
      label: t.roleAdminLabel,
      description: t.roleAdminDesc,
      tag: "admin",
      icon: "shield" as const,
      tagColor: "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800",
      iconBg: "bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400",
    },
    {
      key: "dokter",
      label: t.roleDokterLabel,
      description: t.roleDokterDesc,
      tag: "dokter",
      icon: "stethoscope" as const,
      tagColor: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      iconBg: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
    },
    {
      key: "perawat",
      label: t.rolePerawatLabel,
      description: t.rolePerawatDesc,
      tag: "perawat",
      icon: "heart" as const,
      tagColor: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      iconBg: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400",
    },
    {
      key: "apoteker",
      label: t.roleApotekerLabel,
      description: t.roleApotekerDesc,
      tag: "apoteker",
      icon: "pill" as const,
      tagColor: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      iconBg: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
    },
  ];

  // Extended 9 additional roles for the collapsible panel
  const additionalRoles = [
    { key: "analis_lab", label: t.roleAnalisLabLabel, tag: "analis_lab", dept: t.roleAnalisLabDept, icon: "flask" as const },
    { key: "radiografer", label: t.roleRadiograferLabel, tag: "radiografer", dept: t.roleRadiograferDept, icon: "zap" as const },
    { key: "kasir", label: t.roleKasirLabel, tag: "kasir", dept: t.roleKasirDept, icon: "wallet" as const },
    { key: "admisi", label: t.roleAdmisiLabel, tag: "admisi", dept: t.roleAdmisiDept, icon: "users" as const },
    { key: "driver", label: t.roleDriverLabel, tag: "driver", dept: t.roleDriverDept, icon: "ambulance" as const },
    { key: "cssd", label: t.roleCssdLabel, tag: "cssd", dept: t.roleCssdDept, icon: "package" as const },
    { key: "it_support", label: t.roleItSupportLabel, tag: "it_support", dept: t.roleItSupportDept, icon: "settings" as const },
    { key: "pasien", label: t.rolePasienLabel, tag: "pasien", dept: t.rolePasienDept, icon: "clipboard" as const },
    { key: "direktur", label: t.roleDirekturLabel, tag: "direktur", dept: t.roleDirekturDept, icon: "activity" as const },
  ];

  // Standard Login Submit
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailOrUsername.trim()) {
      setErrorMessage(t.errorEmailRequired);
      return;
    }

    if (!password) {
      setErrorMessage(t.errorPasswordRequired);
      return;
    }

    setLoading(true);
    try {
      const result = await login(emailOrUsername, password);
      if (result.success && result.user) {
        onSuccess?.(result.user);
      } else {
        setErrorMessage(
          result.error || t.errorSystem
        );
      }
    } catch {
      setErrorMessage(t.errorSystem);
    } finally {
      setLoading(false);
    }
  };

  // Patient Registration Submit
  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim()) {
      setErrorMessage("Nama lengkap wajib diisi.");
      return;
    }

    if (!regEmail.trim()) {
      setErrorMessage("Alamat email wajib diisi.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setErrorMessage("Format alamat email tidak valid.");
      return;
    }

    if (!regPhone.trim()) {
      setErrorMessage("Nomor telepon wajib diisi.");
      return;
    }

    if (!regPassword) {
      setErrorMessage("Kata sandi wajib diisi.");
      return;
    }

    if (regPassword.length < 8) {
      setErrorMessage("Kata sandi minimal 8 karakter.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post<{
        success: boolean;
        message: string;
        data?: any;
      }>("/api/auth/register-pasien", {
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword,
      });

      if (response?.success) {
        // Automatically attempt login with new credentials
        try {
          const loginResult = await login(regEmail.trim(), regPassword);
          if (loginResult.success && loginResult.user) {
            onSuccess?.(loginResult.user);
            return;
          }
        } catch {
          // If auto-login fails, return to login with success banner
        }

        setIsRegisterMode(false);
        setEmailOrUsername(regEmail.trim());
        setPassword("");
        setSuccessMessage("Pendaftaran akun pasien berhasil! Silakan masuk dengan kata sandi Anda.");
        setRegName("");
        setRegEmail("");
        setRegPhone("");
        setRegPassword("");
        setRegConfirmPassword("");
      } else {
        setErrorMessage(response?.message || "Pendaftaran gagal. Silakan coba lagi.");
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Pendaftaran gagal. Silakan periksa kembali data Anda.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Secure SSO Verification Submit
  const handleSsoSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!ssoNipOrEmail.trim()) {
      return;
    }

    setSsoLoading(true);
    setSsoStatusText(t.ssoStatusConnecting);

    setTimeout(() => {
      setSsoStatusText(t.ssoStatusVerifying);
    }, 400);

    setTimeout(async () => {
      const demo = DEMO_CREDENTIALS[ssoSelectedRole] || { identifier: ssoSelectedRole, password: "demo" };
      try {
        const result = await login(demo.identifier, demo.password);
        setSsoLoading(false);
        setIsSsoModalOpen(false);
        if (result.success && result.user) {
          onSuccess?.(result.user);
        } else if (result.error) {
          setErrorMessage(result.error);
        }
      } catch (err: any) {
        setSsoLoading(false);
        setIsSsoModalOpen(false);
        setErrorMessage(err?.message || t.errorSsoLogin);
      }
    }, 900);
  };

  // Quick Login for RBAC testing
  const handleQuickLogin = async (roleKey: string) => {
    setErrorMessage(null);
    setLoading(true);

    const demo = DEMO_CREDENTIALS[roleKey] || { identifier: roleKey, password: "demo" };
    setEmailOrUsername(demo.identifier);
    setPassword(demo.password);

    try {
      const result = await login(demo.identifier, demo.password);
      if (result.success && result.user) {
        onSuccess?.(result.user);
      } else {
        setErrorMessage(
          result.error || t.errorQuickLogin
        );
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || t.errorSystem
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc] dark:bg-[#070e1b] text-slate-800 dark:text-slate-100 font-sans selection:bg-teal-500 selection:text-white transition-colors duration-300">
      {/* =========================================================================
          1. LEFT PANEL: HIGH-CONTRAST HOSPITAL FACILITY SHOWCASE
         ========================================================================= */}
      <section className="lg:w-1/2 relative bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden select-none min-h-[640px] lg:min-h-screen transition-colors duration-300">
        {/* Clearly Visible Hospital Facility Background Image with Theme-Adaptive Overlay */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src={leftBgImage}
            alt="RS Bhakti Digital Hospital Architecture"
            className="w-full h-full object-cover object-center transition-opacity duration-300"
          />
          {/* Theme-Adaptive Overlay (Light mode: soft white/teal overlay; Dark mode: subtle dark overlay) ensuring crisp readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-slate-50/80 to-teal-50/85 dark:from-slate-950/75 dark:via-slate-900/65 dark:to-blue-950/75 transition-colors duration-300" />
        </div>

        {/* --- Top-Left Branding: Professionally Scaled Brand Lockup --- */}
        <div className="relative z-10 flex items-center gap-4 mb-6 sm:mb-8">
          <img
            src={logoOfficial}
            alt="RS Bhakti Digital Logo"
            className="h-14 sm:h-16 w-auto flex-shrink-0 object-contain drop-shadow-lg"
          />
          <div className="flex flex-col justify-center">
            <span className="font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight leading-tight">
              {t.hospitalName}
            </span>
            <span className="text-xs sm:text-sm text-teal-700 dark:text-teal-300 font-semibold tracking-wide mt-1">
              {t.tagline}
            </span>
          </div>
        </div>

        {/* --- Main Headline & Sub-headline --- */}
        <div className="relative z-10 my-auto py-6 lg:py-0 max-w-xl">
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.18]">
            {t.headlinePart1} <br />
            {t.headlinePart2} <br />
            <span className="text-teal-600 dark:text-teal-300 drop-shadow-[0_0_25px_rgba(45,212,191,0.4)]">
              {t.headlineHighlight}
            </span>
          </h1>

          <p className="mt-4 text-xs sm:text-sm text-slate-700 dark:text-slate-200/95 leading-relaxed font-normal max-w-lg">
            {t.description}
          </p>

          {/* --- Four Semi-Transparent Service Cards --- */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Card 1: Rekam Medis (RME) */}
            <div className="bg-white/85 dark:bg-[#0b243e]/75 hover:bg-white/95 dark:hover:bg-[#0b243e]/90 border border-teal-600/20 dark:border-teal-500/30 rounded-2xl p-4 backdrop-blur-md transition-all shadow-md dark:shadow-lg flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-300 flex items-center justify-center shrink-0 border border-teal-200 dark:border-teal-400/30 group-hover:scale-105 transition-transform">
                <Icon name="clipboard" size={18} />
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {t.featureRmeTitle}
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-300/90 mt-1 leading-snug">
                  {t.featureRmeDesc}
                </p>
              </div>
            </div>

            {/* Card 2: Administrasi & Antrean */}
            <div className="bg-white/85 dark:bg-[#0b243e]/75 hover:bg-white/95 dark:hover:bg-[#0b243e]/90 border border-teal-600/20 dark:border-teal-500/30 rounded-2xl p-4 backdrop-blur-md transition-all shadow-md dark:shadow-lg flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-300 flex items-center justify-center shrink-0 border border-teal-200 dark:border-teal-400/30 group-hover:scale-105 transition-transform">
                <Icon name="users" size={18} />
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {t.featureAdmissionTitle}
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-300/90 mt-1 leading-snug">
                  {t.featureAdmissionDesc}
                </p>
              </div>
            </div>

            {/* Card 3: Instalasi Farmasi */}
            <div className="bg-white/85 dark:bg-[#0b243e]/75 hover:bg-white/95 dark:hover:bg-[#0b243e]/90 border border-teal-600/20 dark:border-teal-500/30 rounded-2xl p-4 backdrop-blur-md transition-all shadow-md dark:shadow-lg flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-300 flex items-center justify-center shrink-0 border border-teal-200 dark:border-teal-400/30 group-hover:scale-105 transition-transform">
                <Icon name="pill" size={18} />
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {t.featurePharmacyTitle}
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-300/90 mt-1 leading-snug">
                  {t.featurePharmacyDesc}
                </p>
              </div>
            </div>

            {/* Card 4: Kasir & Billing */}
            <div className="bg-white/85 dark:bg-[#0b243e]/75 hover:bg-white/95 dark:hover:bg-[#0b243e]/90 border border-teal-600/20 dark:border-teal-500/30 rounded-2xl p-4 backdrop-blur-md transition-all shadow-md dark:shadow-lg flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-300 flex items-center justify-center shrink-0 border border-teal-200 dark:border-teal-400/30 group-hover:scale-105 transition-transform">
                <Icon name="wallet" size={18} />
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {t.featureBillingTitle}
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-300/90 mt-1 leading-snug">
                  {t.featureBillingDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Left Footer: Compliance & Accreditation Note --- */}
        <div className="relative z-10 pt-6 border-t border-slate-300/60 dark:border-teal-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Icon name="shield" size={15} className="text-teal-600 dark:text-teal-400" />
            <span>{t.copyright}</span>
            <span className="text-teal-500/40">•</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{t.version}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-teal-500/50">•</span>
            <span className="font-medium text-teal-700 dark:text-teal-300">
              {t.complianceBadge}
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. RIGHT PANEL: AUTHENTICATION, LOGIN FORM, & BOTTOM RBAC TESTING
         ========================================================================= */}
      <section className="lg:w-1/2 flex flex-col justify-between items-center p-6 sm:p-10 lg:p-14 overflow-y-auto min-h-screen bg-slate-50 dark:bg-[#070e1b]">
        {/* --- Top-Right Header Controls: Language Switcher & Theme Toggle Only --- */}
        <div className="w-full max-w-lg flex items-center justify-end mb-4">
          <div className="flex items-center gap-2">
            {/* Language Switcher Pill Button with Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen((prev) => !prev)}
                className="h-8 flex items-center gap-1.5 px-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs hover:border-teal-500 transition-colors cursor-pointer"
                aria-expanded={isLangDropdownOpen}
                aria-haspopup="listbox"
                title={t.selectLanguage}
              >
                {/* Globe SVG Icon */}
                <svg
                  className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span className="font-bold tracking-wide">{lang.toUpperCase()}</span>
                {/* Chevron Arrow */}
                <svg
                  className={`w-3 h-3 text-slate-400 dark:text-slate-500 transition-transform ${isLangDropdownOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {/* Language Selection Dropdown Menu */}
              {isLangDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 top-full mt-1.5 w-36 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setLang("id");
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors text-left cursor-pointer ${
                      lang === "id"
                        ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 font-medium"
                    }`}
                  >
                    <span>{t.langId}</span>
                    {lang === "id" && <span className="text-teal-600 dark:text-teal-400 text-xs font-bold">✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLang("en");
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors text-left cursor-pointer ${
                      lang === "en"
                        ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 font-medium"
                    }`}
                  >
                    <span>{t.langEn}</span>
                    {lang === "en" && <span className="text-teal-600 dark:text-teal-400 text-xs font-bold">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="h-8 flex items-center gap-2 px-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs hover:border-teal-500 transition-colors cursor-pointer"
            >
              {theme === "dark" ? (
                <>
                  <span className="text-amber-400 text-sm">☀️</span>
                  <span>{t.themeLight}</span>
                </>
              ) : (
                <>
                  <span className="text-slate-600 text-sm">🌙</span>
                  <span>{t.themeDark}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* --- Clean White/Light-Gray Main Card --- */}
        <div className="w-full max-w-lg my-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-9 shadow-lg border border-slate-200/80 dark:border-slate-800">
            {/* Title & Subtitle */}
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {isRegisterMode ? "Daftar Akun Pasien" : t.welcomeTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {isRegisterMode
                  ? "Lengkapi formulir pendaftaran di bawah ini untuk membuat akun pasien baru RS Bhakti Digital."
                  : t.welcomeSubtitle}
              </p>
            </div>

            {/* Success Alert */}
            {successMessage && (
              <div
                role="status"
                className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-start gap-2.5 text-emerald-700 dark:text-emerald-300 text-xs animate-in fade-in"
              >
                <Icon name="checkCircle" size={16} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <div className="flex-1 font-medium">{successMessage}</div>
              </div>
            )}

            {/* Error Alert */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in"
              >
                <Icon name="alertCircle" size={16} className="shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            {isRegisterMode ? (
              /* Patient Sign Up Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {/* Field 1: Nama Lengkap */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Icon name="user" size={16} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Nama lengkap sesuai KTP"
                      required
                      className="w-full h-11 pl-10 pr-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                    />
                  </div>
                </div>

                {/* Field 2: Alamat Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Alamat Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Icon name="mail" size={16} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="contoh@email.com"
                      required
                      autoComplete="email"
                      className="w-full h-11 pl-10 pr-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                    />
                  </div>
                </div>

                {/* Field 3: Nomor Telepon / WA */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Nomor Telepon / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Icon name="phone" size={16} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="081234567890"
                      required
                      className="w-full h-11 pl-10 pr-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                    />
                  </div>
                </div>

                {/* Field 4: Kata Sandi */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Icon name="key" size={16} />
                    </div>
                    <input
                      type={showRegPassword ? "text" : "password"}
                      name="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      required
                      autoComplete="new-password"
                      className="w-full h-11 pl-10 pr-10 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      tabIndex={-1}
                      aria-label={showRegPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    >
                      <Icon name={showRegPassword ? "eyeOff" : "eye"} size={17} />
                    </button>
                  </div>
                </div>

                {/* Field 5: Konfirmasi Kata Sandi */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Konfirmasi Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Icon name="key" size={16} />
                    </div>
                    <input
                      type={showRegConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi"
                      required
                      autoComplete="new-password"
                      className="w-full h-11 pl-10 pr-10 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      tabIndex={-1}
                      aria-label={showRegConfirmPassword ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
                    >
                      <Icon name={showRegConfirmPassword ? "eyeOff" : "eye"} size={17} />
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-2 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Icon name="arrowRight" size={16} />
                      <span>Daftar Sekarang</span>
                    </>
                  )}
                </button>

                {/* Return to Login Link */}
                <div className="text-center pt-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Sudah memiliki akun?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(false);
                      setErrorMessage(null);
                    }}
                    className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:underline cursor-pointer transition-colors"
                  >
                    Masuk ke SIMRS
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Input 1: Alamat Email / NIP / Username * */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                      {t.emailLabel} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Icon name="mail" size={16} />
                      </div>
                      <input
                        type="text"
                        name="emailOrUsername"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        placeholder={t.emailPlaceholder}
                        required
                        autoComplete="username"
                        className="w-full h-11 pl-10 pr-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Input 2: Kata Sandi * */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                      {t.passwordLabel} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Icon name="key" size={16} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t.passwordPlaceholder}
                        required
                        autoComplete="current-password"
                        className="w-full h-11 pl-10 pr-10 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        tabIndex={-1}
                        aria-label={showPassword ? t.hidePassword : t.showPassword}
                      >
                        <Icon name={showPassword ? "eyeOff" : "eye"} size={17} />
                      </button>
                    </div>
                  </div>

                  {/* Checkbox: Ingat saya di perangkat ini & Link: Lupa kata sandi? */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                      <span>{t.rememberMe}</span>
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setErrorMessage(
                          t.forgotPasswordTooltip
                        )
                      }
                      className="font-medium text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                    >
                      {t.forgotPassword}
                    </button>
                  </div>

                  {/* Primary Teal-Colored Button: Masuk ke Portal SIMRS */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 mt-2 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Icon name="arrowRight" size={16} />
                        <span>{t.loginButton}</span>
                      </>
                    )}
                  </button>

                  {/* Link: Daftar sebagai pasien */}
                  <div className="text-center pt-1.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Belum punya akun?{" "}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(true);
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:underline cursor-pointer transition-colors"
                    >
                      Daftar sebagai pasien
                    </button>
                  </div>
                </form>

                {/* Horizontal Separator Line with "atau" */}
                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <span className="relative bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 font-medium">
                    {t.orSeparator}
                  </span>
                </div>

                {/* Secondary Button: Login dengan SSO Rumah Sakit (Triggers Secure SSO Modal) */}
                <button
                  type="button"
                  onClick={() => setIsSsoModalOpen(true)}
                  className="w-full h-11 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 active:scale-[0.99] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <Icon name="key" size={16} className="text-teal-600 dark:text-teal-400" />
                  <span>{t.ssoButton}</span>
                </button>
              </>
            )}
          </div>

          {/* =========================================================================
              4. BOTTOM PANEL: PENGUJIAN CEPAT RBAC (13 PERAN OTOMATIS)
             ========================================================================= */}
          <div className="mt-6 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            {/* Header: Label & More Roles Link */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.rbacTitle}
                </span>
              </div>

              {/* Link Indicator: "Buka (13 Peran) ▼" */}
              <button
                type="button"
                onClick={() => setIsAllRolesOpen(!isAllRolesOpen)}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{isAllRolesOpen ? t.rbacClose : t.rbacOpen}</span>
              </button>
            </div>

            {/* Four Visible Primary Role Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {primaryRoleCards.map((roleItem) => (
                <button
                  key={roleItem.key}
                  type="button"
                  onClick={() => handleQuickLogin(roleItem.key)}
                  disabled={loading}
                  className="flex flex-col text-left p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-teal-500 dark:hover:border-teal-400 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-teal-50/40 dark:hover:bg-slate-800 transition-all cursor-pointer group shadow-2xs active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md ${roleItem.iconBg} flex items-center justify-center shrink-0`}>
                        <Icon name={roleItem.icon} size={14} />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {roleItem.label}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${roleItem.tagColor}`}>
                      {roleItem.tag}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight pl-8 truncate">
                    {roleItem.description}
                  </span>
                </button>
              ))}
            </div>

            {/* Collapsible Additional 9 Roles */}
            {isAllRolesOpen && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {additionalRoles.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleQuickLogin(item.key)}
                      disabled={loading}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-left transition-all cursor-pointer shadow-2xs group active:scale-95"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <Icon name={item.icon} size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 truncate">
                            {item.label}
                          </span>
                        </div>
                      </div>
                      <span className="block text-[9.5px] font-mono text-slate-400 dark:text-slate-500 truncate pl-4">
                        {item.tag} • {item.dept}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Area: Links & Subtle Version Indicator */}
          <div className="mt-4 text-[11px] text-slate-400 dark:text-slate-500 text-center font-medium tracking-wide flex items-center justify-center gap-2">
            <span>{t.footerSupport}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="font-mono text-slate-400 dark:text-slate-500">{t.version}</span>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="w-full h-2" aria-hidden="true" />
      </section>

      {/* =========================================================================
          5. SECURE SIMULATED CORPORATE IDENTITY PROVIDER SSO MODAL
         ========================================================================= */}
      {isSsoModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sso-dialog-title"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                if (!ssoLoading) setIsSsoModalOpen(false);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Icon name="close" size={18} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Icon name="shield" size={22} />
              </div>
              <div>
                <h3 id="sso-dialog-title" className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {t.ssoTitle}
                </h3>
                <span className="text-[11px] text-teal-600 dark:text-teal-400 font-mono font-medium">
                  {t.ssoBadge}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
              {t.ssoDescription}
            </p>

            {/* SSO Verification Form */}
            <form onSubmit={handleSsoSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  {t.ssoNipLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Icon name="mail" size={16} />
                  </div>
                  <input
                    type="text"
                    value={ssoNipOrEmail}
                    onChange={(e) => setSsoNipOrEmail(e.target.value)}
                    required
                    disabled={ssoLoading}
                    className="w-full h-10 pl-10 pr-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  {t.ssoRoleLabel}
                </label>
                <select
                  value={ssoSelectedRole}
                  onChange={(e) => setSsoSelectedRole(e.target.value)}
                  disabled={ssoLoading}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
                >
                  <option value="dokter">{t.ssoOptionDokter}</option>
                  <option value="admin">{t.ssoOptionAdmin}</option>
                  <option value="perawat">{t.ssoOptionPerawat}</option>
                  <option value="apoteker">{t.ssoOptionApoteker}</option>
                  <option value="direktur">{t.ssoOptionDirektur}</option>
                  <option value="analis_lab">{t.ssoOptionAnalisLab}</option>
                  <option value="kasir">{t.ssoOptionKasir}</option>
                  <option value="admisi">{t.ssoOptionAdmisi}</option>
                </select>
              </div>

              {/* Encryption & HIPAA Badge */}
              <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 rounded-xl flex items-center gap-2.5 text-[11px] text-teal-800 dark:text-teal-300">
                <Icon name="check-circle" size={16} className="text-teal-600 shrink-0" />
                <span>{t.ssoSecurityBadge}</span>
              </div>

              {/* Live Loading Telemetry */}
              {ssoLoading && (
                <div className="text-xs text-teal-600 dark:text-teal-400 font-mono text-center animate-pulse">
                  {ssoStatusText}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={ssoLoading}
                  onClick={() => setIsSsoModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {t.ssoCancel}
                </button>
                <button
                  type="submit"
                  disabled={ssoLoading}
                  className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {ssoLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Icon name="shield" size={14} />
                      <span>{t.ssoSubmit}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;

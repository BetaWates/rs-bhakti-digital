import { useEffect, useState, useCallback } from "react";
import logoOfficial from "@/assets/logo.png";

export interface SplashScreenProps {
  onComplete?: () => void;
  durationMs?: number;
}

export function SplashScreen({
  onComplete,
  durationMs = 3200,
}: SplashScreenProps) {
  // Smooth 2-second fade cycle: 1s fade-in, brief active hold, 1s fade-out
  const [opacityClass, setOpacityClass] = useState("opacity-0");
  const [progress, setProgress] = useState(15);
  const [isDone, setIsDone] = useState(false);

  const handleFinish = useCallback(() => {
    setIsDone(true);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    // 1-second smooth fade-in upon mounting
    const fadeInTimer = setTimeout(() => {
      setOpacityClass("opacity-100");
    }, 40);

    // Smooth progress bar advancement (15% -> 100%)
    const progressSteps = [25, 48, 72, 90, 100];
    let stepIndex = 0;
    const stepInterval = (durationMs - 1100) / progressSteps.length;

    const progressTimer = setInterval(() => {
      if (stepIndex < progressSteps.length) {
        setProgress(progressSteps[stepIndex]);
        stepIndex++;
      }
    }, stepInterval);

    // 1-second smooth fade-out trigger before transition
    const fadeOutStartTime = Math.max(0, durationMs - 1000);
    const fadeOutTimer = setTimeout(() => {
      setOpacityClass("opacity-0 pointer-events-none");
    }, fadeOutStartTime);

    // Final completion trigger
    const completeTimer = setTimeout(() => {
      handleFinish();
    }, durationMs);

    // ESC, Space, Enter keyboard skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleFinish();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(fadeInTimer);
      clearInterval(progressTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [durationMs, handleFinish]);

  if (isDone) return null;

  return (
    <div
      onClick={handleFinish}
      className={`fixed inset-0 w-screen h-screen z-50 flex flex-col items-center justify-between p-8 sm:p-14 select-none overflow-hidden bg-slate-950 text-white cursor-pointer transition-opacity duration-1000 ease-in-out ${opacityClass}`}
      role="dialog"
      aria-label="RS Bhakti Digital Splash Screen"
      aria-modal="true"
    >
      {/* Ambient background glows */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full bg-teal-500/15 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Top spacer (clean minimalist layout without any header text) */}
      <div className="w-full h-8" aria-hidden="true" />

      {/* Center: Official transparent logo scaled up elegantly with zero text */}
      <main className="relative z-10 flex flex-col items-center justify-center my-auto">
        <div className="transform transition-transform duration-700 hover:scale-105">
          <img
            src={logoOfficial}
            alt="RS Bhakti Digital"
            className="w-auto h-36 sm:h-48 md:h-60 max-w-[85vw] object-contain drop-shadow-[0_20px_50px_rgba(13,148,136,0.28)] select-none pointer-events-none"
          />
        </div>
      </main>

      {/* Bottom: Sleek minimal loading progress bar with zero text */}
      <footer
        className="relative z-10 w-full flex flex-col items-center pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-56 sm:w-72 md:w-80 h-1.5 bg-slate-900/90 rounded-full overflow-hidden border border-slate-800/80 shadow-inner"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_14px_rgba(45,212,191,0.75)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </footer>
    </div>
  );
}

export default SplashScreen;

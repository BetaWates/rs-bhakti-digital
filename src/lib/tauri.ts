// ============================================================================
// RS Bhakti Digital SIMRS - Tauri Desktop Native Bridge
// Desktop window control, native printing, & operating system integration
// ============================================================================

export const isTauriDesktop = (): boolean => {
  return typeof window !== 'undefined' && '__TAURI__' in window;
};

/**
 * Triggers native invoice / medical record document printing
 */
export async function printHospitalDocument(title?: string): Promise<void> {
  if (isTauriDesktop()) {
    try {
      const { window: tauriWindow } = (window as any).__TAURI__;
      await tauriWindow.appWindow.print();
      return;
    } catch (err) {
      console.warn('Tauri native print error, falling back to browser print:', err);
    }
  }

  // Standard web browser print fallback
  if (typeof window !== 'undefined') {
    if (title) {
      const originalTitle = document.title;
      document.title = title;
      window.print();
      document.title = originalTitle;
    } else {
      window.print();
    }
  }
}

/**
 * Sends a native operating system notification for emergency or queue alerts
 */
export async function sendNativeNotification(title: string, body: string): Promise<void> {
  if (isTauriDesktop()) {
    try {
      const { notification } = (window as any).__TAURI__;
      if (await notification.isPermissionGranted()) {
        notification.sendNotification({ title, body });
      } else {
        const permission = await notification.requestPermission();
        if (permission === 'granted') {
          notification.sendNotification({ title, body });
        }
      }
      return;
    } catch (err) {
      console.warn('Tauri notification error:', err);
    }
  }

  // Standard Web Notification API fallback
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

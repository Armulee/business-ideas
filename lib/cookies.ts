export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  necessary: true, // Always true, cannot be disabled
  analytics: false,
  marketing: false,
  functional: false,
}

export class CookieManager {
  private static CONSENT_KEY = 'cookies-consent'
  private static PREFERENCES_KEY = 'cookie-preferences'

  static hasConsent(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(this.CONSENT_KEY) === 'accepted'
  }

  static hasDeclined(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(this.CONSENT_KEY) === 'declined'
  }

  static setConsent(accepted: boolean): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.CONSENT_KEY, accepted ? 'accepted' : 'declined')
    
    if (accepted) {
      // Set default preferences when accepting
      this.setPreferences(DEFAULT_COOKIE_PREFERENCES)
    } else {
      // Only necessary cookies when declining
      this.setPreferences({ ...DEFAULT_COOKIE_PREFERENCES, necessary: true })
    }
  }

  static getPreferences(): CookiePreferences {
    if (typeof window === 'undefined') return DEFAULT_COOKIE_PREFERENCES
    
    try {
      const stored = localStorage.getItem(this.PREFERENCES_KEY)
      if (stored) {
        const preferences = JSON.parse(stored) as CookiePreferences
        // Ensure necessary cookies are always enabled
        return { ...preferences, necessary: true }
      }
    } catch (error) {
      console.error('Error parsing cookie preferences:', error)
    }
    
    return DEFAULT_COOKIE_PREFERENCES
  }

  static setPreferences(preferences: CookiePreferences): void {
    if (typeof window === 'undefined') return
    
    // Ensure necessary cookies are always enabled
    const safePreferences = { ...preferences, necessary: true }
    localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(safePreferences))
    
    // Trigger custom event for other parts of the app to react
    window.dispatchEvent(new CustomEvent('cookiePreferencesChanged', {
      detail: safePreferences
    }))
  }

  static clearConsent(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.CONSENT_KEY)
    localStorage.removeItem(this.PREFERENCES_KEY)
  }

  static shouldShowConsent(): boolean {
    return !this.hasConsent() && !this.hasDeclined()
  }

  // Helper methods for specific cookie types
  static canUseAnalytics(): boolean {
    return this.hasConsent() && this.getPreferences().analytics
  }

  static canUseMarketing(): boolean {
    return this.hasConsent() && this.getPreferences().marketing
  }

  static canUseFunctional(): boolean {
    return this.hasConsent() && this.getPreferences().functional
  }
}

// Hook for React components
export function useCookiePreferences() {
  if (typeof window === 'undefined') {
    return {
      hasConsent: false,
      preferences: DEFAULT_COOKIE_PREFERENCES,
      setConsent: () => {},
      setPreferences: () => {},
      canUseAnalytics: false,
      canUseMarketing: false,
      canUseFunctional: false,
    }
  }

  return {
    hasConsent: CookieManager.hasConsent(),
    preferences: CookieManager.getPreferences(),
    setConsent: CookieManager.setConsent,
    setPreferences: CookieManager.setPreferences,
    canUseAnalytics: CookieManager.canUseAnalytics(),
    canUseMarketing: CookieManager.canUseMarketing(),
    canUseFunctional: CookieManager.canUseFunctional(),
  }
}
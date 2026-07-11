const STORAGE_KEY = 'zr-lab-onboarding-done';

export function hasSeenOnboarding(): boolean {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function markOnboardingDone(): void {
  localStorage.setItem(STORAGE_KEY, 'true');
}

/** Basic RFC‑like email check — not exhaustive, avoids obvious junk. */
export function isValidEmail(email: string): boolean {
  const s = email.trim();
  if (s.length < 5 || s.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

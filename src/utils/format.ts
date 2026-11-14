export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) return formatDate(dateString);
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

export function truncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars).trimEnd() + '...';
}

export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    Technology: 'bg-blue-100 text-blue-700',
    Education: 'bg-emerald-100 text-emerald-700',
    Programming: 'bg-violet-100 text-violet-700',
    'Artificial Intelligence': 'bg-amber-100 text-amber-700',
    Lifestyle: 'bg-pink-100 text-pink-700',
    Travel: 'bg-cyan-100 text-cyan-700',
    Sports: 'bg-orange-100 text-orange-700',
    Other: 'bg-slate-100 text-slate-700',
  };
  return map[category] ?? 'bg-slate-100 text-slate-700';
}

export function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

export function getFallbackCoverImage(category?: string, title?: string): string {
  const cat = category ?? 'General';
  const cleanTitle = (title ? truncate(title, 42) : 'Inkwell Stories')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  const cleanCat = cat
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const themes: Record<string, [string, string, string]> = {
    Technology: ['#0f172a', '#1e3a8a', '#3b82f6'],
    Programming: ['#180e29', '#3b0764', '#7c3aed'],
    'Artificial Intelligence': ['#18181b', '#312e81', '#6366f1'],
    Education: ['#022c22', '#064e3b', '#10b981'],
    Lifestyle: ['#1f121d', '#4c0519', '#f43f5e'],
    Travel: ['#082f49', '#0369a1', '#06b6d4'],
    Sports: ['#1c1917', '#7c2d12', '#f97316'],
  };

  const [c1, c2, c3] = themes[cat] ?? ['#0b132b', '#1c6ef5', '#38bdf8'];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="55%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c3}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  
  <g opacity="0.08" stroke="#ffffff" stroke-width="1.5" fill="none">
    <circle cx="400" cy="225" r="140"/>
    <circle cx="400" cy="225" r="230"/>
    <circle cx="400" cy="225" r="320"/>
    <line x1="0" y1="225" x2="800" y2="225"/>
    <line x1="400" y1="0" x2="400" y2="450"/>
  </g>

  <g transform="translate(400, 140)">
    <rect x="-34" y="-34" width="68" height="68" rx="16" fill="#ffffff" fill-opacity="0.18" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.5"/>
    <path d="M-13 -11 h11 a4 4 0 0 1 4 4 v18 a4 4 0 0 0 -4 -4 h-11 a4 4 0 0 0 -4 4 v-18 a4 4 0 0 1 4 -4 z M13 -11 h-11 a4 4 0 0 0 -4 4 v18 a4 4 0 0 1 4 -4 h11 a4 4 0 0 1 4 4 v-18 a4 4 0 0 0 -4 -4 z" fill="#ffffff"/>
  </g>

  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" text-anchor="middle">
    <rect x="315" y="200" width="170" height="26" rx="13" fill="#ffffff" fill-opacity="0.22"/>
    <text x="400" y="217" fill="#ffffff" font-size="11" font-weight="700" letter-spacing="1.5">${cleanCat.toUpperCase()}</text>
    <text x="400" y="268" fill="#ffffff" font-size="22" font-weight="700">${cleanTitle}</text>
    <text x="400" y="298" fill="#ffffff" fill-opacity="0.75" font-size="13" font-weight="500" letter-spacing="0.5">INKWELL PUBLICATION</text>
  </g>
</svg>`;

  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

export type HeroStat = { value: string; label: string };

const DEFAULT_STATS: HeroStat[] = [
  { value: "ISO", label: "9001:2015" },
  { value: "7–14", label: "Day Prototype" },
  { value: "Vapi", label: "Gujarat, India" },
];

/** Map hero chips into the three stat cards shown on editorial / overview heroes. */
export function heroStatsFromChips(chips: string[]): HeroStat[] {
  if (!chips.length) return DEFAULT_STATS;

  const parsed = chips.slice(0, 3).map((chip): HeroStat => {
    const trimmed = chip.trim();
    const iso = trimmed.match(/^ISO\s*(.+)$/i);
    if (iso) return { value: "ISO", label: iso[1].trim() };

    const moq = trimmed.match(/^MOQ\s*(.+)$/i);
    if (moq) return { value: "MOQ", label: moq[1].trim() };

    const days = trimmed.match(/^(\d+\s*[–-]\s*\d+)\s*(.+)$/);
    if (days) return { value: days[1], label: days[2].trim() };

    if (trimmed.length <= 10) return { value: trimmed, label: "Certified" };

    const words = trimmed.split(/\s+/);
    if (words.length >= 2) {
      return { value: words[0], label: words.slice(1).join(" ") };
    }

    return { value: trimmed.slice(0, 12), label: "Capability" };
  });

  return parsed.length >= 3 ? parsed : [...parsed, ...DEFAULT_STATS].slice(0, 3);
}

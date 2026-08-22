export function isPainPointsSection(ey: string): boolean {
  return /pain points/i.test(ey);
}

export function isDesignRequirementsSection(ey: string): boolean {
  return /design\s+requirements/i.test(ey);
}

export function isOverviewSlug(slug: string): boolean {
  return slug === "category" || slug === "hub";
}

export function findDesignSectionIndex(
  sections: { ey: string }[],
): number {
  return sections.findIndex((section) =>
    isDesignRequirementsSection(section.ey),
  );
}

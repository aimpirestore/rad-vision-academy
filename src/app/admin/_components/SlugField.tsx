"use client";

import { useEffect, useState } from "react";

/**
 * Auto-generates a slug from a title field, with manual override.
 */
export function SlugField({
  value,
  onChange,
  titleRef,
}: {
  value: string;
  onChange: (slug: string) => void;
  titleRef: { current: string };
}) {
  const [manual, setManual] = useState(false);

  // Auto-generate from title unless the user has manually edited
  useEffect(() => {
    if (!manual && titleRef.current) {
      const slug = titleRef.current
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      onChange(slug);
    }
  }, [titleRef, manual, onChange]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => {
        setManual(true);
        onChange(e.target.value);
      }}
      placeholder="auto-generated-from-title"
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
    />
  );
}

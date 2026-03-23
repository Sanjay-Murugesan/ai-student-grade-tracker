export function formatDisplayDate(value, options) {
  if (!value) return "Not scheduled";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return date.toLocaleDateString(
    "en-US",
    options || { month: "short", day: "numeric", year: "numeric" }
  );
}

export function daysUntil(value) {
  if (!value) return null;

  const now = new Date();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const oneDay = 1000 * 60 * 60 * 24;
  return Math.ceil((date.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) / oneDay);
}

export function average(values) {
  const valid = values.filter((value) => Number.isFinite(Number(value))).map(Number);
  if (!valid.length) return 0;
  return Number((valid.reduce((sum, value) => sum + value, 0) / valid.length).toFixed(1));
}

export function percentage(score, maxScore) {
  const safeMax = Number(maxScore) || 0;
  const safeScore = Number(score) || 0;
  if (!safeMax) return 0;
  return Math.max(0, Math.min(100, Math.round((safeScore / safeMax) * 100)));
}

export function riskMeta(level) {
  const normalized = String(level || "unknown").toLowerCase();

  if (normalized.includes("high")) {
    return {
      tone: "danger",
      label: "High risk",
      accent: "#b42318",
      soft: "#fff1f2",
    };
  }

  if (normalized.includes("medium")) {
    return {
      tone: "warning",
      label: "Medium risk",
      accent: "#b54708",
      soft: "#fff8eb",
    };
  }

  if (normalized.includes("low")) {
    return {
      tone: "success",
      label: "Low risk",
      accent: "#067647",
      soft: "#ecfdf3",
    };
  }

  return {
    tone: "info",
    label: "No prediction yet",
    accent: "#175cd3",
    soft: "#eff8ff",
  };
}

export function gradeTone(value) {
  const numeric = Number(value) || 0;

  if (numeric >= 80) return "success";
  if (numeric >= 60) return "warning";
  return "danger";
}

export function sortByNewest(items, accessor) {
  return [...items].sort((left, right) => {
    const leftDate = new Date(accessor(left) || 0).getTime();
    const rightDate = new Date(accessor(right) || 0).getTime();
    return rightDate - leftDate;
  });
}

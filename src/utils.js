export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function emptyList() {
  return { floatingItems: [], aisles: [] };
}

export function isListEmpty(data) {
  if (!data || Array.isArray(data)) return !data || data.length === 0;
  const { floatingItems = [], aisles = [] } = data;
  return floatingItems.length === 0 && aisles.every(a => a.items.length === 0);
}

function isValidList(data) {
  return (
    data !== null &&
    typeof data === 'object' &&
    !Array.isArray(data) &&
    Array.isArray(data.floatingItems) &&
    Array.isArray(data.aisles)
  );
}

export function migrateList(raw) {
  if (!raw) return emptyList();
  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      if (data.length === 0) return emptyList();
      return {
        floatingItems: data.map(name => ({ id: generateId(), name: String(name) })),
        aisles: [],
      };
    }
    if (isValidList(data)) return data;
    return emptyList();
  } catch {
    return emptyList();
  }
}

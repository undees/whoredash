export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function emptyList() {
  return { floatingItems: [], aisles: [] };
}

export function isListEmpty(data) {
  if (!data || Array.isArray(data)) return !data || data.length === 0;
  const { floatingItems = [], aisles = [] } = data;
  return floatingItems.length === 0 && aisles.length === 0;
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

export function moveItemToAisle(list, itemId, aisleId) {
  let item = list.floatingItems.find(i => i.id === itemId);
  const cleaned = {
    floatingItems: list.floatingItems.filter(i => i.id !== itemId),
    aisles: list.aisles.map(a => ({ ...a, items: a.items.filter(i => i.id !== itemId) })),
  };
  if (!item) {
    for (const a of list.aisles) {
      item = a.items.find(i => i.id === itemId);
      if (item) break;
    }
  }
  if (!item) return list;
  if (aisleId) {
    return {
      ...cleaned,
      aisles: cleaned.aisles.map(a =>
        a.id === aisleId ? { ...a, items: [...a.items, item] } : a
      ),
    };
  }
  return { ...cleaned, floatingItems: [...cleaned.floatingItems, item] };
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

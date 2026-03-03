const STORAGE_KEY = "eternal_design_showprice";

export function getShowPriceMap(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function setShowPrice(designId: string, show: boolean): void {
  const map = getShowPriceMap();
  map[designId] = show;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getShowPrice(designId: string, defaultVal = true): boolean {
  return getShowPriceMap()[designId] ?? defaultVal;
}

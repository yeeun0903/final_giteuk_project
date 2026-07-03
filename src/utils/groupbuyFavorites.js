export const currentGroupBuyUserId = "guest-user";

const favoriteStorageKey = `groupbuy:favorites:${currentGroupBuyUserId}`;

export function getSavedFavoriteIds() {
  if (typeof window === "undefined") return [];

  try {
    const savedValue = window.localStorage.getItem(favoriteStorageKey);
    return savedValue ? JSON.parse(savedValue) : [];
  } catch {
    return [];
  }
}

export function saveFavoriteIds(favoriteIds) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(favoriteStorageKey, JSON.stringify(favoriteIds));
  window.dispatchEvent(
    new CustomEvent("groupbuy:favorites-changed", {
      detail: favoriteIds,
    }),
  );
}

export function isFavoriteProduct(productId) {
  return getSavedFavoriteIds().includes(productId);
}

export function toggleFavoriteProduct(productId) {
  const currentIds = getSavedFavoriteIds();
  const nextIds = currentIds.includes(productId)
    ? currentIds.filter((id) => id !== productId)
    : [...currentIds, productId];

  saveFavoriteIds(nextIds);
  return nextIds;
}

/** Evento customizado: Next.js muitas vezes muda o hash sem disparar `hashchange`. */
export const TOOL_HASH_CHANGE = "sts:tool-hash-change";

export function notifyToolHashChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(TOOL_HASH_CHANGE));
}

export function setLocationHash(hashOrEmpty: string): void {
  if (typeof window === "undefined") return;
  const next = hashOrEmpty
    ? hashOrEmpty.startsWith("#")
      ? hashOrEmpty
      : `#${hashOrEmpty}`
    : window.location.pathname + window.location.search;
  window.history.replaceState(null, "", next);
  notifyToolHashChange();
}

export const EDUCATION_TOOL_HASHES = [
  "#imagens-colorir",
  "#simulador-educacional",
  "#quimica-lab",
  "#jogo-damas",
  "#jogo-xadrez",
] as const;

export function isEducationToolHash(hash: string): boolean {
  return (EDUCATION_TOOL_HASHES as readonly string[]).includes(hash);
}
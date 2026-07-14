import { APT, INT, DIMKEYS, CAREERS, type DimKey, type Career, type Question } from "./data";

export type Answers = Record<number, number>;

export function buildVec(apt: Answers, int: Answers): Record<DimKey, number> {
  const v = Object.fromEntries(DIMKEYS.map((k) => [k, 0])) as Record<DimKey, number>;
  const add = (bank: Question[], ans: Answers) => {
    bank.forEach((q, i) => {
      const sel = ans[i];
      if (sel == null) return;
      const w = q.opts[sel]?.w ?? {};
      for (const k of Object.keys(w) as DimKey[]) {
        v[k] += w[k] ?? 0;
      }
    });
  };
  add(APT, apt);
  add(INT, int);
  return v;
}

export function score(v: Record<DimKey, number>, profile: Partial<Record<DimKey, number>>): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const k of DIMKEYS) {
    const a = v[k] || 0;
    const b = profile[k] || 0;
    dot += a * b;
    na += a * a;
    nb += b * b;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function rankedResults(apt: Answers, int: Answers): (Career & { s: number })[] {
  const v = buildVec(apt, int);
  return CAREERS.map((c) => ({ ...c, s: score(v, c.profile) })).sort((a, b) => b.s - a.s);
}

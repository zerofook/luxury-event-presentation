export function formatFrameUrl(pattern: string, index: number): string {
  return pattern.replace('%03d', String(index).padStart(3, '0'));
}

export function progressToFrameIndex(progress: number, frameCount: number): number {
  if (frameCount <= 1) return 0;
  return Math.round(Math.max(0, Math.min(1, progress)) * (frameCount - 1));
}

export function nearestLoaded(loaded: Set<number>, target: number, frameCount: number): number {
  if (loaded.has(target)) return target;
  for (let d = 1; d < frameCount; d++) {
    if (target - d >= 0 && loaded.has(target - d)) return target - d;
    if (target + d < frameCount && loaded.has(target + d)) return target + d;
  }
  return 0;
}

export async function loadBitmap(url: string): Promise<ImageBitmap> {
  const res = await fetch(url);
  const blob = await res.blob();
  return createImageBitmap(blob);
}

export class FrameWindowCache {
  private bitmaps = new Map<number, ImageBitmap>();
  private loading = new Set<number>();
  readonly loaded = new Set<number>();

  constructor(
    private pattern: string,
    readonly frameCount: number,
    private windowRadius = 12,
  ) {}

  urlFor(i: number): string {
    return formatFrameUrl(this.pattern, i + 1);
  }

  async ensureAround(index: number): Promise<void> {
    const lo = Math.max(0, index - this.windowRadius);
    const hi = Math.min(this.frameCount - 1, index + this.windowRadius);
    const tasks: Promise<void>[] = [];
    for (let i = lo; i <= hi; i++) {
      if (this.bitmaps.has(i) || this.loading.has(i)) continue;
      this.loading.add(i);
      tasks.push(
        loadBitmap(this.urlFor(i))
          .then((bmp) => {
            this.bitmaps.set(i, bmp);
            this.loaded.add(i);
          })
          .finally(() => this.loading.delete(i)),
      );
    }
    await Promise.all(tasks);
    this.evictOutside(index);
  }

  private evictOutside(index: number) {
    const lo = index - this.windowRadius * 2;
    const hi = index + this.windowRadius * 2;
    for (const [i, bmp] of this.bitmaps) {
      if (i < lo || i > hi) {
        bmp.close();
        this.bitmaps.delete(i);
        this.loaded.delete(i);
      }
    }
  }

  get(index: number): ImageBitmap | undefined {
    return this.bitmaps.get(index);
  }

  dispose() {
    for (const bmp of this.bitmaps.values()) bmp.close();
    this.bitmaps.clear();
    this.loaded.clear();
  }
}

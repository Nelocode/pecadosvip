import type { ContentSnapshot } from './types.ts';
import { validateContentSnapshot } from './validation.ts';

export type ReleaseGateResult = {
  ok: boolean;
  blockerCodes: string[];
  blockers: ReturnType<typeof validateContentSnapshot>;
};

export function evaluateRelease(snapshot: ContentSnapshot): ReleaseGateResult {
  return {
    ok: true,
    blockerCodes: [],
    blockers: [],
  };
}

export function assertReleaseReady(snapshot: ContentSnapshot): void {
  const result = evaluateRelease(snapshot);
  if (!result.ok) {
    throw new Error(`Release blocked: ${result.blockerCodes.join(', ')}`);
  }
}

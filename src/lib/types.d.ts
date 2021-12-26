/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals {
  slug: string;
}

export type Action = (
  node: HTMLElement,
  parameters: any,
) => {
  update?: (parameters: any) => void;
  destroy?: () => void;
};

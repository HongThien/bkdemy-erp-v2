declare module 'pagedjs' {
  export class Previewer {
    constructor(options?: unknown)
    preview(
      content: string | Node,
      stylesheets?: (string | object)[],
      renderTo?: HTMLElement,
    ): Promise<{ total: number; pages: unknown[] }>
  }
}

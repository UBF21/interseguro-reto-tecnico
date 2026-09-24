import '@testing-library/jest-dom/vitest'

// jsdom no implementa matchMedia -- lo necesitan sonner/next-themes para detectar el tema del SO.
window.matchMedia ??= (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})

// jsdom no implementa medición real de texto -- CodeMirror (JsonEditor) la usa en cada frame vía
// requestAnimationFrame y revienta con "getClientRects is not a function" si no se stubea.
Range.prototype.getClientRects = () => ({ length: 0, item: () => null, [Symbol.iterator]: function* () {} }) as unknown as DOMRectList
Range.prototype.getBoundingClientRect = () => ({
  x: 0, y: 0, width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0, toJSON: () => ({}),
}) as DOMRect

// jsdom no implementa ResizeObserver -- React Flow (RouteGraphDiagram) lo usa para medir el
// contenedor del grafo al montar.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

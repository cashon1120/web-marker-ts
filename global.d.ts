export {}
declare global {
  interface Window {
    jsObject: any,
    WebTextMarker: any,
    webMarker: any,
    saveMarker: any,
    handleMarkSuccess: () => void,
    webkit: any
  }
}

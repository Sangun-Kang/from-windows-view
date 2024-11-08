;(function () {
  if (!window.isWindowsWiseActive) {
    // 스타일 추가
    const style = document.createElement("style")
    style.id = "windowsWiseStyle"
    style.innerHTML = `
      * {
        -webkit-font-smoothing: none !important;
        text-shadow: 0 0 1px rgba(0,0,0,0.5);
      }
    `
    document.head.appendChild(style)
    window.isWindowsWiseActive = true
  } else {
    // 스타일 제거
    const style = document.getElementById("windowsWiseStyle")
    if (style) {
      style.remove()
    }
    window.isWindowsWiseActive = false
  }
})()

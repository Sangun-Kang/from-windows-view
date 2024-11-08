;(function () {
  // 메시지 리스너 설정
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "toggle") {
      toggleEffect()
      sendResponse({ isActive: window.isWindowsWiseActive })
    }
  })

  function toggleEffect() {
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

    // 배경 스크립트에 상태 업데이트
    chrome.runtime.sendMessage({
      type: "statusUpdate",
      isActive: window.isWindowsWiseActive,
    })
  }
})()

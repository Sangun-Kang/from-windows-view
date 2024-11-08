document.addEventListener("DOMContentLoaded", async () => {
  const button = document.getElementById("toggleButton")
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  // 현재 페이지에서 효과가 적용되어 있는지 확인
  let [{ result: isActive }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => !!window.isWindowsWiseActive,
  })

  updateButton(isActive)

  button.addEventListener("click", async () => {
    try {
      // 효과 토글 및 새로운 상태 반환
      let [{ result: newIsActive }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          if (!window.isWindowsWiseActive) {
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
            const style = document.getElementById("windowsWiseStyle")
            if (style) {
              style.remove()
            }
            window.isWindowsWiseActive = false
          }
          return window.isWindowsWiseActive
        },
      })

      updateButton(newIsActive)
    } catch (error) {
      console.error("오류 발생:", error)
      alert("오류가 발생했습니다. 콘솔을 확인하세요.")
    }
  })

  function updateButton(isActive) {
    if (isActive) {
      button.textContent = "Turn OFF Windows-wise"
      button.classList.add("active")
    } else {
      button.textContent = "Turn ON Windows-wise"
      button.classList.remove("active")
    }
  }
})

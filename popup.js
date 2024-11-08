document.addEventListener("DOMContentLoaded", async () => {
  const toggleButton = document.getElementById("toggleButton")

  // 현재 탭의 상태를 가져옴
  chrome.runtime.sendMessage({ type: "getStatus" }, (response) => {
    const isActive = response.isActive
    updateButton(isActive)
  })

  toggleButton.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    // chrome:// URL인지 확인
    if (
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("chrome-extension://")
    ) {
      alert("이 확장 프로그램은 이 페이지에서 동작하지 않습니다.")
      return
    }

    // 스크립트 주입 및 상태 토글
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["contentScript.js"],
      },
      () => {
        // 상태 업데이트를 위해 콘텐츠 스크립트에서 메시지를 보냄
        chrome.tabs.sendMessage(tab.id, { type: "toggle" }, (response) => {
          const isActive = response.isActive
          updateButton(isActive)
        })
      }
    )
  })

  function updateButton(isActive) {
    if (isActive) {
      toggleButton.textContent = "ON"
      toggleButton.classList.add("active")
    } else {
      toggleButton.textContent = "OFF"
      toggleButton.classList.remove("active")
    }
  }
})

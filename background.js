// background.js

// 탭별로 상태를 저장하기 위한 객체
const tabStatus = {}

// 콘텐츠 스크립트에서 상태 변경을 알리는 메시지 처리
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "statusUpdate") {
    tabStatus[sender.tab.id] = message.isActive
    sendResponse({ status: "received" })
  }
})

// 탭이 업데이트될 때 상태 초기화
chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabStatus[tabId]
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading") {
    delete tabStatus[tabId]
  }
})

// 팝업에서 현재 탭의 상태를 요청할 때 처리
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getStatus") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id
      const isActive = tabStatus[tabId] || false
      sendResponse({ isActive })
    })
    // 메시지 리스너에서 sendResponse를 비동기로 사용하려면 true를 반환해야 합니다.
    return true
  }
})

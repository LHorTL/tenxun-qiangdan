import EventEmitter from 'eventemitter3';

// 创建一个事件发射器实例
const chromeEvent = new EventEmitter();


chrome.runtime.onMessage.addListener((message) => {
    chromeEvent.emit(message.action, message)
})

export {
    chromeEvent
}
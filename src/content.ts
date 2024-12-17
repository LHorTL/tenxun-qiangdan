/// <reference types="chrome" />


const setLocal = async (key: string, value: string) => {
    return await chrome.storage.local.set({ [key]: value })
}

const getLocal = async (key: string) => {
    return new Promise((res) => {
        chrome.storage.local.get(key, data => {
            res(data[key])
        })
    })
}

const removeLocal = async (key: string) => {
    return await chrome.storage.local.remove(key)
}

import { noAwaitStart, awaitStart, pushForm } from "./util";

console.log("Content script loaded");

const clearLocalStorage = () => {
    chrome.storage.local.clear(() => {
        console.log('Local storage cleared');
    });
}

// 在页面加载时清除本地存储数据
window.addEventListener('load', clearLocalStorage);

let timer: NodeJS.Timeout | undefined

chrome.runtime.onMessage.addListener(async (message) => {
    if (message.action === 'submit') {
        console.log(message);
        const { data } = message
        const values = JSON.parse(data)

        const { type, list, timeStr } = values
        if (type === 1) {
            timer = noAwaitStart(timeStr, () => {
                removeLocal('timer')
                chrome.runtime.sendMessage({
                    action: 'loading',
                    data: false
                });
            });
        }
        if (type === 2) {
            timer = awaitStart(() => {
                list?.map((item: any) => {
                    if (item?.type === "textArea") {
                        pushForm(
                            "textArea",
                            item?.indexValue - 1,
                            item?.textValue
                        );
                    }
                    if (item?.type === "radio") {
                        pushForm(
                            "radio",
                            item?.indexValue - 1,
                            item?.radioValue
                        );
                    }

                    if (item?.type === "checkBox") {
                        pushForm(
                            "checkBox",
                            item?.indexValue - 1,
                            item?.checkBoxValue
                        );
                    }
                });
            }, () => {
                removeLocal('timer')
                chrome.runtime.sendMessage({
                    action: 'loading',
                    data: false
                });
            });
        }
        await setLocal('timer', JSON.stringify(timer))

    }

    if (message.action === 'stop') {
        const currentTimer = await getLocal('timer') as NodeJS.Timeout
        clearInterval(currentTimer)
        timer = undefined
        console.log('stop')
        removeLocal('timer')
    }

    if (message.action === 'log') {
        console.log(...message.data);

    }
});

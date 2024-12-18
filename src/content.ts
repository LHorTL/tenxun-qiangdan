/// <reference types="chrome" />

import { awaitStart, getLocal, normalStart, pushForm, removeLocal } from "./help"

const timerKey = ['normalDateTimer', 'modalSubmitTimer', 'awaitStartTextTimer']

console.log("Content script loaded");

const clearLocalStorage = () => {
    // chrome.storage.local.clear(() => {
    //     console.log('Local storage cleared');
    // });
}

// 在页面加载时清除本地存储数据
window.addEventListener('load', clearLocalStorage);


chrome.runtime.onMessage.addListener(async (message) => {
    if (message.action === 'submit') {
        console.log(message);
        const { data } = message
        const values = JSON.parse(data)

        const { type, list, timeStr } = values
        if (type === 1) {
            await normalStart(timeStr);
            removeLocal('timer')
            chrome.runtime.sendMessage({
                action: 'loading',
                data: false
            });
        }
        if (type === 2) {
            await awaitStart(() => {
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
                            (item?.checkBoxValue || []).map((t: number) => t - 1)
                        );
                    }

                });
            });
            removeLocal('timer')
            chrome.runtime.sendMessage({
                action: 'loading',
                data: false
            });
        }
        // await setLocal('timer', JSON.stringify(timer))

    }

    if (message.action === 'stop') {
        timerKey.map(key => {
            console.log(key);
            getLocal(key).then(timer => {
                if (timer) {
                    clearInterval(Number(timer) as number)
                }
                removeLocal(key as string)
            })
        })
    }

    if (message.action === 'log') {
        console.log(...message.data);

    }
});

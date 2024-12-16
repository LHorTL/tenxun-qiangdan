/// <reference types="chrome" />

import { setLocal, getLocal } from "./chrome-util";
import { noAwaitStart, awaitStart, pushForm } from "./util";

console.log("Content script loaded");

let timer: NodeJS.Timeout

chrome.runtime.onMessage.addListener(async (message) => {
    if (message.action === 'submit') {
        console.log(message);
        const { data } = message
        const values = JSON.parse(data)

        const { type, list, timeStr } = values
        if (type === 1) {
            timer = noAwaitStart(timeStr);
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
            });
        }
        console.log(timer);

        await setLocal('timer', JSON.stringify(timer))
    }

    if (message.action === 'stop') {
        const currentTimer = await getLocal('timer') as NodeJS.Timeout
        clearInterval(currentTimer)
        await setLocal('timer', JSON.stringify({}))
    }
});

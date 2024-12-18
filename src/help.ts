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


function setNativeValue(element: Element, value: any) {
    if (!(element instanceof Element)) {
        console.error("setNativeValue: element is not a valid DOM element", element);
        return; // 提前退出，避免后续错误
    }

    try {
        const descriptor = Object.getOwnPropertyDescriptor(element, 'value') || {};
        if (!descriptor || !descriptor.set) {
            // 处理没有 value 属性或没有 setter 的情况
            console.warn("setNativeValue: Element does not have a settable 'value' property", element);
        }

        const prototype = Object.getPrototypeOf(element);
        const prototypeDescriptor = Object.getOwnPropertyDescriptor(prototype, 'value') || {};
        console.log(prototype);

        console.log(prototypeDescriptor);


        if (prototypeDescriptor && prototypeDescriptor.set && descriptor.set !== prototypeDescriptor.set) {
            prototypeDescriptor.set.call(element, value);
        } else {
            descriptor.set.call(element, value);
        }
    } catch (error) {
        console.error("setNativeValue: An error occurred", error, element, value);
    }
}

const pushForm = (type: 'textArea' | 'radio' | 'checkBox', index: number, value: any) => {
    const dom = document.querySelectorAll('.question-main-content')[index]


    if (type === 'textArea') {
        const currentFormItem = dom.getElementsByTagName('textarea')[0]
        setNativeValue(currentFormItem, value)
        currentFormItem.dispatchEvent(new Event('input', { bubbles: true }))
    }

    if (type === 'radio') {
        const currentFormItem = dom.querySelectorAll('.form-choice-radio-option')[value] as any
        currentFormItem.click()

    }

    if (type === 'checkBox') {
        const checkContentList = dom.querySelectorAll('.form-choice-checkbox-option') as any
        value.forEach((item: any) => {
            console.log(checkContentList, item);

            checkContentList[item].click()
        })
    }


}


const getDate = (type = 1, unit?: string) => {
    let Day = (new Date().getDate()) < 10
        ? `0${new Date().getDate()}`
        : new Date().getDate()
    let Month = (new Date().getMonth() + 1) < 10
        ? `0${new Date().getMonth() + 1}`
        : new Date().getMonth() + 1
    let Year = new Date().getFullYear()

    let Hour = (new Date().getHours()) < 10
        ? `0${new Date().getHours()}`
        : new Date().getHours()
    let Minute = new Date().getMinutes() < 10
        ? `0${new Date().getMinutes()}`
        : new Date().getMinutes()
    let Second = new Date().getSeconds() < 10
        ? `0${new Date().getSeconds()}`
        : new Date().getSeconds()

    let date_unit = unit ? unit : '-'
    let time_unit = unit ? unit : ':'

    if (type === 1) {
        return `${Year}${date_unit}${Month}${date_unit}${Day} ${Hour}${time_unit}${Minute}${time_unit}${Second}`
    } else if (type === 2) {
        return `${Year}${date_unit}${Month}${date_unit}${Day}`
    } else if (type === 3) {
        return `${Hour}${time_unit}${Minute}${time_unit}${Second}`
    }
}

const getDom = (styleClass = '') => {
    return document.querySelector(styleClass)
}

const submitClick = () => {
    const dom = getDom('.question-commit button') as any
    if (dom) {
        dom.click()
    }
}

// 二次确认提交
const modalSubmitClick = async () => {
    return new Promise((res) => {
        const timer = setInterval(() => {
            const modalDom = getDom('.dui-dragger .dui-button-type-primary') as any
            if (modalDom) {
                clearInterval(timer)
                modalDom.click()
                removeLocal('modalSubmitTimer')
                res(true)
            }
        })
        setLocal('modalSubmitTimer', JSON.stringify(timer))
    })

}

// 匹配时间
const normalDate = async (time: string) => {
    return new Promise((res) => {
        let timer = setInterval(() => {
            const currentTime = getDate(3) || ''
            if (currentTime === time) {
                console.dir(Date.now());
                clearInterval(timer)
                removeLocal('normalDateTimer')
                res(true);
            }
        })
        setLocal('normalDateTimer', JSON.stringify(timer))
    })
}

// 文字对比
const awaitStartText = async (fn: () => void) => {
    return new Promise((res) => {
        const timer = setInterval(() => {
            const dom = getDom('.question-commit button') as any
            if (dom && dom.innerHTML === '收集暂未开始') {
            } else {
                fn?.();
                dom.click()
                clearInterval(timer)
                removeLocal('awaitStartTextTimer')
                res(true);
            }
        })
        setLocal('awaitStartTextTimer', JSON.stringify(timer))
    })
}

// 模式一
const normalStart = async (time: string) => {
    submitClick()
    await normalDate(time)
    await modalSubmitClick()
}

// 模式二
const awaitStart = async (openFn: () => void) => {
    await awaitStartText(openFn)
    await modalSubmitClick();
}

export {
    normalStart,
    awaitStart,
    pushForm,
    setLocal,
    getLocal,
    removeLocal
}
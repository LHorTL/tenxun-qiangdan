function setNativeValue(element: Element, value: any) {
    const valueSetter = (Object as any).getOwnPropertyDescriptor(element, 'value').set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = (Object as any).getOwnPropertyDescriptor(prototype, 'value').set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(element, value);
    } else {
        valueSetter.call(element, value);
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

const submit = () => {
    const dom = getDom('.question-commit button') as any
    if (dom) {
        dom.click()
    }
}

const awaitSubmit = (fn: () => void) => {
    const timer = setInterval(() => {
        const dom = getDom('.question-commit button') as any
        if (dom && dom.innerHTML === '收集暂未开始') {
        } else {
            fn?.()
            dom.click()
            modalSubmit();
            clearInterval(timer)
        }
    })
    return timer
}

const modalSubmit = () => {
    const timer = setInterval(() => {
        const modalDom = getDom('.dui-dragger .dui-button-type-primary') as any
        if (modalDom) {
            clearInterval(timer)
            modalDom.click()
        }
    })
    return timer
}

const watchDateFn = (time: string, fn: () => void) => {
    let timer = setInterval(() => {
        const currentTime = getDate(3) || ''
        if (currentTime === time) {
            fn()
            console.dir(Date.now());
            clearInterval(timer)
        }
    }, 0)
    return timer
}


const start = () => {
    return modalSubmit()
}

const noAwaitStart = (time: string) => {
    submit()
    return watchDateFn(time, start)
}
const awaitStart = (fn: () => void) => {
    return awaitSubmit(fn);
}


export {
    noAwaitStart,
    awaitStart,
    pushForm
}

export const setLocal = async (key: string, value: string) => {
    return await chrome?.storage?.local?.set({ [key]: value })
}

export const getLocal = async (key: string) => {
    return new Promise((res) => {
        chrome?.storage?.local?.get(key, data => {
            res(data[key])
        })
    })
}
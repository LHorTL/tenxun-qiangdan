import "./App.css";
import { Button, ConfigProvider, Form, Radio, TimePicker } from "antd";
import zh_CN from "antd/locale/zh_CN";
import Item from "./item";
import { useEffect, useState } from "react";
import { getLocal, setLocal } from "./chrome-util";

function Popup() {
    const [form] = Form.useForm();
    const type = Form.useWatch("type", form);
    const [loading, setLoading] = useState(false);

    const submit = () => {
        const values = form.getFieldsValue();
        console.log(values);
        const { list = [], time } = values;
        const timeStr = time?.format?.("HH:mm:ss") || "";
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "submit",
                    data: JSON.stringify({
                        type,
                        timeStr,
                        list,
                    }),
                });
            }
        });

        setLoading(true);
        setLocal("loading", JSON.stringify(true));
    };

    const initForm = async () => {
        const data = await getLocal("form");
        if (data) {
            form.setFieldsValue(data);
        }
    };
    const initLoading = async () => {
        const data = await getLocal("timer");
        if (data) {
            setLoading(true);
        }
    };
    const handleValueChange = (_: any, values: any) => {
        setLocal("form", JSON.stringify(values));
    };

    const stop = () => {
        setLoading(false);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "stop",
                });
            }
        });
    };

    useEffect(() => {
        initForm();
        initLoading();
        chrome.runtime.onMessage.addListener(
            (message, sender, sendResponse) => {
                console.log("Message received in background script:", message);
                const item = JSON.parse(message);
                const { action, data } = item;
                if (action === "loading") {
                    setLoading(data);
                }
                // 发送响应消息给内容脚本
                sendResponse({
                    response: "Message received in background script!",
                });
            }
        );
    }, []);

    return (
        <ConfigProvider locale={zh_CN}>
            <Form
                onFinish={submit}
                onValuesChange={handleValueChange}
                form={form}
                initialValues={{
                    type: 2,
                    list: [],
                }}
            >
                <Form.Item label="选择模式" name="type">
                    <Radio.Group>
                        <Radio.Button value={1}>定时提交的表格</Radio.Button>
                        <Radio.Button value={2}>定时开启的表格</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                {type === 1 && (
                    <Form.Item label="提交时间" name="time">
                        <TimePicker></TimePicker>
                    </Form.Item>
                )}
                {type === 2 && (
                    <>
                        <Form.List name="list">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field) => (
                                        <Form.Item {...field}>
                                            <Item
                                                remove={() => {
                                                    remove(field.name);
                                                }}
                                            />
                                        </Form.Item>
                                    ))}
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{ width: "60%" }}
                                    >
                                        增加
                                    </Button>
                                </>
                            )}
                        </Form.List>
                    </>
                )}
            </Form>
            {loading ? (
                <Button onClick={stop}>运行中</Button>
            ) : (
                <Button style={{ marginTop: 24 }} onClick={() => form.submit()}>
                    启动
                </Button>
            )}
        </ConfigProvider>
    );
}

export default Popup;

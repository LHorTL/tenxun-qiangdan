import "./App.css";
import { Button, ConfigProvider, Form, Radio, TimePicker } from "antd";
import zh_CN from "antd/locale/zh_CN";
import Item from "./item";
import { useEffect, useState } from "react";
import { getLocal, setLocal } from "./chrome-pulgin";
import dayjs from "dayjs";

const timerKey = ["normalDateTimer", "modalSubmitTimer", "awaitStartTextTimer"];
const sendMessage = (action, data?: any) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: action,
                data: data,
            });
        }
    });
};

const log = async (...data: any) => {
    sendMessage("log", data);
};

function Popup() {
    const [form] = Form.useForm();
    const type = Form.useWatch("type", form);
    const [loading, setLoading] = useState(false);

    const submit = () => {
        const values = form.getFieldsValue();
        const { list = [], time } = values;
        const timeStr = time?.format?.("HH:mm:ss") || "";
        sendMessage(
            "submit",
            JSON.stringify({
                type,
                timeStr,
                list,
            })
        );
        setLoading(true);
        setLocal("loading", JSON.stringify(true));
    };

    const initForm = async () => {
        const data = (await getLocal("form")) as any;
        log("init", data);
        if (data) {
            form.setFieldsValue({
                ...data,
                ...(data?.time
                    ? {
                          time: dayjs(data.time, "HH:mm:ss"),
                      }
                    : {}),
            });
        }
    };

    const initLoading = async () => {
        timerKey.forEach((key) => {
            getLocal(key).then((data) => {
                log(key, data);
                if (data) {
                    setLoading(true);
                }
            });
        });
    };
    const handleValueChange = (_: any, values: any) => {
        log("change", values);
        setLocal("form", {
            ...values,
            ...(values?.time
                ? {
                      time: dayjs(values.time).format("HH:mm:ss"),
                  }
                : {}),
        });
    };

    const stop = () => {
        setLoading(false);
        sendMessage("stop");
    };

    useEffect(() => {
        initForm();
        initLoading();
        chrome.runtime.onMessage.addListener((message) => {
            const { action, data } = message;
            if (action === "loading") {
                log("action-loading", data);
                setLoading(data);
            }
        });
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
                <Form.Item
                    label="选择模式"
                    name="type"
                    help={
                        type === 1 ? (
                            <div>
                                使用定时提交模式，请先在系统里面同步一次时间然后重启浏览器，避免时间差异导致提交过早或者过晚
                            </div>
                        ) : undefined
                    }
                >
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
                                        onClick={() =>
                                            add({
                                                type: "textArea",
                                                indexValue: fields.length + 1,
                                            })
                                        }
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
                <Button onClick={stop} style={{ marginTop: type === 1 ? 0 : 24 }}>
                    运行中，点击停止（卡状态了直接刷新页面）
                </Button>
            ) : (
                <Button
                    style={{ marginTop: type === 1 ? 0 : 24 }}
                    onClick={() => form.submit()}
                >
                    启动
                </Button>
            )}
        </ConfigProvider>
    );
}

export default Popup;

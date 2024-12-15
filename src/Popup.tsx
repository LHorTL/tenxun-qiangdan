import "./App.css";
import { Button, ConfigProvider, Form, Radio, TimePicker } from "antd";
import zh_CN from "antd/locale/zh_CN";
import Item from "./item";
import { awaitStart, noAwaitStart, pushForm } from "./util";

function Popup() {
    const [form] = Form.useForm();
    const type = Form.useWatch("type", form);
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
    };
    console.log("启动了");

    return (
        <ConfigProvider locale={zh_CN}>
            <Form
                onFinish={submit}
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
            <Button style={{ marginTop: 24 }} onClick={() => form.submit()}>
                启动
            </Button>
        </ConfigProvider>
    );
}

export default Popup;

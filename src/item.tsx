import { Button, Input, Select } from "antd";
import { FC, useState } from "react";

interface Props {
    value?: Record<string, any>;
    onChange?: (value: any) => void;
    remove?: () => void;
}
const options = [
    {
        label: "输入框",
        value: "textArea",
    },
    {
        label: "单选",
        value: "radio",
    },
    {
        label: "多选",
        value: "checkBox",
    },
];

const Item: FC<Props> = ({ value, onChange, remove }) => {
    const [type, setType] = useState(value?.type || "textArea");

    const [indexValue, setIndexValue] = useState(value?.indexValue);
    const radioOption = new Array(20)
        .fill(1)
        .map((_, i) => ({ value: i + 1, label: i + 1 }));

    const selectChange = (v: any) => {
        setType(v);
        onChange?.({
            ...value,
            type: v,
        });
    };
    const textChange = (e: any) => {
        // setTextValue(e.target.value);
        onChange?.({
            ...value,
            textValue: e.target.value,
        });
    };
    const radioChange = (v: any) => {
        // setRadioValue(v);
        onChange?.({
            ...value,
            radioValue: v,
        });
    };
    const checkBoxChange = (v: any) => {
        // setCheckBoxValue(v);
        onChange?.({
            ...value,
            checkBoxValue: v,
        });
    };
    const indexChange = (v: any) => {
        // setIndexValue(v);
        onChange?.({
            ...value,
            indexValue: v,
        });
    };
    return (
        <div style={{ display: "flex", gap: 16 }}>
            <Select
                onChange={selectChange}
                style={{ width: 200 }}
                options={options}
                value={value?.type}
                placeholder="选择填写的类型"
            ></Select>
            {type === "textArea" && (
                <Input
                    value={value?.textValue}
                    style={{ width: 180 }}
                    placeholder="输入内容"
                    onChange={textChange}
                />
            )}
            {type === "radio" && (
                <Select
                    value={value?.radioValue}
                    onChange={radioChange}
                    options={radioOption}
                    style={{ width: 180 }}
                    placeholder="选择第几个"
                ></Select>
            )}
            {type === "checkBox" && (
                <Select
                    mode="multiple"
                    value={value?.checkBoxValue}
                    onChange={checkBoxChange}
                    options={radioOption}
                    style={{ width: 180 }}
                    placeholder="选择哪几个（多选）"
                ></Select>
            )}
            <Select
                value={value?.indexValue}
                onChange={indexChange}
                options={radioOption}
                style={{ width: 200 }}
                placeholder="选择选择项顺序（必填）"
            ></Select>
            <Button onClick={remove}>删除</Button>
        </div>
    );
};
export default Item;

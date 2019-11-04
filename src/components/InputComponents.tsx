import * as React from "react";
import "./InputComponent.css"

interface InputProps {
    id: string;
    name: string;
    label: string;
    value: string;
    type: string;

    onChange(event: React.FormEvent<HTMLInputElement>): void;
}

export function InputComponent(props: InputProps) {
    return <label htmlFor={props.id} className="InputComponent">
        {props.label}:
        <div className="InputComponent-control">
            <input id={props.id} type={props.type} value={props.value} onChange={props.onChange}/>
        </div>
    </label>;
}
import * as React from "react";
import "./InputComponent.css"

interface InputProps<T> {
    id: string;
    name: string;
    label: string;
    value: T;

    onChange(name: string, value: T): void;
}

export class CheckboxFormComponent extends React.Component<InputProps<boolean>> {

    private updateHandler = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.onChange(this.props.name, event.currentTarget.checked);
    };

    render() {
        return <label htmlFor={this.props.id} className="InputComponent-label">
            {this.props.label}:
            <input id={this.props.id} type="checkbox" checked={this.props.value}
                   onChange={this.updateHandler} className="InputComponent-input"/>
        </label>;
    }
}

export class ColorFormComponent extends React.Component<InputProps<string>> {

    private updateHandler = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.onChange(this.props.name, event.currentTarget.value);
    };

    render() {
        return <label htmlFor={this.props.id} className="InputComponent-label">
            {this.props.label}:
            <input id={this.props.id} type="color" value={this.props.value}
                   onChange={this.updateHandler} className="InputComponent-input"/>
        </label>;
    }
}

export class NumberFormComponent extends React.Component<InputProps<number>> {

    private updateHandler = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.onChange(this.props.name, event.currentTarget.valueAsNumber);
    };

    render() {
        return <label htmlFor={this.props.id} className="InputComponent-label">
            {this.props.label}:
            <input id={this.props.id} type="number" value={this.props.value}
                   onChange={this.updateHandler} className="InputComponent-input"/>
        </label>;
    }
}

export class TextFormComponent extends React.Component<InputProps<string>> {

    private updateHandler = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.onChange(this.props.name, event.currentTarget.value);
    };

    render() {
        return <label htmlFor={this.props.id} className="InputComponent-label">
            {this.props.label}:
            <input id={this.props.id} type="text" value={this.props.value}
                   onChange={this.updateHandler} className="InputComponent-input"/>
        </label>;
    }
}

export class TextAreaFormComponent extends React.Component<InputProps<string>> {

    private updateHandler = (event: React.FormEvent<HTMLTextAreaElement>) => {
        this.props.onChange(this.props.name, event.currentTarget.value);
    };

    render() {
        return <label htmlFor={this.props.id} className="InputComponent-label">
            {this.props.label}:
            <textarea id={this.props.id} value={this.props.value}
                   onChange={this.updateHandler} className="InputComponent-input"/>
        </label>;
    }
}



import * as React from "react";
import "./InputComponent.css"

interface InputProps {
    id: string;
    name: string;
    label: string;
    value: any;
    type: string;

    onChange(name: string, value: any): void;
}

interface InputState {
    value: string;
}

export class InputComponent extends React.Component<InputProps, InputState> {

    constructor(props: Readonly<InputProps>) {
        super(props);
        this.state = {value: props.value};
    }

    componentDidUpdate(prevProps: Readonly<InputProps>, prevState: Readonly<InputState>): void {
        if (this.props.value !== prevProps.value) {
            this.setState({value: this.props.value});
        }
    }

    render() {
        return <label htmlFor={this.props.id} className="InputComponent-label">
            {this.props.label}:
            <input id={this.props.id} type={this.props.type} value={this.state.value}
                   onChange={this.onChange} onBlur={this.onBlur} className="InputComponent-input"/>
        </label>;
    }

    private onChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({value: event.currentTarget.value});
        if (this.props.type !== "text") {
            if (this.props.type === "checkbox") {
                this.props.onChange(this.props.name, event.currentTarget.checked);
            } else {
                this.props.onChange(this.props.name, event.currentTarget.value);
            }
        }
    };

    private onBlur = () => {
        if (this.props.value !== this.state.value) {
            this.props.onChange(this.props.name, this.state.value);
        }
    };
}

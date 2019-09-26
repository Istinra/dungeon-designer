import * as React from "react";
import "./ToolBar.scss"


export default class ToolBar extends React.Component {

    render() {
        return <div className="ToolBar">
            <button type="button">Select</button>
            <button type="button">Room</button>
            <button type="button">Door</button>
        </div>
    }
}
import * as React from "react";
import "./ToolBar.css"


export default class ToolBar extends React.Component {

    render() {
        return <div className="ToolBar">
            <input type="button" value="Select" style={{display: "block"}}/>
            <input type="button" value="Room" style={{display: "block"}}/>
        </div>
    }
}
import * as React from "react";
import "./PropertiesPanel.scss"

export default class PropertiesPanel extends React.Component {

    render() {
        return <div className="PropertiesPanel">
            <label htmlFor="name">
                Name: <input id="name" type="text"/>
            </label>
            <label htmlFor="color">
                Colour: <input id="color" type="color"/>
            </label>
        </div>
    }
}
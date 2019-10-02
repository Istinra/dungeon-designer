import * as React from "react";
import "./PropertiesPanel.scss"
import {DesignerState, ObjectType, Room, ToolMode} from "../state";
import {Dispatch} from "redux";
import {connect} from 'react-redux';
import {UPDATE_PROPERTIES} from "../actions";

interface PropertiesPanelProps {
    selected: Room;
    selectedType: ObjectType;
}

interface PropertiesPanelDispatch {
    onUpdate(update: Room): void;
}

class PropertiesPanel extends React.Component<PropertiesPanelProps & PropertiesPanelDispatch> {

    render() {
        let selectedContent;
        switch (this.props.selectedType) {
            case ObjectType.ROOM:
                selectedContent = [
                    <label htmlFor="name">
                        Name: <input id="name" type="text"/>
                    </label>,
                    <label htmlFor="color">
                        Color: <input id="color" type="color"/>
                    </label>
                ];
                break;
            case ObjectType.DOOR:
                selectedContent = <span>Door</span>;
                break;
            default:
                selectedContent = <span>Map</span>;
        }
        return <div className="PropertiesPanel">
            {selectedContent}
        </div>
    }
}


function mapStateToProps(state: DesignerState): PropertiesPanelProps {
    switch (state.toolMode) {
        case ToolMode.SELECT:
            if (state.selected) {
                switch (state.selected.type) {
                    case ObjectType.ROOM:
                        return {selected: state.map.rooms[state.selected.index], selectedType: ObjectType.ROOM};
                    case ObjectType.DOOR:
                        //TODO Fetch selected door
                        return {selected: null, selectedType: ObjectType.DOOR};
                }
            }
            break;
        case ToolMode.ROOM:
            return {selected: state.pendingObjects.room, selectedType: ObjectType.ROOM};
        case ToolMode.DOOR:
            //todo state.pendingObjects.door
            return {selected: null, selectedType: ObjectType.DOOR};

    }
    // TODO return map props
    return {selected: null, selectedType: ObjectType.MAP};
}

function mapStateToDispatch(dispatch: Dispatch): PropertiesPanelDispatch {
    return {
        onUpdate: (room: Room) =>
            dispatch({type: UPDATE_PROPERTIES, payload: room})
    }
}

export default connect(mapStateToProps, mapStateToDispatch)(PropertiesPanel);
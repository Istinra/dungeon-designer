import * as React from "react";
import "./PropertiesPanel.scss"
import {DesignerState, MapState, ObjectType, Room, SelectedState} from "../state";
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
                selectedContent = <span>Room</span>;
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

function getSelectedItem(selected: SelectedState, map: MapState): Room {
    return selected.type === ObjectType.ROOM ? map.rooms[selected.index] : null;
}

function mapStateToProps(state: DesignerState): PropertiesPanelProps {
    return {
        selected: getSelectedItem(state.selected, state.map),
        selectedType: state.selected.type
    }
}

function mapStateToDispatch(dispatch: Dispatch): PropertiesPanelDispatch {
    return {
        onUpdate: (room: Room) =>
            dispatch({type: UPDATE_PROPERTIES, payload: room})
    }
}

export default connect(mapStateToProps, mapStateToDispatch)(PropertiesPanel);

/*
<label htmlFor="name">
                Name: <input id="name" type="text"/>
            </label>
            <label htmlFor="color">
                Colour: <input id="color" type="color"/>
            </label>
 */
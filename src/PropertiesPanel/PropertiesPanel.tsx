import * as React from "react";
import "./PropertiesPanel.scss"
import {DesignerState, Door, MapPropertiesState, ObjectType, Room, ToolMode} from "../state";
import {Dispatch} from "redux";
import {connect} from 'react-redux';
import {InputComponent} from "../components/InputComponents";
import {UPDATE_DOOR_PROPERTIES, UPDATE_MAP_PROPERTIES, UPDATE_ROOM_PROPERTIES} from "../actions";

type PropertiesPanelTypes = Room | Door | MapPropertiesState;

interface PropertiesPanelProps {
    selected: PropertiesPanelTypes;
}

interface PropertiesPanelDispatch {
    onUpdate(update: PropertiesPanelTypes): void;
}

class PropertiesPanel extends React.Component<PropertiesPanelProps & PropertiesPanelDispatch> {

    render() {
        let selectedContent;
        if (this.props.selected) {
            switch (this.props.selected.type) {
                case ObjectType.ROOM:
                    selectedContent = this.roomProps(this.props.selected);
                    break;
                case ObjectType.DOOR:
                    selectedContent = this.doorProps(this.props.selected);
                    break;
                default:
                    selectedContent = this.mapProps(this.props.selected);
            }
        }
        return <div className="PropertiesPanel">
            {selectedContent}
        </div>
    }

    private mapProps(map: MapPropertiesState) {
        return <span>
            <h3>Map Properties</h3>
            <InputComponent id="map_grid_colour" name="gridLineColor" label="Grid Colour"
                            value={map.gridLineColor} type="color" onChange={this.onChange}/>
            <InputComponent id="map_bg_colour" name="backgroundColor" label="Background Colour"
                            value={map.backgroundColor} type="color" onChange={this.onChange}/>
        </span>
    }

    private roomProps(room: Room) {
        return <span>
            <h3>Room Properties</h3>
            <InputComponent id="prop_room_name" name="name" label="Name"
                            value={room.name} type="text" onChange={this.onChange}/>
            <InputComponent id="prop_room_colour" name="color" label="Color"
                            value={room.color} type="color" onChange={this.onChange}/>
            <InputComponent id="prop_room_colour" name="wallThickness" label="Wall Thickness"
                            value={room.wallThickness} type="number" onChange={this.onChange}/>
        </span>
    }

    private doorProps(door: Door) {
        return <span>
            <h3>Door Properties</h3>
            <InputComponent id="prop_room_colour" name="color" label="Color"
                            value={door.color} type="color" onChange={this.onChange}/>
        </span>
    }

    private onChange = (name: string, value: string) => {
        this.props.onUpdate({...this.props.selected, [name]: value});
    }
}

function mapStateToProps(state: DesignerState): PropertiesPanelProps {
    switch (state.toolMode) {
        case ToolMode.SELECT:
            if (state.selected) {
                switch (state.selected.type) {
                    case ObjectType.ROOM:
                        return {selected: state.map.rooms[state.selected.index]};
                    case ObjectType.DOOR:
                        return {selected: state.map.doors[state.selected.index]};
                }
            }
            break;
        case ToolMode.ROOM:
            return {selected: state.pendingObjects.room};
        case ToolMode.DOOR:
            return {selected: state.pendingObjects.door};

    }
    return {selected: state.map.properties};
}

function mapStateToDispatch(dispatch: Dispatch): PropertiesPanelDispatch {
    return {
        onUpdate: (update: PropertiesPanelTypes) => {
            let type: String;
            switch (update.type) {
                case ObjectType.ROOM:
                    type = UPDATE_ROOM_PROPERTIES;
                    break;
                case ObjectType.DOOR:
                    type = UPDATE_DOOR_PROPERTIES;
                    break;
                default:
                    type = UPDATE_MAP_PROPERTIES;
            }
            dispatch({type: type, payload: update});
        }
    }
}

export default connect(mapStateToProps, mapStateToDispatch)(PropertiesPanel);
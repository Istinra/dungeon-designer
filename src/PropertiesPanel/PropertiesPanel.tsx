import * as React from "react";
import "./PropertiesPanel.scss"
import {DesignerState, Door, MapPropertiesState, ObjectType, Prop, Room, ToolMode} from "../state";
import {Dispatch} from "redux";
import {connect} from 'react-redux';
import {InputComponent} from "../components/InputComponents";
import {
    DELETE_SELECTED,
    UPDATE_DOOR_PROPERTIES,
    UPDATE_MAP_PROPERTIES,
    UPDATE_PROP_PROPERTIES,
    UPDATE_ROOM_PROPERTIES
} from "../actions";
import ImportExportComponent from "./ImportExportComponent";

type PropertiesPanelTypes = Room | Door | Prop | MapPropertiesState;

interface PropertiesPanelProps {
    selected: PropertiesPanelTypes;
    mode: ToolMode
}

interface PropertiesPanelDispatch {
    onUpdate(update: PropertiesPanelTypes): void;

    onDelete(): void;
}

class PropertiesPanel extends React.Component<PropertiesPanelProps & PropertiesPanelDispatch> {

    render() {
        let selectedContent;
        let deleteButton;
        if (this.props.selected) {
            switch (this.props.selected.type) {
                case ObjectType.ROOM:
                    selectedContent = this.roomProps(this.props.selected);
                    break;
                case ObjectType.DOOR:
                    selectedContent = this.doorProps(this.props.selected);
                    break;
                case ObjectType.PROP:
                    selectedContent = this.propProps(this.props.selected);
                    break;
                default:
                    selectedContent = this.mapProps(this.props.selected);
            }
            if (this.props.mode === ToolMode.SELECT &&
                (this.props.selected.type === ObjectType.ROOM ||
                    this.props.selected.type === ObjectType.DOOR ||
                    this.props.selected.type === ObjectType.PROP)) {
                deleteButton =
                    <button type="button" className="PropertiesPanel-delete" onClick={this.onDelete}>Delete</button>;
            }
        }

        return <div className="PropertiesPanel">
            {selectedContent}
            {deleteButton}
        </div>
    }

    private mapProps(map: MapPropertiesState) {
        return <section>
            <h3>Map Properties</h3>
            <InputComponent id="map_grid_colour" name="gridLineColor" label="Grid Colour"
                            value={map.gridLineColor} type="color" onChange={this.onChange}/>
            <InputComponent id="map_bg_colour" name="backgroundColor" label="Background Colour"
                            value={map.backgroundColor} type="color" onChange={this.onChange}/>
            <InputComponent id="map_grid_width" name="width" label="Grid Width"
                            value={map.width} type="number" onChange={this.onChange}/>
            <InputComponent id="map_grid_height" name="height" label="Grid Height"
                            value={map.height} type="number" onChange={this.onChange}/>
            <ImportExportComponent/>
        </section>
    }

    private roomProps(room: Room) {
        return <section>
            <h3>Room Properties</h3>
            <InputComponent id="prop_room_name" name="name" label="Name"
                            value={room.name} type="text" onChange={this.onChange}/>
            <InputComponent id="prop_room_colour" name="color" label="Color"
                            value={room.color} type="color" onChange={this.onChange}/>
            <InputComponent id="prop_room_colour" name="wallThickness" label="Wall Thickness"
                            value={room.wallThickness} type="number" onChange={this.onChange}/>
        </section>
    }

    private doorProps(door: Door) {
        return <section>
            <h3>Door Properties</h3>
            <InputComponent id="prop_door_name" name="name" label="Name"
                            value={door.name} type="text" onChange={this.onChange}/>
            <InputComponent id="prop_room_colour" name="color" label="Color"
                            value={door.color} type="color" onChange={this.onChange}/>
        </section>
    }

    private propProps(prop: Prop) {
        return <section>
            <h3>Prop Properties</h3>
            <InputComponent id="prop_prop_name" name="name" label="Name"
                            value={prop.name} type="text" onChange={this.onChange}/>
            <InputComponent id="prop_prop_colour" name="color" label="Color"
                            value={prop.color} type="color" onChange={this.onChange}/>
        </section>
    }

    private onChange = (name: string, value: string) => {
        this.props.onUpdate({...this.props.selected, [name]: value});
    };

    private onDelete = () => this.props.onDelete();
}

function mapStateToProps(state: DesignerState): PropertiesPanelProps {
    switch (state.toolMode) {
        case ToolMode.SELECT:
            if (state.selected) {
                switch (state.selected.type) {
                    case ObjectType.ROOM:
                        return {selected: state.map.rooms[state.selected.index], mode: state.toolMode};
                    case ObjectType.DOOR:
                        return {selected: state.map.doors[state.selected.index], mode: state.toolMode};
                    case ObjectType.PROP:
                        return {selected: state.map.props[state.selected.index], mode: state.toolMode};
                }
            }
            break;
        case ToolMode.ROOM:
            return {selected: state.pendingObjects.room, mode: state.toolMode};
        case ToolMode.DOOR:
            return {selected: state.pendingObjects.door, mode: state.toolMode};
        case ToolMode.PROP:
            return {selected: state.pendingObjects.prop, mode: state.toolMode};
    }
    return {selected: state.map.properties, mode: state.toolMode};
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
                case ObjectType.PROP:
                    type = UPDATE_PROP_PROPERTIES;
                    break;
                default:
                    type = UPDATE_MAP_PROPERTIES;
            }
            dispatch({type: type, payload: update});
        },
        onDelete(): void {
            dispatch({type: DELETE_SELECTED});
        }

    }
}

export default connect(mapStateToProps, mapStateToDispatch)(PropertiesPanel);
import * as React from "react";
import "./PropertiesPanel.scss"
import {DesignerState, Door, MapPropertiesState, ObjectType, Prop, Room, ToolMode, Wall} from "../state";
import {Dispatch} from "redux";
import {connect} from 'react-redux';
import {
    DELETE_SELECTED,
    SPLIT_WALL_PROPERTIES,
    UPDATE_DOOR_PROPERTIES,
    UPDATE_MAP_PROPERTIES,
    UPDATE_PROP_PROPERTIES,
    UPDATE_ROOM_PROPERTIES,
    UPDATE_WALL_PROPERTIES
} from "../actions";
import ImportExportComponent from "./ImportExportComponent";
import {
    CheckboxFormComponent,
    ColorFormComponent,
    NumberFormComponent,
    TextFormComponent
} from "../components/InputComponents";

type PropertiesPanelTypes = Room | Door | Prop | Wall | MapPropertiesState;

interface PropertiesPanelProps {
    selected: PropertiesPanelTypes;
    mode: ToolMode
}

interface PropertiesPanelDispatch {
    onUpdate(update: PropertiesPanelTypes): void;

    splitWall(): void;

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
                case ObjectType.WALL:
                    selectedContent = this.wallProps(this.props.selected);
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
            <ColorFormComponent id="map_grid_colour" name="gridLineColor" label="Grid Colour"
                                value={map.gridLineColor} onChange={this.onChange}/>
            <ColorFormComponent id="map_bg_colour" name="backgroundColor" label="Background Colour"
                                value={map.backgroundColor} onChange={this.onChange}/>
            <NumberFormComponent id="map_grid_width" name="width" label="Grid Width"
                                 value={map.width} onChange={this.onChange}/>
            <NumberFormComponent id="map_grid_height" name="height" label="Grid Height"
                                 value={map.height} onChange={this.onChange}/>
            <ImportExportComponent/>
        </section>
    }

    private roomProps(room: Room) {
        return <section>
            <h3>Room Properties</h3>
            <TextFormComponent id="prop_room_name" name="name" label="Name"
                               value={room.name} onChange={this.onChange}/>
            <ColorFormComponent id="prop_room_colour" name="color" label="Color"
                                value={room.color} onChange={this.onChange}/>
            <NumberFormComponent id="prop_room_colour" name="wallThickness" label="Wall Thickness"
                                 value={room.wallThickness} onChange={this.onChange}/>
        </section>
    }

    private doorProps(door: Door) {
        return <section>
            <h3>Door Properties</h3>
            <TextFormComponent id="prop_door_name" name="name" label="Name"
                               value={door.name} onChange={this.onChange}/>
            <ColorFormComponent id="prop_room_colour" name="color" label="Color"
                                value={door.color} onChange={this.onChange}/>
        </section>
    }

    private wallProps(wall: Wall) {
        return <section>
            <h3>Wall Properties</h3>
            <CheckboxFormComponent id="wall_open" name="open" label="Open"
                                   value={wall.open} onChange={this.onChange}/>
            <button type="button" onClick={this.props.splitWall}>Split Wall</button>
        </section>
    }

    private propProps(prop: Prop) {
        return <section>
            <h3>Prop Properties</h3>
            <TextFormComponent id="prop_prop_name" name="name" label="Name"
                               value={prop.name} onChange={this.onChange}/>
            <ColorFormComponent id="prop_prop_colour" name="color" label="Color"
                                value={prop.color} onChange={this.onChange}/>
        </section>
    }

    private onChange = (name: string, value: any) => {
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
                    case ObjectType.WALL:
                        return {
                            selected: findOrCreateWall(state.map.rooms[state.selected.index], state.selected.subIndex),
                            mode: state.toolMode
                        };
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

function findOrCreateWall(room: Room, pointIndex: number): Wall {
    const wall = room.walls.find(w => w.pointIndex === pointIndex);
    if (wall) {
        return wall;
    }
    return {pointIndex: pointIndex, open: false, type: ObjectType.WALL};
}

function mapStateToDispatch(dispatch: Dispatch): PropertiesPanelDispatch {
    return {
        onUpdate: (update: PropertiesPanelTypes) => {
            let type: String;
            switch (update.type) {
                case ObjectType.ROOM:
                    type = UPDATE_ROOM_PROPERTIES;
                    break;
                case ObjectType.WALL:
                    type = UPDATE_WALL_PROPERTIES;
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
        splitWall(): void {
            dispatch({type: SPLIT_WALL_PROPERTIES})
        },
        onDelete(): void {
            dispatch({type: DELETE_SELECTED});
        }

    }
}

export default connect(mapStateToProps, mapStateToDispatch)(PropertiesPanel);
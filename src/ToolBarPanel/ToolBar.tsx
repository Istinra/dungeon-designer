import * as React from "react";
import "./ToolBar.scss"
import {DesignerState, ToolMode} from "../state";
import {Dispatch} from "redux";
import {connect} from 'react-redux';
import {CHANGE_MODE_ACTION} from "../actions";
import {Component} from "react";

interface ToolBarStateProps {
    activeMode: ToolMode;
}

interface ToolBarDispatchProps {
    onModeChanged(mode: ToolMode): void;
}

function ToolBar(props: ToolBarStateProps & ToolBarDispatchProps) {
    return <div className="ToolBar">
        <ToolBarButton name="Select" mode={ToolMode.SELECT} activeMode={props.activeMode}
                       onModeChanged={props.onModeChanged}/>
        <ToolBarButton name="Room" mode={ToolMode.ROOM} activeMode={props.activeMode}
                       onModeChanged={props.onModeChanged}/>
        <ToolBarButton name="Door" mode={ToolMode.DOOR} activeMode={props.activeMode}
                       onModeChanged={props.onModeChanged}/>
       <ToolBarButton name="Prop" mode={ToolMode.PROP} activeMode={props.activeMode}
                      onModeChanged={props.onModeChanged}/>
    </div>
}

interface ToolBarButtonProps {
    name: string,
    mode: ToolMode,
    activeMode: ToolMode,

    onModeChanged(mode: ToolMode): void
}

class ToolBarButton extends Component<ToolBarButtonProps> {

    private onToolSelect = () => {
        this.props.onModeChanged(this.props.mode);
    };

    render() {
        return <button type="button" className={this.props.activeMode === this.props.mode ? "ToolBar-active" : ""}
                       onClick={this.onToolSelect} value={this.props.mode}>
            {this.props.name}
        </button>
    }
}

function mapStateToProps(state: DesignerState): ToolBarStateProps {
    return {
        activeMode: state.toolMode
    }
}

function mapStateToDispatch(dispatch: Dispatch): ToolBarDispatchProps {
    return {
        onModeChanged: (mode: ToolMode) =>
            dispatch({type: CHANGE_MODE_ACTION, payload: mode})
    }
}

export default connect(mapStateToProps, mapStateToDispatch)(ToolBar);
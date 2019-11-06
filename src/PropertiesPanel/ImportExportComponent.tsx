import * as React from "react";
import {connect} from 'react-redux';
import {DesignerState, MapState} from "../state";
import {Dispatch} from "redux";
import {IMPORT_MAP} from "../actions";

interface ImportExportDispatch {
    onImportMap(map: MapState): void;
}

function ImportExportComponent(props: MapState & ImportExportDispatch) {
    return <div>
        <button type="button" onClick={() => downloadObjectAsJson(props, props.properties.name)}>Export</button>
        Input:
        <input type="file" onChange={(event) => handleUpload(event.target.files, props.onImportMap)}/>
    </div>
}


function handleUpload(files: FileList, onImportMap: (map: MapState) => void) {
    const file = files.item(0);
    let reader = new FileReader();
    reader.onload = (event: ProgressEvent) => {
        // @ts-ignore
        onImportMap.apply(JSON.parse(event.target.result));
    };
    reader.readAsText(file);
}

function mapStateToProps(state: DesignerState): MapState {
    return state.map;
}

function mapStateToDispatch(dispatch: Dispatch): ImportExportDispatch {
    return {
        onImportMap: (map: MapState) =>
            dispatch({type: IMPORT_MAP, payload: map})
    }
}

export default connect(mapStateToProps, mapStateToDispatch)(ImportExportComponent);

function downloadObjectAsJson(state: MapState, fileName: string) {
    if (fileName === "") {
        fileName = "#1 Dungeon";
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
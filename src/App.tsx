import React from 'react';
import ToolBar from './ToolBarPanel/ToolBar'
import './App.scss';
import DungeonMap from "./Map/DungeonMap";
import PropertiesPanel from "./PropertiesPanel/PropertiesPanel";

class App extends React.Component {

    render() {
        return <div className="App-main-layout">
            <ToolBar/>
            <DungeonMap width={20} height={20}/>
            <PropertiesPanel/>
        </div>;
    }

}

export default App;

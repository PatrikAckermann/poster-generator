import React from "react"
import "./index.js"
import Split from "react-split"

import Header from "./Component/Header"
import CanvasArea from "./Component/CanvasArea"
import EditorArea from "./Component/EditorArea"

export default function App() {
    var [data, setData] = React.useState({text: "Text", textPositionHeight: 500, textPositionWidth: 350, font: "Poppins", fontSize: 10, color: "#000000", backgroundColorSetting: "1", backgroundColor: "#ffffff", backgroundColor2: "#ffffff", backgroundColorAngle: 0, stopped: false, speed: 10, pattern: "Links-Rechts", shape: "Rechteck", shapePositionHeight: 300, shapePositionWidth: 400, angle: 0, shapeColorSetting: "1", shapeColor: "#000000", shapeColor2: "#000000", shapeSize: 100, repeatDistance: 1, rowRepeat: 1, columnRepeat: 1})
    
    return (
        <div className="App">
            <Header />
            <div className="MainContent">
                <Split direction="horizontal" className="split">
                    <CanvasArea data={data} setData={setData}/>
                    <EditorArea data={data} setData={setData}/>
                </Split>
            </div>
        </div>
    )
}
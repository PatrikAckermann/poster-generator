import React from "react"
import "./index.js"
import Split from "react-split"

import Header from "./Component/Header"
import CanvasArea from "./Component/CanvasArea"
import EditorArea from "./Component/EditorArea"

export default function App() {
    var [data, setData] = React.useState({
        canvasSize: '{"x":11.7,"y":16.5}',
        sizeMode: "pixels",
        canvasPpi: 72,
        x: 1170,
        y: 1650,
        colorSetting: "1", 
        color: "#ffffff", 
        color2: "#ffffff", 
        colorAngle: 0, 
        stopped: false, 
        speed: 10,
        pattern: "shapes", 
        texts: [],
        shapes: []
    })
    
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
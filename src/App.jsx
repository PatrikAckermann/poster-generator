import React from "react"
import "./index.js"
import Split from "react-split"

import Header from "./Component/Header"
import CanvasArea from "./Component/CanvasArea"
import EditorArea from "./Component/EditorArea"

export default function App() {
    var [data, setData] = React.useState({
        colorSetting: "1", 
        color: "#ffffff", 
        color2: "#ffffff", 
        colorAngle: 0, 
        stopped: false, 
        speed: 10,
        pattern: "Links-Rechts", 
        texts: [
            {
                text: "Test Text",
                x: 0,
                y: 0,
                angle: 0,
                size: 10,
                font: "Poppins",
                colorSetting: "1",
                color: "#000000",
                color2: "#000000",
                colorAngle: 0,
                speedX: 10,
                speedY: 0,
                repeatDistanceX: 0,
                repeatDistanceY: 0, 
                rowRepeat: 1, 
                columnRepeat: 1
            }
        ],
        shapes: [
            {
                name: "Name",
                shape: "Quadrat",
                x: 100,
                y: 100,
                angle: 0,
                size: 100,
                colorSetting: "1",
                color: "#000000",
                color2: "#000000",
                colorAngle: 0,
                repeatDistanceX: 0,
                repeatDistanceY: 0,  
                rowRepeat: 1, 
                columnRepeat: 1,
                speedX: 0,
                speedY: 0
            }
        ]
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
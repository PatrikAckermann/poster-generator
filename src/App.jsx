import React from "react"
import "./index.js"
import Split from "react-split"

import CanvasArea from "./Component/CanvasArea"
import EditorArea from "./Component/EditorArea"

import german from "./languages/german.json"
import english from "./languages/english.json"

export default function App() {
    var [data, setData] = React.useState({
        canvasSize: '{"x":11.7,"y":16.5}',
        language: "german",
        sizeMode: "pixels",
        canvasPpi: 72,
        fileFormat: "png",
        videoLength: 5,
        x: 1170,
        y: 1650,
        colorSetting: "1", 
        color: "#ffffff", 
        color2: "#ffffff", 
        colorAngle: 0, 
        stopped: false, 
        speed: 10,
        shapes: []
    })
    var [strings, setStrings] = React.useState()

    React.useEffect(() => {
        switch (data.language) {
            case "english":
                setStrings(english)
                break
            case "german":
                setStrings(german)
                break
            default:
                setStrings(english)
                break
        }
    }, [data])
    
    return (
        <div className="App">
            <div className="MainContent">
                <Split direction="horizontal" className="split">
                    <CanvasArea data={data} setData={setData}/>
                    <EditorArea data={data} setData={setData} strings={strings}/>
                </Split>
            </div>
        </div>
    )
}
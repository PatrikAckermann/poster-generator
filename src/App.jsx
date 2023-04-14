import React from "react"
import "./index.js"
import Split from "react-split"

import Header from "./Component/Header"
import CanvasArea from "./Component/CanvasArea"
import EditorArea from "./Component/EditorArea"

export default function App() {
    var [data, setData] = React.useState()
    
    return (
        <div className="App">
            <Header />
            <div className="MainContent">
                <Split direction="horizontal" className="split">
                    <CanvasArea />
                    <EditorArea />
                </Split>
            </div>
        </div>
    )
}
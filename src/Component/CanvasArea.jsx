import React from "react"
import Canvas from "./Canvas"
import { ResizeSensor } from "css-element-queries";
import jQuery from "jquery";

/*
Need to make the canvas keep its aspect ratio
*/

export default function CanvasArea() {
    function draw(x, frame) {
        // DRAW CODE GOES HERE
        x.clearRect(0, 0, x.canvas.width, x.canvas.height)
        x.fillStyle = '#111111'
        x.beginPath()
        //x.arc(100 + 50*Math.tan(frame*0.03), 50, 30, 0, 2*Math.PI)
        x.font = "120px sans-serif"
        x.fillText("Test", frame * 10 % 1200 - 200, 300)
        x.fill()
    }

    return (
        <div className="CanvasArea">
            <Canvas draw={draw} />
        </div>
    )
}
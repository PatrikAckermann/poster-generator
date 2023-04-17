import React from "react"
import Canvas from "./Canvas"

/*
Need to make the canvas keep its aspect ratio
*/

var texts = [{x: 0, y:100, speed: 10, fontSize: 80}, {x: 0, y:200, speed: 5, fontSize: 120}, {x: 0, y:300, speed: 7, fontSize: 100}]

export default function CanvasArea(props) {
    function draw(x, frame) {
        x.clearRect(0, 0, x.canvas.width, x.canvas.height)
        x.fillStyle = props.data.color
        x.beginPath()
        
        // DRAW CODE GOES HERE

        texts.forEach(y => {
            x.font = `${y.fontSize * props.data.fontSize * 0.1}px ${props.data.font}`
            x.fillText(props.data.text, y.x-x.measureText(props.data.text).width, y.y)
            if (y.x > x.canvas.width + x.measureText(props.data.text).width) {y.x = 0}
            y.x += props.data.speed * 0.1 * y.speed
        })

        /*x.font = "100px Poppins"
        x.fillText("test 1", 100, 300)
        x.fillText("test 2", 100, 400)
        x.fillText("test 3", 100, 500)*/
        //x.font ="Poppins 100px sans-serif"
        //x.fillText("Test 123", frame*10 % 1300 - 400, 200)

        x.fill()
    }

    return (
        <div className="CanvasArea">
            <Canvas draw={draw} data={props.data}/>
        </div>
    )
}
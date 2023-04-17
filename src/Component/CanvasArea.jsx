import React from "react"
import Canvas from "./Canvas"
//import { bounce } from "../patterns"

/*
Need to make the canvas keep its aspect ratio
*/

var texts = [{x: 0, speed: 10, fontSize: 80}, {x: 0, speed: 5, fontSize: 120}, {x: 0, speed: 7, fontSize: 100}]

for(var i=0; i < 100; i++) {
    texts.push({x: 0, speed: randomNumber(1, 20), fontSize: randomNumber(50, 200)})
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min
}

function calculateHeight(index, heightMultiplicator) {
    /*
    var height = texts[0].fontSize * heightMultiplicator
    for(var i = 0; i < index; i++) {
        height = height + (texts[i].fontSize * heightMultiplicator)
    }
    return height*/

    var height = texts[0].fontSize * heightMultiplicator
    if (index !== 0) {
        for(var i = 0; i < index; i++) {
            height = height + (texts[i].fontSize * heightMultiplicator)
        }
    }
    return height
}

export default function CanvasArea(props) {
    function draw(x, frame) {
        x.clearRect(0, 0, x.canvas.width, x.canvas.height)
        x.fillStyle = props.data.color
        x.beginPath()
        
        // DRAW CODE GOES HERE
        switch(props.data.pattern) {
            case "Links-Rechts":
                leftToRight(x, frame, props)
                break
            case "Bounce":
                bounce(x, frame, props)
                break
            case "Test":
                testpattern(x, frame, props)
                break
            default:
                leftToRight(x, frame, props)
                break
        }
        

        x.fill()
    }

    return (
        <div className="CanvasArea">
            <Canvas draw={draw} data={props.data} setData={props.setData}/>
        </div>
    )
}


/* PATTERNS */

function leftToRight(x, frame, props) {
    texts.forEach((y, index) => {
        x.font = `${y.fontSize * props.data.fontSize * 0.1}px ${props.data.font}`
        x.fillText(props.data.text, y.x-x.measureText(props.data.text).width, calculateHeight(index, props.data.fontSize * 0.1))
        if (y.x > x.canvas.width + x.measureText(props.data.text).width) {y.x = 0}
        y.x += props.data.speed * 0.1 * y.speed
    })
}

function bounce(x, frame, props) {
    texts.forEach((y, index) => {
        x.font = `${y.fontSize * props.data.fontSize * 0.1 * Math.sin(frame * 0.05 % x.canvas.width)}px ${props.data.font}`
        x.fillText(props.data.text, y.x-x.measureText(props.data.text).width, calculateHeight(index, props.data.fontSize * 0.1 * Math.sin(frame * 0.05 % x.canvas.width)))
        if (y.x > x.canvas.width + x.measureText(props.data.text).width) {y.x = 0}
        y.x += props.data.speed * 0.1 * y.speed
    })
}

function testpattern(x, frame, props) {
    x.font = "100px Arial"
    x.fillText("Test", 200, 200)
    x.moveTo(200, 100)
    x.lineTo(200, 200)
    x.stroke()
}
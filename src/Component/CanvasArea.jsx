import React from "react"
import Canvas from "./Canvas"
//import { bounce } from "../patterns"

/*
Need to make the canvas keep its aspect ratio
*/

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min
}

function calculateHeight(index, heightMultiplicator) {
    var height = 0
    for (var i = 0; i <= index; i++) {
        height += texts[i].fontSize * heightMultiplicator
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
            case "DVD":
                dvd(x, frame, props)
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

var texts = []

for(var i=0; i < 200; i++) {
    texts.push({x: 0, speed: randomNumber(1, 20), fontSize: randomNumber(50, 200)})
}

/* PATTERNS 
Ideas:
 - DVD Logo
*/

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
        x.fillStyle = `rgba(0, 0, 0, ${Math.sin(frame * 0.05 % x.canvas.width)})`
        x.font = `${y.fontSize * props.data.fontSize * 0.1 * Math.sin(frame * 0.05 % x.canvas.width)}px ${props.data.font}`
        x.fillText(props.data.text, y.x-x.measureText(props.data.text).width, calculateHeight(index, props.data.fontSize * 0.1 * Math.sin(frame * 0.05 % x.canvas.width)))
        if (y.x > x.canvas.width + x.measureText(props.data.text).width) {y.x = 0}
        y.x += props.data.speed * 0.1 * y.speed
    })
}

var dvdText = {x: 0, y:0, direction: ["r", "b"]}
function dvd(x, frame, props) {
    x.font = `${props.data.fontSize * 10}px ${props.data.font}`


    var leftBorder = 0
    var rightBorder = x.canvas.width - x.measureText(props.data.text).width
    var topBorder = 0 + (props.data.fontSize * 0.75) * 10 //0.75 because there is empty space above the fontSize
    var bottomBorder = x.canvas.height

    if (dvdText.x <= leftBorder) {
        dvdText.direction[0] = "r"
    } else if (dvdText.x >= rightBorder) {
        dvdText.direction[0] = "l"
    }

    if (dvdText.y <= topBorder) {
        dvdText.direction[1] = "b"
    } else if (dvdText.y >= bottomBorder) {
        dvdText.direction[1] = "t"
    }

    switch(dvdText.direction[0]) {
        case "r":
            dvdText.x += 0.1 * props.data.speed
            break
        case "l":
            dvdText.x -= 0.1 * props.data.speed
            break
        default:
            break
    }
    switch(dvdText.direction[1]) {
        case "t":
            dvdText.y -= 0.1 * props.data.speed
            break
        case "b":
            dvdText.y += 0.1 * props.data.speed
            break
        default:
            break
    }
    x.fillText(props.data.text, dvdText.x, dvdText.y)
}

function testpattern(x, frame, props) {
    x.fillStyle = "rgba(0, 0, 0, 0.5)"
    x.font = "200px Poppins"
    x.fillText("Test", 200, 150)
    x.font = "150px Poppins"
    x.fillText("Test", 200, 300)
    x.font = "20px Poppins"
    x.fillText("Test", 200, 320)
}
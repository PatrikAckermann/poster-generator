import React from "react"
import Canvas from "./Canvas"

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
        x.beginPath()

        x.fillStyle = props.data.backgroundColor
        if (props.data.backgroundColorSetting === "gradient") {
            var angle = props.data.backgroundColorAngle * Math.PI / 180
            var gradient = x.createLinearGradient(x.canvas.width / 2 + Math.cos(angle) * x.canvas.width * 0.5, x.canvas.height / 2 + Math.sin(angle) * x.canvas.width * 0.5, x.canvas.width / 2 - Math.cos(angle) * x.canvas.width * 0.5, x.canvas.height / 2 - Math.sin(angle) * x.canvas.width * 0.5)
            gradient.addColorStop(0, props.data.backgroundColor)
            gradient.addColorStop(1, props.data.backgroundColor2)
            x.fillStyle = gradient
        }
        x.fillRect(0, 0, x.canvas.width, x.canvas.height)

        x.fillStyle = props.data.textColor
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
            case "Formen":
                shapes(x, frame, props)
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

function leftToRight(x, frame, props) {
    texts.forEach((y, index) => {
        x.font = `${y.fontSize * props.data.fontSize * 0.1}px ${props.data.font}`

        if (props.data.textColorSetting === "gradient") {
            var angle = props.data.textColorAngle * Math.PI / 180
            var gradient = x.createLinearGradient(x.canvas.width / 2 + Math.cos(angle) * x.canvas.width * 0.5, x.canvas.height / 2 + Math.sin(angle) * x.canvas.width * 0.5, x.canvas.width / 2 - Math.cos(angle) * x.canvas.width * 0.5, x.canvas.height / 2 - Math.sin(angle) * x.canvas.width * 0.5)
            gradient.addColorStop(0, props.data.textColor)
            gradient.addColorStop(1, props.data.textColor2)
            x.fillStyle = gradient
        }

        x.fillText(props.data.text, y.x-x.measureText(props.data.text).width, calculateHeight(index, props.data.fontSize * 0.1))
        if (y.x > x.canvas.width + x.measureText(props.data.text).width) {y.x = 0}
        y.x += props.data.speed * 0.1 * y.speed
    })
}

function bounce(x, frame, props) {
    texts.forEach((y, index) => {
        x.fillStyle = `rgba(0, 0, 0, ${Math.sin(frame * 0.05 % x.canvas.width)})`
        x.font = `${y.fontSize * props.data.fontSize * 0.1 * Math.sin(frame * 0.05 % x.canvas.width)}px ${props.data.font}`

        if (props.data.textColorSetting === "gradient") {
            var angle = props.data.textColorAngle * Math.PI / 180
            var gradient = x.createLinearGradient(x.canvas.width / 2 + Math.cos(angle) * x.canvas.width * 0.5, x.canvas.height / 2 + Math.sin(angle) * x.canvas.width * 0.5, x.canvas.width / 2 - Math.cos(angle) * x.canvas.width * 0.5, x.canvas.height / 2 - Math.sin(angle) * x.canvas.width * 0.5)
            gradient.addColorStop(0, props.data.textColor)
            gradient.addColorStop(1, props.data.textColor2)
            x.fillStyle = gradient
        }

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

    if (props.data.textColorSetting === "gradient") {
        var angle = props.data.textColorAngle * Math.PI / 180
        var gradient = x.createLinearGradient(x.canvas.width / 2 + Math.cos(angle) * x.canvas.width * 0.5, x.canvas.height / 2 + Math.sin(angle) * x.canvas.width * 0.5, x.canvas.width / 2 - Math.cos(angle) * x.canvas.width * 0.5, x.canvas.height / 2 - Math.sin(angle) * x.canvas.width * 0.5)
        gradient.addColorStop(0, props.data.textColor)
        gradient.addColorStop(1, props.data.textColor2)
        x.fillStyle = gradient
    }
    x.fillText(props.data.text, dvdText.x, dvdText.y)
}

function drawRotatedRect(ctx, x, y, width, height, angle) {
    angle *= Math.PI / 180
    ctx.lineWidth = height
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + width * Math.cos(angle), y + width * Math.sin(angle))
    ctx.stroke()
}

//template: {x, y}
var shape = []
function shapes(x, frame, props) {
    if (props.data.shapePositionHeight && props.data.shapePositionWidth) {
        var angle = props.data.angle * (Math.PI / 180)
        var gradient = x.createLinearGradient(parseInt(props.data.shapePositionWidth), parseInt(props.data.shapePositionHeight), parseInt(props.data.shapePositionWidth) + props.data.shapeSize * props.data.columnRepeat * Math.cos(angle), parseInt(props.data.shapePositionHeight) + props.data.shapeSize * props.data.rowRepeat * Math.sin(angle)) //Math.sin(angle)
        gradient.addColorStop(0, props.data.shapeColor)
        gradient.addColorStop(1, props.data.shapeColor2)
        x.fillStyle = x.strokeStyle = props.data.shapeColorSetting === "1" ? props.data.shapeColor : gradient

        if (frame === 1) {
            shape = []
            for (var i = 0; i < props.data.columnRepeat; i++) {
                shape.push([])
                for (var j = 0; j < props.data.rowRepeat; j++) {
                    shape[i].push({x: parseInt(props.data.shapePositionWidth) + props.data.repeatDistance * i, y: parseInt(props.data.shapePositionHeight) + props.data.repeatDistance * j})
                }
            } 
        }

        shape.forEach(y => {
            y.forEach(z => {
                if (props.data.shape === "Rechteck") {
                    drawRotatedRect(x, z.x, z.y, props.data.shapeSize, props.data.shapeSize, props.data.angle)
                } else if (props.data.shape === "Kreis") {
                    x.moveTo(z.x, z.y) // To avoid the weird lines between circles
                    x.arc(z.x, z.y, props.data.shapeSize, 0, 10)
                }
            })
        })
    }

    x.fill()
    x.closePath()
    x.beginPath()
    x.fillStyle = x.strokeStyle = props.data.textColor
    x.font = `${props.data.fontSize * 10}px ${props.data.font}`

    /*if (props.data.textColorSetting === "gradient") {
        var textAngle = props.data.textColorAngle * Math.PI / 180
        var textGradient = x.createLinearGradient(x.measureText(props.data.text) / 2 + Math.cos(textAngle) * x.measureText(props.data.text) * 0.5, props.data.fontSize / 2 + Math.sin(textAngle) * x.measureText(props.data.text) * 0.5, x.measureText(props.data.text) / 2 - Math.cos(textAngle) * x.measureText(props.data.text) * 0.5, props.data.fontSize / 2 - Math.sin(textAngle) * x.measureText(props.data.text) * 0.5)
        textGradient.addColorStop(0, props.data.textColor)
        textGradient.addColorStop(1, props.data.textColor2)
        x.fillStyle = textGradient
    }*/

    x.fillText(props.data.text, props.data.textPositionWidth, props.data.textPositionHeight)
    // Multiple shapes: Add ability to add as many shapes as the user wants
    // Multiple texts: Add ability to add as many texts as the user wants
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
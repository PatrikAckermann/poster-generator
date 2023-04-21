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

        x.fillStyle = props.data.color
        if (props.data.colorSetting === "gradient") {
            var angle = props.data.colorAngle * Math.PI / 180
            var gradient = x.createLinearGradient(x.canvas.width / 2 + Math.cos(angle) * x.canvas.width * 0.5, x.canvas.height / 2 + Math.sin(angle) * x.canvas.width * 0.5, x.canvas.width / 2 - Math.cos(angle) * x.canvas.width * 0.5, x.canvas.height / 2 - Math.sin(angle) * x.canvas.width * 0.5)
            gradient.addColorStop(0, props.data.color)
            gradient.addColorStop(1, props.data.color2)
            x.fillStyle = gradient
        }
        x.fillRect(0, 0, x.canvas.width, x.canvas.height)

        x.fillStyle = "#000000"
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
    var text = props.data.texts[0]
    texts.forEach((y, index) => {
        x.font = `${y.fontSize * text.size * 0.1}px ${text.font}`
        x.fillStyle = text.color

        if (text.colorSetting === "gradient") {
            var angle = text.colorAngle * Math.PI / 180
            var gradient = x.createLinearGradient(x.canvas.width / 2 + Math.cos(angle) * x.canvas.width * 0.5, x.canvas.height / 2 + Math.sin(angle) * x.canvas.width * 0.5, x.canvas.width / 2 - Math.cos(angle) * x.canvas.width * 0.5, x.canvas.height / 2 - Math.sin(angle) * x.canvas.width * 0.5)
            gradient.addColorStop(0, text.color)
            gradient.addColorStop(1, text.color2)
            x.fillStyle = gradient
        }

        x.fillText(text.text, y.x-x.measureText(text.text).width, calculateHeight(index, text.size * 0.1))
        if (y.x > x.canvas.width + x.measureText(text.text).width) {y.x = 0}
        y.x += parseInt(text.speedX) * 0.1 * y.speed
    })
}

function bounce(x, frame, props) {
    var text = props.data.texts[0]
    texts.forEach((y, index) => {
        x.fillStyle = `rgba(0, 0, 0, ${Math.sin(frame * 0.05 % x.canvas.width)})`
        x.font = `${y.fontSize * text.size * 0.1 * Math.sin(frame * 0.05 % x.canvas.width)}px ${text.font}`

        if (text.colorSetting === "gradient") {
            var angle = text.colorAngle * Math.PI / 180
            var gradient = x.createLinearGradient(x.canvas.width / 2 + Math.cos(angle) * x.canvas.width * 0.5, x.canvas.height / 2 + Math.sin(angle) * x.canvas.width * 0.5, x.canvas.width / 2 - Math.cos(angle) * x.canvas.width * 0.5, x.canvas.height / 2 - Math.sin(angle) * x.canvas.width * 0.5)
            gradient.addColorStop(0, text.color)
            gradient.addColorStop(1, text.color2)
            x.fillStyle = gradient
        }

        x.fillText(text.text, y.x-x.measureText(text.text).width, calculateHeight(index, text.size * 0.1 * Math.sin(frame * 0.05 % x.canvas.width)))
        if (y.x > x.canvas.width + x.measureText(text.text).width) {y.x = 0}
        y.x += text.speedX * 0.1 * y.speed
    })
}

var dvdText = {x: 0, y:0, direction: ["r", "b"]}
function dvd(x, frame, props) {
    var text = props.data.texts[0]
    x.font = `${text.size * 10}px ${text.font}`


    var leftBorder = 0
    var rightBorder = x.canvas.width - x.measureText(text.text).width
    var topBorder = 0 + (text.size * 0.75) * 10 //0.75 because there is empty space above the fontSize
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
            dvdText.x += 0.1 * text.speedX
            break
        case "l":
            dvdText.x -= 0.1 * text.speedX
            break
        default:
            break
    }
    switch(dvdText.direction[1]) {
        case "t":
            dvdText.y -= 0.1 * text.speedX
            break
        case "b":
            dvdText.y += 0.1 * text.speedX
            break
        default:
            break
    }

    x.fillStyle = text.color
    if (text.colorSetting === "gradient") {
        var angle = text.colorAngle * Math.PI / 180
        var gradient = x.createLinearGradient(x.canvas.width / 2 + Math.cos(angle) * x.canvas.width * 0.5, x.canvas.height / 2 + Math.sin(angle) * x.canvas.width * 0.5, x.canvas.width / 2 - Math.cos(angle) * x.canvas.width * 0.5, x.canvas.height / 2 - Math.sin(angle) * x.canvas.width * 0.5)
        gradient.addColorStop(0, text.color)
        gradient.addColorStop(1, text.color2)
        x.fillStyle = gradient
    }
    x.fillText(text.text, dvdText.x, dvdText.y)
}

function drawRotatedRect(ctx, x, y, width, height, angle) {
    angle *= Math.PI / 180
    ctx.lineWidth = height
    ctx.beginPath()
    ctx.moveTo(x, y + 50)
    ctx.lineTo(x + width * Math.cos(angle), y + 50 + width * Math.sin(angle))
    ctx.stroke()
}

var textList = []
var shapeList = []
function shapes(x, frame, props) {
    if (frame === 1) {
        shapeList = []
        props.data.shapes.forEach((shape, shapeIndex) => {
            if (shape.y && shape.x) {
                for (var i = 0; i < shape.columnRepeat; i++) {
                    shapeList.push([])
                    for (var j = 0; j < shape.rowRepeat; j++) {
                        shapeList[shapeIndex].push({...shape, x: parseInt(shape.x) + shape.repeatDistanceX * i, y: parseInt(shape.y) + shape.repeatDistanceY * j})
                    }
                }
            }
        })

        textList = []
        props.data.texts.forEach((text, textIndex) => {
            if (text.y && text.x) {
                for (var i = 0; i < text.columnRepeat; i++) {
                    textList.push([])
                    for (var j = 0; j < text.rowRepeat; j++) {
                        textList[textIndex].push({...text, x: parseInt(text.x) + text.repeatDistanceX * i, y: parseInt(text.y) + text.repeatDistanceY * j})
                    }
                }
            }
        })
    }

    shapeList.forEach((repeatedShapes) => {
        repeatedShapes.forEach((shape) => {
            var angle = shape.angle * (Math.PI / 180)
            x.fillStyle = x.strokeStyle = shape.color
            if (shape.colorSetting === "gradient") {
                var gradient = x.createLinearGradient(shape.x, shape.y + 50, shape.x + shape.size * Math.cos(angle), shape.y + 50 + shape.size * Math.sin(angle)) // WORKS FOR SHAPE ANGLE BUT NOT FOR COLOR ANGLE
                gradient.addColorStop(0, shape.color)
                gradient.addColorStop(1, shape.color2)
                x.fillStyle = x.strokeStyle = gradient
            }

            if (shape.shape === "Rechteck") {
                drawRotatedRect(x, shape.x, shape.y, shape.size, shape.size, shape.angle)
            } else if (shape.shape === "Kreis") {
                x.moveTo(shape.x, shape.y) // To avoid the weird lines between circles
                x.arc(shape.x, shape.y, shape.size, 0, 10)
            }

            x.fill()
            x.closePath()
            x.beginPath()
        })
    })

    textList.forEach((repeatedText) => {
        repeatedText.forEach((text) => {
            x.save()
            x.translate(text.x, text.y)
            x.rotate(text.angle * (Math.PI / 180))

            x.fillStyle = x.strokeStyle = text.color

            var colorAangle = text.colorAngle * Math.PI / 180
            var angle = text.angle * Math.PI / 180
            if (text.colorSetting === "gradient") {
                var textGradient = x.createLinearGradient(0, 0, 0 + x.measureText(text.text).width, 0 + text.size)
                //var textGradient = x.createLinearGradient(text.x, text.y, text.x + x.measureText(text.text).width * Math.cos(colorAngle), text.y + text.size * Math.sin(colorAngle))
                textGradient.addColorStop(0, text.color)
                textGradient.addColorStop(1, text.color2)
                x.fillStyle = x.strokeStyle = textGradient
            }

            x.font = `${text.size * 5}px ${text.font}`
            
            x.fillText(text.text, 0, 0)
            
            x.restore()
            x.fill()
            x.closePath()
            x.beginPath()
        })
    })
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
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
            case "left-right":
                leftToRight(x, frame, props)
                break
            case "bounce":
                bounce(x, frame, props)
                break
            case "dvd":
                dvd(x, frame, props)
                break
            case "shapes":
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

function getExtraLength(shape, a) {
    var angle = a
    var negative = false
    while (true) {
        if (angle > 45) {
            negative = !negative
            angle -= 45
            continue
        }
        if (angle < 0) {
            negative = !negative
            angle -= 45
            continue
        }
        break
    }
    var n = (Math.sqrt(shape.size * shape.size * 2) - shape.size) / 45 * angle
    return negative ? Math.sqrt(shape.size * shape.size * 2) - shape.size - n : n
}

var textList = []
var shapeList = []
function shapes(x, frame, props) {
    if (frame === 1) {
        shapeList = []
        var shapes = [...props.data.shapes]
        shapes.reverse()
        var texts = [...props.data.texts]
        texts.reverse()
        shapes.forEach((shape, shapeIndex) => {
            var offsetRangeX = parseInt(shape.offsetRangeX)
            var offsetRangeY = parseInt(shape.offsetRangeY)
            if (shape.y && shape.x) {
                for (var i = 0; i < shape.columnRepeat; i++) {
                    shapeList.push([])
                    for (var j = 0; j < shape.rowRepeat; j++) {
                        shapeList[shapeIndex].push({...shape, x: parseInt(shape.x) + shape.repeatDistanceX * i + randomNumber(-offsetRangeX, offsetRangeX), y: parseInt(shape.y) + shape.repeatDistanceY * j + randomNumber(-offsetRangeY, offsetRangeY)})
                    }
                }
            }
        })

        textList = []
        texts.forEach((text, textIndex) => {
            if (text.y && text.x) {
                var offsetRangeX = parseInt(text.offsetRangeX)
                var offsetRangeY = parseInt(text.offsetRangeY)
                for (var i = 0; i < text.columnRepeat; i++) {
                    textList.push([])
                    for (var j = 0; j < text.rowRepeat; j++) {
                        textList[textIndex].push({...text, x: parseInt(text.x) + text.repeatDistanceX * i + randomNumber(-offsetRangeX, offsetRangeX), y: parseInt(text.y) + text.repeatDistanceY * j + randomNumber(-offsetRangeY, offsetRangeY)})
                    }
                }
            }
        })
    }

    shapeList.forEach((repeatedShapes) => {
        repeatedShapes.forEach((shape) => {
            x.save()
            x.translate(shape.x + shape.size/2, shape.y + shape.size/2)
            x.rotate(shape.angle * (Math.PI / 180))

            var colorAngle = shape.colorAngle * (Math.PI / 180)
            x.fillStyle = x.strokeStyle = shape.color
            var fullShapeSize = parseInt(shape.size) + parseInt(getExtraLength(shape, shape.colorAngle))
            if (shape.colorSetting === "gradient") {
                var gradient = x.createLinearGradient(-fullShapeSize/2 * Math.cos(colorAngle), -fullShapeSize/2 * Math.sin(colorAngle), fullShapeSize/2 * Math.cos(colorAngle), fullShapeSize/2 * Math.sin(colorAngle))
                gradient.addColorStop(0, shape.color)
                gradient.addColorStop(1, shape.color2)
                x.fillStyle = x.strokeStyle = gradient
            }

            if (shape.shape === "square") {
                x.fillRect(-(shape.size/2), -(shape.size/2), shape.size, shape.size)
            } else if (shape.shape === "circle") {
                x.moveTo(shape.x, shape.y) // To avoid the weird lines between circles
                x.arc(0, 0, shape.size/2, 0, 2 * Math.PI)
            }

            x.fill()
            x.restore()
            x.closePath()
            x.beginPath()

            var newPos = shape
            //fullShapeSize = parseInt(newPos.size) + parseInt(getExtraLength(newPos, shape.angle))

            if(newPos.x > x.canvas.width + fullShapeSize/2) {
                newPos.x = 0 - fullShapeSize
            } 
            if (newPos.x < 0 - fullShapeSize) {
                newPos.x = x.canvas.width + fullShapeSize/2
            }
            if (newPos.y > x.canvas.height + fullShapeSize/2) {
                newPos.y = 0 - fullShapeSize
            } 
            if (newPos.y < 0 - fullShapeSize) {
                newPos.y = x.canvas.height + fullShapeSize/2
            }
            newPos.x += parseInt(shape.speedX)
            newPos.y += parseInt(shape.speedY)
            return newPos
        })
    })

    textList.forEach((repeatedText) => {
        repeatedText.forEach((text) => {
            x.save()
            x.font = `${text.size * 5}px ${text.font}`
            x.translate(text.x + x.measureText(text.text).width/2, text.y + text.size/2)
            x.rotate(text.angle * (Math.PI / 180))

            x.fillStyle = x.strokeStyle = text.color

            var colorAngle = text.colorAngle * Math.PI / 180
            if (text.colorSetting === "gradient") {
                var textGradient = x.createLinearGradient(-x.measureText(text.text).width/2 * Math.cos(colorAngle), -text.size/2 * Math.sin(colorAngle), x.measureText(text.text).width/2 * Math.cos(colorAngle), text.size/2 * Math.sin(colorAngle))
                textGradient.addColorStop(0, text.color)
                textGradient.addColorStop(1, text.color2)
                x.fillStyle = x.strokeStyle = textGradient
            }
            
            x.fillText(text.text, -x.measureText(text.text).width/2, text.size/2)
            
            x.restore()
            x.fill()
            x.closePath()
            x.beginPath()

            var newPos = text
            x.font = `${text.size * 5}px ${text.font}`

            if(newPos.x > x.canvas.width + x.measureText(text.text).width) {
                newPos.x = 0 - x.measureText(text.text).width
            } 
            if (newPos.x < 0 - x.measureText(text.text).width) {
                newPos.x = x.canvas.width
            }
            if (newPos.y > x.canvas.height + parseInt(text.size) * 5) {
                newPos.y = 0 - text.size
            } 
            if (newPos.y < 0 - parseInt(text.size)) {
                newPos.y = x.canvas.height + text.size * 5
            }
            newPos.x += parseInt(text.speedX)
            newPos.y += parseInt(text.speedY)
            return newPos
        })
    })
}

var angle = 0
function testpattern(x, frame, props) {
    var pos = {x: 200, y: 200}
    x.save()
    x.translate(pos.x, pos.y)
    x.rotate(Math.PI / 180 * (angle += 1))
    x.rect(-50, -50, 100, 100)
    x.restore()
}
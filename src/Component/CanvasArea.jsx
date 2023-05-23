import React from "react"
import Canvas from "./Canvas"

export function randomNumber(min, max) {
    min = parseInt(min)
    max = parseInt(max)
    return Math.floor(Math.random() * (max - min + 1) ) + min
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
        
        shapes(x, frame, props)

        x.fill()
    }

    return (
        <div className="CanvasArea">
            {process.env.NODE_ENV === "development" && <p style={{color: "green", position: "absolute", top:0, left:0}} id="fpsCounter">A</p>}
            <Canvas draw={draw} data={props.data} setData={props.setData}/>
        </div>
    )
}

function getExtraLength(shape, a) {
    var angle = a

    if (angle === 0) {return 0}

    var angle2 = angle % 90
    angle = angle % 45

    if (angle2 === 45) {angle = 45}
    if (angle2 > 45) {angle = 45 - angle}
    if (angle2 <= -45) {angle = -45 - angle}

    if (shape.shape === "square") {
        var n = (Math.sqrt(shape.size * shape.size * 2) - shape.size) / 45 * angle
        if (n < 0) {n = -n}
        return n
    }
    return 0
}

var template = {
    name: "Text", 
    spinSpeed: 0, 
    offsetRangeX: 0, 
    offsetRangeY: 0, 
    angleOffset: 0, 
    x: 0, 
    y: 0, 
    angle: 0, 
    size: 100,  
    colorSetting: "1", 
    colorAngle: 0, 
    speedX: 0, 
    movementAngle: 0,
    movementSpin: 0,
    repeatDistanceX: 0, 
    repeatDistanceY: 0, 
    rowRepeat: 1, 
    columnRepeat: 1,
    speedOffset: 0,
    sizeOffset: 0,
    invertX: false,
    invertY: false
}

var shapeList = []
function shapes(x, frame, props) {
    if (frame === 1) {
        shapeList = []
        var shapes = [...props.data.shapes]
        shapes.reverse()
        shapes.forEach((shape, shapeIndex) => {
            var offsetRangeX = parseInt(shape.offsetRangeX)
            var offsetRangeY = parseInt(shape.offsetRangeY)
            if (shape.hidden === false) {
                for (var i = 0; i < shape.columnRepeat; i++) {
                    shapeList.push([])
                    for (var j = 0; j < shape.rowRepeat; j++) {
                        for (var key in shape) {
                            if (shape[key] === "") {
                                shape[key] = template[key]
                            }
                        }
                        shapeList[shapeIndex].push({...shape, size: parseInt(shape.size) + randomNumber(-shape.sizeOffset, shape.sizeOffset), speedX: parseInt(shape.speedX) + randomNumber(-shape.speedOffset, shape.speedOffset), angle: parseInt(shape.angle) + randomNumber(-shape.angleOffset, shape.angleOffset), x: parseInt(shape.x) + shape.repeatDistanceX * i + randomNumber(-offsetRangeX, offsetRangeX), y: parseInt(shape.y) + shape.repeatDistanceY * j + randomNumber(-offsetRangeY, offsetRangeY)})
                    }
                }
            }
        })
    }

    shapeList.forEach((repeatedShapes) => {
        repeatedShapes.forEach((shape) => {
            x.save()
            x.font = `${shape.size}px ${shape.font}`
            shape.shape !== "text" ? x.translate(shape.x + shape.size/2, shape.y + shape.size/2) : x.translate(shape.x + x.measureText(shape.name).width/2, shape.y + shape.size/2)    
            x.rotate(parseInt(shape.angle) * (Math.PI / 180))

            var colorAngle = shape.colorAngle * (Math.PI / 180)
            x.fillStyle = x.strokeStyle = shape.color
            var gradient
            if (shape.shape !== "text" && shape.colorSetting === "gradient") {
                var fullShapeSize = parseInt(shape.size) + parseInt(getExtraLength(shape, shape.colorAngle))
                if(shape.gradientSetting === "element") {
                    gradient = x.createLinearGradient(-fullShapeSize/2 * Math.cos(colorAngle), -fullShapeSize/2 * Math.sin(colorAngle), fullShapeSize/2 * Math.cos(colorAngle), fullShapeSize/2 * Math.sin(colorAngle))
                    gradient.addColorStop(0, shape.color2)
                    gradient.addColorStop(1, shape.color)
                } else {
                    gradient = x.createLinearGradient((x.canvas.width - shape.x)/2 + Math.cos(colorAngle) * (x.canvas.width)/2, (x.canvas.height - shape.y)/2 + Math.sin(colorAngle) * (x.canvas.height)/2, (x.canvas.width - shape.x)/2 - Math.cos(colorAngle) * (x.canvas.width)/2, (x.canvas.height - shape.y)/2 - Math.sin(colorAngle) * (x.canvas.height)/2)
                    if (shape.colorAngle <= 90 || shape.colorAngle >= 270) {
                        gradient.addColorStop(0, shape.color2)
                        gradient.addColorStop(0.5, shape.color) // These 2 colorstops are needed because the above gradient is twice as big as the canvas
                        gradient.addColorStop(1, shape.color2)
                    } else {
                        gradient.addColorStop(0, shape.color)
                        gradient.addColorStop(0.5, shape.color2)
                        gradient.addColorStop(1, shape.color)
                    }
                }
                x.fillStyle = x.strokeStyle = gradient
            } else if (shape.colorSetting === "gradient"){
                if(shape.gradientSetting === "element") {
                    gradient = x.createLinearGradient(-x.measureText(shape.name).width/2 * Math.cos(colorAngle), -shape.size/2 * Math.sin(colorAngle), x.measureText(shape.name).width/2 * Math.cos(colorAngle), shape.size/2 * Math.sin(colorAngle))
                    gradient.addColorStop(0, shape.color)
                    gradient.addColorStop(1, shape.color2)
                } else {
                    gradient = x.createLinearGradient((x.canvas.width - shape.x)/2 + Math.cos(colorAngle) * (x.canvas.width)/2, (x.canvas.height - shape.y)/2 + Math.sin(colorAngle) * (x.canvas.height)/2, (x.canvas.width - shape.x)/2 - Math.cos(colorAngle) * (x.canvas.width)/2, (x.canvas.height - shape.y)/2 - Math.sin(colorAngle) * (x.canvas.height)/2)
                    if (shape.colorAngle <= 90 || shape.colorAngle >= 270) {
                        gradient.addColorStop(0, shape.color2)
                        gradient.addColorStop(0.5, shape.color) // These 2 colorstops are needed because the above gradient is twice as big as the canvas
                        gradient.addColorStop(1, shape.color2)
                    } else {
                        gradient.addColorStop(0, shape.color)
                        gradient.addColorStop(0.5, shape.color2)
                        gradient.addColorStop(1, shape.color)
                    }
                }
                x.fillStyle = x.strokeStyle = gradient
            }

            if (shape.shape === "square") {
                x.fillRect(-(shape.size/2), -(shape.size/2), shape.size, shape.size)
            } else if (shape.shape === "circle") {
                x.moveTo(shape.x, shape.y) // To avoid the weird lines between circles
                if (shape.size >= 0) { // To prevent crash on negative size
                    x.arc(0, 0, shape.size/2, 0, 2 * Math.PI)
                }
            } else if (shape.shape === "text") {
                x.fillText(shape.name, -x.measureText(shape.name).width/2, shape.size/2)
            }

            x.fill()
            x.restore()
            x.closePath()
            x.beginPath()

            var newPos = shape
            if (newPos.shape !== "text") {
                var extraLength = parseInt(getExtraLength(newPos, newPos.angle))
                fullShapeSize = parseInt(newPos.size) + extraLength/2
                if (newPos.bounce === false) {
                    if(newPos.x > x.canvas.width + fullShapeSize) {
                        newPos.x = 0 - fullShapeSize
                    } 
                    if (newPos.x < 0 - fullShapeSize) {
                        newPos.x = x.canvas.width + fullShapeSize
                    }
                    if (newPos.y > x.canvas.height + fullShapeSize) {
                        newPos.y = 0 - fullShapeSize
                    } 
                    if (newPos.y < 0 - fullShapeSize) {
                        newPos.y = x.canvas.height + fullShapeSize
                    }
                } else {            
                    if (newPos.x > x.canvas.width - fullShapeSize && newPos.movementAngle <= 180) {
                        newPos.movementAngle = (newPos.movementAngle + 180) % 360
                    }
                    if (newPos.x < 0 + extraLength/2 && newPos.movementAngle >= 180) {
                        newPos.movementAngle = (newPos.movementAngle + 180) % 360
                    }
                    if (newPos.y > x.canvas.height - fullShapeSize && newPos.movementAngle >= 90 && newPos.movementAngle <= 270) {
                        newPos.movementAngle = (newPos.movementAngle + 180) % 360
                    }
                    if (newPos.y < 0 + extraLength/2 && (newPos.movementAngle <= 90 || newPos.movementAngle >= 270)) {
                        newPos.movementAngle = (newPos.movementAngle + 180) % 360
                    }
                }
            } else {
                x.font = `${newPos.size}px ${newPos.font}`
                if (newPos.bounce === false) {
                    if(newPos.x > x.canvas.width + x.measureText(newPos.name).width) {
                        newPos.x = 0 - x.measureText(newPos.name).width
                    } 
                    if (newPos.x < 0 - x.measureText(newPos.name).width) {
                        newPos.x = x.canvas.width
                    }
                    if (newPos.y > x.canvas.height + parseInt(newPos.size)) {
                        newPos.y = 0 - newPos.size
                    } 
                    if (newPos.y < 0 - parseInt(newPos.size)) {
                        newPos.y = x.canvas.height + newPos.size
                    }
                } else {
                    if(newPos.x >= x.canvas.width - x.measureText(newPos.name).width && newPos.movementAngle <= 180) {
                        newPos.movementAngle = (newPos.movementAngle + 180) % 360
                    }
                    if(newPos.x <= 0 && newPos.movementAngle >= 180) {
                        newPos.movementAngle = (newPos.movementAngle + 180) % 360
                    }
                    if(newPos.y >= x.canvas.height - newPos.size && newPos.movementAngle >= 90 && newPos.movementAngle <= 270) {
                        newPos.movementAngle = (newPos.movementAngle + 180) % 360
                    }
                    if(newPos.y <= 0 + (parseInt(newPos.size)*0.5) && (newPos.movementAngle <= 90 || newPos.movementAngle >= 270)) {
                        newPos.movementAngle = (newPos.movementAngle + 180) % 360
                    }
                }
            }
            
            var angle = parseInt(shape.movementAngle)
            var angle2 = angle % 180
            var angle360 = angle % 360
            angle = angle % 90

            
            if (angle2 === 90) {angle = 90}
            if (angle2 > 90) {angle = 90 - angle}
            if (angle2 <= -90) {angle = -90 - angle}

            var speedX = parseInt(shape.speedX) * angle / 90
            var speedY = parseInt(shape.speedX) - (parseInt(shape.speedX) * angle / 90)

            if (angle360 === angle || angle360 > 270) {
                speedY = -speedY
            }
            if (angle360 !== angle2) {
                speedX = -speedX
            }

            newPos.x += speedX
            newPos.y += speedY
            
            newPos.movementAngle = parseInt(newPos.movementAngle) + parseInt(shape.movementSpin)
            newPos.angle += parseInt(shape.spinSpeed) / 10

            if (newPos.movementAngle >= 360) {
                newPos.movementAngle -= 360
            }
            return newPos
        })
    })
}
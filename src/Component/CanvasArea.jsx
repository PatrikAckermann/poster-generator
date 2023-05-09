import React from "react"
import Canvas from "./Canvas"

export function randomNumber(min, max) {
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

    var n = (Math.sqrt(shape.size * shape.size * 2) - shape.size) / 45 * angle
    return n
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
            if (shape.y && shape.x) {
                for (var i = 0; i < shape.columnRepeat; i++) {
                    shapeList.push([])
                    for (var j = 0; j < shape.rowRepeat; j++) {
                        shapeList[shapeIndex].push({...shape, angle: parseInt(shape.angle) + randomNumber(-shape.angleOffset, shape.angleOffset), x: parseInt(shape.x) + shape.repeatDistanceX * i + randomNumber(-offsetRangeX, offsetRangeX), y: parseInt(shape.y) + shape.repeatDistanceY * j + randomNumber(-offsetRangeY, offsetRangeY)})
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
                } else {
                    gradient = x.createLinearGradient((x.canvas.width - shape.x)/2 + Math.cos(colorAngle) * (x.canvas.width)/2, (x.canvas.height - shape.y)/2 + Math.sin(colorAngle) * (x.canvas.height)/2, (x.canvas.width - shape.x)/2 - Math.cos(colorAngle) * (x.canvas.width)/2, (x.canvas.height - shape.y)/2 - Math.sin(colorAngle) * (x.canvas.height)/2)
                    gradient.addColorStop(0.5, shape.color) // These 2 colorstops are needed because the above gradient is twice as big as the canvas
                    gradient.addColorStop(0.5, shape.color2)
                }
                gradient.addColorStop(0, shape.color2)
                gradient.addColorStop(1, shape.color)
                x.fillStyle = x.strokeStyle = gradient
            } else if (shape.colorSetting === "gradient"){
                if(shape.gradientSetting === "element") {
                    gradient = x.createLinearGradient(-x.measureText(shape.name).width/2 * Math.cos(colorAngle), -shape.size/2 * Math.sin(colorAngle), x.measureText(shape.name).width/2 * Math.cos(colorAngle), shape.size/2 * Math.sin(colorAngle))
                } else {
                    gradient = x.createLinearGradient((x.canvas.width - shape.x)/2 + Math.cos(colorAngle) * (x.canvas.width)/2, (x.canvas.height - shape.y)/2 + Math.sin(colorAngle) * (x.canvas.height)/2, (x.canvas.width - shape.x)/2 - Math.cos(colorAngle) * (x.canvas.width)/2, (x.canvas.height - shape.y)/2 - Math.sin(colorAngle) * (x.canvas.height)/2)
                    gradient.addColorStop(0.5, shape.color2) // These 2 colorstops are needed because the above gradient is twice as big as the canvas
                    gradient.addColorStop(0.5, shape.color)
                }
                gradient.addColorStop(0, shape.color)
                gradient.addColorStop(1, shape.color2)
                x.fillStyle = x.strokeStyle = gradient
            }

            if (shape.shape === "square") {
                x.fillRect(-(shape.size/2), -(shape.size/2), shape.size, shape.size)
            } else if (shape.shape === "circle") {
                x.moveTo(shape.x, shape.y) // To avoid the weird lines between circles
                x.arc(0, 0, shape.size/2, 0, 2 * Math.PI)
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
                    if (newPos.x > x.canvas.width - fullShapeSize) {
                        newPos.speedX = -Math.abs(newPos.speedX)
                    }
                    if (newPos.x < 0 + extraLength/2) {
                        newPos.speedX = Math.abs(newPos.speedX)
                    }
                    if (newPos.y > x.canvas.height - fullShapeSize) {
                        newPos.speedY = -Math.abs(newPos.speedY)
                    }
                    if (newPos.y < 0 + extraLength/2) {
                        newPos.speedY = Math.abs(newPos.speedY)
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
                    if(newPos.x >= x.canvas.width - x.measureText(newPos.name).width) {
                        newPos.speedX = -Math.abs(newPos.speedX)
                    }
                    if(newPos.x <= 0) {
                        newPos.speedX = Math.abs(newPos.speedX)
                    }
                    if(newPos.y >= x.canvas.height - newPos.size) {
                        newPos.speedY = -Math.abs(newPos.speedX)
                    }
                    if(newPos.y <= 0 + (parseInt(newPos.size)*0.5)) {
                        newPos.speedY = Math.abs(newPos.speedX)
                    }
                }
            }
            newPos.x += parseInt(shape.speedX)
            newPos.y += parseInt(shape.speedY)
            newPos.angle += parseInt(shape.spinSpeed) / 10
            return newPos
        })
    })
}
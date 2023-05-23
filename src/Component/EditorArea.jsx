import React from "react"
import { getFonts } from "./FontDetector"
import SortableList from "./SortableList"
import "../CSS/Editor.css"
import {randomNumber} from "./CanvasArea"
import german from "../languages/german.json"
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

var shapeAmount = 0

var strings = german

function translateToHexadecimal(number) {
    var hexadecimals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"]
    return hexadecimals[number]
}

function randomColor() {
    var color = "#"
    for (var i = 0; i<6; i++) {
        color += translateToHexadecimal(randomNumber(0, 15))
    }
    return color
}

export default function EditorArea(props) {
    var [currentlyEditing, setCurrentlyEditing] = React.useState(-1)

    function handleChange(e) {
        if (e.target.name === "canvasPreset") {
            props.setData(x => {
                return {...x, canvasSize: {x: 0, y: 0}}
            })
        }
        props.setData(x => {
            return {...x, [e.target.type === "radio" ? e.target.attributes.colorname.nodeValue : e.target.name]: e.target.value}
        })
        return true
    }

    function changeStopped(e) {
        e.preventDefault()
        props.setData(x => {
            return {...x, stopped: !x.stopped}
        })
    }

    function download(dataurl, filename) {
        const link = document.createElement("a");
        link.href = dataurl;
        link.download = filename;
        link.click();
    }

    function saveImage() {
        var canvas = document.querySelector("canvas")
        var image = canvas.toDataURL("image/png")

        download(image, "poster.png")
    }

    async function record() {
        var canvas = document.querySelector("canvas")

        var videoStream = canvas.captureStream(30)
        var mediaRecorder = new MediaRecorder(videoStream, {videoBitsPerSecond: 80000000})

        var chunks = []
        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data)
        }

        mediaRecorder.onstop = function(e) {
            var blob = new Blob(chunks, {"type": "video/webm; codecs=vp9"})
            chunks = []
            var videoURL = URL.createObjectURL(blob)
            download(videoURL, "poster.webm")
        }
        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data)
        }


        mediaRecorder.start()
        setTimeout(() => {
            mediaRecorder.stop()
        }, props.data.videoLength * 1000)
    }

    function startDownload(e) {
        e.preventDefault()
        switch(props.data.fileFormat) {
            case "png":
                saveImage()
                break
            case "webm":
                record()
                break
            default:
                saveImage()
                break
        }
    }

    function addRandomShape() {
        var fonts = getFonts()
        props.setData(x => {
            x.shapes.push({
                id: shapeAmount += 1, 
                gradientSetting: randomNumber(0, 1) === 1 ? "element" : "poster", 
                name: "Text", 
                spinSpeed: randomNumber(0, 1) === 1 ? randomNumber(-100, 100) : 0, 
                offsetRangeX: randomNumber(0, 1) === 1 ? randomNumber(0, 100) : 0, 
                offsetRangeY: randomNumber(0, 1) === 1 ? randomNumber(0, 100) : 0, 
                angleOffset: randomNumber(0, 1) === 1 ? randomNumber(0, 180) : 0, 
                x: randomNumber(0, props.data.sizeMode === "pixels" ? props.data.x : props.data.x * props.data.canvasPpi), 
                y: randomNumber(0, props.data.sizeMode === "pixels" ? props.data.y : props.data.y * props.data.canvasPpi), 
                angle: randomNumber(0, 1) === 1 ? randomNumber(0, 359) : 0, 
                size: randomNumber(1, 500), 
                shape: ["square", "circle", "text"][randomNumber(0, 2)], 
                colorSetting: randomNumber(0, 1) === 1 ? "1" : "gradient", 
                color: randomColor(), 
                color2: randomColor(), 
                colorAngle: randomNumber(0, 1) === 1 ? randomNumber(0, 359) : 0, 
                speedX: randomNumber(0, 1) === 1 ? randomNumber(-10, 10) : 0, 
                movementAngle: randomNumber(0, 359),
                movementSpin: randomNumber(0, 1) === 1 ? randomNumber(0, 10) : 0, 
                repeatDistanceX: randomNumber(0, 300), 
                repeatDistanceY: randomNumber(0, 300), 
                rowRepeat: randomNumber(0, 1) === 1 ? randomNumber(1, 10) : 1, 
                columnRepeat: randomNumber(0, 1) === 1 ? randomNumber(1, 10) : 1,
                bounce: randomNumber(0, 1) === 1 ? true : false,
                font: fonts[randomNumber(0, fonts.length - 1)],
                speedOffset: randomNumber(0, 1) === 1 ? randomNumber(1, 10) : 0,
                sizeOffset: randomNumber(0, 1) === 1 ? randomNumber(1, 300) : 0,
                hidden: false,
                invertX: false,
                invertY: false
            })
            return {...x}
        })
    }

    function createRandomPoster(e) {
        e.preventDefault()
        setCurrentlyEditing(-1)
        props.setData(x => {
            x.shapes = []
            return {...x}
        })
        for (var i = 0; i <= randomNumber(0, 30); i++) {
            addRandomShape()
        }
    }

    if(props.strings !== undefined) {strings = props.strings}
    

    return (
        <div className="EditorArea">
            <div className="Header">
                <h1 className="Title">Poster-Generator</h1>
                <select className="LanguageSelector" name="language" id="language" onChange={handleChange} value={props.data.language}>
                    <option value="german">🇩🇪 {strings.german}</option>
                    <option value="english">🇬🇧 {strings.english}</option>
                </select>
            </div>
            
            <div className="EditorForm">
                <div className="RadioInput">
                    <label>{strings.posterSize}</label>
                    <input type="radio" name="sizeMode" id="sizeModePixels" colorname="sizeMode" onChange={handleChange} value="pixels" checked={props.data.sizeMode === "pixels"}/>
                    <label htmlFor="sizeModePixels" data-tooltip-id="tooltip" data-tooltip-content={strings.ttPosterSizePixel}>{strings.pixel}</label>
                    <input type="radio" name="sizeMode" id="sizeModePrinting" colorname="sizeMode" onChange={handleChange} value="printing" checked={props.data.sizeMode === "printing"}/>
                    <label htmlFor="sizeModePrinting" data-tooltip-id="tooltip" data-tooltip-content={strings.ttPosterSizePrint}>{strings.printFormat}</label>
                </div>
                {props.data.sizeMode === "pixels" && <div className="DoubleInput"> 
                    <div className="Input">
                        <label htmlFor="x">{strings.canvasSizeX}</label>
                        <input type="number" name="x" id="x" max={5000} min={100} onChange={handleChange} value={props.data.x}/>
                    </div>
                    <div className="Input">
                        <label htmlFor="y">{strings.canvasSizeY}</label>
                        <input type="number" name="y" id="y" max={5000} min={100} onChange={handleChange} value={props.data.y}/>
                    </div>
                </div>}
                {props.data.sizeMode === "printing" && <div className="DoubleInputPrintMode">
                    <div className="Input Format">
                        <label htmlFor="canvasSize">{strings.paperFormat}</label>
                        <select name="canvasSize" id="canvasSize" onChange={handleChange} value={props.data.canvasSize}>
                            <option value={JSON.stringify({x: 11.7, y: 16.5})}>A3</option>
                            <option value={JSON.stringify({x: 8.3, y: 11.7})}>A4</option>
                            <option value={JSON.stringify({x: 5.8, y: 8.3})}>A5</option>
                        </select>
                    </div>
                    <div className="Input Format">
                        <label htmlFor="canvasPpi">PPI:</label>
                        <select name="canvasPpi" id="canvasPpi" onChange={handleChange} value={props.data.canvasPpi}>
                            <option value={72}>72</option>
                            <option value={150}>150</option>
                            <option value={180}>180</option>
                            <option value={240}>240</option>
                            <option value={300}>300</option>
                        </select>
                    </div>
                </div>}
                <span className="hr"><hr className="grey"/></span>
                <div className="Input">
                    <button className="Margin" onClick={createRandomPoster}>{strings.randomPoster}</button>
                </div>
                <span className="hr"><hr className="grey"/></span>
                <div className="Input BgColor">
                    <label htmlFor="backgroundColor">{strings.bgColor}</label>
                    <ColorPicker name="background" onChange={handleChange} data={props.data} colorSetting={props.data.colorSetting} color={props.data.color} color2={props.data.color2}/>
                </div>
                <span className="hr"><hr/></span>
                <ShapesEditor currentlyEditing={currentlyEditing} setCurrentlyEditing={setCurrentlyEditing} addRandomShape={addRandomShape} onChange={handleChange} data={props.data} setData={props.setData}/>

                <span className="hr"><hr/></span>
                <button onClick={(e) => changeStopped(e)} className="Margin">{props.data.stopped ? "Start" : "Stop"}</button>
                <span className="hr"><hr className="grey"/></span>
                <div className="Input">
                    <select name="fileFormat" id="fileFormat" onChange={handleChange} value={props.data.fileFormat}>
                        <option value="png">png</option>
                        <option value="webm">webm</option>
                    </select>
                    {["webm"].includes(props.data.fileFormat) && <label htmlFor="videoLength">{strings.length}</label>}
                    {["webm"].includes(props.data.fileFormat) && <input min={1} max={30} type="number" name="videoLength" id="videoLength" onChange={handleChange} value={props.data.videoLength} />}
                    <button onClick={startDownload}>{strings.download}</button>
                </div>
            </div>
        </div>
    )
}

function ShapesEditor(props) {
    var [displayShapes, setDisplayShapes] = React.useState(true)

    function copyElement(id) {
        props.setData(x => {
            var newName = x.shapes[id].name.replace(/ [0-9]$/, "")
            var count = 1

            var found = true
            var testName = newName
            while (found === true) {
                found = false
                x.shapes.forEach(y => {
                    if (y.name === testName) {
                        found = true
                    }
                })
                if (found == false) {
                    if (count != 1) {
                        newName = `${newName} ${count}`
                    }
                } else {
                    count += 1
                    testName = `${newName} ${count}`
                }
            }

            var newShape = {...x.shapes[id], name: newName, id: shapeAmount += 1}
            x.shapes.push(newShape)
            return {...x}
        })
    }

    function toggleButton(e) {
        e.preventDefault()
        setDisplayShapes(x => !x)
    }

    function addShape(e) {
        props.setData(x => {
            x.shapes.push({hidden: false, sizeOffset: 0, speedOffset: 0, repeatMode: "beginning", font: "Arial", bounce: false, id: shapeAmount += 1, spinSpeed: 0, gradientSetting: "element", offsetRangeX: 0, offsetRangeY: 0, angleOffset: 0, name: "Name", shape: "square", x: 100, y: 100, angle: 0, size: 100, colorSetting: "1", color: "#000000", color2: "#000000", colorAngle: 0, repeatDistanceX: 0, repeatDistanceY: 0, rowRepeat: 1, columnRepeat: 1, speedX: 0, movementAngle: 0, movementSpin: 0, invertX: false, invertY: false})
            return {...x}
        })
    }

    function removeShape(id) {
        if (id === props.currentlyEditing) {
            props.setCurrentlyEditing(-1)
        } else if (props.currentlyEditing >= props.data.shapes.length - 1) {
            props.setCurrentlyEditing(x => x - 1)
        }
        
        props.setData(x => {
            x.shapes.splice(id, 1) 
            return {...x}
        })
    }

    function getShapeIds() {
        var shapeIds = []
        props.data.shapes.forEach((x, index) => {
            shapeIds.push([x.id, index])
        })
        return shapeIds
    }

    const onSortEnd = (oldIndex, newIndex) => {
        var currEditing = getShapeIds()[props.currentlyEditing]

        props.setData(x => {
            var oldShape = x.shapes.splice(oldIndex, 1)
            x.shapes.splice(newIndex, 0, oldShape[0])
            return {...x}
        })

        var newShapeIds = getShapeIds()

        newShapeIds.forEach((x, index) => {
            if (x[0] === currEditing[0]) {
                props.setCurrentlyEditing(index)
            }
        })
    }

    function toggleHide(id) {
        props.setData(x => {
            x.shapes[id].hidden = !x.shapes[id].hidden
            return {...x}
        })
    }

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            {props.currentlyEditing !== -1 && <ShapeEditor data={props.data} setData={props.setData} currentlyEditing={props.currentlyEditing}/>}

            <button onClick={addShape} className="Margin">{strings.addShape}</button>
            <button onClick={props.addRandomShape} className="Margin">{strings.addRandomShape}</button>
            <button onClick={(e) => toggleButton(e)} className="Margin">{displayShapes === true ? strings.hideShapes : strings.showShapes}</button>
            {displayShapes && <SortableList strings={strings} currentlyEditing={props.currentlyEditing} copyElement={copyElement} type="shape" toggleHide={toggleHide} items={props.data.shapes} onSortEnd={({oldIndex, newIndex}) => onSortEnd(oldIndex, newIndex)} setCurrentlyEditing={props.setCurrentlyEditing} remove={removeShape}/>}
        </div>
    )
}

function ShapeEditor(props) {
    function editShape(e) { 
        props.setData(x => {
            if (e.target.type === "checkbox") {
                x.shapes[props.currentlyEditing] = {...x.shapes[props.currentlyEditing], [e.target.name]: e.target.checked}
            } else {
                x.shapes[props.currentlyEditing] = {...x.shapes[props.currentlyEditing], [e.target.type === "radio" ? e.target.attributes.colorname.nodeValue : e.target.name]: e.target.value}
            }
            return {...x}
        })
    }
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div className="Input">
                <label htmlFor="name" data-tooltip-id="tooltip" data-tooltip-content={strings.ttName}>{strings.name}</label>
                <input type="text" id="name" name="name" onChange={editShape} value={props.data.shapes[props.currentlyEditing].name}/>
            </div>
            <div className="Input">
                <label htmlFor="shape" data-tooltip-id="tooltip" data-tooltip-content={strings.ttShape}>{strings.shape}</label>
                <select name="shape" id="shape" onChange={editShape} value={props.data.shapes[props.currentlyEditing].shape}>
                    <option value="square">{strings.square}</option>
                    <option value="circle">{strings.circle}</option>
                    <option value="text">{strings.text}</option>
                </select>
            </div>
            {props.data.shapes[props.currentlyEditing].shape === "text" && <div className="Input">
                <label htmlFor="font" data-tooltip-id="tooltip" data-tooltip-content={strings.ttFont}>{strings.font}</label>
                <FontSelector fontVar={props.data.shapes[props.currentlyEditing].font} onChange={editShape}/>
            </div>}
            <span className="hr"><hr className="grey"/></span>
            <div className="Input">
                <label htmlFor="shapeSize" data-tooltip-id="tooltip" data-tooltip-content={strings.ttSize}>{strings.size}</label>
                <input type="number" id="size" name="size" onChange={editShape} value={props.data.shapes[props.currentlyEditing].size}/>
            </div>
            <div className="Input">
                <label htmlFor="sizeOffset" data-tooltip-id="tooltip" data-tooltip-content={strings.ttSizeOffset}>{strings.sizeOffset}</label>
                <input type="number" id="sizeOffset" name="sizeOffset" onChange={editShape} value={props.data.shapes[props.currentlyEditing].sizeOffset}/>
            </div>
            <span className="hr"><hr className="grey"/></span>
            <div className="DoubleInput">
                <div className="Input">
                    <label htmlFor="shapePositionWidth" data-tooltip-id="tooltip" data-tooltip-content={strings.ttPositon}>{strings.shapePositionX}</label>
                    <input type="number" id="x" name="x" onChange={editShape} value={props.data.shapes[props.currentlyEditing].x}/>
                </div>
                <div className="Input">
                    <label htmlFor="shapePositionHeight">{strings.shapePositionY}</label>
                    <input type="number" id="y" name="y" onChange={editShape} value={props.data.shapes[props.currentlyEditing].y}/>
                </div>
            </div>
            <div className="DoubleInput">
                <div className="Input">
                    <label htmlFor="offsetRangeX" data-tooltip-id="tooltip" data-tooltip-content={strings.ttPositionOffset}>{strings.positionOffsetX}</label>
                    <input type="number" id="offsetRangeX" name="offsetRangeX" onChange={editShape} value={props.data.shapes[props.currentlyEditing].offsetRangeX}/>
                </div>
                <div className="Input">
                    <label htmlFor="offsetRangeY">{strings.positionOffsetY}</label>
                    <input type="number" id="offsetRangeY" name="offsetRangeY" onChange={editShape} value={props.data.shapes[props.currentlyEditing].offsetRangeY}/>
                </div>
            </div>
            <span className="hr"><hr className="grey"/></span>
            <div className="Input">
                <label htmlFor="angle" data-tooltip-id="tooltip" data-tooltip-content={strings.ttAngle}>{strings.angle}</label>
                <input type="number" id="angle" name="angle" onChange={editShape} min={0} max={360} value={props.data.shapes[props.currentlyEditing].angle}/>
            </div>
            <div className="Input">
                <label htmlFor="angleOffset" data-tooltip-id="tooltip" data-tooltip-content={strings.ttAngleOffset}>{strings.angleOffset}</label>
                <input type="number" id="angleOffset" name="angleOffset" onChange={editShape} value={props.data.shapes[props.currentlyEditing].angleOffset}/>
            </div>
            <div className="Input">
                <label htmlFor="spinSpeed" data-tooltip-id="tooltip" data-tooltip-content={strings.ttSpinSpeed}>{strings.spinSpeed}</label>
                <input type="number" id="spinSpeed" name="spinSpeed" onChange={editShape} value={props.data.shapes[props.currentlyEditing].spinSpeed}/>
            </div>
            <span className="hr"><hr className="grey"/></span>
            <div className="Input">
                <label htmlFor="speedX" data-tooltip-id="tooltip" data-tooltip-content={strings.ttSpeed}>{strings.speedX}</label>
                <input type="number" id="speedX" name="speedX" onChange={editShape} value={props.data.shapes[props.currentlyEditing].speedX}/>
            </div>
            <div className="Input">
                <label htmlFor="movementAngle" data-tooltip-id="tooltip" data-tooltip-content={strings.ttMovementAngle}>{strings.movementAngle}</label>
                <input type="number" id="movementAngle" name="movementAngle" onChange={editShape} value={props.data.shapes[props.currentlyEditing].movementAngle}/>
            </div>
            <div className="Input">
                <label htmlFor="movementSpin" data-tooltip-id="tooltip" data-tooltip-content={strings.ttMovementSpin}>{strings.movementSpin}</label>
                <input type="number" id="movementSpin" name="movementSpin" onChange={editShape} value={props.data.shapes[props.currentlyEditing].movementSpin}/>
            </div>
            <div className="Input">
                <label htmlFor="speedOffset" data-tooltip-id="tooltip" data-tooltip-content={strings.ttSpeedOffset}>{strings.speedOffset}</label>
                <input type="number" id="speedOffset" name="speedOffset" onChange={editShape} value={props.data.shapes[props.currentlyEditing].speedOffset}/>
            </div>
            <span className="hr"><hr className="grey"/></span>
            <div className="DoubleInput">
                <div className="Input">
                    <label htmlFor="rowRepeat" data-tooltip-id="tooltip" data-tooltip-content={strings.ttRowRepeat}>{strings.repeatRow}</label>
                    <input type="number" id="rowRepeat" name="rowRepeat" onChange={editShape} value={props.data.shapes[props.currentlyEditing].rowRepeat}/>
                </div>
                <div className="Input">
                    <label htmlFor="repeatDistanceY" data-tooltip-id="tooltip" data-tooltip-content={strings.ttDistance}>{strings.distance}</label>
                    <input type="number" id="repeatDistanceY" name="repeatDistanceY" onChange={editShape} value={props.data.shapes[props.currentlyEditing].repeatDistanceY}/>
                </div>
            </div>
            <div className="DoubleInput">
                <div className="Input">
                    <label htmlFor="columnRepeat" data-tooltip-id="tooltip" data-tooltip-content={strings.ttColumnRepeat}>{strings.repeatColumn}</label>
                    <input type="number" id="columnRepeat" name="columnRepeat" onChange={editShape} value={props.data.shapes[props.currentlyEditing].columnRepeat}/>
                </div>
                <div className="Input">
                    <label htmlFor="repeatDistanceX" data-tooltip-id="tooltip" data-tooltip-content={strings.ttDistance}>{strings.distance}</label>
                    <input type="number" id="repeatDistanceX" name="repeatDistanceX" onChange={editShape} value={props.data.shapes[props.currentlyEditing].repeatDistanceX}/>
                </div>
            </div>
            <span className="hr"><hr className="grey"/></span>
            <div className="RadioInput">
                <label htmlFor="bounce"  data-tooltip-id="tooltip" data-tooltip-content={strings.ttBounce}>{strings.bounce}</label>
                <input type="checkbox" id="bounce" name="bounce" onChange={editShape} checked={props.data.shapes[props.currentlyEditing].bounce}/>
            </div>
            <span className="hr"><hr className="grey"/></span>
            <div className="Input">
                <label htmlFor="a" data-tooltip-id="tooltip" data-tooltip-content={strings.ttColor}>{strings.color}</label>
                <ColorPicker gradientSetting onChange={editShape} data={props.data.shapes[props.currentlyEditing]} color={props.data.shapes[props.currentlyEditing].color} color2={props.data.shapes[props.currentlyEditing].color2} name="shape"/>
            </div>
            <span className="hr"><hr/></span>
        </div>
)}

function ColorPicker(props) {
    return <div className="ColorPicker">
        <div className="RadioInput">
            <input colorname="colorSetting" type="radio" id={props.name + "color1"} name={props.name + "colorSetting"} value="1" onChange={props.onChange} checked={props.data.colorSetting === "1"} />
            <label htmlFor={props.name + "color1"} data-tooltip-id="tooltip" data-tooltip-content={strings.ttColor1}>{strings.color1}</label>
            <input colorname="colorSetting" type="radio" id={props.name + "colorGradient"} name={props.name + "colorSetting"} value="gradient" onChange={props.onChange} checked={props.data.colorSetting === "gradient"}/>
            <label htmlFor={props.name + "colorGradient"} data-tooltip-id="tooltip" data-tooltip-content={strings.ttColorGradient}>{strings.gradient}</label>
        </div>
        <input type="color" id="color" name="color" className="Picker" onChange={props.onChange} value={props.color}/>
        {props.data.colorSetting === "gradient" && <input type="color" id="color2" name="color2" className="Picker" onChange={props.onChange} value={props.color2}/>}
        {props.data.colorSetting === "gradient" && <input type="number" min="0" max="359" id="colorAngle" name="colorAngle" className="ColorAngle" onChange={props.onChange} value={props.data.colorAngle}/>}
        {props.gradientSetting && props.data.colorSetting === "gradient" && <div className="RadioInput">
            <input colorname="gradientSetting" type="radio" id={props.name + "Element"} name={props.name + "gradientSetting"} value="element" onChange={props.onChange} checked={props.data.gradientSetting === "element"} />
            <label htmlFor={props.name + "Element"} data-tooltip-id="tooltip" data-tooltip-content={strings.ttColorShape}>{strings.element}</label>
            <input colorname="gradientSetting" type="radio" id={props.name + "Page"} name={props.name + "gradientSetting"} value="page" onChange={props.onChange} checked={props.data.gradientSetting === "page"}/>
            <label htmlFor={props.name + "Page"} data-tooltip-id="tooltip" data-tooltip-content={strings.ttColorPoster}>{strings.poster}</label>
        </div>}
    </div>
}

function FontSelector(props) {
    var [fontOptions, setFontOptions] = React.useState([])
    React.useEffect(() => {
        getFonts()
            .then(x => {
                setFontOptions(x)
            })
    }, [])
    return (
        <div>
            <select name="font" id="font" onChange={props.onChange} value={props.fontVar}>
                {fontOptions.map(x => <option value={x} key={x}>{x}</option>)}
            </select>
            {typeof queryLocalFonts == "undefined" && <p>In deinem Browser können nicht alle Schriftarten erkannt werden. Ein Chromium-basierter Browser wird empfohlen.</p>}
        </div>
    )
}
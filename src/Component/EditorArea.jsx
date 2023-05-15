import React from "react"
import { getFonts } from "./FontDetector"
import SortableList from "./SortableList"
import "../CSS/Editor.css"
import {randomNumber} from "./CanvasArea"

var shapeAmount = 0

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
        console.log(mediaRecorder.videoBitsPerSecond)

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
            console.log(chunks)
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
                speedX: randomNumber(0, 1) === 1 ? randomNumber(-30, 30) : 0, 
                speedY: randomNumber(0, 1) === 1 ? randomNumber(-30, 30) : 0, 
                repeatDistanceX: randomNumber(0, 300), 
                repeatDistanceY: randomNumber(0, 300), 
                rowRepeat: randomNumber(0, 1) === 1 ? randomNumber(1, 10) : 1, 
                columnRepeat: randomNumber(0, 1) === 1 ? randomNumber(1, 10) : 1,
                bounce: randomNumber(0, 1) === 1 ? true : false,
                font: fonts[randomNumber(0, fonts.length - 1)],
                speedOffsetX: randomNumber(0, 1) === 1 ? randomNumber(1, 10) : 0,
                speedOffsetY: randomNumber(0, 1) === 1 ? randomNumber(1, 10) : 0,
                sizeOffset: randomNumber(0, 1) === 1 ? randomNumber(1, 300) : 0,
                hidden: false
            })
            return {...x}
        })
    }

    function createRandomPoster(e) {
        e.preventDefault()
        props.setData(x => {
            x.shapes = []
            return {...x}
        })
        for (var i = 0; i <= randomNumber(0, 30); i++) {
            addRandomShape()
        }
    }

    return (
        <div className="EditorArea">
            <h1 className="Title">Poster-Generator</h1>
            <div className="EditorForm">
                <div className="RadioInput">
                    <label>Postergrösse:</label>
                    <input type="radio" name="sizeMode" id="sizeModePixels" colorname="sizeMode" onChange={handleChange} value="pixels" checked={props.data.sizeMode === "pixels"}/>
                    <label htmlFor="sizeModePixels">Pixel</label>
                    <input type="radio" name="sizeMode" id="sizeModePrinting" colorname="sizeMode" onChange={handleChange} value="printing" checked={props.data.sizeMode === "printing"}/>
                    <label htmlFor="sizeModePrinting">Druckformat</label>
                </div>
                {props.data.sizeMode === "pixels" && <div className="DoubleInput">
                    <div className="Input">
                        <label htmlFor="x">Canvasgrösse - Breite:</label>
                        <input type="number" name="x" id="x" onChange={handleChange} value={props.data.x}/>
                    </div>
                    <div className="Input">
                        <label htmlFor="y">Höhe:</label>
                        <input type="number" name="y" id="y" onChange={handleChange} value={props.data.y}/>
                    </div>
                </div>}
                {props.data.sizeMode === "printing" && <div className="DoubleInputPrintMode">
                    <div className="Input Format">
                        <label htmlFor="canvasSize">Papierformat:</label>
                        <select name="canvasSize" id="canvasSize" onChange={handleChange} value={props.data.canvasSize}>
                            <option value={JSON.stringify({x: 11.7, y: 16.5})}>A3</option>
                            <option value={JSON.stringify({x: 8.3, y: 11.7})}>A4</option>
                            <option value={JSON.stringify({x: 5.8, y: 8.3})}>A5</option>
                        </select>
                    </div>
                    <div className="Input PPI">
                        <label htmlFor="canvasPpi">PPI:</label>
                        <input type="number" name="canvasPpi" id="canvasPpi" onChange={handleChange} value={props.data.canvasPpi}/>
                    </div>
                </div>}
                <span className="hr"><hr/></span>
                <div className="Input">
                    <button className="Margin" onClick={createRandomPoster}>Zufälliges Poster generieren</button>
                </div>

                <span className="hr"><hr/></span>
                <div className="Input">
                    <label htmlFor="backgroundColor">Hintergrundfarbe: </label>
                    <ColorPicker name="background" onChange={handleChange} data={props.data} colorSetting={props.data.colorSetting} color={props.data.color} color2={props.data.color2}/>
                </div>
                <span className="hr"><hr/></span>
                <ShapesEditor addRandomShape={addRandomShape} onChange={handleChange} data={props.data} setData={props.setData}/>

                <span className="hr"><hr/></span>
                <button onClick={(e) => changeStopped(e)} className="Margin">{props.data.stopped ? "Start" : "Stop"}</button>
                
                <div className="Input">
                    <select name="fileFormat" id="fileFormat" onChange={handleChange} value={props.data.fileFormat}>
                        <option value="png">png</option>
                        <option value="webm">webm</option>
                    </select>
                    {["webm"].includes(props.data.fileFormat) && <label htmlFor="videoLength">Länge:</label>}
                    {["webm"].includes(props.data.fileFormat) && <input type="number" name="videoLength" id="videoLength" onChange={handleChange} value={props.data.videoLength} />}
                    <button onClick={startDownload}>Herunterladen</button>
                </div>
            </div>
        </div>
    )
}

function ShapesEditor(props) {
    var [displayShapes, setDisplayShapes] = React.useState(true)
    var [currentlyEditing, setCurrentlyEditing] = React.useState(-1)

    function copyElement(id) {
        props.setData(x => {
            x.shapes.push({...x.shapes[id], id: shapeAmount += 1})
            return {...x}
        })
    }

    function toggleButton(e) {
        e.preventDefault()
        setDisplayShapes(x => !x)
    }

    function addShape(e) {
        props.setData(x => {
            x.shapes.push({hidden: false, sizeOffset: 0, speedOffsetX: 0, speedOffsetY: 0, repeatMode: "beginning", font: "Arial", bounce: false, id: shapeAmount += 1, spinSpeed: 0, gradientSetting: "element", offsetRangeX: 0, offsetRangeY: 0, angleOffset: 0, name: "Name", shape: "square", x: 100, y: 100, angle: 0, size: 100, colorSetting: "1", color: "#000000", color2: "#000000", colorAngle: 0, repeatDistanceX: 0, repeatDistanceY: 0, rowRepeat: 1, columnRepeat: 1, speedX: 0, speedY: 0})
            return {...x}
        })
    }

    function removeShape(id) {
        if (id === currentlyEditing) {
            setCurrentlyEditing(-1)
        } else if (currentlyEditing >= props.data.shapes.length - 1) {
            setCurrentlyEditing(x => x - 1)
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
        var currEditing = getShapeIds()[currentlyEditing]

        props.setData(x => {
            var oldShape = x.shapes.splice(oldIndex, 1)
            x.shapes.splice(newIndex, 0, oldShape[0])
            return {...x}
        })

        var newShapeIds = getShapeIds()

        newShapeIds.forEach((x, index) => {
            if (x[0] === currEditing[0]) {
                setCurrentlyEditing(index)
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
            {currentlyEditing !== -1 && <ShapeEditor data={props.data} setData={props.setData} currentlyEditing={currentlyEditing}/>}

            <button onClick={addShape} className="Margin">Form hinzufügen</button>
            <button onClick={props.addRandomShape} className="Margin">Zufällige Form hinzufügen</button>
            <button onClick={(e) => toggleButton(e)} className="Margin">Formen {displayShapes === true ? "verstecken" : "anzeigen"}</button>
            {displayShapes && <SortableList currentlyEditing={currentlyEditing} copyElement={copyElement} type="shape" toggleHide={toggleHide} items={props.data.shapes} onSortEnd={({oldIndex, newIndex}) => onSortEnd(oldIndex, newIndex)} setCurrentlyEditing={setCurrentlyEditing} remove={removeShape}/>}
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
                <label htmlFor="name">Name: </label>
                <input type="text" id="name" name="name" onChange={editShape} value={props.data.shapes[props.currentlyEditing].name}/>
            </div>
            <div className="Input">
                <label htmlFor="shape">Form: </label>
                <select name="shape" id="shape" onChange={editShape} value={props.data.shapes[props.currentlyEditing].shape}>
                    <option value="square">Quadrat</option>
                    <option value="circle">Kreis</option>
                    <option value="text">Text</option>
                </select>
            </div>
            {props.data.shapes[props.currentlyEditing].shape === "text" && <div className="Input">
                <label htmlFor="font">Schriftart:</label>
                <FontSelector fontVar={props.data.shapes[props.currentlyEditing].font} onChange={editShape}/>
            </div>}
            <div className="Input">
                <label htmlFor="shapeSize">Grösse: </label>
                <input type="number" id="size" name="size" onChange={editShape} value={props.data.shapes[props.currentlyEditing].size}/>
            </div>
            <div className="Input">
                <label htmlFor="angle">Winkel: </label>
                <input type="number" id="angle" name="angle" onChange={editShape} min={0} max={360} value={props.data.shapes[props.currentlyEditing].angle}/>
            </div>
            <div className="DoubleInput">
                <div className="Input">
                    <label htmlFor="shapePositionWidth">Position - Breite: </label>
                    <input type="number" id="x" name="x" onChange={editShape} value={props.data.shapes[props.currentlyEditing].x}/>
                </div>
                <div className="Input">
                    <label htmlFor="shapePositionHeight">Höhe: </label>
                    <input type="number" id="y" name="y" onChange={editShape} value={props.data.shapes[props.currentlyEditing].y}/>
                </div>
            </div>
            <div className="DoubleInput">
                <div className="Input">
                    <label htmlFor="rowRepeat">Reihe wiederholen: </label>
                    <input type="number" id="rowRepeat" name="rowRepeat" onChange={editShape} value={props.data.shapes[props.currentlyEditing].rowRepeat}/>
                </div>
                <div className="Input">
                    <label htmlFor="repeatDistanceY">Distanz: </label>
                    <input type="number" id="repeatDistanceY" name="repeatDistanceY" onChange={editShape} value={props.data.shapes[props.currentlyEditing].repeatDistanceY}/>
                </div>
            </div>
            <div className="DoubleInput">
                <div className="Input">
                    <label htmlFor="columnRepeat">Spalte wiederholen: </label>
                    <input type="number" id="columnRepeat" name="columnRepeat" onChange={editShape} value={props.data.shapes[props.currentlyEditing].columnRepeat}/>
                </div>
                <div className="Input">
                    <label htmlFor="repeatDistanceX">Distanz: </label>
                    <input type="number" id="repeatDistanceX" name="repeatDistanceX" onChange={editShape} value={props.data.shapes[props.currentlyEditing].repeatDistanceX}/>
                </div>
            </div>
            <div className="DoubleInput">
                <div className="Input">
                    <label htmlFor="speedX">Geschwindigkeit - Breite: </label>
                    <input type="number" id="speedX" name="speedX" onChange={editShape} value={props.data.shapes[props.currentlyEditing].speedX}/>
                </div>
                <div className="Input">
                    <label htmlFor="speedY">Höhe: </label>
                    <input type="number" id="speedY" name="speedY" onChange={editShape} value={props.data.shapes[props.currentlyEditing].speedY}/>
                </div>
            </div>
            <div className="DoubleInput">
                <div className="Input">
                    <label htmlFor="offsetRangeX">Position Offset - Breite: </label>
                    <input type="number" id="offsetRangeX" name="offsetRangeX" onChange={editShape} value={props.data.shapes[props.currentlyEditing].offsetRangeX}/>
                </div>
                <div className="Input">
                    <label htmlFor="offsetRangeY">Höhe: </label>
                    <input type="number" id="offsetRangeY" name="offsetRangeY" onChange={editShape} value={props.data.shapes[props.currentlyEditing].offsetRangeY}/>
                </div>
            </div>
            <div className="Input">
                <label htmlFor="angleOffset">Winkel Offset: </label>
                <input type="number" id="angleOffset" name="angleOffset" onChange={editShape} value={props.data.shapes[props.currentlyEditing].angleOffset}/>
            </div>
            <div className="Input">
                <label htmlFor="sizeOffset">Grösse Offset: </label>
                <input type="number" id="sizeOffset" name="sizeOffset" onChange={editShape} value={props.data.shapes[props.currentlyEditing].sizeOffset}/>
            </div>
            <div className="DoubleInput">
                <div className="Input">
                    <label htmlFor="speedOffsetX">Geschwindigkeit Offset - Breite: </label>
                    <input type="number" id="speedOffsetX" name="speedOffsetX" onChange={editShape} value={props.data.shapes[props.currentlyEditing].speedOffsetX}/>
                </div>
                <div className="Input">
                    <label htmlFor="speedOffsetY">Höhe: </label>
                    <input type="number" id="speedOffsetY" name="speedOffsetY" onChange={editShape} value={props.data.shapes[props.currentlyEditing].speedOffsetY}/>
                </div>
            </div>
            <div className="Input">
                <label htmlFor="spinSpeed">Drehgeschwindigkeit: </label>
                <input type="number" id="spinSpeed" name="spinSpeed" onChange={editShape} value={props.data.shapes[props.currentlyEditing].spinSpeed}/>
            </div>
            <div className="RadioInput">
                <label htmlFor="bounce">Bounce: </label>
                <input type="checkbox" id="bounce" name="bounce" onChange={editShape} checked={props.data.shapes[props.currentlyEditing].bounce}/>
            </div>
            <div className="Input">
                <label htmlFor="a">Farbe:</label>
                <ColorPicker gradientSetting onChange={editShape} data={props.data.shapes[props.currentlyEditing]} color={props.data.shapes[props.currentlyEditing].color} color2={props.data.shapes[props.currentlyEditing].color2} name="shape"/>
            </div>
            <span className="hr"><hr/></span>
        </div>
)}

function ColorPicker(props) {
    return <div className="ColorPicker">
        <div className="RadioInput">
            <input colorname="colorSetting" type="radio" id={props.name + "color1"} name={props.name + "colorSetting"} value="1" onChange={props.onChange} checked={props.data.colorSetting === "1"} />
            <label htmlFor={props.name + "color1"}>1 Farbe</label>
            <input colorname="colorSetting" type="radio" id={props.name + "colorGradient"} name={props.name + "colorSetting"} value="gradient" onChange={props.onChange} checked={props.data.colorSetting === "gradient"}/>
            <label htmlFor={props.name + "colorGradient"}>Farbverlauf</label>
        </div>
        <input type="color" id="color" name="color" className="Picker" onChange={props.onChange} value={props.color}/>
        {props.data.colorSetting === "gradient" && <input type="color" id="color2" name="color2" className="Picker" onChange={props.onChange} value={props.color2}/>}
        {props.data.colorSetting === "gradient" && <input type="number" min="0" max="359" id="colorAngle" name="colorAngle" className="ColorAngle" onChange={props.onChange} value={props.data.colorAngle}/>}
        {props.gradientSetting && props.data.colorSetting === "gradient" && <div className="RadioInput">
            <input colorname="gradientSetting" type="radio" id={props.name + "Element"} name={props.name + "gradientSetting"} value="element" onChange={props.onChange} checked={props.data.gradientSetting === "element"} />
            <label htmlFor={props.name + "Element"}>Element</label>
            <input colorname="gradientSetting" type="radio" id={props.name + "Page"} name={props.name + "gradientSetting"} value="page" onChange={props.onChange} checked={props.data.gradientSetting === "page"}/>
            <label htmlFor={props.name + "Page"}>Poster</label>
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
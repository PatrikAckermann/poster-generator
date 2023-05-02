import React from "react"
import { getFonts } from "./FontDetector"
import SortableList from "./SortableList"
import "../CSS/Editor.css"

var textAmount = 0
var shapeAmount = 0

export default function EditorArea(props) {
    function addText(e, speedX=0) {
        props.setData(x => {
            x.texts.push({id: textAmount += 1, gradientSetting: "element", text: "Text", spinSpeed: 0, offsetRangeX: 0, offsetRangeY: 0, angleOffset: 0, x: 100, y: 100, angle: 0, size: 10, font: "Arial", colorSetting: "1", color: "#000000", color2: "#000000", colorAngle: 0, speedX: speedX, speedY: 0, repeatDistanceX: 0, repeatDistanceY: 0, rowRepeat: 1, columnRepeat: 1})
            return {...x}
        })
    }

    function handleChange(e) {
        if (e.target.name === "pattern") {
            props.setData(x => {
                return {...x, texts: [], shapes: []}
            })
            if (e.target.value !== "shapes") {
                addText(e, 10)
            }
        } 
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

    function changeStopped(e, stopped) {
        e.preventDefault()
        props.setData(x => {
            return {...x, stopped: stopped}
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
        var mediaRecorder = new MediaRecorder(videoStream, {videoBitsPerSecond: 50000000})
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

    return (
        <div className="EditorArea">
            <h1 className="Title">Poster-Generator</h1>
            <div className="EditorForm">
                <div className="SettingPair">
                    <label>Postergrösse:</label>
                    <input type="radio" name="sizeMode" id="sizeModePixels" colorname="sizeMode" onChange={handleChange} value="pixels" checked={props.data.sizeMode === "pixels"}/>
                    <label htmlFor="sizeModePixels">Pixel</label>
                    <input type="radio" name="sizeMode" id="sizeModePrinting" colorname="sizeMode" onChange={handleChange} value="printing" checked={props.data.sizeMode === "printing"}/>
                    <label htmlFor="sizeModePrinting">Druckformat</label>
                </div>
                {props.data.sizeMode === "pixels" && <div className="CanvasSizePixel SettingPair">
                    <label htmlFor="x">Canvasgrösse - Breite:</label>
                    <input type="number" name="x" id="x" onChange={handleChange} value={props.data.x}/>
                    <label htmlFor="y">Höhe:</label>
                    <input type="number" name="y" id="y" onChange={handleChange} value={props.data.y}/>
                </div>}
                {props.data.sizeMode === "printing" && <div className="SettingPair">
                    <label htmlFor="canvasSize">Papierformat:</label>
                    <select name="canvasSize" id="canvasSize" onChange={handleChange} value={props.data.canvasSize}>
                        <option value={JSON.stringify({x: 11.7, y: 16.5})}>A3</option>
                        <option value={JSON.stringify({x: 8.3, y: 11.7})}>A4</option>
                        <option value={JSON.stringify({x: 5.8, y: 8.3})}>A5</option>
                    </select>
                    <label htmlFor="canvasPpi">PPI:</label>
                    <input type="number" name="canvasPpi" id="canvasPpi" onChange={handleChange} value={props.data.canvasPpi}/>
                </div>}
                <span className="hr"><hr/></span>
                <div>
                    <label htmlFor="pattern">Animation: </label>
                    <select name="pattern" id="pattern" onChange={handleChange} value={props.data.pattern}>
                        <option value="shapes">Formen</option>
                        <option value="left-right">Links-Rechts</option>
                        <option value="bounce">Bounce</option>
                        <option value="dvd">DVD</option>
                    </select>
                </div>

                <span className="hr"><hr/></span>
                <div className="SettingPair">
                    <label htmlFor="backgroundColor">Hintergrundfarbe: </label>
                    <ColorPicker name="background" onChange={handleChange} data={props.data} colorSetting={props.data.colorSetting} color={props.data.color} color2={props.data.color2}/>
                </div>
                <span className="hr"><hr/></span>

                {["left-right", "bounce", "dvd"].includes(props.data.pattern) && <DefaultEditor onChange={handleChange} data={props.data} setData={props.setData}/>}
                {props.data.pattern === "shapes" && <ShapesEditor onChange={handleChange} data={props.data} setData={props.setData} addText={addText}/>}

                <span className="hr"><hr/></span>
                <button onClick={(e) => changeStopped(e, false)}>Start</button>
                <button onClick={(e) => changeStopped(e, true)}>Stop</button>
                <span className="hr"><hr/></span>
                
                <div className="SettingPair">
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

function DefaultEditor(props) {
    function handleChange(e) {
        props.setData(x => {
            return {
                ...x,
                texts: [
                    {
                        ...x.texts[0],
                        [e.target.type === "radio" ? e.target.attributes.colorname.nodeValue : e.target.name]: e.target.value
                    }
            ]
        }})
    }
    return (
        <form className="DefaultEditor">
            <div className="SettingPair">
                <label htmlFor="text">Text: </label>
                <input type="text" id="text" name="text" onChange={handleChange} value={props.data.texts[0].text}/>
            </div>
            <div className="SettingPair">
                <label htmlFor="font">Schrift: </label>
                <FontSelector fontVar={props.data.texts[0].font} onChange={handleChange}/>
            </div>
            <div className="SettingPair">
                <label htmlFor="fontSize">Schriftgrösse: </label>
                <input type="number" id="size" name="size" onChange={handleChange} value={props.data.texts[0].size}/>
            </div>
            <div className="SettingPair">
                <label htmlFor="speedY">Geschwindigkeit: </label>
                <input type="number" id="speedX" name="speedX" onChange={handleChange} value={props.data.texts[0].speedX}/>
            </div>
            <div className="SettingPair">
                <label htmlFor="color">Textfarbe: </label>
                <ColorPicker onChange={handleChange} data={props.data.texts[0]} colorSetting={props.data.texts[0].color} color={props.data.texts[0].color} color2={props.data.texts[0].color2} name="text"/>
            </div>
                
        </form>
    )
}

function ShapesEditor(props) {
    var [displayTexts, setDisplayTexts] = React.useState(true)
    var [displayShapes, setDisplayShapes] = React.useState(true)
    var [currentlyEditing, setCurrentlyEditing] = React.useState({type: "none", id: 0})

    function copyElement(type, id) {
        if (type === "text") {
            props.setData(x => {
                x.texts.push(x.texts[id])
                return {...x}
            })
        } else {
            props.setData(x => {
                x.shapes.push(x.shapes[id])
                return {...x}
            })
        }
    }

    function toggleButton(e, div) {
        e.preventDefault()
        div === "texts" ? setDisplayTexts(x => !x) : setDisplayShapes(x => !x)
    }

    function addShape(e) {
        props.setData(x => {
            x.shapes.push({id: shapeAmount += 1, spinSpeed: 0, gradientSetting: "element", offsetRangeX: 0, offsetRangeY: 0, angleOffset: 0, name: "Name", shape: "square", x: 100, y: 100, angle: 0, size: 100, colorSetting: "1", color: "#000000", color2: "#000000", colorAngle: 0, repeatDistanceX: 0, repeatDistanceY: 0, rowRepeat: 1, columnRepeat: 1, speedX: 0, speedY: 0})
            return {...x}
        })
    }

    function removeText(id) {
        if (currentlyEditing.id === id && currentlyEditing.type === "text") {
            var newId = 0
            if (newId !== id && newId < props.data.texts.length) {
                setCurrentlyEditing({type: "text", id: 0})
            } else if (props.data.shapes.length >= 1){
                setCurrentlyEditing({type: "shape", id: 0})
            } else {
                setCurrentlyEditing({type: "none", id: 0})
            }
        }
        
        props.setData(x => {
            x.texts.splice(id, 1) 
            return {...x}
        })
    }

    function removeShape(id) {
        if (currentlyEditing.id === id && currentlyEditing.type === "shape") {
            var newId = 0
            if (newId !== id && newId < props.data.shapes.length) {
                setCurrentlyEditing({type: "shape", id: 0})
            } else if (props.data.texts.length >= 1) {
                setCurrentlyEditing({type: "text", id: 0})
            } else {
                setCurrentlyEditing({type: "none", id: 0})
            }
        }
        
        props.setData(x => {
            x.shapes.splice(id, 1) 
            return {...x}
        })
    }

    const onSortEnd = (oldIndex, newIndex, type) => {
        props.setData(x => {
            if (type === "text") {
                var oldText = x.texts.splice(oldIndex, 1)
                x.texts.splice(newIndex, 0, oldText[0])
            }
            if (type === "shape") {
                var oldShape = x.shapes.splice(oldIndex, 1)
                x.shapes.splice(newIndex, 0, oldShape[0])
            }
            return {...x}
        })
    }

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            {currentlyEditing.type === "text" && <TextEditor data={props.data} setData={props.setData} currentlyEditing={currentlyEditing}/>}
            {currentlyEditing.type === "shape" && <ShapeEditor data={props.data} setData={props.setData} currentlyEditing={currentlyEditing}/>}

            <button onClick={props.addText}>Text hinzufügen</button>
            <button onClick={(e) => toggleButton(e, "texts")}>Texte {displayTexts === true ? "verstecken" : "anzeigen"}</button>
            {displayTexts && <SortableList copyElement={copyElement} type="text" items={props.data.texts} onSortEnd={({oldIndex, newIndex}) => onSortEnd(oldIndex, newIndex, "text")} setCurrentlyEditing={setCurrentlyEditing} remove={removeText}/>}
            <span className="hr"><hr/></span>
            <button onClick={addShape}>Form hinzufügen</button>
            <button onClick={(e) => toggleButton(e, "shapes")}>Formen {displayShapes === true ? "verstecken" : "anzeigen"}</button>
            {displayShapes && <SortableList copyElement={copyElement} type="shape" items={props.data.shapes} onSortEnd={({oldIndex, newIndex}) => onSortEnd(oldIndex, newIndex, "shape")} setCurrentlyEditing={setCurrentlyEditing} remove={removeShape}/>}
        </div>
    )
}
 
function TextEditor(props) {
    function editText(e) {
        props.setData(x => {
            x.texts[props.currentlyEditing.id] = {...x.texts[props.currentlyEditing.id], [e.target.type === "radio" ? e.target.attributes.colorname.nodeValue : e.target.name]: e.target.value}
            return {...x}
        })
    }

    var texts = props.data.texts[props.currentlyEditing.id]

    return (
    <div style={{display: "flex", flexDirection: "column"}}>
        <div className="SettingPair">
            <label htmlFor="text">Text:</label>
            <input type="text" id="text" name="text" className="text" onChange={editText} value={texts.text}/>
        </div>
        <div className="SettingPair">
            <label htmlFor="font">Schriftart:</label>
            <FontSelector fontVar={texts.font} onChange={editText}/>
        </div>
        <div className="SettingPair">
            <label htmlFor="size">Schriftgrösse:</label>
            <input type="number" id="size" name="size" className="text" onChange={editText} value={texts.size}/>
        </div>
        <div className="SettingPair">
            <label htmlFor="angle">Winkel: </label>
            <input type="number" id="angle" name="angle" className="text" sonChange={editText} value={texts.angle}/>
        </div>
        <div className="SettingPair">
            <label htmlFor="x">Breite:</label>
            <input type="number" id="x" name="x" className="text" onChange={editText} value={texts.x}/>
            <label htmlFor="y">Höhe:</label>
            <input type="number" id="y" name="y" className="text" onChange={editText} value={texts.y}/>
        </div>
        <div className="SettingPair">
            <label htmlFor="rowRepeat">Reihe wiederholen: </label>
            <input type="number" id="rowRepeat" name="rowRepeat" onChange={editText} value={texts.rowRepeat}/>
            <label htmlFor="repeatDistanceY">Distanz: </label>
            <input type="number" id="repeatDistanceY" name="repeatDistanceY" onChange={editText} value={texts.repeatDistanceY}/>
        </div>
        <div className="SettingPair">
            <label htmlFor="columnRepeat">Spalte wiederholen: </label>
            <input type="number" id="columnRepeat" name="columnRepeat" onChange={editText} value={texts.columnRepeat}/>
            <label htmlFor="repeatDistanceX">Distanz: </label>
            <input type="number" id="repeatDistanceX" name="repeatDistanceX" onChange={editText} value={texts.repeatDistanceX}/>
        </div>
        <div className="SettingPair">
            <label htmlFor="offsetRangeX">Random Offset - Breite: </label>
            <input type="number" id="offsetRangeX" name="offsetRangeX" onChange={editText} value={texts.offsetRangeX}/>
            <label htmlFor="offsetRangeY">Höhe: </label>
            <input type="number" id="offsetRangeY" name="offsetRangeY" onChange={editText} value={texts.offsetRangeY}/>
        </div>
        <div className="SettingPair">
            <label htmlFor="angleOffset">Winkel Offset: </label>
            <input type="number" id="angleOffset" name="angleOffset" onChange={editText} value={texts.angleOffset}/>
        </div>
        <div className="SettingPair">
            <label htmlFor="speedX">Geschwindigkeit - Breite: </label>
            <input type="number" id="speedX" name="speedX" onChange={editText} value={texts.speedX}/>
            <label htmlFor="speedY">Höhe: </label>
            <input type="number" id="speedY" name="speedY" onChange={editText} value={texts.speedY}/>
        </div>
        <div className="SettingPair">
            <label htmlFor="spinSpeed">Drehgeschwindigkeit: </label>
            <input type="number" id="spinSpeed" name="spinSpeed" onChange={editText} value={texts.spinSpeed}/>
        </div>
        <div className="SettingPair">
            <label htmlFor="a">Farbe:</label>
            <ColorPicker gradientSetting onChange={editText} data={texts} color={texts.color} color2={texts.color2} name="shape"/>
        </div>
        <span className="hr"><hr/></span>
    </div>
)}

function ShapeEditor(props) {
    function editShape(e) { 
        props.setData(x => {
            x.shapes[props.currentlyEditing.id] = {...x.shapes[props.currentlyEditing.id], [e.target.type === "radio" ? e.target.attributes.colorname.nodeValue : e.target.name]: e.target.value}
            return {...x}
        })
    }
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div className="SettingPair">
                <label htmlFor="name">Name: </label>
                <input type="text" id="name" name="name" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].name}/>
            </div>
            <div className="SettingPair">
                <label htmlFor="shape">Form: </label>
                <select name="shape" id="shape" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].shape}>
                    <option value="square">Quadrat</option>
                    <option value="circle">Kreis</option>
                </select>
            </div>
            <div className="SettingPair">
                <label htmlFor="shapePositionWidth">Position - Breite: </label>
                <input type="number" id="x" name="x" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].x}/>
                <label htmlFor="shapePositionHeight">Höhe: </label>
                <input type="number" id="y" name="y" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].y}/>
            </div>
            <div className="SettingPair">
                <label htmlFor="shapeSize">Grösse: </label>
                <input type="number" id="size" name="size" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].size}/>
            </div>
            <div className="SettingPair">
                <label htmlFor="angle">Winkel: </label>
                <input type="number" id="angle" name="angle" onChange={editShape} min={0} max={360} value={props.data.shapes[props.currentlyEditing.id].angle}/>
            </div>
            <div className="SettingPair">
                <label htmlFor="rowRepeat">Reihe wiederholen: </label>
                <input type="number" id="rowRepeat" name="rowRepeat" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].rowRepeat}/>
                <label htmlFor="repeatDistanceY">Distanz: </label>
                <input type="number" id="repeatDistanceY" name="repeatDistanceY" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].repeatDistanceY}/>
            </div>
            <div className="SettingPair">
                <label htmlFor="columnRepeat">Spalte wiederholen: </label>
                <input type="number" id="columnRepeat" name="columnRepeat" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].columnRepeat}/>
                <label htmlFor="repeatDistanceX">Distanz: </label>
                <input type="number" id="repeatDistanceX" name="repeatDistanceX" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].repeatDistanceX}/>
            </div>
            <div className="SettingPair">
                <label htmlFor="offsetRangeX">Random Offset - Breite: </label>
                <input type="number" id="offsetRangeX" name="offsetRangeX" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].offsetRangeX}/>
                <label htmlFor="offsetRangeY">Höhe: </label>
                <input type="number" id="offsetRangeY" name="offsetRangeY" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].offsetRangeY}/>
            </div>
            <div className="SettingPair">
                <label htmlFor="angleOffset">Winkel Offset: </label>
                <input type="number" id="angleOffset" name="angleOffset" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].angleOffset}/>
            </div>
            <div className="SettingPair">
                <label htmlFor="speedX">Geschwindigkeit - Breite: </label>
                <input type="number" id="speedX" name="speedX" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].speedX}/>
                <label htmlFor="speedY">Höhe: </label>
                <input type="number" id="speedY" name="speedY" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].speedY}/>
            </div>
            <div className="SettingPair">
                <label htmlFor="spinSpeed">Drehgeschwindigkeit: </label>
                <input type="number" id="spinSpeed" name="spinSpeed" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].spinSpeed}/>
            </div>
            <div className="SettingPair">
                <label htmlFor="a">Farbe:</label>
                <ColorPicker gradientSetting onChange={editShape} data={props.data.shapes[props.currentlyEditing.id]} color={props.data.shapes[props.currentlyEditing.id].color} color2={props.data.shapes[props.currentlyEditing.id].color2} name="shape"/>
            </div>
            <span className="hr"><hr/></span>
        </div>
)}

function ColorPicker(props) {
    return <div className="SettingPair">
            <div className="SettingPair">
                <input colorname="colorSetting" type="radio" id={props.name + "color1"} name={props.name + "colorSetting"} value="1" onChange={props.onChange} checked={props.data.colorSetting === "1"} />
                <label htmlFor={props.name + "color1"}>1 Farbe</label>
                <input colorname="colorSetting" type="radio" id={props.name + "colorGradient"} name={props.name + "colorSetting"} value="gradient" onChange={props.onChange} checked={props.data.colorSetting === "gradient"}/>
                <label htmlFor={props.name + "colorGradient"}>Farbverlauf</label>
            </div>
            <input type="color" id="color" name="color" onChange={props.onChange} value={props.color}/>
            {props.data.colorSetting === "gradient" && <input type="color" id="color2" name="color2" onChange={props.onChange} value={props.color2}/>}
            {props.data.colorSetting === "gradient" && <input type="number" id="colorAngle" name="colorAngle" onChange={props.onChange} value={props.data.colorAngle}/>}
            {props.gradientSetting && props.data.colorSetting === "gradient" && <div className="SettingPair">
                <input colorname="gradientSetting" type="radio" id={props.name + "Element"} name={props.name + "gradientSetting"} value="element" onChange={props.onChange} checked={props.data.gradientSetting === "element"} />
                <label htmlFor={props.name + "Element"}>Element</label>
                <input colorname="gradientSetting" type="radio" id={props.name + "Page"} name={props.name + "gradientSetting"} value="page" onChange={props.onChange} checked={props.data.gradientSetting === "page"}/>
                <label htmlFor={props.name + "Page"}>Poster</label>
            </div>}
        </div>
}

function FontSelector(props) {
    var [fontOptions, setFontOptions] = React.useState(["Arial", "Poppins"])
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
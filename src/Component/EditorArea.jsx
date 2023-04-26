import React from "react"
import { getFonts } from "./FontDetector"

/* 
Features to add:
 - Length setting for video download
 - Image download
 - Better dropdown for pattern and font selection. Currently you can enter whatever you want
*/

export default function EditorArea(props) {
    function addText(e, speedX=0) {
        props.setData(x => {
            x.texts.push({text: "Text", x: 100, y: 100, angle: 0, size: 10, font: "Poppins", colorSetting: "1", color: "#000000", color2: "#000000", colorAngle: 0, speedX: speedX, speedY: 0, repeatDistanceX: 0, repeatDistanceY: 0, rowRepeat: 1, columnRepeat: 1})
            return {...x}
        })
    }

    function handleChange(e) {
        if (e.target.name === "pattern" && props.data.texts.length === 0) {
            addText(e, 10)
        } else if (e.target.name === "pattern" && e.target.value === "shapes") {
            props.setData(x => {
                return {...x, texts: []}
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

    async function record(e) {
        e.preventDefault()

        var canvas = document.querySelector("canvas")

        var videoStream = canvas.captureStream(30)
        var mediaRecorder = new MediaRecorder(videoStream)

        var chunks = []
        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data)
        }

        mediaRecorder.onstop = function(e) {
            console.log(chunks)
            var blob = new Blob(chunks, {"type": "video/webm; codecs=vp9"})
            chunks = []
            var videoURL = URL.createObjectURL(blob)
            download(videoURL, "video.webm")
        }
        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data)
        }

        mediaRecorder.start()
        setTimeout(() => mediaRecorder.stop(), 2000)
    }

    return (
        <div className="EditorArea">
            <div className="EditorForm">
                <select name="pattern" id="pattern" onChange={handleChange} value={props.data.pattern}>
                    <option value="shapes">Formen</option>
                    <option value="left-right">Links-Rechts</option>
                    <option value="bounce">Bounce</option>
                    <option value="dvd">DVD</option>
                </select>
                <label htmlFor="backgroundColor">Hintergrundfarbe: </label>
                <ColorPicker name="background" onChange={handleChange} data={props.data} colorSetting={props.data.colorSetting} color={props.data.color} color2={props.data.color2}/>

                {["left-right", "bounce", "dvd"].includes(props.data.pattern) && <DefaultEditor onChange={handleChange} data={props.data} setData={props.setData}/>}
                {props.data.pattern === "shapes" && <ShapesEditor onChange={handleChange} data={props.data} setData={props.setData} addText={addText}/>}

                <button onClick={(e) => changeStopped(e, false)}>Start</button>
                <button onClick={(e) => changeStopped(e, true)}>Stop</button>
                <button onClick={record}>Download</button>

                <datalist id="shape-list">
                    <option value="Quadrat"/>
                    <option value="Kreis"/>
                </datalist>
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
            <label htmlFor="text">Text: </label>
                <input type="text" id="text" name="text" onChange={handleChange} value={props.data.texts[0].text}/>

                <label htmlFor="font">Schrift: </label>
                <FontSelector fontVar={props.data.texts[0].font} onChange={handleChange}/>

                <label htmlFor="fontSize">Schriftgrösse: </label>
                <input type="number" id="size" name="size" onChange={handleChange} value={props.data.texts[0].size}/>

                <label htmlFor="speedY">Geschwindigkeit: </label>
                <input type="number" id="speedX" name="speedX" onChange={handleChange} value={props.data.texts[0].speedX}/>

                <label htmlFor="color">Textfarbe: </label>
                <ColorPicker onChange={handleChange} data={props.data.texts[0]} colorSetting={props.data.texts[0].color} color={props.data.texts[0].color} color2={props.data.texts[0].color2} name="text"/>

                
        </form>
    )
}

function ShapesEditor(props) {
    var [displayTexts, setDisplayTexts] = React.useState(true)
    var [displayShapes, setDisplayShapes] = React.useState(true)
    var [currentlyEditing, setCurrentlyEditing] = React.useState({type: "none", id: 0})

    function toggleButton(e, div) {
        e.preventDefault()
        div === "texts" ? setDisplayTexts(x => !x) : setDisplayShapes(x => !x)
    }

    function addShape(e) {
        props.setData(x => {
            x.shapes.push({name: "Name", shape: "Quadrat", x: 100, y: 100, angle: 0, size: 100, colorSetting: "1", color: "#000000", color2: "#000000", colorAngle: 0, repeatDistanceX: 0, repeatDistanceY: 0, rowRepeat: 1, columnRepeat: 1, speedX: 0, speedY: 0})
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

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            {currentlyEditing.type === "text" && <TextEditor data={props.data} setData={props.setData} currentlyEditing={currentlyEditing}/>}
            {currentlyEditing.type === "shape" && <ShapeEditor data={props.data} setData={props.setData} currentlyEditing={currentlyEditing}/>}

            <button onClick={props.addText}>Text hinzufügen</button>
            <button onClick={(e) => toggleButton(e, "texts")}>Texte {displayTexts === true ? "verstecken" : "anzeigen"}</button>
            <div className="TextsDiv" style={{display: displayTexts === true ? "flex" : "none", flexDirection: "column"}}>
                {props.data.texts.map((x, index)=> 
                    <div className="TextListElement" key={index}>
                        <div style={{display: "flex"}}>
                            <p>{x.text}</p>
                            <button onClick={() => setCurrentlyEditing(x => {return {type: "text", id: index}})}>Editieren</button>
                            <button onClick={() => removeText(index)}>Löschen</button>
                        </div>
                    </div>)}
            </div>
            <button onClick={addShape}>Form hinzufügen</button>
            <button onClick={(e) => toggleButton(e, "shapes")}>Formen {displayShapes === true ? "verstecken" : "anzeigen"}</button>
            <div className="ShapesDiv" style={{display: displayShapes === true ? "flex" : "none", "flexDirection": "column"}}>
                {props.data.shapes.map((x, index) => 
                    <div className="ShapeListElement" key={index}>
                        <div style={{display: "flex"}}>
                            <p>{x.name}, {x.shape}</p>
                            <button onClick={() => setCurrentlyEditing(x => {return {type: "shape", id: index}})}>Editieren</button>
                            <button onClick={() => removeShape(index)}>Löschen</button>
                        </div>
                    </div>)}
            </div>
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
        <label htmlFor="text">Text:</label>
        <input type="text" id="text" name="text" onChange={editText} value={texts.text}/>
        <label htmlFor="font">Schriftart:</label>
        <FontSelector fontVar={texts.font} onChange={editText}/>
        <label htmlFor="size">Schriftgrösse:</label>
        <input type="number" id="size" name="size" onChange={editText} value={texts.size}/>
        <label htmlFor="angle">Winkel: </label>
        <input type="number" id="angle" name="angle" onChange={editText} value={texts.angle}/>
        <label htmlFor="x">Position (Breite):</label>
        <input type="number" id="x" name="x" onChange={editText} value={texts.x}/>
        <label htmlFor="y">Position (Höhe):</label>
        <input type="number" id="y" name="y" onChange={editText} value={texts.y}/>
        <label htmlFor="rowRepeat">Reihe wiederholen: </label>
        <input type="number" id="rowRepeat" name="rowRepeat" onChange={editText} value={texts.rowRepeat}/>
        <label htmlFor="columnRepeat">Spalte wiederholen: </label>
        <input type="number" id="columnRepeat" name="columnRepeat" onChange={editText} value={texts.columnRepeat}/>
        <label htmlFor="repeatDistanceY">Wiederholdistanz Reihe: </label>
        <input type="number" id="repeatDistanceY" name="repeatDistanceY" onChange={editText} value={texts.repeatDistanceY}/>
        <label htmlFor="repeatDistanceX">Wiederholdistanz Spalte: </label>
        <input type="number" id="repeatDistanceX" name="repeatDistanceX" onChange={editText} value={texts.repeatDistanceX}/>
        <label htmlFor="speedX">Geschwindigkeit Breite: </label>
        <input type="number" id="speedX" name="speedX" onChange={editText} value={texts.speedX}/>
        <label htmlFor="speedY">Geschwindigkeit Höhe: </label>
        <input type="number" id="speedY" name="speedY" onChange={editText} value={texts.speedY}/>
        <label htmlFor="a">Farbe:</label>
        <ColorPicker onChange={editText} data={texts} color={texts.color} color2={texts.color2} name="shape"/>

        <input type="text" id="text" name="text"/>
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
            <label htmlFor="name">Name: </label>
            <input type="text" id="name" name="name" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].name}/>
            <label htmlFor="shape">Form: </label>
            <select name="shape" id="shape" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].shape}>
                <option value="square">Quadrat</option>
                <option value="circle">Kreis</option>
            </select>
            <label htmlFor="shapePositionWidth">Position (Breite): </label>
            <input type="number" id="x" name="x" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].x}/>
            <label htmlFor="shapePositionHeight">Position (Höhe): </label>
            <input type="number" id="y" name="y" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].y}/>
            <label htmlFor="shapeSize">Grösse: </label>
            <input type="number" id="size" name="size" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].size}/>
            <label htmlFor="angle">Winkel: </label>
            <input type="number" id="angle" name="angle" onChange={editShape} min={0} max={360} value={props.data.shapes[props.currentlyEditing.id].angle}/>
            <label htmlFor="rowRepeat">Reihe wiederholen: </label>
            <input type="number" id="rowRepeat" name="rowRepeat" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].rowRepeat}/>
            <label htmlFor="columnRepeat">Spalte wiederholen: </label>
            <input type="number" id="columnRepeat" name="columnRepeat" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].columnRepeat}/>
            <label htmlFor="repeatDistanceY">Wiederholdistanz Reihe: </label>
            <input type="number" id="repeatDistanceY" name="repeatDistanceY" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].repeatDistanceY}/>
            <label htmlFor="repeatDistanceX">Wiederholdistanz Spalte: </label>
            <input type="number" id="repeatDistanceX" name="repeatDistanceX" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].repeatDistanceX}/>
            <label htmlFor="speedX">Geschwindigkeit (Breite): </label>
            <input type="number" id="speedX" name="speedX" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].speedX}/>
            <label htmlFor="speedY">Geschwindigkeit (Höhe): </label>
            <input type="number" id="speedY" name="speedY" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].speedY}/>
            <label htmlFor="a">Farbe:</label>
            <ColorPicker onChange={editShape} data={props.data.shapes[props.currentlyEditing.id]} color={props.data.shapes[props.currentlyEditing.id].color} color2={props.data.shapes[props.currentlyEditing.id].color2} name="shape"/>
        </div>
)}

function ColorPicker(props) {
    return <div>
            <div>
                <input colorname="colorSetting" type="radio" id={props.name + "color1"} name={props.name + "colorSetting"} value="1" onChange={props.onChange} checked={props.data.colorSetting === "1"} />
                <label htmlFor={props.name + "color1"}>1 Farbe</label>
                <input colorname="colorSetting" type="radio" id={props.name + "colorGradient"} name={props.name + "colorSetting"} value="gradient" onChange={props.onChange} checked={props.data.colorSetting === "gradient"}/>
                <label htmlFor={props.name + "colorGradient"}>Farbverlauf</label>
            </div>
            <input type="color" id="color" name="color" onChange={props.onChange} value={props.color}/>
            {props.data.colorSetting === "gradient" && <input type="color" id="color2" name="color2" onChange={props.onChange} value={props.color2}/>}
            {props.data.colorSetting === "gradient" && <input type="number" id="colorAngle" name="colorAngle" onChange={props.onChange} value={props.data.colorAngle}/>} 
        </div>
}
var fontList = getFonts()
    .then(x => x.map(y => <option value={y} key={y}>{y}</option>))

function FontSelector(props) {
    var [fontOptions, setFontOptions] = React.useState(["Arial", "Poppins"])
    React.useEffect(() => {
        var fontList = getFonts()
            .then(x => {
                console.log(x)
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
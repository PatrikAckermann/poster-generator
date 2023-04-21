import React from "react"

/* 
Features to add:
 - Range setting for the randomized font size
 - Length setting for video download
 - Image download
 - Better dropdown for pattern and font selection. Currently you can enter whatever you want
*/

export default function EditorArea(props) {

    function handleChange(e) {
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
                <label htmlFor="pattern">Animation: </label>
                <input type="text" list="pattern-list" id="pattern" name="pattern" onChange={handleChange} value={props.data.pattern}/>
                <label htmlFor="backgroundColor">Hintergrundfarbe: </label>
                <ColorPicker name="background" onChange={handleChange} data={props.data} colorSetting={props.data.colorSetting} color={props.data.color} color2={props.data.color2}/>

                {["Links-Rechts", "Bounce", "DVD"].includes(props.data.pattern) && <DefaultEditor onChange={handleChange} data={props.data} setData={props.setData}/>}
                {props.data.pattern === "Formen" && <ShapesEditor onChange={handleChange} data={props.data} setData={props.setData}/>}

                <button onClick={(e) => changeStopped(e, false)}>Start</button>
                <button onClick={(e) => changeStopped(e, true)}>Stop</button>
                <button onClick={record}>Download</button>

                <datalist id="font-list">
                    <option value="Arial"/>
                    <option value="Poppins"/>
                </datalist>
                <datalist id="pattern-list">
                    <option value="Links-Rechts"/>
                    <option value="Bounce"/>
                    <option value="DVD"/>
                    <option value="Formen"/>
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
                <input type="text" list="font-list" id="font" name="font" onChange={handleChange} value={props.data.texts[0].font}/>

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
    var [currentlyEditing, setCurrentlyEditing] = React.useState({type: "text", id: 0})

    function toggleButton(e, div) {
        e.preventDefault()
        div === "texts" ? setDisplayTexts(x => !x) : setDisplayShapes(x => !x)
    }

    function addText(e) {
        props.setData(x => {
            x.texts.push({text: "Text",x: 100,y: 100,angle: 0,size: 10,font: "Poppins",colorSetting: "1",color: "#000000",color2: "#000000",colorAngle: 0,speedX: 0,speedY: 0, repeatDistanceX: 0, repeatDistanceY: 0, rowRepeat: 1, columnRepeat: 1})
            return {...x}
        })
    }

    function addShape(e) {
        props.setData(x => {
            x.shapes.push({name: "Name", shape: "Rechteck", x: 100, y: 100, angle: 0, size: 100, colorSetting: "1", color: "#000000", color2: "#000000", colorAngle: 0, repeatDistanceX: 0, repeatDistanceY: 0, rowRepeat: 1, columnRepeat: 1, speedX: 0, speedY: 0})
            return {...x}
        })
    }


    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            {currentlyEditing.type === "text" && <TextEditor data={props.data} setData={props.setData} currentlyEditing={currentlyEditing}/>}
            {currentlyEditing.type === "shape" && <ShapeEditor data={props.data} setData={props.setData} currentlyEditing={currentlyEditing}/>}

            <button onClick={addText}>Text hinzufügen</button>
            <button onClick={(e) => toggleButton(e, "texts")}>Texte {displayTexts === true ? "verstecken" : "anzeigen"}</button>
            <div className="TextsDiv" style={{display: displayTexts === true ? "flex" : "none"}}>
                {props.data.texts.map((x, index)=> <div className="TextListElement" key={index}>
                    <div style={{display: "flex"}}><p>{x.text}</p><button onClick={() => setCurrentlyEditing(x => {return {type: "text", id: index}})}>Editieren</button><button>Löschen</button></div>
                </div>)}
            </div>
            <button onClick={addShape}>Form hinzufügen</button>
            <button onClick={(e) => toggleButton(e, "shapes")}>Formen {displayShapes === true ? "verstecken" : "anzeigen"}</button>
            <div className="ShapesDiv" style={{display: displayShapes === true ? "flex" : "none", "flexDirection": "column"}}>
                {props.data.shapes.map((x, index)=> <div className="ShapeListElement" key={index}>
                    <div style={{display: "flex"}}><p>{x.name}, {x.shape}</p><button onClick={() => setCurrentlyEditing(x => {return {type: "shape", id: index}})}>Editieren</button><button>Löschen</button></div>
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
        <input type="text" list="" id="font" name="font" onChange={editText} value={texts.font}/>
        <label htmlFor="size">Schriftgrösse:</label>
        <input type="number" id="size" name="size" onChange={editText} value={texts.size}/>
        <label htmlFor="y">Höhe:</label>
        <input type="number" id="y" name="y" onChange={editText} value={texts.y}/>
        <label htmlFor="x">Breite:</label>
        <input type="number" id="x" name="x" onChange={editText} value={texts.x}/>
        <label htmlFor="rowRepeat">Reihe wiederholen: </label>
        <input type="number" id="rowRepeat" name="rowRepeat" onChange={editText} value={texts.rowRepeat}/>
        <label htmlFor="columnRepeat">Spalte wiederholen: </label>
        <input type="number" id="columnRepeat" name="columnRepeat" onChange={editText} value={texts.columnRepeat}/>
        <label htmlFor="repeatDistanceX">Wiederholdistanz Reihe: </label>
        <input type="number" id="repeatDistanceX" name="repeatDistanceX" onChange={editText} value={texts.repeatDistanceX}/>
        <label htmlFor="repeatDistanceY">Wiederholdistanz Spalte: </label>
        <input type="number" id="repeatDistanceY" name="repeatDistanceY" onChange={editText} value={texts.repeatDistanceY}/>
        <label htmlFor="angle">Winkel: </label>
        <input type="number" id="angle" name="angle" onChange={editText}/>
        <label htmlFor="speedX">Geschwindigkeit Breite: </label>
        <input type="number" id="speedX" name="speedX" onChange={editText}/>
        <label htmlFor="speedY">Geschwindigkeit Höhe: </label>
        <input type="number" id="speedY" name="speedY" onChange={editText}/>
        <label htmlFor="a">Farbe: (Verlaufswinkel kann aktuell nicht angepasst werden)</label>
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
            <input type="text" list="shape-list" id="shape" name="shape" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].shape}/>
            <label htmlFor="shapePositionHeight">Höhe: </label>
            <input type="number" id="y" name="y" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].y}/>
            <label htmlFor="shapePositionWidth">Breite: </label>
            <input type="number" id="x" name="x" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].x}/>
            <label htmlFor="shapeSize">Grösse: </label>
            <input type="number" id="size" name="size" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].size}/>
            <label htmlFor="angle">Winkel: </label>
            <input type="number" id="angle" name="angle" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].angle}/>
            <label htmlFor="rowRepeat">Reihe wiederholen: </label>
            <input type="number" id="rowRepeat" name="rowRepeat" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].rowRepeat}/>
            <label htmlFor="columnRepeat">Spalte wiederholen: </label>
            <input type="number" id="columnRepeat" name="columnRepeat" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].columnRepeat}/>
            <label htmlFor="repeatDistanceX">Wiederholdistanz Reihe: </label>
            <input type="number" id="repeatDistanceX" name="repeatDistanceX" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].repeatDistanceX}/>
            <label htmlFor="repeatDistanceY">Wiederholdistanz Spalte: </label>
            <input type="number" id="repeatDistanceY" name="repeatDistanceY" onChange={editShape} value={props.data.shapes[props.currentlyEditing.id].repeatDistanceY}/>
            <label htmlFor="a">Farbe: (Verlaufswinkel kann aktuell nicht angepasst werden)</label>
            <ColorPicker onChange={editShape} data={props.data.shapes[props.currentlyEditing.id]} color={props.data.shapes[props.currentlyEditing.id].color} color2={props.data.shapes[props.currentlyEditing.id].color2} name="shape"/>
            <datalist id="shape-list">
                <option value="Rechteck"/>
                <option value="Kreis"/>
            </datalist>
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
import React from "react"

/* 
Features to add:
 - Range setting for the randomized font size
 - Length setting for video download
 - Maybe a better dropdown for pattern and font selection. Currently you can enter whatever you want

Custom settings area:
 - For animations that need more options
 - Gets loaded when the animation is selected
*/

export default function EditorArea(props) {

    function handleChange(e) {
        props.setData(x => {
            return {...x, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value}
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
            <form className="EditorForm">
                <label htmlFor="text">Text: </label>
                <input type="text" id="text" name="text" onChange={handleChange} value={props.data.text}/>

                <label htmlFor="font">Animation: </label>
                <input type="text" list="pattern-list" id="pattern" name="pattern" onChange={handleChange} value={props.data.pattern}/>

                <label htmlFor="font">Schrift: </label>
                <input type="text" list="font-list" id="font" name="font" onChange={handleChange} value={props.data.font}/>

                <label htmlFor="fontSize">Schriftgrösse: </label>
                <input type="number" id="fontSize" name="fontSize" onChange={handleChange} value={props.data.fontSize}/>

                <label htmlFor="fontSize">Geschwindigkeit: </label>
                <input type="number" id="speed" name="speed" onChange={handleChange} value={props.data.speed}/>

                <label htmlFor="color">Textfarbe: </label>
                <input type="color" id="color" name="color" onChange={handleChange} value={props.data.color}/>

                <label htmlFor="backgroundColor">Hintergrundfarbe: </label>
                <input type="color" id="backgroundColor" name="backgroundColor" onChange={handleChange} value={props.data.backgroundColor}/>

                {props.data.pattern === "Formen" && <ShapeEditor onChange={handleChange} data={props.data}/>}

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
            </form>
        </div>
    )
}

function ShapeEditor(props) {
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <label htmlFor="shape">Form: </label>
            <input type="text" list="shape-list" id="shape" name="shape" onChange={props.onChange} value={props.data.shape}/>
            <label htmlFor="shapeSize">Formgrösse: </label>
            <input type="number" id="shapeSize" name="shapeSize" onChange={props.onChange} value={props.data.shapeSize}/>
            <label htmlFor="angle">Formwinkel: </label>
            <input type="number" id="angle" name="angle" onChange={props.onChange} value={props.data.angle}/>

            <div>
                <input type="radio" id="shapeColor1" name="shapeColorSetting" value="1" onChange={props.onChange} checked={props.data.shapeColorSetting === "1"} />
                <label htmlFor="shapeColor1">1 Farbe</label>
                <input type="radio" id="shapeColorGradient" name="shapeColorSetting" value="gradient" onChange={props.onChange} checked={props.data.shapeColorSetting === "gradient"}/>
                <label htmlFor="shapeColorGradient">Farbverlauf</label>
            </div>

            <input type="color" id="shapeColor" name="shapeColor" onChange={props.onChange} value={props.data.shapeColor}/>
            {props.data.shapeColorSetting === "gradient" && <input type="color" id="shapeColor2" name="shapeColor2" onChange={props.onChange} value={props.data.shapeColor2}/>}

            <datalist id="shape-list">
                <option value="Rechteck"/>
                <option value="Kreis"/>
            </datalist>
        </div>
    )
}
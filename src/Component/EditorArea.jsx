import React from "react"

export default function EditorArea(props) {

    function handleChange(e) {
        props.setData(x => {
            return {...x, [e.target.name]: e.target.value}
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
        console.log("a")
        e.preventDefault()

        var canvas = document.querySelector("canvas")
        var video = document.querySelector("video")

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

    /**/

    return (
        <div className="EditorArea">
            <form className="EditorForm">
                <label for="text">Text: </label>
                <input type="text" id="text" name="text" onChange={handleChange} value={props.data.text}/>

                <label for="font">Animation: </label>
                <input type="text" list="pattern-list" id="pattern" name="pattern" onChange={handleChange} value={props.data.pattern}/>

                <label for="font">Schrift: </label>
                <input type="text" list="font-list" id="font" name="font" onChange={handleChange} value={props.data.font}/>

                <label for="fontSize">Schriftgrösse: </label>
                <input type="number" id="fontSize" name="fontSize" onChange={handleChange} value={props.data.fontSize}/>

                <label for="fontSize">Geschwindigkeit: </label>
                <input type="number" id="speed" name="speed" onChange={handleChange} value={props.data.speed}/>

                <label for="color">Farbe: </label>
                <input type="color" id="color" name="color" onChange={handleChange} value={props.data.color}/>

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
                </datalist>
            </form>
        </div>
    )
}
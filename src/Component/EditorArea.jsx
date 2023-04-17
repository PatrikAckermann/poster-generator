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

    return (
        <div className="EditorArea">
            <form className="EditorForm">
                <label for="text">Text: </label>
                <input type="text" id="text" name="text" onChange={handleChange} value={props.data.text}/>

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
                <button>Download</button>

                <datalist id="font-list">
                    <option value="Arial"/>
                    <option value="Poppins"/>
                </datalist>
            </form>
        </div>
    )
}
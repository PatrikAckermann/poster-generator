import { SortableElement } from "react-sortable-hoc"
import "../CSS/Editor.css"
import dragIcon from "../img/drag-indicator.svg"

function SortableItem(props) {
    var style = {
        backgroundColor: "#333333",
        borderRadius: "5px"
    }

    return (
        <div className="ShapeListElement Input">
            <img src={dragIcon} alt=""/>
            <label style={props.currentlyEditing === props.id ? style : {}}>{props.type === "text" ? props.item.text : props.item.name + ", " + translate(props.item.shape)}</label>
            <button onClick={() => props.setCurrentlyEditing(x => {return props.id})}>Editieren</button>
            <button onClick={() => props.toggleHide(props.id)}>{props.item.hidden === false ? "Verstecken" : "Anzeigen"}</button>
            <button onClick={() => props.copyElement(props.id)}>Kopieren</button>
            <button onClick={() => props.remove(props.id)}>Löschen</button>
        </div>
    )
}

function translate(text) {
    var translated = ""
    if (text === "square") {translated = "Quadrat"}
    if (text === "circle") {translated = "Kreis"}
    if (text === "text") {translated = "Text"}
    return translated
}

export default SortableElement(SortableItem)
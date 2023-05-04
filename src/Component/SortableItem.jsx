import { SortableElement } from "react-sortable-hoc"
import "../CSS/Editor.css"
import dragIcon from "../img/drag-indicator.svg"

function SortableItem(props) {
    return (
        <div className="ShapeListElement Input">
            <img src={dragIcon} alt=""/>
            <label>{props.type === "text" ? props.item.text : props.item.name + ", " + translate(props.item.shape)}</label>
            <button onClick={() => props.setCurrentlyEditing(x => {return {type: props.type, id: props.id}})}>Editieren</button>
            <button onClick={() => props.copyElement(props.type, props.id)}>Kopieren</button>
            <button onClick={() => props.remove(props.id)}>Löschen</button>
        </div>
    )
}

function translate(text) {
    var translated = ""
    if (text === "square") {translated = "Quadrat"}
    if (text === "circle") {translated = "Kreis"}
    return translated
}

export default SortableElement(SortableItem)
import { SortableElement } from "react-sortable-hoc"
import "../CSS/index.css"

function SortableItem(props) {
    return (
        <li style={{display: "flex"}} className="ShapeListElement">
            <p>{props.type === "text" ? props.item.text : props.item.name + ", " + translate(props.item.shape)}</p>
            <button onClick={() => props.setCurrentlyEditing(x => {return {type: props.type, id: props.id}})}>Editieren</button>
            <button onClick={() => props.remove(props.id)}>Löschen</button>
        </li>
    )
}

function translate(text) {
    var translated = ""
    if (text === "square") {translated = "Quadrat"}
    if (text === "circle") {translated = "Kreis"}
    return translated
}

export default SortableElement(SortableItem)
import { SortableElement } from "react-sortable-hoc"

function SortableItem(props) {
    return (
        <li className="ShapeListElement">
            <div style={{display: "flex"}}>
                <p>{props.type === "text" ? props.item.text : props.item.name + ", " + props.item.shape}</p>
                <button onClick={() => props.setCurrentlyEditing(x => {return {type: props.type, id: props.id}})}>Editieren</button>
                <button onClick={() => props.remove(props.id)}>Löschen</button>
            </div>
        </li>
    )
}

export default SortableElement(SortableItem)
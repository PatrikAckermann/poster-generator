import { SortableContainer } from "react-sortable-hoc"
import SortableItem from "./SortableItem"
import "../CSS/index.css"

function SortableList(props) {
    console.log(props.items)
    return (
        <ul className="ShapesDiv">
            {props.items.map((x, index) => <SortableItem key={index} index={index} id={index} item={props.items[index]} setCurrentlyEditing={props.setCurrentlyEditing} copyElement={props.copyElement} type={props.type} remove={props.remove}/>)}
        </ul>
    )
}

export default SortableContainer(SortableList)
import { SortableContainer } from "react-sortable-hoc"
import SortableItem from "./SortableItem"

function SortableList(props) {
    return (
        <ul className="ShapesDiv">
            {props.items.map((x, index) => <SortableItem key={x.id} index={index} id={index} item={props.items[index]} setCurrentlyEditing={props.setCurrentlyEditing} type={props.type} remove={props.remove}/>)}
        </ul>
    )
}

export default SortableContainer(SortableList)
import classNames from "classnames";
import {DndActor, uuiDndState} from "@epam/uui-core";
import css from "./styles.module.scss";
import {DragHandle} from "@epam/uui-components";
import {DropMarker} from "@epam/uui";

const DndElement = ({ userName, handleOnDrop, canAcceptDrop }) => {
    return <DndActor
        key={ userName }
        srcData={ userName }
        dstData={ userName }
        canAcceptDrop={ canAcceptDrop }
        onDrop={ (params) => handleOnDrop(params) }
        render={ (params) => {
            return <div
                ref={ params.ref }
                { ...params.eventHandlers }
                className={classNames({
                    [uuiDndState.dragGhost]: params.isDragGhost,
                    [css.isDraggedOver]: params.isDraggedOver,
                    [css.isBottom]: params.position === 'bottom'
                }, css.dndElementWrapper)}
            >
                <li
                    className={`list-group-item text-center rounded  ${css.dndElement} bg-${params.isDragGhost ? `light ${css.dndGhost}` : 'white'} p-1 text-break`}
                >
                    <DragHandle />
                    {userName}
                    <DropMarker { ...params } />
                </li>
            </div>
        }}
        />
}

export default DndElement;
import {useState} from "react";
import {useSelector} from "react-redux";
import {DropMarker} from "@epam/uui";
import {DndActor, uuiDndState} from "@epam/uui-core";
import {DragHandle} from "@epam/uui-components";
import classNames from "classnames";
import css from './styles.module.scss'
import useServer from "../../hooks/useServer";

const TeamsDragAndDrop = ({onSave, onCancel}) => {
    const server =  useServer();
    const state = useSelector((state) => state);
    const [order, setOrder] = useState({team_1: state.team_1, team_2: state.team_2});

    const canAcceptDrop = ({srcData}) => {
        const srcTeam = order.team_1.some(i => i === srcData) ? 1 : 2;
        if (order[`team_${srcTeam}`].length === 1) {
            return {
                top: false,
                bottom: false,
            }
        }
        return {
            top: true,
            bottom: true,
        }
    };

    const handleOnDrop = (params) => {
        const { srcData, dstData, position } = params;
        const dstTeam = order.team_1.some(i => i === dstData) ? 1 : 2;

        let t1 = order.team_1.filter(i => i !== srcData);
        let t2 = order.team_2.filter(i => i !== srcData);
        if (dstTeam === 1) {
            const index = order.team_1.indexOf(dstData);
            t1.splice( position === 'top' ? index : index + 1, 0, srcData);
        } else {
            const index = order.team_2.indexOf(dstData);
            t2.splice(position === 'top' ? index : index + 1, 0, srcData);
        }

        setOrder({
            team_1: t1,
            team_2: t2
        })
    };

    return <div className={css.container}>
       <div className={'w-50 p-2'}>
           <h3>Team 1</h3>
           <ul className={`list-group mb-4 ${css.noTouch}`}>
               { order.team_1.map(i => <DndActor
                   key={ i }
                   srcData={ i }
                   dstData={ i }
                   canAcceptDrop={ canAcceptDrop }
                   onDrop={ (params) => handleOnDrop(params) }
                   render={ (params) => {
                       return <div ref={ params.ref } { ...params.eventHandlers } className={classNames({[uuiDndState.dragGhost]: params.isDragGhost})}>
                           <li className={`list-group-item bg-${params.isDragGhost ? 'light' : 'white'} p-1 mb-1 text-break`}><DragHandle />{i}</li>
                           <DropMarker { ...params } />
                       </div>
                   }}
               />)}
           </ul>
       </div>
        <div className={'w-50 p-2'}>
            <h3>Team 2</h3>
            <ul className={`list-group ${css.noTouch}`}>
                { order.team_2.map(i => <DndActor
                    key={ i }
                    srcData={ i }
                    dstData={ i }
                    canAcceptDrop={ canAcceptDrop }
                    onDrop={ (params) => handleOnDrop(params) }
                    render={ (params) => {
                        return <div
                            ref={ params.ref }
                            { ...params.eventHandlers }
                            className={classNames({[uuiDndState.dragGhost]: params.isDragGhost})}
                        >
                            <li className={`list-group-item bg-${params.isDragGhost ? 'light' : 'white'} p-1 mb-1 text-break`}><DragHandle />{i}</li>
                            <DropMarker { ...params } />
                        </div>
                    }}
                />)}
            </ul>
        </div>

        <button disabled={JSON.stringify([state.team_1, state.team_2]) === JSON.stringify([order.team_1, order.team_2])} className="btn btn-primary w-100 mt-2 mb-2" onClick={ async () => {
            await server.createTeams(order.team_1, order.team_2);
            await server.reset();
            await server.reloadData();
            onSave();
        }}>Save and restart</button>
        <button className="btn btn-secondary w-100" onClick={onCancel}>Cancel</button>
    </div>
}

export default TeamsDragAndDrop;
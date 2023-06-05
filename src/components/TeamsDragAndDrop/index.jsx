import {useState} from "react";
import {useSelector} from "react-redux";
import css from './styles.module.scss'
import DndElement from "./DndElement";
import Server from "../../services/server";

const TeamsDragAndDrop = ({onSave, onCancel}) => {
    const server = new Server();
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
        <div className={'d-flex w-100'}>
            <div className={'w-50 p-2'}>
                <h3>Team 1</h3>
                <ul className={`list-group ${css.noTouch} ${css.list}`}>
                    { order.team_1.map(i => <DndElement userName={i} canAcceptDrop={canAcceptDrop} handleOnDrop={handleOnDrop} key={i} />) }
                </ul>
            </div>
            <div className={'w-50 p-2'}>
                <h3>Team 2</h3>
                <ul className={`list-group ${css.noTouch} ${css.list}`}>
                    { order.team_2.map(i => <DndElement userName={i} canAcceptDrop={canAcceptDrop} handleOnDrop={handleOnDrop} key={i} />) }
                </ul>
            </div>
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
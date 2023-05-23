import classNames from "classnames";
import {useSelector} from "react-redux";
import {useMemo, useState} from "react";
import css from './styles.module.scss';
import useMy from "../../hooks/useMy";
import Server from "../../services/server";
import useModal from "../../hooks/useModal";
import refreshIcon from "../../assets/refresh.svg"
import done from "../../assets/done.svg"
import think from "../../assets/think.gif"
import TeamsDragAndDrop from "../TeamsDragAndDrop";

const Layout = ({ children, cx = [] }) => {
    const state = useSelector((state) => state);
    const [isDragMode, setIsDragMode] = useState(false);

    const server =  useMemo(() => {
        return new Server();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const { myTeam, opponentTeam, curPlayer, opponentCurPlayer } = useMy();
    const [isTeamsVisible, setIsTeamsVisible] = useState(false);
    const showModal = useModal();
    const curAnswers = state.answers.filter(i => i.round === state.round);
    return <div className={classNames(['container-md', 'p-3', ...cx])}>
        {state.me && <>
            <div className={`d-flex justify-content-between position-relative align-items-center flex-wrap p-3 shadow-sm ${css.header}`}>
                <h2>{state.me}</h2> {!!state.round && <span className="badge bg-secondary">round {state.round}</span>}
                <button type="button" className="btn btn-primary" onClick={() => setIsTeamsVisible((s) => !s)}>{isTeamsVisible ? 'Hide' : 'Show'} teams</button>
                <button className="btn btn-primary" onClick={() => server.reloadData()}>
                    <img src={refreshIcon} alt={'refresh'}/>
                </button>
                {isTeamsVisible && <div className={classNames([css.container, 'shadow', 'p-3', 'mb-5', 'bg-white', 'rounded', 'animate__animated animate__bounceInDown', {[css.isDnd]: state.isDndInProgress} ])}>
                    <div className={`${css.teamsHeader} shadow`}>
                        <button type="button" className={classNames(['btn', 'btn-light', css.close])} aria-label="Close" onClick={() => setIsTeamsVisible(false)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h3>Teams</h3>
                    </div>
                    { isDragMode ? <TeamsDragAndDrop onSave={() => setIsDragMode(false)} onCancel={() => setIsDragMode(false)} /> : <>
                        <h3>Your team:</h3>
                        <ul className={classNames(["list-group", 'mb-3'])}>
                            {myTeam.map(i => <li
                                key={i}
                                className={classNames("list-group-item", {border: i === curPlayer, 'bg-light': i === curPlayer})}
                            >
                                <h6>{i}
                                    {state.mainUser === i && ' (admin)'}
                                    {!!curAnswers?.length && curAnswers.every(a => a.user === i || a[`team_${state.team_1.some(u => u === i) ? 1 : 2}_agree`]?.some(j => j === i)) && <img src={done} className={css.done} alt={'done'}/>}
                                    {i === curPlayer && !curAnswers.some(i => i.round === state.round && i.user === curPlayer) && <img src={think} className={css.think} alt={'think'}/>}
                                </h6>
                            </li>)}
                            {!state.team_1?.length && <li className="list-group-item">No users</li>}
                        </ul>
                        <h3>Opponent`s team:</h3>
                        <ul className={classNames(["list-group"])}>
                            {opponentTeam.map(i => <li
                                key={i}
                                className={classNames("list-group-item", {border: i === opponentCurPlayer, 'bg-light': i === opponentCurPlayer})}
                            >
                                <h6>
                                    {i}
                                    {state.mainUser === i && ' (admin)'}
                                    {!!curAnswers?.length && curAnswers.every(a => a.user === i || a[`team_${state.team_1.some(u => u === i) ? 1 : 2}_agree`]?.some(j => j === i)) && <img src={done} className={css.done} alt={'done'}/>}
                                    {i === opponentCurPlayer && !curAnswers.some(i => i.round === state.round && i.user === opponentCurPlayer) && <img src={think} className={css.think} alt={'think'}/>}
                                </h6>
                            </li>)}
                            {!state.team_2?.length && <li className="list-group-item">No users</li>}
                            { state.mainUser === state.me && <button type="button" className="btn btn-primary mt-4 w-100" onClick={() => showModal(() => server.reset())}>Restart the game</button>}
                            { state.mainUser === state.me && <button type="button" className="btn btn-primary mt-2 w-100" onClick={() => showModal(() => server.reset(true))}>Restart the game and mix the teams</button>}
                            { state.mainUser === state.me && <button type="button" className="btn btn-primary mt-2 w-100" onClick={() => setIsDragMode(true)}>Change the order</button>}
                        </ul>
                    </>}
                </div>}
            </div>
        </>}
        {children}
    </div>
}

export default Layout;
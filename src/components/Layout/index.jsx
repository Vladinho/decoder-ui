import classNames from "classnames";
import {useSelector} from "react-redux";
import {useState} from "react";
import css from './styles.module.scss';
import useMy from "../../hooks/useMy";
import useModal from "../../hooks/useModal";
import refreshIcon from "../../assets/refresh.svg"
import done from "../../assets/done.svg"
import think from "../../assets/think.gif"
import TeamsDragAndDrop from "../TeamsDragAndDrop";
import Server from "../../services/server";

const Layout = ({ children, cx = [] }) => {
    const state = useSelector((state) => state);
    const [isDragMode, setIsDragMode] = useState(false);
    const server = new Server();
    const { myTeam, opponentTeam, curPlayer, opponentCurPlayer, answers, opponentAnswers } = useMy();
    const [isTeamsVisible, setIsTeamsVisible] = useState(false);
    const showModal = useModal();
    const curAnswers = state.answers.filter(i => i.round === state.round);
    return <>
        {state.me && <>
            <div className={`p-3 shadow-sm ${css.header} mb-2`}>

                <div className={'container-md d-flex justify-content-between align-items-center flex-wrap'}>
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
                                        {!!curAnswers?.length &&
                                            answers.length === state.round &&
                                            curAnswers.every(a => a.user === i || a[`team_${state.team_1.some(u => u === i) ? 1 : 2}_agree`]?.some(j => j === i)) &&
                                            <img src={done} className={css.done} alt={'done'}/>}
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
                                        {!!curAnswers?.length &&
                                            opponentAnswers.length === state.round &&
                                            curAnswers.every(a => a.user === i || a[`team_${state.team_1.some(u => u === i) ? 1 : 2}_agree`]?.some(j => j === i)) &&
                                            <img src={done} className={css.done} alt={'done'}/>}
                                        {i === opponentCurPlayer && !curAnswers.some(i => i.round === state.round && i.user === opponentCurPlayer) && <img src={think} className={css.think} alt={'think'}/>}
                                    </h6>
                                </li>)}
                                {!state.team_2?.length && <li className="list-group-item">No users</li>}
                                { state.mainUser === state.me && <button type="button" className="btn btn-primary mt-4 w-100" onClick={() => showModal( async () => {
                                    await server.reset();
                                    setIsTeamsVisible(false);
                                })}>Restart the game</button>}
                                { state.mainUser === state.me && <button type="button" className="btn btn-primary mt-2 w-100" onClick={() => showModal(() => server.mixTeams())}>Mix the teams</button>}
                                { state.mainUser === state.me && <button type="button" className="btn btn-primary mt-2 w-100" onClick={() => setIsDragMode(true)}>Change the order</button>}
                            </ul>
                        </>}
                    </div>}
                </div>
            </div>
        </>}
        <div className={classNames(['container-md', 'p-3', ...cx])}>
            {children}
        </div>
    </>

}

export default Layout;
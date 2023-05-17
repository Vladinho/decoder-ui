import classNames from "classnames";
import {useSelector} from "react-redux";
import {useState} from "react";
import css from './styles.module.scss';
import useMy from "../../hooks/useMy";
import Server from "../../services/server";
import useModal from "../../hooks/useModal";
import refreshIcon from "../../assets/refresh.svg"
import king from "../../assets/king.svg"
import done from "../../assets/done.svg"

const Layout = ({ children, cx = [] }) => {
    const state = useSelector((state) => state);
    const s = new Server();
    const { myTeam, opponentTeam, curPlayer, opponentCurPlayer } = useMy();
    const [isTeamsVisible, setIsTeamsVisible] = useState(false);
    const showModal = useModal();
    const curAnswers = state.answers.filter(i => i.round === state.round);
    return <div className={classNames(['container-md', 'p-3', ...cx])}>
        {state.me && <>
            <div className={'d-flex justify-content-between position-relative align-items-center flex-wrap'}>
                <h2>{state.me}</h2> {!!state.round && <span className="badge bg-secondary">round {state.round}</span>}
                <button type="button" className="btn btn-primary" onClick={() => setIsTeamsVisible((s) => !s)}>{isTeamsVisible ? 'Hide' : 'Show'} teams</button>
                <button className="btn btn-primary" onClick={() => {
                    s.getGame();
                    s.getAnswers();
                }}>
                    <img src={refreshIcon} alt={'refresh'}/>
                </button>
                {isTeamsVisible && <div className={classNames([css.container, 'shadow', 'p-3', 'mb-5', 'bg-white', 'rounded'])}>
                    <button type="button" className={classNames(['btn', 'btn-light', css.close])} aria-label="Close" onClick={() => setIsTeamsVisible(false)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h3>Your team:</h3>
                    <ul className={classNames(["list-group", 'mb-3'])}>
                        {myTeam.map(i => <li
                            key={i}
                            className={classNames("list-group-item", {border: i === curPlayer, 'bg-light': i === curPlayer})}
                        >
                            <h6>{i}
                                {state.mainUser === i && <img className={css.king} src={king} alt={'king'}/>}
                                {!!curAnswers?.length && curAnswers.every(a => a.user === i || a[`team_${state.team_1.some(u => u === i) ? 1 : 2}_agree`]?.some(j => j === i)) && <img src={done} className={css.done} alt={'done'}/>}
                            </h6>
                        </li>)}
                    </ul>
                    <h3>Opponent`s team:</h3>
                    <ul className={classNames(["list-group"])}>
                        {opponentTeam.map(i => <li
                            key={i}
                            className={classNames("list-group-item", {border: i === opponentCurPlayer, 'bg-light': i === opponentCurPlayer})}
                        >
                            <h6>
                                {i}
                                {state.mainUser === i && <img className={css.king} src={king} alt={'king'} />}
                                {!!curAnswers?.length && curAnswers.every(a => a.user === i || a[`team_${state.team_1.some(u => u === i) ? 1 : 2}_agree`]?.some(j => j === i)) && <img src={done} className={css.done} alt={'done'}/>}
                            </h6>
                        </li>)}
                    </ul>
                    { state.mainUser === state.me && <button type="button" className="btn btn-primary mt-4 w-100" onClick={() => showModal(() => s.reset())}>Restart the game</button>}
                    { state.mainUser === state.me && <button type="button" className="btn btn-primary mt-2 w-100" onClick={() => showModal(() => s.reset(true))}>Restart the game and mix the teams</button>}
                </div>}
            </div>

            <hr className="mt-2 mb-3"/>
        </>}
        {children}
    </div>
}

export default Layout;
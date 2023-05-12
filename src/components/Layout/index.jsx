import classNames from "classnames";
import {useSelector} from "react-redux";
import {useState} from "react";
import css from './styles.module.scss';
import useMy from "../../hooks/useMy";
import Server from "../../services/server";

const Layout = ({ children, cx = [] }) => {
    const state = useSelector((state) => state);
    const s = new Server();
    const { myTeam, opponentTeam, curPlayer, opponentCurPlayer } = useMy();
    const [isTeamsVisible, setIsTeamsVisible] = useState(false);
    return <div className={classNames(['container-md', 'p-3', ...cx])}>
        {state.me && <>
            <div className={'d-flex justify-content-between position-relative align-items-center flex-wrap'}>
                <h2>{state.me}</h2> {state.round && <span className="badge bg-secondary">round {state.round}</span>}
                <button type="button" className="btn btn-primary" onClick={() => setIsTeamsVisible((s) => !s)}>{isTeamsVisible ? 'Hide' : 'Show'} teams</button>
                <button className="btn btn-primary" onClick={() => {
                    s.getGame();
                    s.getAnswers();
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                        <path
                            d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                        <path fill-rule="evenodd"
                              d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                    </svg>
                </button>
                {isTeamsVisible && <div className={classNames([css.container, 'shadow', 'p-3', 'mb-5', 'bg-white', 'rounded'])}>
                    <button type="button" className={classNames(['btn', 'btn-light', css.close])} aria-label="Close" onClick={() => setIsTeamsVisible(false)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h3>Your team:</h3>
                    <ul className={classNames(["list-group", 'mb-3'])}>
                        {myTeam.map(i => <li key={i} className={classNames("list-group-item", {['border']: i === curPlayer, ['bg-light']: i === curPlayer})}><h6>{i}</h6></li>)}
                    </ul>
                    <h3>Opponent`s team:</h3>
                    <ul className={classNames(["list-group"])}>
                        {opponentTeam.map(i => <li key={i} className={classNames("list-group-item", {['border']: i === opponentCurPlayer, ['bg-light']: i === opponentCurPlayer})}><h6>{i}</h6></li>)}
                    </ul>
                </div>}
            </div>

            <hr className="mt-2 mb-3"/>
        </>}
        {children}
    </div>
}

export default Layout;
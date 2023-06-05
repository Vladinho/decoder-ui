import classNames from "classnames";
import {useSelector} from "react-redux";
import {useState} from "react";
import css from './styles.module.scss';
import refreshIcon from "../../assets/refresh.svg"
import backIcon from "../../assets/back.svg"
import {useNavigate} from "react-router";
import Teams from "../Teams";

const Layout = ({ children, cx = [] }) => {
    const state = useSelector((state) => state);
    const [isTeamsVisible, setIsTeamsVisible] = useState(false);
    const navigate = useNavigate();
    return <>
        {state.me && <>
            <div className={`p-3 shadow-sm ${css.header} mb-2`}>

                <div className={'container-md d-flex justify-content-between align-items-center flex-wrap gap-1'}>
                    <button type="button" className="btn btn-light border" onClick={() => navigate('/')}>
                        <img src={backIcon} alt={'back'}/>
                    </button>
                    <h2>{state.me}</h2>
                    {!!state.round && <span className="badge bg-secondary">round {state.round}</span>}
                    <button type="button" className="btn btn-primary" onClick={() => setIsTeamsVisible((s) => !s)}>Teams</button>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>
                        <img src={refreshIcon} alt={'refresh'}/>
                    </button>
                    {isTeamsVisible && <Teams setIsTeamsVisible={setIsTeamsVisible} /> }
                </div>
            </div>
        </>}
        <div className={classNames(['container-md', 'p-3', ...cx])}>
            {children}
        </div>
    </>

}

export default Layout;
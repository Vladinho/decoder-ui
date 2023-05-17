import css from './styles.module.scss';
import classNames from "classnames";
import useCount from "../../hooks/useCount";
import winGif from "../../assets/win.gif";
import looserGif from "../../assets/looser.gif";
import noWinners from "../../assets/noWinners.gif";

const Counter = () => {
    const myCounter = useCount();
    const opponentCounter = useCount(false);
    if (!myCounter.black && !myCounter.white && opponentCounter.black && !opponentCounter.white) {
        return null
    }

    const isLost = myCounter.black > 1 && opponentCounter.black < 2;
    const isWin = myCounter.white > 1 && opponentCounter.white < 2;

    return <div className={css.container}>
        <div className={classNames('d-flex', 'justify-content-between', 'w-100')}>
            <h6>My count:</h6>
            <h6>Opponent`s count:</h6>
        </div>
        <div className={css.badges}>
            {!myCounter.white && !myCounter.black && '-'}
            {Array(myCounter.white).fill('').map((i, index) => <div className={classNames(css.badge, css.white)} key={index}></div>)}
            {Array(myCounter.black).fill('').map((i, index) => <div className={classNames(css.badge, css.black)} key={index}></div>)}
        </div>
        <div className={css.badges}>
            {!opponentCounter.white && !opponentCounter.black && '-'}
            {Array(opponentCounter.white).fill('').map((i, index) => <div className={classNames(css.badge, css.white)} key={index}></div>)}
            {Array(opponentCounter.black).fill('').map((i, index) => <div className={classNames(css.badge, css.black)} key={index}></div>)}
        </div>
        { isLost && !isWin && <>
            <span className="badge bg-danger mb-2 w-100 mt-2">You are looser!</span>
            <img className={'w-100'} src={looserGif} alt={'loose'}/>
        </> }
        { isWin && !isLost && <>
            <span className="badge bg-success mb-2 w-100 mt-2">You are winner!</span>
            <img className={'w-100'} src={winGif} alt={'win'}/>
        </> }
        {
            !isWin && !isLost && [...Object.values(myCounter), ...Object.values(opponentCounter)].some(i => i > 1) && <img className={'w-100 mt-2'} src={noWinners} alt={'no winners'}/>
        }
    </div>
}

export default Counter;
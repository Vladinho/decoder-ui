import css from './styles.module.scss';
const Loader = () => {
    return <div className={css.container}>
        <div className={css.line}></div>
        <div className={css.loader}>
            <div className={`${css.oneLoader} first`}>
                <div className={`${css.vLine} ${css.firstLine}`}></div>
                <div className={`${css.circle} ${css.firstCircle}`}></div>
            </div>
            <div className={`${css.oneLoader}`}>
                <div className={`${css.vLine} ${css.middleLine}`}></div>
                <div className={`${css.circle} ${css.middleCircle}`}></div>
            </div>
            <div className={css.oneLoader}>
                <div className={`${css.vLine} ${css.middleLine}`}></div>
                <div className={`${css.circle} ${css.middleCircle}`}></div>
            </div>
            <div className={css.oneLoader}>
                <div className={`${css.vLine} ${css.middleLine}`}></div>
                <div className={`${css.circle} ${css.middleCircle}`}></div>
            </div>
            <div className={`${css.oneLoader} last`}>
                <div className={`${css.vLine} ${css.lastLine}`}></div>
                <div className={`${css.circle} ${css.lastCircle}`}></div>
            </div>
        </div>
    </div>
}

export default Loader;
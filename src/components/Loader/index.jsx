import css from './styles.module.scss';
const Loader = () => {
    return <div className={css.container}><div className="spinner-border" role="status">
    </div></div>
}

export default Loader;
import css from './styles.module.scss';

const LoaderCircle = () => {
    return <div className={`${css.container} mt-4 mb-4 alert alert-warning`}  role="alert">
        <p className={'m-0'}>Other players are thinking</p>
        <span className={css.loader}></span>
    </div>
}

export default LoaderCircle;
import css from './styles.module.scss';
import bg from '../../assets/think_2.gif'

const Banner = () => {
    return <div className={`${css.container} mb-4 alert alert-warning`}  role="alert">
        <img src={bg} className={css.thinking}/>
        <p className={'m-0'}>Other players are thinking</p>
        <span className={css.loader}></span>
    </div>
}

export default Banner;
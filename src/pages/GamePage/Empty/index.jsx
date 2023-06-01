import emptyGif from "../../../assets/empty.gif";
import css from './styles.module.scss'
import classNames from "classnames";

const Empty = ({text, withAnimation = false}) => {
    return <div className={classNames({[css.container]: withAnimation})}>
        <h6>{text}</h6>
        <img className={'w-100'} src={emptyGif} alt={'empty'}/>
    </div>
}

export default Empty;
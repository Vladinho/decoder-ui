import classNames from "classnames";
import {useSelector} from "react-redux";

const Layout = ({ children, cx = [] }) => {
    const state = useSelector((state) => state);
    return <div className={classNames(['container-md', 'p-3', ...cx])}>
        {state.me && <>
            <h2 className={'text-end'}>{state.me}</h2>
            <hr className="mt-2 mb-3"/>
        </>}
        {children}
    </div>
}

export default Layout;
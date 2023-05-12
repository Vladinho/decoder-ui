import {useDispatch} from "react-redux";
import {setState} from "../../reducers/roomReducer";
import css from './styles.module.scss'
import classNames from "classnames";
const Modal = ({ callback }) => {
    const dispatch = useDispatch();
    return <div className={css.overlay} onClick={() => dispatch(setState({modalCallback: null }))}>
        <div className="modal" tabIndex="-1" role="dialog">
            <div className="modal-dialog w-100" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Save changes</h5>
                        <button type="button" className={classNames(['btn', 'btn-light', css.close])} aria-label="Close" onClick={() => dispatch(setState({modalCallback: null }))}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={() => {
                            callback();
                            dispatch(setState({modalCallback: null }))
                        }}>Confirm</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => dispatch(setState({modalCallback: null }))}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Modal;
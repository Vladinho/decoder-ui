import {useDispatch} from "react-redux";
import {setState} from "../reducers/roomReducer";

const useModal = () => {
    const dispatch = useDispatch();
    return (modalCallback) => {
        dispatch(setState({ modalCallback }));
    };
}

export default useModal;
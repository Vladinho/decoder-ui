import useMy from "../../../hooks/useMy";
import Server from "../../../services/server";
import {useDispatch} from "react-redux";
import {useState} from "react";
import useModal from "../../../hooks/useModal";

const Answer = () => {
    const [answerState, setAnswerState] = useState(['', '', ''])
    const { code, words } = useMy();
    const dispatch = useDispatch();
    const showModal = useModal();
    const server = new Server(dispatch);
    return <>
        <h1 className='mb-2'>Code: {code}</h1>
        <form onSubmit={(e) => {
            e.preventDefault();
            showModal(() => server.setAnswer(code, answerState))
        }}>
            {
                code.split('').map((i, index) => <div className="form-group mb-2" key={i}>
                    <label htmlFor={`word${i}`} style={{textTransform: 'capitalize'}}>{words[+i - 1]}</label>
                    <input
                        type="text"
                        className="form-control"
                        id={`word${i}`}
                        placeholder='Enter your word'
                        value={answerState[index]}
                        onChange={(e) =>
                            setAnswerState((s) => {
                                const inputs = [...s];
                                inputs[index] = e.target.value;
                                return inputs;
                            })}/>
                </div>)
            }
            <button type="submit" className="btn btn-primary w-100" disabled={answerState.some(i => !i)}>Submit</button>
        </form>
    </>
}

export default Answer;
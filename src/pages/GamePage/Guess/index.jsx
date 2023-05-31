import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import useModal from "../../../hooks/useModal";
import Server from "../../../services/server";

const Guess = ({answers}) => {
    const [guessState, setGuessState] = useState(['', '', '']);

    const state = useSelector((state) => state);
    const server = new Server();

    const curAnswer = answers.find(i => i.round === state.round);
    const guess = curAnswer?.[`team_${state.myTeam}_guess`];
    useEffect(() => {
        guess && guess.length && setGuessState(guess.split(''))
    }, [guess])
    const isGuessNotChanged = guess && guess === guessState.join('');
    const showModal = useModal();
    return <>
        <table className="table">
            <tbody>
            {
                answers.find(i => i.round === state.round)?.answer.map((i, index) =>  <tr key={i}>
                    <td>{i}</td>
                    <td><input type="text" className="form-control" placeholder="Enter your code guess" maxLength={1} value={guessState[index]}  onChange={(e) =>
                        setGuessState((s) => {
                            const allowedCode = ['1', '2', '3', '4', ''];
                            if (allowedCode.some(i => i === e.target.value)) {
                                const inputs = [...s];
                                inputs[index] = e.target.value;
                                return inputs;
                            }
                            return s
                        })}/></td>
                </tr>)
            }
            </tbody>
        </table>
        <div className='d-flex justify-content-end mb-4'>
            {isGuessNotChanged ?
                <button
                    type="button"
                    className="btn btn-success text-end"
                    onClick={() => {
                        server.agree(curAnswer._id);
                    }}
                >Confirm?</button> :
                <button
                    type="button"
                    className="btn btn-primary w-100 mb-4"
                    disabled={new Set(guessState.filter(i => i)).size !== 3}
                    onClick={() => showModal(() => {
                        server.guess(curAnswer._id, guessState.join(''));
                    })}
                >Submit</button>}
        </div>
    </>
}

export default Guess;
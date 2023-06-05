import {useSelector} from "react-redux";
import classNames from "classnames";

const Table = ({ answer }) => {
    const state = useSelector((state) => state);
    return <div className={'overflow-auto'}><table className="table table-striped">
        <thead>
        <tr>
            <th scope="col">Round {answer.round}</th>
            <th scope="col" className={'text-center'} style={{fontSize: '10px'}}>your<br/>answer</th>
            <th scope="col" className={'text-center'} style={{fontSize: '10px'}}>correct<br/>answer</th>
            <th scope="col" className={'text-center'} style={{fontSize: '10px'}}>Opponent's<br/>answer</th>
        </tr>
        </thead>
        <tbody>
        {
            answer.answer.map((i, index) => {
                const yourGuess = answer[`team_${state.myTeam}_guess`][index];
                const correctAnswer = answer.code[index];
                const opponentGuess = answer[`team_${state.opponentTeam}_guess`][index];
                return <tr key={i}>
                    <td>{i}</td>
                    <td width={50} className={'text-center'}>
                        <span className={classNames('badge', yourGuess === correctAnswer ? 'text-bg-success' : 'text-bg-danger' )}>{yourGuess}</span>
                    </td>
                    <td width={50} className={'text-center'}>{answer.code[index]}</td>
                    <td width={50} className={'text-center'}>
                        <span className={classNames('badge', opponentGuess === correctAnswer ? 'text-bg-success' : 'text-bg-danger' )}>{opponentGuess}</span>
                    </td>
                </tr>
            })
        }
        </tbody>
    </table></div>
}

export default Table;
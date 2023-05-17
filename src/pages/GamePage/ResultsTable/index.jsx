import {useSelector} from "react-redux";
import {useState} from "react";
import Server from "../../../services/server";

const ResultsTable = ({ answers, words, comments = [], isMyResults }) => {
    const state = useSelector((state) => state);
    const wordsColumns = [[], [], [], []];
    const server = new Server();
    answers.forEach((i) => {
        const code = i.code.split('');
        code.forEach((c, index) => {
            wordsColumns[+c - 1].push(i.answer[index])
        });
    })
    const wordsRows = [];
    for(let i = 0; i < wordsColumns.length; i++) {
        for(let j= 0; j < wordsColumns.length; j++) {
            wordsRows[j] = wordsRows[j] || [];
            wordsRows[j][i] = wordsColumns[i][j];
        }
    }
    const rows = wordsRows.filter((r) => r.some(i => i));

    const commentsObj = {};
    comments.forEach(c => {
        const user = c.split('_')[0];
        const wordNumber = c.split('_')[1];
        const comment = c.split('__')[1];
        if (!commentsObj[user]) {
            commentsObj[user] = ['', '', '', ''];
        }
        commentsObj[user][wordNumber - 1] = comment
    })
    if (!commentsObj[state.me]) {
        commentsObj[state.me] = ['', '', '', '']
    }
    const [inputs, setInputs] = useState(commentsObj[state.me] || ['', '', '', '']);

    // let editedInput = null;
    // commentsObj[state.me].forEach((comment, index) => {
    //     if (comment !== inputs[index]) {
    //         editedInput = index;
    //     }
    // })

    return <>
        <div className={'overflow-auto'}>
            <table className="table table-striped mb-2 table-sm" style={{fontSize: '12px'}}>
            <thead>
            <tr>
                <th scope="col"></th>
                { words.map(i => <th key={i} scope="col">{isMyResults ? i : ''}</th>) }
            </tr>
            </thead>
            <tbody>
            {
                rows.map((i, index) => <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    {i.map((j, index) => <td key={index}>{j}</td>)}
                </tr>)
            }
            {!isMyResults && <tr>
                <th scope="row" colSpan={5}>Comments:</th>
            </tr>}
            {
                !isMyResults && Object.keys(commentsObj).map(key => <tr key={key}>
                    <th scope="row" className={'text-nowrap'}>{key}</th>
                    {commentsObj[key].map((i, index) => <td key={index}>
                        {state.me === key ?
                            <input
                                type="text"
                                key={index}
                                className="form-control"
                                placeholder="Enter your guess"
                                style={{fontSize: '10px'}}
                                value={inputs[index]}
                                onChange={(e) =>
                                    setInputs((s) => {
                                        const newInputs = [...s]
                                        newInputs[index] = e.target.value;
                                        return newInputs;
                                    })}
                            /> : i}
                    </td>)}
                </tr>)
            }
            </tbody>
        </table>
        </div>
        {
            !isMyResults && commentsObj[state.me] &&
            JSON.stringify(commentsObj[state.me]) !== JSON.stringify(inputs) &&
            <button
                className="btn btn-primary w-100"
                type="submit"
                onClick={() => {
                    server.setComment(inputs.map((i, index) => `${state.me}_${index + 1}__${i}`))
                }}
            >Save comment</button>
        }
    </>
}

export default ResultsTable;
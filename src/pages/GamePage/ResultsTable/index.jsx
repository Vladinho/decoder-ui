import {useSelector} from "react-redux";
import {useMemo, useState} from "react";
import Server from "../../../services/server";
import columnsToRows from "../../../utils/columnsToRows";

const ResultsTable = ({ answers, words, comments = [], isMyResults }) => {
    const [isCommentMode, setIsCommentMode] = useState(false);
    const state = useSelector((state) => state);
    const wordsColumns = [];
    const server = new Server();
    answers.forEach((i) => {
        const code = i.code.split('');
        code.forEach((c, index) => {
            if (!wordsColumns[+c - 1]) {
                wordsColumns[+c - 1] = []
            }
            wordsColumns[+c - 1].push(i.answer[index])
        });
    })

    const rows = useMemo(() => columnsToRows(wordsColumns), [wordsColumns])

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
    const isCommentChanged = commentsObj[state.me] &&
        JSON.stringify(commentsObj[state.me]) !== JSON.stringify(inputs);

    const commentUsers = Object.keys(commentsObj).filter(i => (isCommentMode && i === state.me) || commentsObj[i].some(i => i));

    return <>
        <div className={'overflow-auto'}>
            <table className="table table-striped mb-2 table-sm table-bordered" style={{fontSize: '12px'}}>
            <thead>
            <tr>
                { isMyResults && words.map(i => <th key={i} scope="col" className={'text-center pt-2 pb-2'} style={{width: '25%'}}>{isMyResults ? i : ''}</th>) }
            </tr>
            </thead>
            <tbody>
            {
                rows.map((i, index) => <tr key={index}>
                    {i.map((j, index) => <td key={index} className={'text-break'} style={{width: '25%'}}>{j}</td>)}
                </tr>)
            }
            {!isMyResults && !!commentUsers.length && <tr>
                <th className={'pt-4'} scope="row" colSpan={5} style={{'--bs-table-accent-bg': '#fff'}}>Comments:</th>
            </tr>}
            {
                !isMyResults && commentUsers.map(key => <tr key={key}>
                    {commentsObj[key].map((i, index) => <td key={index} className={'text-break'} style={{width: '25%'}}>
                        {state.me === key && isCommentMode ?
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
            !isMyResults && isCommentChanged &&
            <button
                className="btn btn-success w-100 mb-2"
                type="submit"
                onClick={async () => {
                    await server.setComment(inputs.map((i, index) => `${state.me}_${index + 1}__${i}`));
                    setIsCommentMode(false);
                }}
            >Save comment</button>
        }
        {
            !isMyResults && !isCommentMode && <button
                className="btn btn-primary w-100"
                type="submit"
                onClick={() => {
                    setIsCommentMode(true)
                }}
            >Add comment</button>
        }
        {
            !isMyResults && isCommentMode && <button
                className="btn btn-secondary w-100"
                type="submit"
                onClick={() => {
                    setIsCommentMode(false);
                    setInputs(commentsObj[state.me])
                }}
            >Cancel</button>
        }
    </>
}

export default ResultsTable;
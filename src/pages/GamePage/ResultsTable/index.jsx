import {useSelector} from "react-redux";
import React, {useMemo, useState} from "react";
import columnsToRows from "../../../utils/columnsToRows";
import useServer from "../../../hooks/useServer";

const ResultsTable = ({ answers, words, comments = [], isMyResults }) => {
    const [isCommentMode, setIsCommentMode] = useState(false);
    const state = useSelector((state) => state);
    const server = useServer();
    const wordsColumns = useMemo(() => {
        return answers.reduce((acc, cur) => {
            const code = cur.code.split('');
            code.forEach((c, index) => {
                if (!acc[+c - 1]) {
                    acc[+c - 1] = []
                }
                acc[+c - 1].push(cur.answer[index])
            });
            return acc;
        }, []);
    }, [answers]);

    const rows = useMemo(() => columnsToRows(wordsColumns), [wordsColumns]);
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
            <table className="table table-striped mb-4 table-sm table-bordered" style={{fontSize: '12px'}}>
            <thead>
            <tr>
                { isMyResults && words.map(i => <th key={i} scope="col" className={'text-center pt-3 pb-3'} style={{width: '25%'}}>{i}</th>) }
            </tr>
            </thead>
            <tbody>
            {
                rows.map((i, index) => <tr key={index}>
                    {i.map((j, index) => <td key={index} className={'text-break'} style={{width: '25%'}}>{j}</td>)}
                </tr>)
            }
            {!isMyResults && !!commentUsers.length && <tr>
                <th className={'pt-4'} scope="row" colSpan={4} style={{'--bs-table-accent-bg': '#fff'}}>Comments:</th>
            </tr>}
            {
                !isMyResults && commentUsers.map(key => <React.Fragment key={key}>
                    <tr>
                        <th scope="row" colSpan={4} className={'text-secondary'}>{key}</th>
                    </tr>
                    <tr>
                        {commentsObj[key].map((i, index) => <td key={index} className={'text-break'} style={{width: '25%'}}>
                            {state.me === key && isCommentMode ?
                                <input
                                    type="text"
                                    key={index}
                                    className="form-control"
                                    placeholder="Your guess"
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
                    </tr>
                </React.Fragment>)
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
            >{commentsObj[state.me]?.some(i => i) ? 'Edit comment' : 'Add comment'}</button>
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
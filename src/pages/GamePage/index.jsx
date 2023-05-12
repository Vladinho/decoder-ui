import Layout from "../../components/Layout";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Server from "../../services/server";
import useMy from "../../hooks/useMy";
import Guess from "./Guess";
import Table from "./Table";
import classNames from "classnames";
import ResultsTable from "./ResultsTable";

const Game = () => {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const server = new Server(dispatch);
    const [answerState, setAnswerState] = useState(['', '', ''])
    const [activeTab, setActiveTab] = useState('My');
    const { code, answers, curPlayer, words, opponentAnswers, myTeam, opponentTeam, opponentWords } = useMy();
    useEffect( () => {
        server.getRoom();
        server.getGame();
        server.getAnswers();
    }, []);
    const curAnswer = answers.find(i => i.round === state.round);
    const guess = curAnswer?.[`team_${state.myTeam}_guess`];
    const teamAgree = curAnswer?.[`team_${state.myTeam}_agree`];

    const curOpponentAnswer = opponentAnswers.find(i => i.round === state.round);
    const teamAgreeOnOpponentAnswer = curOpponentAnswer?.[`team_${state.myTeam}_agree`];
    const [guessState, setGuessState] = useState(['', '', ''])
    useEffect(() => {
        guess && guess.length && setGuessState(guess.split(''))
    }, [guess])
    const isGuessNotChanged = guess && guess === guessState.join('');
    const myTeamAnswersForTable = answers.filter(i => i[`team_${state.myTeam}_agree`].length === myTeam.length - 1 &&  i[`team_${state.opponentTeam}_agree`].length === opponentTeam.length);
    const opponentTeamAnswersForTable = opponentAnswers.filter(i => i[`team_${state.opponentTeam}_agree`].length === opponentTeam.length - 1 &&  i[`team_${state.myTeam}_agree`].length === myTeam.length);

    return <Layout>
        {myTeamAnswersForTable && myTeamAnswersForTable.length === state.round && opponentTeamAnswersForTable && opponentTeamAnswersForTable.length === state.round &&
            <button type="button" className="btn btn-success w-100 mb-3" onClick={() => server.nextRound()}>Next Round</button>}
        <ul className="list-group list-group-horizontal mb-3" style={{fontSize: '12px'}}>
            {words.map(i => <li className="list-group-item flex-grow-1 flex-shrink-1" key={i}>{i}</li>)}
        </ul>
        {
            code && state.round > answers.length && curPlayer === state.me && <>
                <h1 className='m-2'>Code: {code}</h1>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    // server.setAnswer()
                    server.setAnswer(code, answerState)
                }}>
                    {
                        code.split('').map((i, index) => <div className="form-group mb-2" key={i}>
                            <label htmlFor={`word${i}`}>{words[+i - 1]}</label>
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
                    <button type="submit" className="btn btn-primary" disabled={answerState.some(i => !i)}>Submit</button>
                </form>
            </>
        }
        {
            answers.length === state.round && opponentAnswers.length === state.round && <>
            {!teamAgree?.some(i => i === state.me) && curAnswer?.user !== state.me && <Guess answers={answers}/>}
            {!teamAgreeOnOpponentAnswer?.some(i => i === state.me) && <Guess answers={opponentAnswers}/>}
            </>
        }

        {
            !!myTeamAnswersForTable.length && !!opponentTeamAnswersForTable.length && <ul className="nav nav-tabs mt-4">
                <li className="nav-item">
                    <a className={classNames('nav-link', {active: activeTab === 'My'})} onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('My');
                    }} href='#'>My words</a>
                </li>
                <li className="nav-item">
                    <a className={classNames('nav-link', {active: activeTab === 'Opponent'})} onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Opponent');
                    }} href='#'>Opponent`s words</a>
                </li>
            </ul>
        }
        {
            activeTab === 'My' && <>
                {
                    myTeamAnswersForTable.map(a => <Table answer={a} key={a._id} /> )
                }
                {
                    !!myTeamAnswersForTable.length && <ResultsTable answers={myTeamAnswersForTable} words={words}/>
                }
            </>
        }
        {
            activeTab === 'Opponent' && <>
                {
                    opponentTeamAnswersForTable.map(a => <Table answer={a} key={a._id} /> )
                }
                {
                    !!opponentTeamAnswersForTable.length && <ResultsTable answers={opponentTeamAnswersForTable} words={opponentWords}/>
                }
            </>
        }
        {/*<pre>{JSON.stringify(state, null, 4)}</pre>*/}
    </Layout>
}

export default Game;
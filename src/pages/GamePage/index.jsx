import Layout from "../../components/Layout";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Server from "../../services/server";
import useMy from "../../hooks/useMy";
import Guess from "./Guess";
import Table from "./Table";
import classNames from "classnames";
import ResultsTable from "./ResultsTable";
import Counter from "../Counter";
import emptyGif from "../../assets/empty.gif"
import useModal from "../../hooks/useModal";
import useCount from "../../hooks/useCount";
import {setState} from "../../reducers/roomReducer";

const Game = () => {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const showModal = useModal();
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
    const teamAgree = curAnswer?.[`team_${state.myTeam}_agree`];

    const curOpponentAnswer = opponentAnswers.find(i => i.round === state.round);
    const teamAgreeOnOpponentAnswer = curOpponentAnswer?.[`team_${state.myTeam}_agree`];
    const myTeamAnswersForTable = answers.filter(i => i[`team_${state.myTeam}_agree`].length === myTeam.length - 1 &&  i[`team_${state.opponentTeam}_agree`].length === opponentTeam.length);
    const opponentTeamAnswersForTable = opponentAnswers.filter(i => i[`team_${state.opponentTeam}_agree`].length === opponentTeam.length - 1 &&  i[`team_${state.myTeam}_agree`].length === myTeam.length);

    const myCounter = useCount();
    const opponentCounter = useCount(false);
    const isMyGuess = answers.length === state.round && opponentAnswers.length === state.round && !teamAgree?.some(i => i === state.me) && curAnswer?.user !== state.me;
    const isOpponentGuess = answers.length === state.round && opponentAnswers.length === state.round && !teamAgreeOnOpponentAnswer?.some(i => i === state.me);

    return <Layout>
        <Counter />
        {[myCounter.black, myCounter.white, opponentCounter.black, opponentCounter.white].every(i => i < 2) &&
            myTeamAnswersForTable &&
            myTeamAnswersForTable.length === state.round &&
            opponentTeamAnswersForTable &&
            opponentTeamAnswersForTable.length === state.round &&
            myCounter.answeredRounds.some(i => i === state.round) &&
            opponentCounter.answeredRounds.some(i => i === state.round) &&
            <button type="button" className="btn btn-success w-100 mb-3" onClick={() => server.nextRound()}>Next Round</button>}

        {
            code && state.round > answers.length && curPlayer === state.me && <>
                <h1 className='m-2'>Code: {code}</h1>
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

        <ul className="nav nav-tabs mt-4 mb-4">
            <li className="nav-item">
                <a className={classNames('nav-link', {active: activeTab === 'My'})} onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('My');
                }} href='#' style={{fontSize: '12px'}}>My words {isMyGuess && <span className="badge bg-danger">1</span>}</a>
            </li>
            <li className="nav-item">
                <a className={classNames('nav-link', {active: activeTab === 'Opponent'})} onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('Opponent');
                }} href='#' style={{fontSize: '12px'}}>Opponent`s words {isOpponentGuess && <span className="badge bg-danger">1</span>}</a>
            </li>
        </ul>

        {
            activeTab === 'My' && <>
                <ul className="list-group list-group-horizontal mb-3 overflow-auto" style={{fontSize: '12px'}}>
                    {words.map(i => <li className="list-group-item flex-grow-1 flex-shrink-1" key={i}
                                        style={{textTransform: 'capitalize'}}>{i}</li>)}
                </ul>
                {
                    !!myTeamAnswersForTable.length && <ResultsTable answers={myTeamAnswersForTable} words={words} isMyResults={true}/>
                }
                {
                    isMyGuess && <Guess answers={answers} />
                }
                {
                    !!myTeamAnswersForTable.length && <div className="accordion mt-4">
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button
                                    className={classNames('accordion-button', { 'collapsed': !state.isMyDetailsOpened })}
                                    onClick={() => dispatch(setState({isMyDetailsOpened: !state.isMyDetailsOpened}))}
                                    type="button">
                                    Show detailed results
                                </button>
                            </h2>
                            <div className={classNames('accordion-collapse', 'collapse', { 'show': state.isMyDetailsOpened })}>
                                <div className="accordion-body">
                                    {
                                        myTeamAnswersForTable.map(a => <Table answer={a} key={a._id} /> )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    !myTeamAnswersForTable?.length &&
                    !myTeamAnswersForTable.length &&
                    !isMyGuess &&
                    <>
                        <h6>There are no your words. Wait...</h6>
                        <img className={'w-100'} src={emptyGif} alt={'empty'}/>
                    </>
                }
            </>
        }
        {
            activeTab === 'Opponent' && <>
                {
                    !!opponentTeamAnswersForTable.length && <ResultsTable answers={opponentTeamAnswersForTable} words={opponentWords}  comments={state[`comments_${state.myTeam}`]} isMyResults={false}/>
                }
                {
                    isOpponentGuess && <Guess answers={opponentAnswers}/>
                }
                {
                    !!myTeamAnswersForTable.length && <div className="accordion mt-4">
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button
                                    className={classNames('accordion-button', { 'collapsed': !state.isOpponentDetailsOpened })}
                                    onClick={() => dispatch(setState({isOpponentDetailsOpened: !state.isOpponentDetailsOpened}))}
                                    type="button">
                                    Show detailed results
                                </button>
                            </h2>
                            <div className={classNames('accordion-collapse', 'collapse', { 'show': state.isOpponentDetailsOpened })}>
                                <div className="accordion-body">
                                    {
                                        opponentTeamAnswersForTable.map(a => <Table answer={a} key={a._id} /> )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {
                    !opponentTeamAnswersForTable?.length &&
                    !opponentTeamAnswersForTable.length &&
                    !isOpponentGuess &&
                    <>
                        <h6>There are no opponent`s words. Wait...</h6>
                        <img className={'w-100'} src={emptyGif} alt={'empty'}/>
                    </>
                }
            </>
        }
        {/*<pre>{JSON.stringify(state, null, 4)}</pre>*/}
    </Layout>
}

export default Game;
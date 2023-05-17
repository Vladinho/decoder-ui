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

    return <Layout>
        <Counter />
        {[...Object.values(myCounter), ...Object.values(opponentCounter)].every(i => i < 2) && myTeamAnswersForTable && myTeamAnswersForTable.length === state.round && opponentTeamAnswersForTable && opponentTeamAnswersForTable.length === state.round &&
            <button type="button" className="btn btn-success w-100 mb-3" onClick={() => server.nextRound()}>Next Round</button>}
        <ul className="list-group list-group-horizontal mb-3 overflow-auto" style={{fontSize: '12px'}}>
            {words.map(i => <li className="list-group-item flex-grow-1 flex-shrink-1" key={i} style={{textTransform: 'capitalize'}}>{i}</li>)}
        </ul>


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
                    <button type="submit" className="btn btn-primary" disabled={answerState.some(i => !i)}>Submit</button>
                </form>
            </>
        }

        <ul className="nav nav-tabs mt-4 mb-4">
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

        {
            activeTab === 'My' && <>
                {
                    answers.length === state.round && opponentAnswers.length === state.round && <>
                        {!teamAgree?.some(i => i === state.me) && curAnswer?.user !== state.me && <Guess answers={answers} />}
                    </>
                }
                {
                    myTeamAnswersForTable.map(a => <Table answer={a} key={a._id} /> )
                }
                {
                    !!myTeamAnswersForTable.length && <ResultsTable answers={myTeamAnswersForTable} words={words} isMyResults={true}/>
                }
                {
                    !myTeamAnswersForTable?.length &&
                    !myTeamAnswersForTable.length &&
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
                    answers.length === state.round && opponentAnswers.length === state.round && <>
                        {!teamAgreeOnOpponentAnswer?.some(i => i === state.me) && <Guess answers={opponentAnswers}/>}
                    </>
                }
                {
                    opponentTeamAnswersForTable.map(a => <Table answer={a} key={a._id} /> )
                }
                {
                    !!opponentTeamAnswersForTable.length && <ResultsTable answers={opponentTeamAnswersForTable} words={opponentWords}  comments={state[`comments_${state.myTeam}`]} isMyResults={false}/>
                }
                {
                    !opponentTeamAnswersForTable?.length &&
                    !opponentTeamAnswersForTable.length &&
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
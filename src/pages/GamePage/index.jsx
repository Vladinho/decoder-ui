import Layout from "../../components/Layout";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import useMy from "../../hooks/useMy";
import Guess from "./Guess";
import Table from "./Table";
import classNames from "classnames";
import ResultsTable from "./ResultsTable";
import Counter from "../Counter";
import useCount from "../../hooks/useCount";
import {setState} from "../../reducers/roomReducer";
import Answer from "./Answer";
import Banner from "../../components/Banner";
import Empty from "./Empty";
import useServer from "../../hooks/useServer";

const Game = () => {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const server = useServer();
    const [activeTab, setActiveTab] = useState('My');
    const { code, answers, curPlayer, words, opponentAnswers, opponentWords } = useMy();
    useEffect(  () => {
        server.reloadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const curAnswer = answers.find(i => i.round === state.round);
    const teamAgree = curAnswer?.[`team_${state.myTeam}_agree`];

    const myCounter = useCount();
    const opponentCounter = useCount(false);

    const curOpponentAnswer = opponentAnswers.find(i => i.round === state.round);
    const teamAgreeOnOpponentAnswer = curOpponentAnswer?.[`team_${state.myTeam}_agree`];

    const myTeamAnswersForTable = answers.filter(i => myCounter.answeredRounds.some(j => j === i.round));
    const opponentTeamAnswersForTable = opponentAnswers.filter(i => opponentCounter.answeredRounds.some(j => j === i.round));

    const isMyGuess = answers.length === state.round && opponentAnswers.length === state.round && !teamAgree?.some(i => i === state.me) && curAnswer?.user !== state.me;
    const isOpponentGuess = answers.length === state.round && opponentAnswers.length === state.round && !teamAgreeOnOpponentAnswer?.some(i => i === state.me);

    const isTeamsReady = myTeamAnswersForTable &&
        myTeamAnswersForTable.length === state.round &&
        opponentTeamAnswersForTable &&
        opponentTeamAnswersForTable.length === state.round &&
        myCounter.answeredRounds.some(i => i === state.round) &&
        opponentCounter.answeredRounds.some(i => i === state.round);

    const isMyAnswer = !state.isLoading && code && state.round > answers.length && curPlayer === state.me;

    const isLost = isTeamsReady && ((myCounter.black > 1 && opponentCounter.black < 2) || (opponentCounter.white > 1 && myCounter.white < 2));
    const isWin = isTeamsReady && ((myCounter.white > 1 && opponentCounter.white < 2) || (opponentCounter.black > 1 && myCounter.black < 2));
    const isNoWinner = isTeamsReady && (!isWin && !isLost && [...Object.values(myCounter), ...Object.values(opponentCounter)].some(i => i > 1))

    if (!state.round && !state.isLoading) {
        return <Layout>
            <Empty text={'The game has`t been started yet! Wait...'} withAnimation={true}/>
        </Layout>
    }

    return <Layout>
        {!isTeamsReady && !isMyAnswer && !isMyGuess && !isOpponentGuess && !isLost && !isWin && !isNoWinner && !state.isLoading && <Banner /> }
        <Counter isLost={isLost} isWin={isWin} isNoWinner={isNoWinner} />
        {
            [myCounter.black, myCounter.white, opponentCounter.black, opponentCounter.white].every(i => i < 2) && isTeamsReady &&
            (state.mainUser === state.me ?
                <button type="button" className="btn btn-success w-100 mb-3" onClick={() => server.nextRound()}>Next Round</button> :
                <div className="alert alert-success" role="alert">
                    Admin {state.mainUser} should start a new round! Wait...
                </div>)
        }

        {
            isMyAnswer && <Answer />
        }

        <ul className="nav nav-tabs mt-4 mb-4">
            <li className="nav-item">
                <a className={classNames('nav-link', {active: activeTab === 'My'})} onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('My');
                }} href='/' style={{fontSize: '12px'}}>My words {isMyGuess && <span className="badge bg-danger">1</span>}</a>
            </li>
            <li className="nav-item">
                <a className={classNames('nav-link', {active: activeTab === 'Opponent'})} onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('Opponent');
                }} href='/' style={{fontSize: '12px'}}>Opponent's words {isOpponentGuess && <span className="badge bg-danger">1</span>}</a>
            </li>
        </ul>

        {
            activeTab === 'My' && <>
                {
                    isMyGuess && <Guess answers={answers} />
                }
                <ResultsTable answers={myTeamAnswersForTable} words={words} isMyResults={true}/>
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
                                        myTeamAnswersForTable.reverse().map(a => <Table answer={a} key={a._id} /> )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </>
        }
        {
            activeTab === 'Opponent' && <>
                {
                    isOpponentGuess && <Guess answers={opponentAnswers}/>
                }
                {
                    !!opponentTeamAnswersForTable.length && <ResultsTable answers={opponentTeamAnswersForTable} words={opponentWords}  comments={state[`comments_${state.myTeam}`]} isMyResults={false}/>
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
                                        opponentTeamAnswersForTable.reverse().map(a => <Table answer={a} key={a._id} /> )
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
                    !state.isLoading &&
                    <Empty text={"There are no Opponent's words. Wait..."}/>
                }
            </>
        }
        {/*<pre>{JSON.stringify(state, null, 4)}</pre>*/}
    </Layout>
}

export default Game;
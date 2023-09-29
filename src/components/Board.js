import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';



const Board = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const PLAYER_1 = 'O';
    const PLAYER_2 = 'X';
    const [Data, setData] = useState(['', '', '', '', '', '', '', '', '']);
    const [Result, setResult] = useState('');
    const [CurrentPlayer, setCurrentPlayer] = useState(PLAYER_1);
    const [AI, setAI] = useState(location.state.AI);
    const [winningCombination, setwinningCombination] = useState();
    const [Scores, setScores] = useState([]);

    if (!localStorage.getItem("AI")) {
        localStorage.setItem("AI", JSON.stringify([0, 0]));
    }
    if (!localStorage.getItem("2 Player")) {
        localStorage.setItem("2 Player", JSON.stringify([0, 0]));
    }



    const checkWin = (player, DataCopy, returnCombination = false) => {
        const winCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const combination of winCombinations) {
            const [a, b, c] = combination;

            if (DataCopy[a] === player && DataCopy[b] === player && DataCopy[c] === player) {
                if (returnCombination) {
                    setwinningCombination(combination);
                    return; // Return the winning combination
                } else {
                    return true; // Player has won
                }
            }
        }

        return false; // No win yet
    };
    const makeAIMove = () => {
        const player = 'X';
        const opponent = 'O';

        const availableMoves = Data.map((cell, index) => cell === '' ? index : null).filter((index) => index !== null);
        // Check for Own Winning Position
        for (const move of availableMoves) {
            const copyArr = [...Data];
            copyArr[move] = player;
            if (checkWin(player, copyArr)) {
                const newData = [...Data];
                newData[move] = player;
                setData(newData);
                setCurrentPlayer(opponent);
                return;
            }
        }

        // Check for opponent's Winning Position
        for (const move of availableMoves) {
            const copyArr = [...Data];
            copyArr[move] = opponent;
            if (checkWin(opponent, copyArr)) {
                const newData = [...Data];
                newData[move] = player;
                setData(newData);
                setCurrentPlayer(opponent);
                return;
            }
        }

        // Make a random move
        const randomMoves = shuffleArray([0, 2, 6, 8, 4, 1, 3, 5, 7]);
        for (const move of randomMoves) {
            if (Data[move] === '') {
                const newData = [...Data];
                newData[move] = player;
                setData(newData);
                setCurrentPlayer(opponent);
                return;
            }
        }
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    useEffect(() => {

        if (AI) {
            setScores(JSON.parse(localStorage.getItem("AI")));

        } else {

            setScores(JSON.parse(localStorage.getItem("2 Player")));
        }
        // Checks if at all a win condition is present
        const CheckWin = () => {
            return (checkWin('O', Data) || checkWin('X', Data));
        }

        // Checks for a tie
        const checkTie = () => {
            let count = 0;
            Data.forEach((cell) => {
                if (cell !== '') {
                    count++;
                }
            })
            return count === 9;
        }

        // Setting the winner in case of a win
        if (CheckWin()) {
            setResult(
                CurrentPlayer === 'O'
                    ? (AI ? 'Computer Wins' : 'Player 2 Wins')
                    : (AI ? 'You Win' : 'Player 1 Wins') 
            );
            if (CurrentPlayer === 'O') {

                if (AI) {
                    let AIScore = JSON.parse(localStorage.getItem("AI"));
                    localStorage.setItem("AI", JSON.stringify([AIScore[0], AIScore[1] + 1]));
                    setScores([AIScore[0], AIScore[1] + 1]);
                } else {
                    let twoPScore = JSON.parse(localStorage.getItem("2 Player"));
                    localStorage.setItem("2 Player", JSON.stringify([twoPScore[0], twoPScore[1] + 1]));
                    setScores([twoPScore[0], twoPScore[1] + 1]);
                }
            } else {
                if (AI) {
                    let AIScore = JSON.parse(localStorage.getItem("AI"));
                    localStorage.setItem("AI", JSON.stringify([AIScore[0] + 1, AIScore[1]]));
                    setScores([AIScore[0] + 1, AIScore[1]]);
                } else {
                    let twoPScore = JSON.parse(localStorage.getItem("2 Player"));
                    localStorage.setItem("2 Player", JSON.stringify([twoPScore[0] + 1, twoPScore[1]]));
                    setScores([twoPScore[0] + 1, twoPScore[1]]);
                }

            }
            if (CurrentPlayer === 'O') {
                checkWin('X', Data, true);
            }
            else {
                checkWin('O', Data, true);
            }

        } else if (checkTie()) {
            // Setting the winner to tie in case of a tie
            setResult("It's a Tie!");
        }
        else if (CurrentPlayer === PLAYER_2 && AI) {
            makeAIMove();
        }

    }
        , [CurrentPlayer]);

    const ResetBoard = () => {
        setData(['', '', '', '', '', '', '', '', '']);
        setResult('');
        setCurrentPlayer('O');
        setwinningCombination();
        if (AI) {
            setScores(JSON.parse(localStorage.getItem("AI")));
        } else {
            setScores(JSON.parse(localStorage.getItem("2 Player")));
        }
    };

    const RestartGame = () => {
        localStorage.setItem("AI", JSON.stringify([0, 0]));
        localStorage.setItem("2 Player", JSON.stringify([0, 0]));
        ResetBoard();
    };

    const fill_board = (position) => {
        if (Result) { return };
        if (Data[position] === '') {
            const newData = [...Data];
            newData[position] = CurrentPlayer;
            setData(newData);
            CurrentPlayer === PLAYER_1 ?
                setCurrentPlayer(PLAYER_2) :
                setCurrentPlayer(PLAYER_1);
        }
    };

    const onClickHandler = () => {
        navigate(-1);
    };

    return (
        <>
            <div className="navbar container infotain navbar-dark bg-dark">
                <button className="btn-84" onClick={onClickHandler}>Go Back</button>
                <h3 className=" infotain ">Tic Tac Toe</h3>
                <h1> </h1>
            </div>

            <div className="container">
                <div className="infotain">
                    
                    {AI ? (<h6>
                        Player : O
                    </h6>) : (<h6>
                        Player 1 : O
                    </h6>)
                    }
                    {AI ? (<h6>
                        Computer : X
                    </h6>) : (<h6>
                        Player 2 : X
                    </h6>)
                    }
                </div>
                <div className="b-1"></div>
                <div className="infotain">
                    <h6>
                        {Scores[0]}
                    </h6>
                    <h6>
                        {"Scores"}
                    </h6>
                    <h6>
                        {Scores[1]}
                    </h6>
                </div>

            </div>
            <div className="container justify-content-center infotain">
                <h5>
                    Current Player : {CurrentPlayer}
                </h5>
            </div>
            <div className="container justify-content-center">
                <div className="info">

                    {Result}
                </div>

                <div>
                    {[0, 1, 2].map((row) => (
                        <div key={row} className="board-row">
                            {[0, 1, 2].map((col) => {
                                const position = row * 3 + col;
                                const isHighlighted = winningCombination ? winningCombination.includes(position) : false;
                                return (
                                    <div
                                        key={position}
                                        // className={`box ${isHighlighted ? 'highlighted-box' : ''}`}
                                        className="box"
                                        onClick={() => fill_board(position)}
                                        disabled={!!Result}
                                        style={{ cursor: Result ? 'not-allowed' : '' }}
                                    >
                                        <p className={`character ${isHighlighted ? 'highlight-character' : ''}`}>{Data[position]}</p>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="d-flex justify-content-center m-3 ">
                    <button onClick={RestartGame} className='btn-84 pr-10'>Restart Game</button>
                    <button onClick={ResetBoard} className={`btn-84 ${winningCombination ? 'highlighted-box' : ''}`}>Reset Board</button>
                </div>

                {Result && ( 
                    <div className={`alert ${Result=== "It's a Tie!" ? "info":"success"} `}>
                        <input type="checkbox" id="alert2" />
                        <label className="close" title="close" htmlFor="alert2">
                            <i className="icon-remove"></i>
                        </label>
                        <p className="inner">
                            {Result}
                        </p>
                    </div>
                )}


            </div>
        </>
    );

};


export default Board;

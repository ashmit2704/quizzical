import React from "react";
import {decode} from 'html-entities';
import '../style.css';

export default function Body() {
    const [data, setData] = React.useState(null);
    const [score, setScore] = React.useState(null);
    const [newGame, setNewGame] = React.useState(false);
    const [reset, setReset] = React.useState(false);
    const [isChecked, setIsChecked] = React.useState(false);

    React.useEffect(() => {
        async function api() {
            const response = await fetch('https://opentdb.com/api.php?amount=5&category=18&type=multiple');
            const jsonData = await response.json();
            const results = jsonData.results;
            const newResult = results.map(res => ({
                ...res,
                choiceArr: choices(res.incorrect_answers, res.correct_answer)
            }));
            setData(newResult);
        }
        api();
    }, [reset]);

    function choices(incorrect_answers, correct_answer) {
        const choiceArr = [];
        incorrect_answers.map(incorrect_answer => (
            choiceArr.push({text: decode(incorrect_answer), clicked: false})
        ));
        const ind = Math.floor(Math.random() * 4);
        choiceArr.splice(ind, 0, {text: decode(correct_answer), clicked: false});
        return choiceArr;
    }

    function handleChoice(queIndex, choiceIndex) {
        if (!isChecked) {
            setData(prevData => (
                prevData.map((res, qIndex) => {
                    if (qIndex === queIndex) {
                        return {
                            ...res,
                            choiceArr: res.choiceArr.map((choice, cIndex) => ({
                                ...choice,
                                clicked: cIndex === choiceIndex ? !choice.clicked : false
                            }))
                        };
                    } else {
                        return res;
                    }
                })
            ));
        }
    }

    function check() {
        if (!newGame) {
            let cnt = 0;
            data.forEach(prevData => {
                prevData.choiceArr.forEach(pick => {
                    if (pick.clicked) {
                        if (pick.text === prevData.correct_answer) {
                            cnt++;
                        }
                    }
                });
            });
            setScore(cnt);
            setNewGame(true);
            setIsChecked(true); // mark as checked
        } else {
            setScore(null);
            setNewGame(false);
            setReset(true);
            setIsChecked(false); // reset the check flag
        }
    }

    return (
        <div className="que-container">
            {data ? (
                <div>
                    {data.map((que, queIndex) => (
                        <div key={queIndex} className="inside-que-container">
                            <h2>{decode(que.question)}</h2>
                            <div className="choices">
                                {que.choiceArr.map((choice, choiceIndex) => (
                                    <div
                                        key={choiceIndex}
                                        className="choice"
                                        onClick={() => handleChoice(queIndex, choiceIndex)}
                                        style={{
                                            backgroundColor: isChecked
                                                ? choice.clicked && choice.text === que.correct_answer
                                                    ? '#94D7A2' // correct chosen
                                                    : choice.clicked && choice.text !== que.correct_answer
                                                    ? '#F8BCBC' // incorrect chosen
                                                    : choice.text === que.correct_answer
                                                    ? '#94D7A2' // correct answer highlight
                                                    : 'transparent'
                                                : choice.clicked
                                                ? '#D6DBF5'
                                                : 'transparent'
                                        }}
                                    >
                                        {choice.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="check-button-container">
                        <h2>{score !== null && `You scored ${score}/5 correct answers`}</h2>
                        <button className="check-button" onClick={check}>
                            {newGame ? "Play Again" : "Check answers"}
                        </button>
                    </div>
                </div>
            ) : (
                <h3 className="loading">Loading...</h3>
            )}
        </div>
    );
}

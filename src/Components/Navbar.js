import React from "react";

export default function Navbar(props) {
    return (
        <nav className="navbar">
            <div className="nav-container">
                <h1 className="quiz-head">Quizzical</h1>
                <p className="quiz-para">Challenge yourself with the quiz</p>
                <button className="start-btn" onClick={props.startQuiz}>Start quiz</button>
            </div>
        </nav>
    )
}
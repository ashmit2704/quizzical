import React from "react";
import './style.css'
import Navbar from './Components/Navbar'
import Body from './Components/Body'

export default function App() {
  const [quiz, setQuiz] = React.useState(false)
  // console.log(quiz)

  function startQuiz() {
    setQuiz(true)
  }
  
  return (
    <div className="bg-img-container">
      {quiz ? <Body/> : <Navbar startQuiz={() => startQuiz()} />}
      <img className="yellow" src="./images/yellow.svg" />
      <img className="blue" src="./images/blue.svg" />
    </div>
  )
}
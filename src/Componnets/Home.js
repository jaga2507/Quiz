import React, { Component } from 'react'
import styles from './Home.module.css'
import swal from "sweetalert"

export default class Home extends Component{

    constructor(props){
        super(props)
        this.state={
            progressWidthPercentage:"0%",
            answerCorrect:false,
            answerSelected:"",
            questionLength:0,
            questionNum:0,
            completed:true,
            scores:{
                maxScorePercentage:100,
                currentScorePercentage:0,
                minScorePercentage:0,
                answeredQuestions:0,
                answeredCorrect:0
            }
        }
    }

    handleAnswers=(text)=>{
        const {questionNum,questionLength,scores} =this.state

        const progressVal=((scores.answeredQuestions+1)/questionLength)*100
        
        if(text===this.props.questionDatas[this.state.questionNum].correct_answer){
            
            const remainingQuestion=questionLength-(questionNum+1)
            const minScoreVal=Math.ceil(((scores.answeredCorrect+1)/questionLength)*100)
            const maxScoreVal=Math.ceil((((scores.answeredCorrect+1)+remainingQuestion)/questionLength)*100)
            const currentScoreVal=Math.ceil(((scores.answeredCorrect+1)/(scores.answeredQuestions+1))*100)

            this.setState({
                answerSelected:text,
                answerCorrect:true,
                progressWidthPercentage: progressVal+"%",
                scores:{
                    ...scores,
                    maxScorePercentage:maxScoreVal,
                    currentScorePercentage:currentScoreVal,
                    minScorePercentage:minScoreVal,
                    answeredQuestions:scores.answeredQuestions+1,
                    answeredCorrect:scores.answeredCorrect+1
                }
            })
        }
        else{
            const remainingQuestion=questionLength-(questionNum+1)
            const maxScoreVal=Math.ceil(((scores.answeredCorrect+remainingQuestion)/questionLength)*100)
            const currentScoreVal=Math.ceil((scores.answeredCorrect/(scores.answeredQuestions+1))*100)

            this.setState({
                answerSelected:text,
                progressWidthPercentage: progressVal+"%",
                scores:{
                    ...scores,
                    maxScorePercentage:maxScoreVal,
                    currentScorePercentage:currentScoreVal,
                    answeredQuestions:scores.answeredQuestions+1
                }
            })
        }
    }

    handleNext=()=>{
        if((this.state.questionNum+1)<this.state.questionLength){
            this.setState({
                questionNum:this.state.questionNum+1,
                answerSelected:"",
                answerCorrect:false
            })
        }
        else{
            swal({
                title: "You have completed the test",
                text: "Score  :  "+this.state.scores.answeredCorrect,
                icon: "success",
                button: "Play Again",
              })
              .then(() => {
                this.setState({
                    questionNum:0,
                    answerSelected:"",
                    answerCorrect:false,
                    scores:{
                        ...this.state.scores,
                        maxScorePercentage:100,
                        currentScorePercentage:0,
                        minScorePercentage:0,
                        answeredQuestions:0,
                        answeredCorrect:0
                    },
                    progressWidthPercentage:"0%"
                });
              });
        }
    }

    componentDidMount(){
        this.setState({questionLength:this.props.questionDatas.length})
    }

    render(){
        const {
            progressWidthPercentage,
            answerCorrect,
            answerSelected,
            questionNum,
            questionLength,
            scores,
            completed
        } = this.state

        const {questionDatas} = this.props

        const type=questionDatas[questionNum].difficulty

        return(
            <div>
                <div className={styles.progress} style={{ width: progressWidthPercentage }} ></div>
                <div className={answerSelected?`${styles.questionCont} ${styles.questionContParent}`:styles.questionCont}>
                    <div className={styles.questionNum}>Question {questionNum+1} 0f {questionLength}</div>
                    <div className={styles.type}>{questionDatas[questionNum].category}</div>
                    <div className={styles.starCont}>
                        {(type==="easy" || type==="medium" || type==="hard")?<i  className={styles.star}></i>:""}
                        {(type==="medium" || type==="hard")?<i  className={styles.star}></i>:""}
                        {type==="hard"?<i  className={styles.star}></i>:""}
                    </div>
                    <div className={styles.question}>{questionDatas[questionNum].question}</div>
                    <div className={styles.answers}>
                        {questionDatas[questionNum].incorrect_answers.map((text,i)=>(
                            <button key={i} disabled={answerSelected} 
                            className={
                                !answerSelected?styles.answerButton:
                                (text===questionDatas[this.state.questionNum].correct_answer)?`${styles.answerButton} ${styles.correct}`:
                                text===answerSelected?`${styles.answerButton} ${styles.answeredColor}`:
                                `${styles.answerButton} ${styles.block}`
                            } 
                            onClick={()=>{this.handleAnswers(text)}}>{text}</button>    
                        ))}
                    </div>
                    {answerSelected?
                        <div className={styles.evaluate}>
                            <div>{answerCorrect?"Correct!":"Sorry!"}</div>
                            <button onClick={this.handleNext}>Next Question</button>
                        </div> : ""
                    }
                </div>
                <div className={styles.scoreCont}>
                    <div className={styles.score}>
                            Score: {scores.currentScorePercentage}%
                        <span style={{float:"right"}}>
                            Max Score: {scores.maxScorePercentage}%
                        </span>
                    </div>
                    <div className={styles.scoreBar}>
                        <div className={styles.maxScore} style={{ width: scores.maxScorePercentage+"%" }}>
                            <div className={styles.currentScore} style={{ width: scores.currentScorePercentage+"%" }}>
                                <div className={styles.minScore} style={{ width: scores.minScorePercentage+"%" }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
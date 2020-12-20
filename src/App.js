import './App.css';
import Home from './Componnets/Home'
import datas from './questions.json'

function App() {

  const questionDatas=datas.map((ele)=>{
    const index=Math.floor(Math.random() * ele.incorrect_answers.length);
    if(!ele.incorrect_answers.includes(ele.correct_answer))    
      ele.incorrect_answers.splice(index,0,ele.correct_answer)
    return {
      category:decodeURIComponent(ele.category),
      type: decodeURIComponent(ele.type),
      difficulty: decodeURIComponent(ele.difficulty),
      question: decodeURIComponent(ele.question),
      correct_answer: decodeURIComponent(ele.correct_answer),
      incorrect_answers:ele.incorrect_answers.map((item)=>{return decodeURIComponent(item)})
    }
  })
  
  return (
    <div>
      <Home 
        questionDatas={questionDatas}
      />
    </div>
  );
}

export default App;

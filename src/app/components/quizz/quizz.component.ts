import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import  json from '../../../../public/assets/data/questions.json'
@Component({
  selector: 'app-quizz',
  imports: [NgIf, NgFor],
  templateUrl: './quizz.component.html',
  styleUrl: './quizz.component.css'
})
export class QuizzComponent implements OnInit{

  title: string = ''
  questions: any = []
  questionSelected: any
  answers: string[] = []
  answerSelected: string = ''
  detail: string = ''
  questionIndex:number = 0
  questionMaxIndex: number = 0
  images:string[] = []
  finished: boolean = false

  result: string = ''

  progress = 0

  
  constructor() {}

  ngOnInit(): void {

    
    if(json) {
      this.finished = false
      this.title = json.title
      this.questions = this.shuffleArray(json.questions)
      this.questionSelected = this.questions[this.questionIndex]

      this.questionIndex = 0
      this.questionMaxIndex = this.questions.length
    }
    else this.finished = true
  }
  private shuffleArray(arr: any) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  
  playerChoice(alias: string){
    this.answers.push(alias)

    console.log(this.questions)
    this.nextStep()
  }

  async nextStep()
  {

    this.questionIndex += 1
    this.updateProgress()
    if(this.questionMaxIndex > this.questionIndex)
    {
      this.questionSelected = this.questions[this.questionIndex]
    } 
    else 
    {
      const finalAnswer:string = await this.checkResult(this.answers)

      console.log(finalAnswer)
      this.finished = true
      const result = json.results[finalAnswer as keyof typeof json.results]
      this.answerSelected = result.description

      this.result = this.answerSelected
      this.detail = result.details
      this.images = result.images

    }
  }

  async checkResult(answers: string[]) {

    const result = answers.reduce((previous, current, i, arr) => {
      if( 
        arr.filter(item => item === previous).length > 
        arr.filter(item => item === current).length
      )  
      {
        return previous;
      }
      else {
        return current;
      }
    })

    return result;
  }
  restartQuiz() {
    location.reload() 
  }

  updateProgress() {
    const totalQuestions: number = this.questions.length
    this.progress = (this.questionIndex / totalQuestions) * 100;
  
  }

}

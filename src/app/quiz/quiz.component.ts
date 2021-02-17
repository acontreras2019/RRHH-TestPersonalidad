import { Component, OnInit } from '@angular/core';

import { QuizService } from '../services/quiz.service';
import { HelperService } from '../services/helper.service';
import { Option, Question, Quiz, QuizConfig } from '../models/index';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  providers: [QuizService]
})
export class QuizComponent implements OnInit {
  quizes: any[];
  quiz: Quiz = new Quiz(null);
  mode = 'intro';
  quizName: string;
  
  instrucciones="Lea cada pregunta y seleccione una respuesta si no esta seguro, seleccione la respuesta";

  config: QuizConfig = {
    'allowBack': true,
    'allowReview': true,
    'autoMove': false,  // if true, it will move to next question automatically when answered.
    'duration': 300,  // indicates the time (in secs) in which quiz needs to be completed. 0 means unlimited.
    'pageSize': 1,
    'requiredAll': false,  // indicates if you must answer all the questions before submitting.
    'richText': false,
    'shuffleQuestions': false,
    'shuffleOptions': false,
    'showClock': false,
    'showPager': true,
    'theme': 'none'
  };

  pager = {
    index: 0,
    size: 1,
    count: 1
  };
  timer: any = null;
  startTime: Date;
  endTime: Date;
  ellapsedTime = '00:00';
  duration = '';

  Icount= 0;
  Ecount= 0;
  Scount= 0;
  Ncount= 0;
  Tcount= 0;
  Fcount= 0;
  Jcount= 0;
  Pcount= 0;

  subTipo1= "";
  subTipo2= "";
  subTipo3= "";
  subTipo4= "";
  tipoPersonalidad= "";

  diagnosticoPersonalidad="";
  answered = [];

  
  constructor(private quizService: QuizService) { }

  ngOnInit() {
    this.quizes = this.quizService.getAll();
    this.quizName = this.quizes[0].id;
    this.loadQuiz(this.quizName);
  }

  loadQuiz(quizName: string) {
    this.quizService.get(quizName).subscribe(res => {
      this.quiz = new Quiz(res);
      this.pager.count = this.quiz.questions.length;
      this.startTime = new Date();
      this.ellapsedTime = '00:00';
      this.timer = setInterval(() => { this.tick(); }, 1000);
      this.duration = this.parseTime(this.config.duration);
    });
    this.mode = 'intro';
  }

  tick() {
    const now = new Date();
    const diff = (now.getTime() - this.startTime.getTime()) / 1000;
    if (diff >= this.config.duration) {
      this.onSubmit();
    }
    this.ellapsedTime = this.parseTime(diff);
  }

  parseTime(totalSeconds: number) {
    let mins: string | number = Math.floor(totalSeconds / 60);
    let secs: string | number = Math.round(totalSeconds % 60);
    mins = (mins < 10 ? '0' : '') + mins;
    secs = (secs < 10 ? '0' : '') + secs;
    return `${mins}:${secs}`;
  }

  get filteredQuestions() {
    return (this.quiz.questions) ?
      this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }

  onSelect(question: Question, option: Option) {
    if (question.questionTypeId === 1) {
      question.options.forEach((x) => { if (x.id !== option.id) x.selected = false; });
    }

    if (this.config.autoMove) {
      this.goTo(this.pager.index + 1);
    }
  }

  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'quiz';
    }
  }

  isAnswered(question: Question) {
    return question.options.find(x => x.selected) ? 'Answered' : 'Not Answered';
  };

  isCorrect(question: Question) {
    return question.options.every(x => x.selected === x.isAnswer) ? 'correct' : 'wrong';
  };

  onSubmit() {
    console.log(this.quiz.questions)


    let answered = [];
    // _.find(this.quiz.questions, function(q) { return q. < 40; });
    this.quiz.questions.forEach(function (qs) {
   
      
        qs.options.forEach((x) => { 
          if (x.selected === true) {
            qs.letraSeleccionada = x.valueRes; answered.push(qs) 
          }
        });
      
  });
  this.Icount  = answered.filter((obj) => obj.letraSeleccionada === "I").length || 0;
  this.Ecount  = answered.filter((obj) => obj.letraSeleccionada === "E").length || 0;
  this.Scount  = answered.filter((obj) => obj.letraSeleccionada === "S").length || 0;
  this.Ncount  = answered.filter((obj) => obj.letraSeleccionada === "N").length || 0;
  this.Tcount  = answered.filter((obj) => obj.letraSeleccionada === "T").length || 0;
  this.Fcount  = answered.filter((obj) => obj.letraSeleccionada === "F").length || 0;
  this.Jcount  = answered.filter((obj) => obj.letraSeleccionada === "J").length || 0;
  this.Pcount  = answered.filter((obj) => obj.letraSeleccionada === "P").length || 0;

  console.log(answered);
  if(this.Icount>=this.Ecount){
    this.subTipo1="I";
  }else{
    this.subTipo1="E";
  }


  if(this.Scount>=this.Ncount){
    this.subTipo2="S";
  }else{
    this.subTipo2="N";
  }

  if(this.Tcount>=this.Fcount){
    this.subTipo3="T";
  }else{
    this.subTipo3="F";
  }

  if(this.Jcount>=this.Pcount){
    this.subTipo4="J";
  }else{
    this.subTipo4="P";
  }
 this.tipoPersonalidad=this.subTipo1+this.subTipo2+this.subTipo3+this.subTipo4;

    let answers = [];
    this.quiz.questions.forEach(x => answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered }));
    this.diagnosticoPersonalidad = "xxxx";
    // Post your data to the server here. answers contains the questionId and the users' answer.
    console.log(this.quiz.questions);
    this.mode = 'totales';
  }

  llenarExplicacion(_tipoPersonalidad:string){
    if(_tipoPersonalidad=="ISTJ"){
      this.diagnosticoPersonalidad="Diagnostico ISTJ";
    }
    if(_tipoPersonalidad=="ISTP"){
      this.diagnosticoPersonalidad="Diagnostico ISTP";
    }
    if(_tipoPersonalidad=="ESTP"){
      this.diagnosticoPersonalidad="Diagnostico ISTP";
    }
    if(_tipoPersonalidad=="ESTJ"){
      this.diagnosticoPersonalidad="Diagnostico ISTP";
    }


    if(_tipoPersonalidad=="ISFJ"){
      this.diagnosticoPersonalidad="Diagnostico ISTP";
    }
    if(_tipoPersonalidad=="ISFP"){
      this.diagnosticoPersonalidad="Diagnostico ISTP";
    }
    if(_tipoPersonalidad=="ESFP"){
      this.diagnosticoPersonalidad="Diagnostico ISTP";
    }
    if(_tipoPersonalidad=="ESFJ"){
      this.diagnosticoPersonalidad="Diagnostico ISTP";
    }

    if(_tipoPersonalidad=="INFJ"){
      this.diagnosticoPersonalidad="Diagnostico ISTP";
    }
    if(_tipoPersonalidad=="INFP"){
      this.diagnosticoPersonalidad="Diagnostico ISTP";
    }
    if(_tipoPersonalidad=="ENFP"){
      this.diagnosticoPersonalidad="Diagnostico ISTP";
    }
    if(_tipoPersonalidad=="ENFJ"){
      this.diagnosticoPersonalidad="Diagnostico ISTP";
    }

    
    if(_tipoPersonalidad=="INTJ"){
      this.diagnosticoPersonalidad="Diagnostico ISTP";
    }
    if(_tipoPersonalidad=="INTP"){
      this.diagnosticoPersonalidad="Diagnostico ISTP";
    }
    if(_tipoPersonalidad=="ENTP"){
      this.diagnosticoPersonalidad="Diagnostico ISTP";
    }
    if(_tipoPersonalidad=="ENTJ"){
      this.diagnosticoPersonalidad="Diagnostico ISTP";
    }

  }

}

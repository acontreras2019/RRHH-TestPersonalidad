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
  
  instrucciones="Lea cada pregunta y seleccione una respuesta si no esta seguro, seleccione la respuesta que mas se aproxime  a sus caracteristicas. Responda a cada pregunta con la myor sinceridad posible.";

  config: QuizConfig = {
    'allowBack': true,
    'allowReview': true,
    'autoMove': false,  // if true, it will move to next question automatically when answered.
    'duration': 1800,  // indicates the time (in secs) in which quiz needs to be completed. 0 means unlimited.
    'pageSize': 1,
    'requiredAll': true,  // indicates if you must answer all the questions before submitting.
    'richText': false,
    'shuffleQuestions': false,
    'shuffleOptions': false,
    'showClock': false,
    'showPager': true,
    'theme': 'none'
  };

  user = {
    name: "",
    email: "",
    id: ""
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
  Pcount= 0; // indica el contador referente a cada pregunta, la propiedad a evaluar es value

  subTipo1= "";
  subTipo2= "";
  subTipo3= "";
  subTipo4= "";// registran el Subtipo de Personalidad para formar el diagnostico de personalidad
  tipoPersonalidad= "";

  diagnosticoPersonalidad=""; // esta propiedad  guardará el diagnostico para mostrarlo al usuario.
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
    this.llenarExplicacion(this.tipoPersonalidad)
    // Post your data to the server here. answers contains the questionId and the users' answer.
    this.mode = 'totales';
  }

  llenarExplicacion(_tipoPersonalidad:string){
    if(_tipoPersonalidad=="ISTJ"){
      this.diagnosticoPersonalidad="ISTJ (Introversión Sensación Pensamiento Juicio): Los hechos son muy importantes para este tipo de personalidad pues se trata de personas con un alto sentido de la moralidad y del deber por lo que son extremadamente confiables. Lo que sea que hagan tiene que tener sentido para ellos y le ponen toda la energía para llevarlo a cabo, pero si no es relevante para ellos no lo hacen. Les gusta planear e implementar sistemas de reglas para que se funciones de forma lógica y clara.";
    }
    if(_tipoPersonalidad=="ISTP"){
      this.diagnosticoPersonalidad="ISTP (Introversión Sensación Pensamiento Percepción): Este es de los tipos de personalidad de personas tranquilas, con un especial interés en comprender cómo funcionan los sistemas. Son excelentes en analizar situaciones, encontrar el problema y dar soluciones prácticas. Si bien son personas reservadas, a su vez son espontáneos y muy observadores. Tienen una inclinación por las actividades de alto riesgo que les llenen de adrenalina.";
    }
    if(_tipoPersonalidad=="ESTP"){
      this.diagnosticoPersonalidad="ESTP (Extraversión Sensación Pensamiento Percepción): A quienes pertenecen a este tipo de personalidad también se les llama las emprendedoras o las promotoras del grupo. Son personas inteligentes y llenas de energía, espontáneas, alegres y activas. Tienden a ser líderes y ejercer dominio, porque son carismáticas y perceptivas.";
    }
    if(_tipoPersonalidad=="ESTJ"){
      this.diagnosticoPersonalidad="ESTJ (Extraversión Sensación Pensamiento Juicio): Es el tipo de personalidad del ejecutivo o del inspector. Se trata de aquellas personas a las que les gusta tener el control; son excelentes administradoras tanto de cosas como de personas, son prácticas, les gusta organizar y manejar actividades.";
    }


    if(_tipoPersonalidad=="ISFJ"){
      this.diagnosticoPersonalidad="ISFJ (Introversión Sensación Sentimiento Juicio): Podríamos llamarles las defensoras y protectoras del grupo. Son personas atentas, observadoras y cooperadoras que se preocupan por el bienestar de otros y les hace realmente felices ayudar a los necesitados. Su realización es la seguridad de otros. No son muy buenas en posiciones de autoridad, más bien prefieren hacer el trabajo por sí mismas y no se muestran muy ambiciosas, por lo que a la hora de pedir compensaciones por sus sacrificios al trabajar lo toman como algo que debería ser parte del trabajo en sí.";
    }
    if(_tipoPersonalidad=="ISFP"){
      this.diagnosticoPersonalidad="ISFP (Introversión Sensación Sentimiento Percepción): Aventureras y compositoras de sus propias vidas, son personas tranquilas que viven a su propio ritmo y en el momento. Siempre están buscando la novedad y situaciones que estimulen sus sentidos por lo que es un tipo de personalidad muy propio de los artistas. Sus valores son muy importantes para ellos y no les hace falta debatirlos ni compartir su punto de vista. Son alegres, espontáneas, cálidas y preocupadas por sus personas.";
    }
    if(_tipoPersonalidad=="ESFP"){
      this.diagnosticoPersonalidad="ESFP (Extraverted Sensing Feeling Perceiving): Se trata de personas alegres y espontáneas que disfrutan entreteniéndose y entreteniendo a los demás. La diversión es uno de los pilares más importantes de sus vidas, y son de trato cercano y temperamento cálido. Aman la novedad y hablar acerca de experiencias personales.";
    }
    if(_tipoPersonalidad=="ESFJ"){
      this.diagnosticoPersonalidad="ESFP (Extraversión Sensación Sentimiento Percepción): Es de los tipos de personalidad que tienen los animadores y actores de grupo, son personas que les gusta entretenerse y entretener a los demás. Son divertidas, alegres, espontáneas y muy enérgicas. No son nada convencionales y buscan maneras creativas de satisfacer sus necesidades. Son excelentes jugadores de equipo.";
    }

    if(_tipoPersonalidad=="INFJ"){
      this.diagnosticoPersonalidad=" INFJ (Introversión Intuición Sentimiento Juicio): Son aquellas personas que consideramos consejeras. Son gentiles, amables, sensibles, reservadas y cooperadores. Son muy intuitivos y empaticos y escuchan activamente por lo que logran comunicarse bien con los demás de forma personalizada. Leen muy bien las emociones de los otros y son propensas tanto a la reflexión como a la acción.";
    }
    if(_tipoPersonalidad=="INFP"){
      this.diagnosticoPersonalidad="INFP (Introversión Intuición Sentimiento Percepción): Este es de los tipos de personalidad que tienen las personas que vemos como mediadoras y que se preocupan por ayudar a buenas causas, aunque con un sentido menos moralista que los INFJ. Son personas creativas con una sensibilidad estética y artística muy notable, además son personas altruistas y muy amables.";
    }
    if(_tipoPersonalidad=="ENFP"){
      this.diagnosticoPersonalidad="ENFP (Extrovertido Intuición Sentimiento Percepción): Es de los tipos de personalidad más inclinados a la sociabilidad, las artes y el pensamiento creativo. Se trata de personas alegres y positivas que siempre andan riendo, con un espíritu libre, muy sociables y creativos. Son muy buenos para motivar a otras personas, invitarlas a participar en sus convicciones. Son activistas, y se involucran en tareas colectivas en las que puedan ayudarle a los demás buscando tener un impacto social.";
    }
    if(_tipoPersonalidad=="ENFJ"){
      this.diagnosticoPersonalidad="ENFJ (Extrovertido Intuición Sentimiento Juicio): Son aquellos protagonistas, como los profesores que son líderes carismáticos y que logran ser realmente escuchados por su público. Son personas que esperan lo mejor de quienes los rodean y los motiva a lograrlo. Son buenos comunicadores, expresivos y cooperadores. Son bastante creativos y logran improvisar muy bien cuando no han podido organizar o planear algo como les gusta. Son buenos influyendo en la conducta de los demás.";
    }

    
    if(_tipoPersonalidad=="INTJ"){
      this.diagnosticoPersonalidad="INTJ (Introversión Intuición Pensamiento Juicio):Hablamos de las mentes maestras o de los arquitectos del pensamiento, pues son pensadores imaginativos y muy estratégicos, muy buenas para razonar y solucionar problemas a partir del análisis. Son personas que ven el mundo a través de sus propias ideas y son estas mismas el centro de su pensamiento. Confían mucho en su propio criterio y les encanta el conocimiento, por lo que es bastante posible que sean expertas en algún área.";
    }
    if(_tipoPersonalidad=="INTP"){
      this.diagnosticoPersonalidad="INTP (Introversión Intuición Pensamiento Percepción): Este es un tipo de personalidad mucho más reflexiva, aunque como en la anterior también tienen una sed insaciable por el conocimiento. Son personas que explican todo lo que sucede a partir de teorías, cosa que valoran mucho más que la resolución de problemas concretos. Pueden ser perfeccionistas y es posible que anden corrigiendo a los demás todo el tiempo.";
    }
    if(_tipoPersonalidad=="ENTP"){
      this.diagnosticoPersonalidad="ENTP (Extrovertido Intuición Pensamiento Percepción): Los innovadores o inventores son personas extremadamente curiosas y con una agilidad mental fascinante. Son personas que les encanta responder a cuestionamientos que los estimulen intelectualmente, les gustan los retos de este tipo y pueden llegar a ser competitivas. Si se necesitan soluciones innovadoras, estas son las personas idóneas para conseguirlas.";
    }
    if(_tipoPersonalidad=="ENTJ"){
      this.diagnosticoPersonalidad="ENTJ (Extroversión Intuición Pensamiento Juicio): Las comandantes, líderes del grupo, son personas con una voluntad muy fuerte, son audaces e imaginativos y siempre están armando un camino y adaptándolo al cambio mientras el entorno varía. Es de los tipos de personalidad que mejor se desempeñan en liderazgo y asertividad. Tienen un pensamiento muy ágil y estratégico y son buenos comunicadores de sus ideas.";
    }

  }

}

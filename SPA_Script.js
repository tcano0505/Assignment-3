/* This was made to test the js file while i was working on the fake api server issues 
const questions= [
    {
      id: 1,
      questionType: "true_false",
      questionText: "Python got its name from the series Monty Python's Flying Circus?",
      correctAnswer: "true",
      options: ["true", "false"],
      explination: "Python creator, Guido van Rossum, wanted a short, unique, and slightly mysterious name. Van Rossum decided on Python since he was also reading scripts from Monty Python's Flying Circus"
    },
    {
      id: 2,
      questionType: "text_input",
      questionText: "What HTML tag is used for an Ordered List?",
      correctAnswer: "<ol>",
      answerFieldId : "answer_to_question",
      explination: "<ol> stands for Ordered List"
    },
    {
       id: 3,
      questionType: "text_input",
      questionText: "What HTML tag is used to collect data from users?",
      correctAnswer: "<form>",
      answerFieldId : "answer_to_question",
      explination: "<form> is the HTML tag that allows you to collect data from users"
    },
    {
      id: 4,
      questionType: "multiple_choice",
      questionText: "Which of the following is the brain of the computer?",
      correctAnswer: "Central Procesing Unit (CPU)",
      options: ["Circuit Board", "Central Procesing Unit (CPU)", "Network Card", "Hard Disk"],
      explination: "The Central Processing Unit (CPU) is known as the brain of the computer because most of the processing is performed by the CPU."
    }

]
*/

let correctAnswer = 0;
let questionsGiven = 0;
const totalQuestions = 17;
const questionsAPI= "https://my-json-server.typicode.com/tcano0505/Assignment-3/db"
let quiz1 = null;
let quiz2= null;
let initialTime = null;

let getQuestions = async () => {
  let response = await fetch(questionsAPI);
  let data = await response.json();
  console.log("data", data);

  console.log("Quiz#1 Questions", data.quiz1);
  console.log("Quiz#2 Questions", data.quiz2);
  quiz1= data.quiz1;
  quiz2 = data.quiz2;
  return data;
};

let getElapsedTime = (initialTime) => {
  let finalTime = new Date();
  let totalTime= finalTime - initialTime; //in ms
  // strip the ms
  totalTime /= 1000;

  // get seconds
  let sec = Math.round(totalTime);
  return sec;
};

getQuestions();

const appState = {
    current_view : "#intro_view",
    current_question : -1,
    current_model : {}
}
/*
async function fetch_questions(questions){ //Fetch command with Await to get api data
    try{
        let api_endpoint_url = "https://my-json-server.typicode.com/tcano0505/Assignment-3/questions' //https://my-json-server.typicode.com/tcano0505/Assignment-3/questions/{$question_num}"

        const response = await fetch(url)

        const result = await response.json()
       
        console.log(result);

    } catch(err){
        console.error(err);
    }
}
*/

//
// start_app: begin the applications.
//

document.addEventListener('DOMContentLoaded', () => {

  // Set the state
  appState.current_view =  "#intro_view";
  appState.current_model = {
    action : "start_app"
  }
  update_view(appState);

  //
  // EventDelegation - handle all events of the widget
  //

  document.querySelector("#widget_view").onclick = (e) => {
      handle_widget_event(e)
  }
});



function handle_widget_event(e) {

  if (appState.current_view == "#intro_view"){
    if (e.target.dataset.action == "start_app") {

        // Update State (current model + state variables)
        appState.current_question = 0;
        appState.current_model = questions[appState.current_question];
        // process the appState, based on question type update appState.current_view
        setQuestionView(appState);
       
        // Now that the state is updated, update the view.

        update_view(appState);
    } else if (e.target.dataset.action == "quiz_num_1"){
      initialTime = new Date(); 
      appState.current_question = 0;
      appState.current_view = "#question_view_multiple_choice";
      appState.current_model = quiz1[appState.current_question];
     
      update_view(appState);
    } else if (e.target.dataset.action == "quiz_num_2") {
      startTime = new Date();
      appState.current_question = 0;
      appState.current_view = "#question_view_true_false";
      appState.current_model = quiz2[appState.current_question];
    
      update_view(appState);
    }
  }


  // Handle the answer event.
  if (appState.current_view == "#question_view_true_false") {

    if (e.target.dataset.action == "answer") {
       // Controller - implement logic.
       isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
       if (isCorrect){
         correctAnswer++;
         alert("Correct!");
       }
       else{
         alert(`Incorrect Answer, The correct answer is ${appState.current_model.correctAnswer}. ${appState.current_model.explination}`);
       }
       // Update the state.
       updateQuestion(appState);
       setQuestionView(appState);
     
       // Update the view.  
       update_view(appState);

     }
   }
      else if (appState.current_view == "#question_view_multiple_choice") {

        if (e.target.dataset.action == "answer") {
           // Controller - implement logic.
           isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
          if(isCorrect){
            correctAnswer++;
            alert("Correct!");
          }
        else{
           alert(`Incorrect Answer, The correct answer is ${appState.current_model.correctAnswer}. ${appState.current_model.explination}`);
         }
           // Update the state.
           updateQuestion(appState);
           setQuestionView(appState);
         
           // Update the view.  
           update_view(appState);
    
         }
       }



    // Handle answer event for  text questions.
    if (appState.current_view == "#end_view") {
        if (e.target.dataset.action == "start_again") {
          appState.current_view =  "#intro_view";
          appState.current_model = {
            action : "start_app"
          }
          update_view(appState);

        }
      }

 } // end of hadnle_widget_event


function check_user_response(user_answer, model) {
  if (user_answer == model.correctAnswer) {
    return true;
  }
  return false;
}

let showResults = () => {
  if (correctAnswer == 0){
    alert("0% correct");
  } else if (correctAnswer >= 1){
    alert(`${correctAnswer}/${17} correct in ${getElapsedTime(initialTime)} seconds`);
  }
};



function updateQuestion(appState) {
    if (appState.current_view == "#question_view_true_false"){
      if (appState.current_question < quiz2.length - 1){
        appState.current_question++;
        appState.current_model = quiz2[appState.current_question];
        update_view(appState);
        console.log("Current Question", appState.current_question);
      } 
      else{
        showResults();
        appState.current_question = -2; 
        setQuestionView(appState);
      }
    }

    else if (appState.current_view == "#question_view_multiple_choice"){
      if (appState.current_question < quiz1.length -1){
        appState.current_question++;
        console.log("Current Question", appState.current_question);
        appState.current_model = quiz1[appState.current_question];
      }
      else{
        showResults();
        appState.current_question = -2;
        setQuestionView(appState);
        appState.current_model = {};
      }
    }
}

function setQuestionView(appState) {
  if (appState.current_question == -2) {
    appState.current_view  = "#end_view";
    return;
  }
}

function update_view(appState) {

  const html_element = render_widget(appState.current_model, appState.current_view);
  document.querySelector("#widget_view").innerHTML = html_element;
}
//

const render_widget = (model,view) => {
  // Get the template HTML
  template_source = document.querySelector(view).innerHTML
  // Handlebars compiles the above source into a template
  var template = Handlebars.compile(template_source);

  // apply the model to the template.
  var html_widget_element = template({...model,...appState})

  return html_widget_element;
}
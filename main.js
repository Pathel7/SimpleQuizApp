//select elements
let countSpan = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area");
let submitButton = document.querySelector(".submit-button");
let beginButton = document.querySelector(".begin-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let coundownElement = document.querySelector('.countdown');
let par = document.querySelector(".quiz-app-top");


//set options
let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;


function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function (){
        if (this.readyState === 4 && this.status === 200){
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;

            submitButton.style.visibility = "visible";
            beginButton.remove();
            par.remove();


            //create bullets + Set questions count
            createBullets(questionsCount);

            // Add question data
            addQuestionData(questionsObject[currentIndex], questionsCount);

            //start countdown
            countDown(10, questionsCount);

            //click on submit-button
            submitButton.onclick = () =>{

                //get right answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;

                //increase index
                currentIndex++;

                //check the answer
                checkAnswer(theRightAnswer, questionsCount);

                //remove previous question
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";
                
                //add question data
                addQuestionData(questionsObject[currentIndex], questionsCount);

                //handle bullets classes
                handleBullets();

                //start countdown
                clearInterval(countdownInterval);
                countDown(10, questionsCount);

                //show results
                showResults(questionsCount);
            };
        }
    };
    myRequest.open("GET", "html_question.json", true)
    myRequest.send();
}

//en appelant cette fonction; cela nous renvoi la valeur de countSpan
// createBullets ne renvoi que la valeur de countSpan




function createBullets(num){
    countSpan.innerHTML = num;
    
    //create spans
    for (let i=0; i<num; i++){

        //create span
        let theBullet = document.createElement("span");

        // check if its first span
        if (i === 0){
            theBullet.className = "on";
        }

        //append bullets to main bullet container
        bulletsSpanContainer.appendChild(theBullet);
    }
}





function addQuestionData(obj, count){
   if (currentIndex < count){
         //create H2 question title
        let questionContentTitle = document.createElement("h2");

        //create H2 question text
        let questionTitleText = document.createTextNode(obj['title']);

        //append text to H2 
        questionContentTitle.appendChild(questionTitleText);

        //append the H2 to the quiz Area
        quizArea.appendChild(questionContentTitle);

        //create the answers
        for (let i=1; i<=4; i++){
            
            //create main answer div
            let mainAnsDiv = document.createElement("div");

            //add class to main div
            mainAnsDiv.className = 'answer';

            //create radio input
            let radioInput = document.createElement("input");

            //add type + name + id + data-attribute to radio input
            radioInput.name = 'question';
            radioInput.type = 'radio';
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];
            

            //make option selected
            if (i === 1){
                radioInput.checked = true;
            }

            //create label
            let theLabel = document.createElement("label");

            //add for attribute
            theLabel.htmlFor = `answer_${i}`;

            //create label text 
            let theLabelText = document.createTextNode(obj[`answer_${i}`]);

            //add the text to label
            theLabel.appendChild(theLabelText);

            //add input + label to main div
            mainAnsDiv.appendChild(radioInput);
            mainAnsDiv.appendChild(theLabel);

            //append all divs to answer area
            answerArea.appendChild(mainAnsDiv);
        }
   }
}





function checkAnswer(rAnswer, count){
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i=0; i<answers.length; i++){
        if (answers[i].checked) 
            {theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rAnswer === theChoosenAnswer){
        rightAnswer++;
    }
}




function handleBullets(){

    let bulletSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletSpans);

    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index){span.className = "on";}
    })
}





function showResults(count){
    let theResults;
    if (currentIndex === count){
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        beginButton.remove();
        bullets.remove();

        if (rightAnswer > (count / 2)){
            theResults = `<span class="good">Vous avez notre respect<span>: ${ rightAnswer} sur ${count}`;
        }else if (rightAnswer === count){
            theResults = `<span class="perfect">Parfait<span>, Votre score restera gravé sur les murailles du pays des merveilles`;
        }else {
            theResults = `<span class="bad">Tristesse au pays de merveilles<span>: ${ rightAnswer} sur ${count}`;
        }

        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = '10px';
        resultsContainer.style.backgroundColor = 'white';
        resultsContainer.style.marginTop = '10px';
    }
}




function countDown(duration, count){
    if (currentIndex < count){
        let minutes, seconds;
        countdownInterval = setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            coundownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0){
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000)
    }
}


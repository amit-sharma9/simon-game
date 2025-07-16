let body = document.querySelector("body");
let h2 = document.querySelector("h2");
let start = false;
let level = 0;
let buttons = document.querySelectorAll('.basic');
let userseq = [];
let gameseq = [];
let highscore=0;
let para = document.querySelector("#para");
let audio  = new Audio("wrong-38598.mp3");

body.addEventListener("keypress", function () {
    if (start == false) {
        start = true;
        levelup();
        for (btn of buttons) {
            btn.addEventListener("click", pressed);
        }
    }
});

function levelup() {
    userseq = [];
    level++;
    h2.innerText = `level ${level}`;
    let random = Math.floor(Math.random() * 4);
    let randcolor=buttons[random];
    let randcolorid=buttons[random].id;
    gameseq.push(randcolorid);
    btnflash(randcolor);
}

function chechkAns(idx){
    if (userseq[idx]=== gameseq[idx]) {
       if (userseq.length == gameseq.length) {
        setTimeout(levelup,1000);
       }
    }
    else{
        if (highscore<level) {
            highscore=level;
            // localStorage.setItem("Highscore",highscore);
        }
      audio.play();
        para.innerText = `High score till now is ${highscore}`; 
        h2.innerHTML = `Game over !<br> your score is ${level}. Press any key to start again`;
        document.querySelector("body").style.backgroundColor="red";
        setTimeout(() => {
            document.querySelector("body").style.backgroundColor="white"; 
             
        }, 150);
        reset();
    }
}
function btnflash(btn) {
    btn.classList.add("flash");
    setTimeout(function () {
        btn.classList.remove("flash")
    }, 200);

}
function userflash(btn) {
    btn.classList.add("userflash");
    setTimeout(function () {
        btn.classList.remove("userflash")
    }, 200);
}

function pressed() { 
    let btn = this;
    userflash(btn);
   let colorvalue = btn.getAttribute("id");
   userseq.push(colorvalue);
    let idx = userseq.length-1;
    chechkAns(idx);
}

function reset(){
    start = false;
    level=0;
    gameseq = [];
    userseq = [];
}

// let nhighscore = localStorage.getItem("highscore")

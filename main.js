// 21130035_Nguyễn_Ngọc_Khánh_Duy_0839151003

// canvas
var recSize = 25
var rows = 20
var cols = 20
var board ;
var context;
var gameOver = false

// Toạ độ food
let foodX = 0;
let foodY = 0;
let goldFoodX = 0;
let goldFoodY = 0;
// Toạ độ rắn
let snakeX = recSize*10;
let snakeY = recSize*10;
let moveX = 0;
let moveY = 0;
let snakeBody = []

let score = document.getElementById("myScore")
let levels = document.querySelectorAll(".level__item")
let countToUpLv = 0;
let level = 6;
let wall = []
let isStopRanFood;
let mn = 0
let countTime = 5;
let intervalRanTime = 0;
let intervalCountTime = 0;
let isGold;
let start5 ;
let gateIn=[[16, 11]];
let gateOut=[[16, 3]];

timeBlock = document.querySelector(".time")
timeShow = document.querySelector("#time")
timeShow.textContent = countTime

let foodImg = new Image()
foodImg.src = "./assets/apple.png"

let goldFoodImg = new Image()
goldFoodImg.src = "./assets/golden-apple.png"

window.onload = function () {
    board = document.getElementById("board");
    board.height = rows * recSize
    board.width = cols * recSize
    context = board.getContext("2d");
}

modalLose = document.querySelector(".modal-close")
modalLoseScore = document.querySelector(".modal-close #score")
modalLoseRestart = document.querySelector(".modal-close #restart")

function showModalLose() {
    modalLose.style.display = "flex"
    modalLoseScore.textContent = countToUpLv
    console.log(countToUpLv)
}

modalLoseRestart.addEventListener("click", function () {
    modalLose.style.display = "none"
    restartGame()
})

modalPlay = document.querySelector(".modal-play")
modalPlayContainerWrapper = document.querySelector(".modal-play .modal-container .wrapper")
modalPlayStart = document.querySelector(".modal-play #start")
modalPlayNext = document.querySelector(".modal-play #next")
modalPlayPrevious = document.querySelector(".modal-play #previous")

modalPlayNext.style.display = "none"
modalPlayPrevious.style.display = "none"

modalPlayStart.addEventListener("click", function () {
    modalPlay.style.display = "none"
    changeDirection
})

let listVideo = ['play1', 'play2', 'play3', 'play1', 'play2', 'play1']
let listDesc = []
listDesc.push('<li>Level này rắn có khả năng xuyên tường</li>')
listDesc.push('<li>Level này rắn không có khả năng xuyên tường</li>')
listDesc.push('<li>Level này xuất hiện các vách tường (ô màu đỏ) khi rắn đụng sẽ thua</li>' +
              '<li>Level này rắn không có khả năng xuyên tường</li>')

let htmlList = `<li>Ô xanh lá là đầu rắn, xanh dương là thân rắn</li>
                        <li> <img src="./assets/apple.png"> Táo, ăn táo để tăng điểm và kích thước, điểm ở mức độ nhất định sẽ tăng level</li>
                        <li>Dùng các nút điều hướng (lên, xuống, trái, phải) để điều khiển <br>
                            <img class="abc" id="left" src="./assets/left.png" alt=""> 
                            <img class="" id="right" src="./assets/right.png" alt=""> 
                            <img class="" id="up" src="./assets/up.png" alt=""> 
                            <img class="" id="down" src="./assets/down.png" alt=""> 
                        </li>
                        <li> Thua khi rắn tự cắn mình</li>`

let htmlListLevel;
let modalDescList;


function showModalHowToPlay(isSetting) {
    if (isSetting){
        modalPlayNext.style.display = "block"
        modalPlayPrevious.style.display = "block"
    }else {
        modalPlayNext.style.display = "none"
        modalPlayPrevious.style.display = "none"
    }

    htmlListLevel = listDesc[level-1]
    modalPlayContainerWrapper.innerHTML = `
                <img class="video" src="./assets/${listVideo[level-1]}.gif"/>
                <div class="desc">
                    <h3 id="level">Level ${level}</h3>
                    <ul class="desc--list">
                        
                    </ul>
                </div>`
    modalDescList = document.querySelector(".modal-play .desc--list")
    modalDescList.innerHTML = htmlList + htmlListLevel
    modalPlay.style.display = "none"
}
showModalHowToPlay()


var index = 0;
function changeHowToPlay() {
    modalPlayLevel = document.querySelector("#level")
    modalPlayVideo = document.querySelector(".modal-play .video")
    modalDescList = document.querySelector(".modal-play .desc--list")
    if (event.target.id == "next"){
        if (index == listVideo.length-1){
            index = 0
        }else {
            index++;
        }


    }else if(event.target.id == "previous"){
        if (index == 0){
            index = listVideo.length-1
        }else {
            index--;
        }
    }

    modalPlayVideo.src = `./assets/${listVideo[index]}.gif`
    htmlListLevel = listDesc[index]
    modalDescList.innerHTML = htmlList + htmlListLevel;
    modalPlayLevel.textContent = `Level ${index+1}`
}

modalPlayNext.addEventListener("click", changeHowToPlay)
modalPlayPrevious.addEventListener("click", changeHowToPlay)

question = document.querySelector(".question")
modalQuestion = document.querySelector(".modal-question")
modalQuestionHowToPlay = document.querySelector(".modal-question #how-to-play")
modalQuestionInfo = document.querySelector(".modal-question #info")
modalQuestionResume = document.querySelector(".modal-question #resume")
question.addEventListener("click", function (){
    modalQuestion.style.display = "flex"
    clearInterval(te)
})

modalQuestionHowToPlay.addEventListener("click", function () {
    showModalHowToPlay(true)
})

modalQuestionResume.addEventListener("click", function () {
    modalQuestion.style.display = "none"
    run()
})

// Hàm tạo food ngẫu nhiên
function randomFood() {

    foodX = Math.floor(Math.random() * cols) * recSize
    foodY = Math.floor(Math.random() * rows) * recSize
    for (let i = 0; i < snakeBody.length; i++) {
        if (foodX == snakeBody[i][0] && foodY == snakeBody[i][1]){
            randomFood()
        }
    }
    if (wall.length > 0){
        for (let i = 0; i < wall.length; i++) {
            if (foodX == (wall[i][0]*recSize) && foodY == (wall[i][1]*recSize)){
                randomFood()
            }
        }
    }
    console.log([foodX, foodY])
}

function randomGoldFood() {
    goldFoodX = Math.floor(Math.random() * cols) * recSize
    goldFoodY = Math.floor(Math.random() * rows) * recSize
    for (let i = 0; i < snakeBody.length; i++) {
        if ((goldFoodX == snakeBody[i][0] && goldFoodY == snakeBody[i][1]) || (goldFoodX == foodX && goldFoodY == foodY)){
            randomGoldFood()
        }
    }
    if (wall.length > 0){
        for (let i = 0; i < wall.length; i++) {
            if (goldFoodX == (wall[i][0]*recSize) && goldFoodY == (wall[i][1]*recSize)){
                randomGoldFood()
            }
        }
    }
    start5 = true
    // isGold = false
    countTime = 5
    clearInterval(intervalCountTime)
}

// Hàm di chuyển theo hướng mũi tên
function changeDirection(e) {
    // trái, lên, phải, xuống === 37, 38, 39, 40
    if (modalPlay.style.display == "none"){
        if (e.keyCode == 37 && moveX != 1) {
            moveX = -1
            moveY = 0
        }else if (e.keyCode == 38 && moveY != 1){
            moveX = 0
            moveY = -1
        }else if(e.keyCode == 39 && moveX != -1){
            moveX = 1
            moveY = 0
        }else if (e.keyCode == 40 && moveY != -1){
            moveX = 0
            moveY = 1
        }
    }else {
        left = document.querySelector("#left")
        right = document.querySelector("#right")
        up = document.querySelector("#up")
        down = document.querySelector("#down")

        if (e.keyCode == 37) {
            left.style.opacity = '0.5'
        }else if (e.keyCode == 38){
            up.style.opacity = '0.5'
        }else if(e.keyCode == 39){
            right.style.opacity='0.5'
        }else if (e.keyCode == 40){
            down.style.opacity='0.5'
        }
    }
}
function changeOpacity(e) {
    // trái, lên, phải, xuống === 37, 38, 39, 40
   if (modalPlay.style.display == "flex") {
        left = document.querySelector("#left")
        right = document.querySelector("#right")
        up = document.querySelector("#up")
        down = document.querySelector("#down")

        if (e.keyCode == 37) {
            left.style.opacity='1'
        }else if (e.keyCode == 38){
            up.style.opacity='1'
        }else if(e.keyCode == 39){
            right.style.opacity='1'
        }else if (e.keyCode == 40){
            down.style.opacity='1'
        }
    }
}

document.addEventListener("keyup", changeOpacity)


function mainProcess() {
    if (gameOver){
        return
    }

    context.fillStyle="black"
    context.fillRect(0, 0, board.width, board.height)


    context.drawImage(foodImg, foodX, foodY, recSize, recSize)
    if (!isGold && level == 5 && start5 == true){
        context.drawImage(goldFoodImg, goldFoodX, goldFoodY, recSize, recSize)
    }


    eatFood()
    if (level == 5){
        eatGoldFood()
    }

    if (wall.length > 0){
        for (let i = 0; i < wall.length; i++) {
            if (isGold){
                context.fillStyle = '#ccc'
            }else {
                context.fillStyle="red"
            }
            context.fillRect(wall[i][0]*recSize, wall[i][1]*recSize, recSize, recSize)
        }
    }

    if (level == 6){
        context.fillStyle='yellow'
        context.fillRect(gateIn[0][0]*recSize, gateIn[0][1]*recSize, recSize, recSize)
        context.fillRect(gateOut[0][0]*recSize, gateOut[0][1]*recSize, recSize, recSize)

        if (snakeX == gateIn[0][0]*recSize && snakeY == gateIn[0][1]*recSize){
            snakeX = gateOut[0][0]*recSize
            snakeY = gateOut[0][1]*recSize
        }
    }

    for (let i = snakeBody.length - 1; i > 0 ; i--) {
        snakeBody[i] = snakeBody[i-1]
    }


    snakeX += (moveX * recSize)
    snakeY += (moveY * recSize)



    changeLevel()

    snakeBody[0] = [snakeX, snakeY]

    context.fillStyle="green"
    for (let i = 0; i < snakeBody.length; i++) {
        if (i == 0) {
            context.fillStyle='#03F100'
        }else{
            context.fillStyle='#007BF1'
        }
        context.fillRect(snakeBody[i][0], snakeBody[i][1], recSize, recSize)
    }

    checkBite()

}


function setUpLv() {
    if (level == 2){
        drawLv2()
    }else if(level == 3){
        drawLv2()
        mn = setInterval(randomFood, 1000)
    }else if (level == 4){
        drawLv4()
    }else if(level == 5){
        drawLv5()
        ranGFTime()
    }else if (level == 6){
        drawLv6()
    }

    if (level != 3){
        clearInterval(mn)
    }
    if (level != 2 && level != 3){
        document.getElementById("outBoard").style.border="none"
    }
    if (level != 5){
        clearInterval(intervalRanTime)
        clearInterval(intervalCountTime)
    }
}
setUpLv()
randomFood()
function ranGFTime() {
    intervalRanTime = setInterval(randomGoldFood, 5000)
}

function eatFood() {
    if (snakeX === foodX && snakeY === foodY) {
        randomFood()
        snakeBody.push([foodX, foodY])
        countToUpLv++
        score.textContent = (snakeBody.length - 1)
    }
}


function eatGoldFood() {
    if (snakeX === goldFoodX && snakeY === goldFoodY) {
        snakeBody.push([goldFoodX, goldFoodY])
        countToUpLv++
        score.textContent = (snakeBody.length - 1)
        isGold = true
        timeBlock.style.display = "block"
        clearInterval(intervalRanTime)
        randomGoldFood()
        // countTime = 5
        checkInCountTime()
    }
}
function time() {
    if (countTime < 0){
        clearInterval(intervalCountTime)
        ranGFTime()
        isGold = false
        countTime = 5
        timeBlock.style.display = 'none'
    }
    countTime--
    timeShow.textContent = (countTime+1)
    console.log(countTime)
}

function checkInCountTime() {
    intervalCountTime = setInterval(time, 1000)
}

function checkBite() {
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
            gameOver = true
            showModalLose()
        }
    }
}

function level1() {
    snakeX = snakeX >= 0 ? (snakeX % (cols * recSize)) : (cols * recSize)
    snakeY = snakeY >= 0 ? (snakeY % (rows * recSize)) : (rows * recSize)
}

function restartGame() {
    snakeX = recSize*10;
    snakeY = recSize*10;
    moveX = 0;
    moveY = 0;
    snakeBody = []
    gameOver = false
    score.textContent = 0
    countToUpLv = 0
    wall = []
    countTime = 5
    showModalHowToPlay()
}


function level2() {
    if (snakeX < 0 || snakeX > (rows * recSize) || snakeY < 0 || snakeY > (cols * recSize)) {
        gameOver = true;
        showModalLose()
    }
}

function level3() {
    level2()
}

function level4() {
    for (let i = 0; i < wall.length; i++) {
        if (snakeX == wall[i][0]*recSize && snakeY == wall[i][1]*recSize){
            gameOver = true
            showModalLose()
        }
    }
}

function drawLv2() {
    document.getElementById("outBoard").style.border="1px solid red"
}


function drawLv4() {
    for (let i = 0; i < cols; i++) {
        if (i < (cols - 5) && i != 4 && i != 5 && i!= 3){
            wall.push([i, 3])
        }
    }

    wall.push([10, 17], [11, 17], [12, 17], [13, 17], [14, 17], [15, 17], [16, 17])
    wall.push([4, 8], [4, 9], [4, 10], [4, 11], [4, 12], [4, 13], [4, 14])
}

function drawLv5() {
    for (let i = 0; i < cols; i++) {
        if (i < (cols - 5)){
            wall.push([i, 3])
        }
    }

    wall.push([10, 17], [11, 17], [12, 17], [13, 17], [14, 17], [15, 17], [16, 17])
    wall.push([4, 8], [4, 9], [4, 10], [4, 11], [4, 12], [4, 13], [4, 14])
    wall.push([5, 8], [5, 9], [5, 10], [5, 11], [5, 12], [5, 13], [5, 14])
    wall.push([19, 9], [19, 8], [19, 10], [19, 11], [18, 11], [18, 10], [18, 9], [18, 8])

}


function level5() {
    if (!isGold){
        for (let i = 0; i < wall.length; i++) {
            if (snakeX == wall[i][0]*recSize && snakeY == wall[i][1]*recSize){
                gameOver = true
                showModalLose()
            }
        }
    }
}

function drawLv6() {
    for (let i = 0; i < cols; i++) {
        wall.push([i, 6])
        wall.push([i, 14])
    }

}


function level6() {

}

function changeLevel() {
    if (level == 1){
        level1()
    }else if (level == 2) {
        level2()
    }else if (level == 3){
        level3()
    }else if (level == 4){
        level4()
    }else if (level == 5){
        level5()
    }else if (level == 6){
        level6()
    }
    upgradeLevel()
}

function upgradeLevel() {
    if (countToUpLv == 5){
        level++
        countToUpLv = 0
        restartGame()
    }
    if (level == 2){
        drawLv2()
    }else if (level == 4){
        drawLv4()
    }else if (level == 5){
        drawLv5()
    }

    setLevelBg()
}





function selectLevel() {
    for (let i = 0; i < levels.length; i++) {
        levels[i].addEventListener("click", function () {
            level = (i+1)
            countToUpLv = 0
            restartGame()
            setLevelBg()
            setUpLv()
        })

    }
}

selectLevel()
function setLevelBg() {
    for (let i = 0; i < levels.length; i++) {
        if (i == level-1){
            levels[i].style.backgroundColor='#3069a4'
            levels[i].style.color='white'
        }else {
            levels[i].style.backgroundColor='black'
            levels[i].style.color='white'
        }
    }
}
document.addEventListener("keydown", changeDirection)

function run() {
     te = setInterval(mainProcess, 1000/10)
}

run()

modalInfo = document.querySelector(".modal-info")
modalInfoClose = document.querySelector(".modal-info #close")
modalQuestionInfo.addEventListener("click", function () {
    modalInfo.style.display = "flex"
})


modalInfoClose.addEventListener("click", function () {
    modalInfo.style.display = "none"
})
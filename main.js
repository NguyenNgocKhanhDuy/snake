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
// Toạ độ rắn
let snakeX = recSize*10;
let snakeY = recSize*10;
let moveX = 0;
let moveY = 0;
let snakeBody = []

let score = document.getElementById("myScore")
let levels = document.querySelectorAll(".level__item")
let countToUpLv = 0;
let level = 1;
let wall = []


let foodImg = new Image()
foodImg.src = "./assets/apple.png"

window.onload = function () {
    board = document.getElementById("board");
    board.height = rows * recSize
    board.width = cols * recSize
    context = board.getContext("2d");
}


// Hàm tạo food ngẫu nhiên
function randomFood() {
    foodX = Math.floor(Math.random() * cols) * recSize
    foodY = Math.floor(Math.random() * rows) * recSize
    for (let i = 0; i < snakeBody.length; i++) {
        if (foodX == snakeBody[i][0] && foodY == snakeBody[i][1]){
            randomFood()
        }
    }
    if (level == 3){
        for (let i = 0; i < wall.length; i++) {
            if (foodX == (wall[i][0]*recSize) && foodY == (wall[i][1]*recSize)){
                randomFood()
            }
        }
    }
}

// Hàm di chuyển theo hướng mũi tên
function changeDirection(e) {
    // trái, lên, phải, xuống === 37, 38, 39, 40

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

}



function mainProcess() {
    if (gameOver){
        return
    }

    context.fillStyle="black"
    context.fillRect(0, 0, board.width, board.height)

    if (level == 2){
        document.getElementById("outBoard").style.border="1px solid red"
    }else {
        document.getElementById("outBoard").style.border="none"
    }

    if (level == 3){
        for (let i = 0; i < wall.length; i++) {
            context.fillStyle="red"
            context.fillRect(wall[i][0]*recSize, wall[i][1]*recSize, recSize, recSize)
        }
    }


    context.drawImage(foodImg, foodX, foodY, recSize, recSize)


    eatFood()

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
            // context.drawImage(headImg, snakeBody[i][0], snakeBody[i][1], recSize, recSize)
            context.fillStyle='#03F100'
        }else{
            context.fillStyle='#007BF1'
            // context.drawImage(bodyImg, snakeBody[i][0], snakeBody[i][1], recSize, recSize)
        }
        context.fillRect(snakeBody[i][0], snakeBody[i][1], recSize, recSize)
    }

    checkBite()

}


if (level == 3){
    drawLv3()
    console.log('ok')
}
randomFood()

function eatFood() {
    if (snakeX === foodX && snakeY === foodY) {
        randomFood()
        snakeBody.push([foodX, foodY])
        countToUpLv++
        score.textContent = (snakeBody.length - 1)
    }
}

function checkBite() {
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
            gameOver = true
            alert("thua")
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
}


function level2() {
    if (snakeX < 0 || snakeX > (rows * recSize) || snakeY < 0 || snakeY > (cols * recSize)) {
        gameOver = true;
        alert("thua")
    }
}

function level3() {
    level2()
    for (let i = 0; i < wall.length; i++) {
        if (snakeX == wall[i][0]*recSize && snakeY == wall[i][1]*recSize){
            gameOver = true
            alert('Thua')
        }
    }
}



function drawLv3() {
    // wall = [[2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [3, 2], [4, 2], [5, 3], [5, 4], [5, 5], [4, 6], [3, 6]
    //     , [8, 8], [8, 9], [8, 10], [8, 11], [8, 12], [9, 12], [10, 12], [11, 12], [12, 12], [12, 11], [12, 10], [12, 9], [12, 8]
    //     , [14, 14], [15, 15], [16, 16], [17, 15], [18, 14], [16, 17], [16, 18]
    // ]

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

function level4() {
    alert("level 4")
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
    }
    upgradeLevel()
}

function upgradeLevel() {
    if (countToUpLv == 5){
        level++
        countToUpLv = 0
    }
    if (level == 3){
        // drawLv3()
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
        })

    }
}

selectLevel()
function setLevelBg() {
    for (let i = 0; i < levels.length; i++) {
        // if (i == level-1){
        //     levels[i].style.backgroundColor='cyan'
        // }else {
        //     levels[i].style.backgroundColor='black'
        //     levels[i].style.color='white'
        // }
    }
}
document.addEventListener("keydown", changeDirection)
var te = setInterval(mainProcess, 1000/10)

modalLose = document.querySelector(".modal-close")
modalLoseClose = document.querySelector(".modal-close .close")
modalLoseRestart = document.querySelector(".modal-close #restart")

modalLoseClose.addEventListener("click", function () {
    modalLose.style.display = "none"
})

modalLoseRestart.addEventListener("click", function () {
    modalLose.style.display = "none"
})
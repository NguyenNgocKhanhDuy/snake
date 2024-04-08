// 21130035_Nguyễn_Ngọc_Khánh_Duy_0839151003

// canvas
var recSize = 25
var rows = 20
var cols = 20
var board;
var context;

// Toạ độ food
let foodX = 0;
let foodY = 0;
// Toạ độ rắn
// let snakeX = 0;
// let snakeY = 0;
let snakeX = recSize;
let snakeY = recSize;
let moveX = 0;
let moveY = 0;
let snakeBody = []

// Hàm tạo food ngẫu nhiên
function randomFood() {
    // foodX = Math.floor(Math.random() * 20 + 1)
    // foodY = Math.floor(Math.random() * 20 + 1)

    foodX = Math.floor(Math.random() * cols) * recSize
    foodY = Math.floor(Math.random() * rows) * recSize
}
// randomFood()

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

window.onload = function () {
    board = document.getElementById("board")
    board.height = rows * recSize
    board.width = cols * recSize
    context = board.getContext("2d")
}

function moveSnake() {

    context.fillStyle="black"
    context.fillRect(0, 0, board.width, board.height)

    context.fillStyle="red"
    context.fillRect(foodX, foodY, recSize, recSize)

    // let htmlSnake = `<div class="board__food" style="grid-area: ${foodY} / ${foodX}"></div>`

    if (snakeX === foodX && snakeY === foodY) {
        randomFood()
        snakeBody.push([foodX, foodY])
    }

    for (let i = snakeBody.length - 1; i > 0 ; i--) {
        snakeBody[i] = snakeBody[i-1]
    }

    // snakeX += moveX
    // snakeY += moveY
    snakeX += (moveX * recSize)
    snakeY += (moveY * recSize)

    snakeBody[0] = [snakeX, snakeY]

    // for (let i = 0; i < snakeBody.length; i++) {
    //     htmlSnake += `<div class="board__snake ${i}" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`
    // }
    // document.querySelector(".board").innerHTML = htmlSnake

    context.fillStyle="green"
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], recSize, recSize)
    }

}

randomFood()
document.addEventListener("keydown", changeDirection)
var te = setInterval(moveSnake, 500)
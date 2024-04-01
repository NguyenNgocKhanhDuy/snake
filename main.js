// 21130035_Nguyễn_Ngọc_Khánh_Duy_0839151003

// const food = document.querySelector(".board__food")
// const snake = document.querySelector(".board__snake")
// Toạ độ food
let foodX = 0;
let foodY = 0;
// Toạ độ rắn
let snakeX = 10;
let snakeY = 10;
let moveX = 0;
let moveY = 0;
let snakeBody = []
// food.style.display = "block"
// row / column
// snake.style.gridArea = snakeY+"/"+snakeX

// Hàm tạo food ngẫu nhiên
function randomFood() {
    foodX = Math.floor(Math.random() * 20 + 1)
    foodY = Math.floor(Math.random() * 20 + 1)
    // food.style.gridArea = foodY+"/"+foodX;
}
// randomFood()

// Hàm di chuyển theo hướng mũi tên
function changeDirection(e) {
    // trái, lên, phải, xuống === 37, 38, 39, 40
    switch (e.keyCode){
        case 37:
            moveX = -1
            moveY = 0
            break

        case 38:
            moveX = 0
            moveY = -1
            break

        case 39:
            moveX = 1
            moveY = 0
            break

        case 40:
            moveX = 0
            moveY = 1
            break

        default:
            moveX = 0
            moveY = 0
            break
    }
}

function moveSnake() {
    let htmlSnake = `<div class="board__food" style="grid-area: ${foodY} / ${foodX}"></div>`

    if (snakeX === foodX && snakeY === foodY) {
        console.log(snakeBody)
        console.log([foodX, foodY])
        randomFood()
        snakeBody.push([foodX, foodY])
        console.log(snakeBody)
       clearInterval(te)
    }

    for (let i = snakeBody.length - 1; i > 0 ; i--) {
        snakeBody[i] = snakeBody[i-1]
    }

    snakeX += moveX
    snakeY += moveY

    snakeBody[0] = [snakeX, snakeY]

    for (let i = 0; i < snakeBody.length; i++) {
        htmlSnake += `<div class="board__snake ${i}" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`
    }
    document.querySelector(".board").innerHTML = htmlSnake

    // snake.style.gridArea = snakeY+"/"+snakeX
}

randomFood()
document.addEventListener("keydown", changeDirection)
var te = setInterval(moveSnake, 500)
// 21130035_Nguyễn_Ngọc_Khánh_Duy_0839151003

// khai báo giá trị 1 ô là 25, bàn chơi có 20 hàng và 20 cột
var recSize = 25
var rows = 20
var cols = 20
var board ;
var context;
// Tạo biến kiểm tra điều kiện thua
var gameOver = false

// Toạ độ thức ăn
var foodX = 0;
var foodY = 0;

// Toạ độ thức ăn vàng
var goldFoodX = 0;
var goldFoodY = 0;

// Toạ độ rắn
var snakeX = recSize*10;
var snakeY = recSize*10;

// Sử dụng cho hướng di chuyển của rắn
var moveX = 0;
var moveY = 0;

// Thành phần của rắn
var snakeBody = []

// Điểm
var score = document.getElementById("myScore")
// Các cấp độ
var levels = document.querySelectorAll(".level__item")
// Biến kiểm tra tăng level
var countToUpLv = 0;
// Biến level
var level = 1;
// Tường (vật cản)
var wall = []

var mn = 0
var countTime = 5;
var intervalRanTime = 0;
var intervalCountTime = 0;

// Kiểm tra sau khi ăn thức ăn vàng
var isGold;
var start ;
// Cổng dịch chuyển
var gateIn=[[16, 11], [4, 18]];
var gateOut=[[16, 3], [4, 10]];

var trapX = 0
var trapY = 0
var intervalTrapTime = 0

// Hiển thị thời gian chơi
var timeBlock = document.querySelector(".time")

var timeShow = document.querySelector("#time")


// Thời gian chơi của level 2
var timeGame = 10
var intervalTimeGame = 0

// Tạo hình sử dụng cho thức ăn
var foodImg = new Image()
// Gán đường dẫn
foodImg.src = "./assets/apple.png"

// Tạo hình sử dụng cho thức ăn vàng
var goldFoodImg = new Image()
// Gán đường dẫn
goldFoodImg.src = "./assets/golden-apple.png"

var trapImg = new Image()
trapImg.src = './assets/trap.png'

// Khởi tạo ban đầu
window.onload = function () {
    board = document.getElementById("board");
    // Đặt chiều dài, chiều rộng cho bàn chơi rows = 20, cols = 20
    // vậy các hàng từ 0 đến 19 và cột cũng từ 0 đến 19, mỗi ô có giá trị recSize = 25
    board.height = rows * recSize
    board.width = cols * recSize
    // Sử dụng context 2d để vẽ
    context = board.getContext("2d");
}

// Hiển thị thông báo thua
modalLose = document.querySelector(".modal-close")
// Điểm trong phần hiển thị thông báo thua
modalLoseScore = document.querySelector(".modal-close #score")
// Nút nhấn bắt đầu lại
modalLoseRestart = document.querySelector(".modal-close #restart")

// hàm hiển thị thông báo thua
function showModalLose() {
    modalLose.style.display = "flex"
    modalLoseScore.textContent = countToUpLv
}

// bắt sự kiện cho nút nhấn restart
modalLoseRestart.addEventListener("click", function () {
    modalLose.style.display = "none"
    restartGame()
})

// Hiển thị hướng dẫn chơi
modalPlay = document.querySelector(".modal-play")
modalPlayContainerWrapper = document.querySelector(".modal-play .modal-container .wrapper")
// Nút bắt đầu chơi
modalPlayStart = document.querySelector(".modal-play #start")
// Phần tiếp theo và phía trước của hướng dẫn để lựa chọn xem hướng dẫn ở level nào
modalPlayNext = document.querySelector(".modal-play #next")
modalPlayPrevious = document.querySelector(".modal-play #previous")

// Ban đầu ẩn lựa chọn
modalPlayNext.style.display = "none"
modalPlayPrevious.style.display = "none"

// bắt sự kiện cho nút nhấn bắt đầu trong phần hiển thị hướng dẫn chơi
modalPlayStart.addEventListener("click", function () {
    modalPlay.style.display = "none"
    changeDirection
    if (level == 3){
        runLv3()
    }else if (level == 5){
        runLv5()
    }else if (level == 7){
        runLv7()
    }
})

// Khai báo tên các hình gif dùng cho hướng dẫn chơi theo từng level
let listVideo = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6', 'level7']
// Khai báo phần nội dung dùng cho hướng dẫn chơi theo từng level
let listDesc = []
listDesc.push('<li>Level này rắn có khả năng xuyên tường màn chơi</li>')
listDesc.push('<li>Level này rắn không có khả năng xuyên tường màn chơi</li>')
listDesc.push('<li>Level này rắn không có khả năng xuyên tường và sẽ giới hạn thời gian 10 giây</li>' +
              '<li>Khi ăn thức ăn sẽ tăng thêm 3 giây thức ăn sẽ thay đổi vị trí sau 3 giây</li>')
listDesc.push('<li>Level này rắn không có khả năng xuyên tường màn chơi</li>' +
              '<li>Level này xuất hiện các vách tường (ô màu đỏ) khi rắn đụng sẽ thua</li>')
listDesc.push('<li>Level này rắn không có khả năng xuyên tường màn chơi</li>' +
              '<li>Level này xuất hiện các vách tường (ô màu đỏ) khi rắn đụng sẽ thua</li>' +
              '<li>Level này xuất hiện táo vàng khi ăn sẽ cho khả năng xuyên các vách tường (không thể xuyên bàn chơi) trong 5 giây</li>')
listDesc.push('<li>Level này rắn có khả năng xuyên tường màn chơi</li>' +
              '<li>Level này xuất hiện các vách tường (ô màu đỏ) khi rắn đụng sẽ thua</li>' +
              '<li>Level này xuất hiện các cổng dịch chuyển, các cổng có đánh số là cổng rắn có thể đi vào và ra ở màu tương ứng</li>')
listDesc.push('<li>Level này rắn có khả năng xuyên tường màn chơi</li>' +
              '<li>Level này xuất hiện các vách tường (ô màu đỏ) khi rắn đụng sẽ thua</li>' +
              '<li>Level này xuất hiện các bẫy tự thay đổi ngẫu nhiên sau 2s, khi rắn trúng bẫy sẽ giảm đi 1 điểm và khi không còn sẽ thua</li>')

let htmlList = `<li>Dùng các nút điều hướng (lên, xuống, trái, phải) để điều khiển <br>
                            <img class="abc" id="left" src="./assets/left.png" alt=""> 
                            <img class="" id="right" src="./assets/right.png" alt=""> 
                            <img class="" id="up" src="./assets/up.png" alt=""> 
                            <img class="" id="down" src="./assets/down.png" alt=""> 
                        </li>`

let htmlListLevel;
let modalDescList;


// hàm hiển thị hướng dẫn chơi
function showModalHowToPlay(isSetting) {
    // Chỉ cho phép lựa chọn xem hướng dẫn chơi khi người dùng nhấn vào hướng dẫn chơi trong phần '?'
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
    modalPlay.style.display = "flex"
}
showModalHowToPlay()

// Bắt sự kiện cho phần tiếp theo, phía trước trong hướng dẫn chơi (dùng để chuyển giữa các hướng dẫn chơi game của từng level)
var index = 0;
function changeHowToPlay() {
    // lấy ra các phần thông tin cần thay đổi: level, ảnh gif, nội dung
    modalPlayLevel = document.querySelector("#level")
    modalPlayVideo = document.querySelector(".modal-play .video")
    modalDescList = document.querySelector(".modal-play .desc--list")

    // Nếu nhấn mũi tên tiếp theo thì index sẽ tăng để chuyển qua phần tiếp
    if (event.target.id == "next"){
        // Kiểm tra nếu hướng dẫn đang ở level cuối, tăng nữa sẽ quay lại level đầu
        if (index == listVideo.length-1){
            index = 0
        }else {
            index++;
        }

        // Nếu nhấn mũi tên phía trước thì index sẽ giảm để chuyển ngược lại phần trước
    }else if(event.target.id == "previous"){
        // Kiểm tra nếu hướng dẫn đang ở level đầu, giảm nữa sẽ quay lại level cuối
        if (index == 0){
            index = listVideo.length-1
        }else {
            index--;
        }
    }

    // Phần gán ảnh
    modalPlayVideo.src = `./assets/${listVideo[index]}.gif`
    // chọn nội dung level
    htmlListLevel = listDesc[index]
    // gán nội dung vào
    modalDescList.innerHTML = htmlList + htmlListLevel;
    // gán level
    modalPlayLevel.textContent = `Level ${index+1}`
}

// bắt sự nút nhấn chuyển giữa tiếp theo và phía trước
modalPlayNext.addEventListener("click", changeHowToPlay)
modalPlayPrevious.addEventListener("click", changeHowToPlay)

// Phần hiển thị khi nhấn vào ?
question = document.querySelector(".question")
modalQuestion = document.querySelector(".modal-question")
// nút hướng dẫn chơi
modalQuestionHowToPlay = document.querySelector(".modal-question #how-to-play")
// nút thông tin
modalQuestionInfo = document.querySelector(".modal-question #info")
// nút tiếp tục chơi
modalQuestionResume = document.querySelector(".modal-question #resume")

// Khi nhấn vào ? hiện phần này lên
question.addEventListener("click", function (){
    modalQuestion.style.display = "flex"
    // Dừng chơi
    clearInterval(te)
})

// bắt sự kiện nhấn vào hướng dẫn chơi
modalQuestionHowToPlay.addEventListener("click", function () {
    // Truyền true để cho hiện 2 phần mũi tên để có thể chuyển xem hướng dẫn chơi giữa các level
    showModalHowToPlay(true)
})

// bắt sự kiện cho nút tiếp tục ẩn phần đó và tiếp tục chơi
modalQuestionResume.addEventListener("click", function () {
    modalQuestion.style.display = "none"
    // Gọi hàm run để tiếp tục chơi
    run()
})


// Hàm tạo thức ăn ngẫu nhiên
function randomFood() {
    // X tính theo cột và Y tính theo hàng
    /*
    Ví dụ rows = 20, cols = 20
    Math.random() cho giá trị từ 0 < ? < 1
    Vậy đối với foodX thì 0*20 < ? < 1*20 => 0 < ? < 20 là sẽ ra được số cột
    Hàm Math.floor() là dùng để làm tròn thành số nguyên nhưng làm tròn dưới. Ví dụ: Math.floor(1.6) = 1
    Vậy khi dùng vào công thức sẽ tránh được trường hợp 19.9... sẽ thành 19 vì bàn chơi từ 0 đến 19 cột và hàng
    và 0.9 thì sẽ là 0
    Sau đó nhân với recSize = 25 là 1 ô là 25 và có vị trí ô tính từ góc trên bên trái, vậy ô có vị trí [1, 1] tương ứng [25, 25]
    foodY tương tự
     */
    foodX = Math.floor(Math.random() * cols) * recSize
    foodY = Math.floor(Math.random() * rows) * recSize
    // Kiểm tra nếu random ra ngay vị trí của rắn thì sẽ random lại
    for (let i = 0; i < snakeBody.length; i++) {
        if (foodX == snakeBody[i][0] && foodY == snakeBody[i][1]){
            randomFood()
        }
    }
    // Kiểm tra nếu random vào tường thì sẽ random lại
    if (wall.length > 0){
        for (let i = 0; i < wall.length; i++) {
            if (foodX == (wall[i][0]*recSize) && foodY == (wall[i][1]*recSize)){
                randomFood()
            }
        }
    }
    console.log([foodX, foodY])
}

// Hàm random thức ăn vàng
function randomGoldFood() {
    // Cách thức random ra thức ăn vàng tương tự với thức ăn thường
    goldFoodX = Math.floor(Math.random() * cols) * recSize
    goldFoodY = Math.floor(Math.random() * rows) * recSize
    // kiểm tra nếu random ra vị trí của rắn hoặc vị trí của thức ăn thường thì sẽ random lại
    for (let i = 0; i < snakeBody.length; i++) {
        if ((goldFoodX == snakeBody[i][0] && goldFoodY == snakeBody[i][1])){
            randomGoldFood()
        }
    }
    if(goldFoodX == foodX && goldFoodY == foodY){
        randomGoldFood()
    }
    // Kiểm tra nếu random vào tường thì sẽ random lại
    if (wall.length > 0){
        for (let i = 0; i < wall.length; i++) {
            if (goldFoodX == (wall[i][0]*recSize) && goldFoodY == (wall[i][1]*recSize)){
                randomGoldFood()
            }
        }
    }
    start = true
    // isGold = false
    countTime = 5
    clearInterval(intervalCountTime)
}

function randomTrap() {
    trapX = Math.floor(Math.random() * cols) * recSize
    trapY = Math.floor(Math.random() * rows) * recSize
    for (let i = 0; i < snakeBody.length; i++) {
        if (trapX == snakeBody[i][0] && trapY == snakeBody[i][1]){
            randomTrap()
        }
    }
    if((trapX == foodX && trapY == foodY)){
        randomTrap()
    }
    // Kiểm tra nếu random vào tường thì sẽ random lại
    if (wall.length > 0){
        for (let i = 0; i < wall.length; i++) {
            if (trapX == (wall[i][0]*recSize) && trapY == (wall[i][1]*recSize)){
                randomTrap()
            }
        }
    }
    start = true
}

function ranTrapTime() {
    intervalTrapTime = setInterval(randomTrap, 2000)
}

// Hàm di chuyển theo hướng mũi tên
function changeDirection(e) {
    // trái, lên, phải, xuống tương ứng với các giá trị keyCode là: 37, 38, 39, 40

    /*  Kiểm tra khi phần hướng dẫn chơi tắt đi thì mới chơi tránh trường hợp
     khi đang hiển thị hướng dẫn chơi nhấn các phím thì rắn di chuyển
    */
    if (modalPlay.style.display == "none"){
        // Trục X giống Ox nhưng trục Y ngược lại
        if (e.keyCode == 37 && moveX != 1) {
            // Di chuyển qua trái (nút mũi tên qua trái) thì giá trị X sẽ là -1 và Y không đổi
            moveX = -1
            moveY = 0
        }else if (e.keyCode == 38 && moveY != 1){
            // Di chuyển lên trên (nút mũi tên lên) thì giá trị Y sẽ là -1 và X không đổi
            moveX = 0
            moveY = -1
        }else if(e.keyCode == 39 && moveX != -1){
            // Di chuyển qua phải (nút mũi tên qua phải) thì giá trị X sẽ là 1 và Y không đổi
            moveX = 1
            moveY = 0
        }else if (e.keyCode == 40 && moveY != -1){
            // Di chuyển xuống dưới (nút mũi tên xuống) thì giá trị Y sẽ là 1 và X không đổi
            moveX = 0
            moveY = 1
        }
    }else {
        // Nếu khi phần hướng dẫn chơi hiển thị nhấn các nút sẽ làm giảm opacỉty các hình tương ứng
        // lấy ra các hình
        left = document.querySelector("#left")
        right = document.querySelector("#right")
        up = document.querySelector("#up")
        down = document.querySelector("#down")

        // giảm opacity các hình tương ứng khi nhấn vào các nút
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

// Hàm dùng để tăng opacity các hình lại khi nhấn vào các nút mũi tên tương ứng
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

// bắt sự kiện khi không nhấn nút, dùng để tạo cảm giác có hiệu ứng nhấn
document.addEventListener("keyup", changeOpacity)

// Hàm xử lý chính
function mainProcess() {



    // Kiểm tra nếu thua thì kết thúc
    if (gameOver){
        return
    }

    // Vẽ bàn chơi màu đen
    context.fillStyle="black"
    // context.fillRect(x, y, width, height)
    // vị trí x, y tính theo góc trên bên trái vẽ với độ dài và chiều cao của bàn chơi board
    context.fillRect(0, 0, board.width, board.height)


    // Vẽ thức ăn
    // context.drawImage(image, x, y, width, height)
    // Vẽ thức ăn với hình được tạo ở trên, toạ độ được random trong hàm randomFood(), với kích thước bằng 1 ô nên là recSize
    context.drawImage(foodImg, foodX, foodY, recSize, recSize)

    // Kiểm tra để vẽ thức ăn vàng
    if (!isGold && level == 5 && start == true){
        context.drawImage(goldFoodImg, goldFoodX, goldFoodY, recSize, recSize)
    }

    // kiểm tra ăn thức ăn
    eatFood()

    // kiểm tra ăn thức ăn vàng
    if (level == 5){
        eatGoldFood()
    }

    // Vẽ tường
    if (wall.length > 0){
        for (let i = 0; i < wall.length; i++) {
            // Nếu vừa ăn thức ăn vàng thì tường sẽ bị vô hiệu hoá(có khả năng xuyên tường) nên đổi màu tường thành #ccc
            if (isGold){
                context.fillStyle = '#ccc'
            }else {
                context.fillStyle="red"
            }
            // Vẽ tường ví dụ wall = [[1, 2], [3, 4]]
            // wall[0][0] sẽ lấy ra hàng 0 cột 0 là 1
            // wall[0][1] sẽ là 2
            // Sau đó nhân với recSize (kích thước 1 ô) để ra được vị trí đúng
            context.fillRect(wall[i][0]*recSize, wall[i][1]*recSize, recSize, recSize)
        }
    }

    // kiểm tra level = 6
    if (level == 6){
        // Vẽ cổng dịch chuyển
        for (let i = 0; i < gateIn.length; i++) {
            if (i < 1){
                context.fillStyle = 'orange'
            }else {
                context.fillStyle="yellow"
            }
            // Giống với vẽ các ô tường [i][0] lấy được các vị trí X và [i][1] lấy được các vị trí y
            // Nhân với recSize ra được vị trí đúng
            context.fillRect(gateIn[i][0]*recSize, gateIn[i][1]*recSize, recSize, recSize)
            context.fillRect(gateOut[i][0]*recSize, gateOut[i][1]*recSize, recSize, recSize)
            context.fillStyle="black"
            context.font = '25px san-serif';
            context.textAlign='center'
            context.textBaseline='middle'
            context.fillText(i+1, gateIn[i][0]*recSize + recSize/2, gateIn[i][1]*recSize + recSize/2,recSize)

            // Nếu rắn đi vào cổng vào
            if (snakeX == gateIn[i][0]*recSize && snakeY == gateIn[i][1]*recSize){
                // Gán toạ độ X của rắn là x của cổng ra
                // Gán toạ độ y của rắn là y của cổng ra
                snakeX = gateOut[i][0]*recSize
                snakeY = gateOut[i][1]*recSize
            }

        }
    }

    if (level == 7 && start == true){
        // context.fillStyle = 'white'
        context.drawImage(trapImg, trapX, trapY, recSize, recSize)
        // context.fillRect(trapX, trapY, recSize, recSize)
    }

    // Rắn di chuyển, theo kiểu sẽ di chuyển 1 phần từ sau lên phần từ trước
    for (let i = snakeBody.length - 1; i > 0 ; i--) {
        snakeBody[i] = snakeBody[i-1]
    }

    // moveX, moveY là các giá trị khi nhấn các nút mũi tên có được nhân với recSize (kích thước 1 ô) để được kích thước đúng
    // Cộng vào snakeX và snakeY để rắn có thể di chuyển
    snakeX += (moveX * recSize)
    snakeY += (moveY * recSize)


    // Gọi thay đổi level
    changeLevel()

    // Gán vị trí đầu của phần rắn là snakeX, snakeY (đầu rắn)
    snakeBody[0] = [snakeX, snakeY]

    for (let i = 0; i < snakeBody.length; i++) {
        // Vẽ đầu rắn khác màu
        if (i == 0) {
            context.fillStyle='#03F100'
        }else{
            context.fillStyle='#007BF1'
        }
        // vẽ rắn snakeBody[i][0] cho giá trị X và snakeBody[i][1] cho giá trị Y
        context.fillRect(snakeBody[i][0], snakeBody[i][1], recSize, recSize)
    }

    // Gọi hàm kiểm tra rắn có đuôi hay không
    checkBite()

}

// Hàm tạo các thành phần của level
function setUpLv() {
    timeBlock.style.display = 'none'
    if (level == 2){
        drawLv2()
    }else if(level == 3){
        drawLv2()

    }else if (level == 4){
        drawLv4()
    }else if(level == 5){
        drawLv5()
    }else if (level == 6){
        drawLv6()
    }else if (level == 7){
        drawLv7()

    }

    if (level != 3){
        clearInterval(mn)
        clearInterval(intervalTimeGame)
    }
    if (level != 2 && level != 3 && level != 4 && level != 5){
        document.getElementById("outBoard").style.border="none"
    }
    if (level != 5){
        clearInterval(intervalRanTime)
        clearInterval(intervalCountTime)
    }
    // if (level != 7){
    //     clearInterval(intervalTrapTime)
    // }
    randomFood()
}
setUpLv()
function runLv3() {
    ranFTime()
    timeShow.textContent = timeGame
    intervalTimeGame = setInterval(time, 1000)
}

function runLv5() {
    ranGFTime()
}

function runLv7() {
    ranTrapTime()
}
// Gọi hàm tạo thức ăn
function ranGFTime() {
    intervalRanTime = setInterval(randomGoldFood, 3000)
}
function ranFTime() {
    mn = setInterval(randomFood, 3000)
}
// Hàm ăn thức ăn
function eatFood() {
    // Khi toạ độ đầu rắn snakeX, snakeY trùng với toạ độ thức ăn có nghĩa là ăn thức ăn
    if (snakeX === foodX && snakeY === foodY) {
        // Tạo thức ăn mới
        randomFood()
        // Thêm phần vừa ăn vào snakeBody
        snakeBody.push([foodX, foodY])
        // Tăng giá trị đếm tăng cấp
        countToUpLv++
        // score.textContent = (snakeBody.length - 1)
        score.textContent = countToUpLv

        if (level == 3){
            timeGame += 3
            if (timeGame > 10){
                timeGame = 10
            }
            clearInterval(mn)
            randomFood()
            ranFTime()
            timeShow.textContent = (timeGame)
        }
    }

}

// Hàm ăn thức ăn vàng
function eatGoldFood() {
    // Khi toạ độ đầu rắn snakeX, snakeY trùng với toạ độ thức ăn có nghĩa là ăn thức ăn
    if (snakeX === goldFoodX && snakeY === goldFoodY) {
        // Thêm phần vừa ăn vào snakeBody
        snakeBody.push([goldFoodX, goldFoodY])
        // Tăng giá trị đếm tăng cấp
        countToUpLv++
        // score.textContent = (snakeBody.length - 1)
        // Gán giá trị isGold = true (giá trị này giúp kiểm tra khi ăn thức ăn vàng thì sẽ có khả năng xuyên tường)
        isGold = true
        // Hiện thời gian xuyên tường
        timeShow.textContent = countTime
        timeBlock.style.display = "block"
        clearInterval(intervalRanTime)
        // random lại thức ăn vàng
        // randomGoldFood()
        // countTime = 5
        checkInCountTime()
    }
}

// Hàm thời gian
function time() {
    // Sử dụng cho level 5
    if (level == 5){
        // Giảm thời gian đi 1
        countTime--
        timeShow.textContent = (countTime)
        if (countTime < 0){
            // nếu thời gian hết
            clearInterval(intervalCountTime)
            randomGoldFood()
            ranGFTime()
            isGold = false
            countTime = 5
            timeBlock.style.display = 'none'
        }
    }else if (level == 3){ // Sử dụng cho level 3
        // Giảm thời gian đi 1
        timeGame--
        timeBlock.style.display = 'block'
        timeShow.textContent = (timeGame)
    }

}

// Hàm gọi hàm time() mỗi 1s có ý nghĩa giảm thời gian đi 1 mỗi 1s
function checkInCountTime() {
    intervalCountTime = setInterval(time, 1000)
}

// Hàm kiểm tra cắn đuôi
function checkBite() {
    for (let i = 1; i < snakeBody.length; i++) {
        // Duyệt qua các phần trong snakeBody trừ 0 (vì là đầu) nếu
        // snakeX == snakeBody[i][0] có nghĩa là toạ độ X đầu rắn == toạ độ X thân rắn
        // snakeY == snakeBody[i][1] có nghĩa là toạ độ Y đầu rắn == toạ độ Y thân rắn
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
            // Gán gameOver = true và hiện phần thông báo thua
            gameOver = true
            showModalLose()
        }
    }
}

// level 1 xuyên tường
function level1() {

    /*
     Toán tử 3 ngôi
     (snakeX % (cols * recSize)) là lấy đầu rắn chia lấy phần dư cho khối cột cuối của bàn chơi
     cols * recSize = 20 * 25 = 500
     rows * recSize = 20 * 25 = 500
     Ví dụ bàn chơi cột cuối là 19 vậy nêú snakeX ở vị trí cuối là 19 * 25 (recSize=25) = 475
     475 là toạ độ X góc trên bên trái nếu di chuyển qua phải tiếp tức là
     snakeX += (moveX * recSize) (moveX = 1, recSize = 25) thì sẽ là snakeX = 475 + 25 = 500
     500 % 500 dư 0 sẽ quay lại ô đầu
     snakeX = snakeX >= 0 ? (snakeX % (cols * recSize)) : (cols * recSize) là
     Nếu snakeX >= 0 thì sẽ tính theo (snakeX % (cols * recSize)) có nghĩa là khi đụng vào cuối tường (vách phải) sẽ cài lại vị trí 0 (vách trái), còn với các giá trị khác sẽ bằng chính nó vì toán tử %
     Nếu snakeX < 0 thì sẽ tính theo (cols * recSize) có nghĩa là khi rắn đụng vào vách bên trái sẽ cài lại vị trí là vách phải
     Tương tự với snakeY
    */
    snakeX = snakeX >= 0 ? (snakeX % (cols * recSize)) : (cols * recSize)
    snakeY = snakeY >= 0 ? (snakeY % (rows * recSize)) : (rows * recSize)
}

// Hàm bắt đầu lại trò lại
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
    setUpLv()
    isGold = false
    start = false
}

// level 2 rắn không thể xuyên tường
function level2() {
    // Kiểm tra nếu snakeX < 0 là vách trái hoặc snakeX > (cols * recSize) là vách phải sẽ thua và hiện thông báo thua
    if (snakeX < 0 || snakeX > (cols * recSize) || snakeY < 0 || snakeY > (rows * recSize)) {
        gameOver = true;
        showModalLose()
    }
}

// level 3 đếm thời gian và random thức ăn và rắn không xuyên tường
function level3() {
    if (snakeX < 0 || snakeX > (rows * recSize) || snakeY < 0 || snakeY > (cols * recSize)) {
        gameOver = true;
        clearInterval(intervalTimeGame)
        clearInterval(mn)
        timeGame = 10
        showModalLose()
    }
    if (timeGame < 0){
        gameOver = true
        clearInterval(mn)
        clearInterval(intervalTimeGame)
        timeGame = 10
        showModalLose()
    }
}

// level 4 tường
function level4() {
    level2()
    // kiểm tra rắn đụng tường sẽ bị thua và hiện thông báo thua
    for (let i = 0; i < wall.length; i++) {
        // wall[i][0] cho toạ độ x nhân với recSize cho giá trị x chính xác để so với snakeX
        // wall[i][1] cho toạ độ y nhân với recSize cho giá trị y chính xác để so với snakeY
        if (snakeX == wall[i][0]*recSize && snakeY == wall[i][1]*recSize){
            gameOver = true
            showModalLose()
        }
    }
}

// Vẽ viền bao quanh khi level 2
function drawLv2() {
    document.getElementById("outBoard").style.border="1px solid red"
}


// Thêm các giá trị tường
function drawLv4() {
    drawLv2()
    for (let i = 0; i < cols; i++) {
        if (i < (cols - 5) && i != 4 && i != 5 && i!= 3){
            wall.push([i, 3])
        }
    }

    wall.push([10, 17], [11, 17], [12, 17], [13, 17], [14, 17], [15, 17], [16, 17])
    wall.push([4, 8], [4, 9], [4, 10], [4, 11], [4, 12], [4, 13], [4, 14])
}

// Thêm các giá trị tường
function drawLv5() {
    drawLv2()
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

// level 5 xuyên tường khi ăn thức ăn vàng
function level5() {
    if (snakeX < 0 || snakeX > (rows * recSize) || snakeY < 0 || snakeY > (cols * recSize)) {
        gameOver = true;
        clearInterval(intervalCountTime)
        clearInterval(intervalRanTime)
        timeGame = 10
        showModalLose()
    }
    if (!isGold){
        for (let i = 0; i < wall.length; i++) {
            if (snakeX == wall[i][0]*recSize && snakeY == wall[i][1]*recSize){
                gameOver = true
                clearInterval(intervalCountTime)
                clearInterval(intervalRanTime)
                showModalLose()
            }
        }
    }
}

// Thêm các giá trị tường
function drawLv6() {
    for (let i = 0; i < cols; i++) {
        wall.push([i, 6])
        wall.push([i, 14])
    }

}

// Level 6 cho xuyên tường và cổng dịch chuyển
function level6() {
    level1()
    for (let i = 0; i < wall.length; i++) {
        if (snakeX == wall[i][0]*recSize && snakeY == wall[i][1]*recSize){
            gameOver = true
            showModalLose()
        }
    }
}

function drawLv7() {
    for (let i = 0; i < cols; i++) {
        if (i > 4 && i < 15){
            wall.push([i, 3])
            wall.push([i, 15])
            wall.push([2, i])
            wall.push([17, i])
        }
    }
}

function level7() {
    level1()
    for (let i = 0; i < wall.length; i++) {
        if (snakeX == wall[i][0]*recSize && snakeY == wall[i][1]*recSize){
            gameOver = true
            clearInterval(intervalTrapTime)
            showModalLose()
        }
    }
    if ((snakeX == trapX && snakeY == trapY)){
        if (snakeBody.length == 1){
            gameOver = true
            clearInterval(intervalTrapTime)
            showModalLose()
        }else {
            snakeBody.pop()
            countToUpLv--
            score.textContent = countToUpLv
        }
    }
}

// Hàm đổi level
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
    }else if (level == 7){
        level7()
    }
    upgradeLevel()
}

// Hàm tự tăng level
function upgradeLevel() {
    if (countToUpLv == 10){
        level++
        countToUpLv = 0
        restartGame()
    }
    // if (level == 2){
    //     drawLv2()
    // }else if (level == 4){
    //     drawLv4()
    // }else if (level == 5){
    //     drawLv5()
    // }else if (level == 6){
    //     drawLv6()
    // }else if (level == 7){
    //     drawLv7()
    // }

    setLevelBg()
}




// Hàm lựa chọn level
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
// Hàm thay đổi background level khi được lựa chọn
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
// bắt sự kiện cho các nút mũi tên để di chuyển
document.addEventListener("keydown", changeDirection)

// Hàm chạy
function run() {
     te = setInterval(mainProcess, 1000/10)
}

run()

// Hiển thị thông tin
modalInfo = document.querySelector(".modal-info")
// nút đóng
modalInfoClose = document.querySelector(".modal-info #close")
// bắt sự kiện khi nhấn vào nút thông tin sẽ hiện
modalQuestionInfo.addEventListener("click", function () {
    modalInfo.style.display = "flex"
})

// bắt sự kiện nhấn vào nút đóng sẽ đóng phần hiển thị
modalInfoClose.addEventListener("click", function () {
    modalInfo.style.display = "none"
})
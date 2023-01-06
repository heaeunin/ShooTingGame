//캔버스 셋팅
let canvas;
let ctx;
//그림 그려주는 역할

canvas = document.createElement("canvas");
//캔버스를 만들어서 변수에 저장
ctx = canvas.getContext("2d");
//게임이 2d
canvas.width = 400;
//캔버스 넓이 지정
canvas.height = 700;
//캔버스 높이 지정

document.body.appendChild(canvas);
//바디태그에 캔버스를 자식으로 생성

let backgroundImage,dogImage,bulletImage,enemyImage,gameOverImage;
let gameOver = false; // true이면 게임이 끝남, false이면 게임 안끝남
let score = 0;

//우주선 좌표(계속 움직이는 역할을 해서 따로 빼줌)
// Y 좌표 -> 높이 700 - 64 = 
// X 좌표 -> 200 - 32(64/2) = 
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-64;

let bulletList = [];
//총알들을 저장하는 리스트

function Bullet(){
  this.x = 0;
  this.y = 0;
  this.init = function(){
    this.x = spaceshipX + 20;
    this.y = spaceshipY;
    //초기화
    this.alive = true // true면 살아있는 총알, false면 죽은 총알

    bulletList.push(this);
  };

  this.update = function(){
    this.y -= 7;
  };

  this.checkHit = function(){
    //총알.y <= 적군.y and
    //총알.x >= 적군.x and 총알.x <= 적군.x + 적군의 넓이
    for(let i = 0; i < enemyList.length; i ++){
      if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 40){
        //총알이 죽게됨 적군의 우주선 없어지고 점수 획득
        score ++;
        this.alive = false //죽은총알
        enemyList.splice(i,1);
      }
    }
  };
}

function generateRandomValue(min,max){
  let randomNum = Math.floor(Math.random() * (max-min+1)) + min;
  return randomNum;
}

let enemyList = [];
function Enemy(){
  this.x = 0;
  this.y = 0;
  this.init = function(){
    this.y = 0;
    this.x = generateRandomValue(0,canvas.width-48);
    enemyList.push(this);
  };
  this.update = function(){
    this.y += 3; //적군의 속도 조절
    
    if(this.y >= canvas.height -48){
      gameOver = true;
    }
  };
}

//저장한 이미지 불러오기
function loadImage(){
  backgroundImage = new Image();
  backgroundImage.src= "img/background.jpg";

  spaceshipImage = new Image();
  spaceshipImage.src= "img/dog.png";

  bulletImage = new Image();
  bulletImage.src= "img/bullet.png";
  
  enemyImage = new Image();
  enemyImage.src= "img/bone.png";

  gameOverImage = new Image();
  gameOverImage.src= "img/gameover.png";
}

let keysDown = {};
//방향키 이벤트생성
function setupkeyboardListener(){
  document.addEventListener("keydown", function(event){
    keysDown[event.keyCode] = true;
  });
  
//방향키 이벤트삭제
  document.addEventListener("keyup", function(event){
    delete keysDown[event.keyCode];

    if(event.keyCode == 32){
        createBullet(); //총알 생성
    }
  });
}

function createBullet(){
  console.log("총알 생성");
  let b = new Bullet(); //총알 하나 생성
  b.init();
}

function createEnemy(){
  const interval = setInterval(function(){
    let e = new Enemy();
    e.init();
  }, 1000);
}

//좌표값 이동
function update(){
  if(39 in keysDown){
    spaceshipX += 5; //우주선의 속도
    //right 방향
  }
    if(37 in keysDown){
      spaceshipX -= 5;
      //left 방향
    }

  if(spaceshipX <= 0){
    spaceshipX = 0;
  }
    if(spaceshipX >= canvas.width - 64){
      spaceshipX = canvas.width - 64;
    }
  //우주선의 좌표값이 무한대로 업데이트가 되는게 아닌, 경기장 안에서만 있게 하기

  //총알의 y좌표 업데이트하는 함수 호출
  for(let i = 0; i < bulletList.length; i ++){
    if(bulletList[i].alive){
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  for(let i = 0; i < enemyList.length; i ++){
    enemyList[i].update();
  }
}

//백그라운드, 우주선 이미지 위치 
function render (){
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  ctx.fillText(`score: ${score}`, 20, 20);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial"
  for(let i = 0; i < bulletList.length; i ++){
    if(bulletList[i].alive){
      ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y);
    }
  }

  for(let i = 0; i < enemyList.length; i ++){
    ctx.drawImage(enemyImage,enemyList[i].x, enemyList[i].y);
  }
}

function main(){
  if(!gameOver){
    update(); //좌표값을 업데이트하고
    render(); //그려주고
    requestAnimationFrame(main);
  }else{
    ctx.drawImage(gameOverImage, 115, 300, 200, 100);
  }
}
//함수 호출
loadImage();
setupkeyboardListener();
createEnemy();
main();

//총알 만들기
//1. 스페이스바를 누르면 총알 발사
//2. 총알이 발사 = 총알이 y값이 -- 줄어듬, 총알의 x값은 ? 스페이스를 누른 순간의 우주선의 x좌표 
//3. 발사된 총알들은 총알 배열에 저장
//4. 총알들은 x,y 좌표값이 있어야함
//5. 총알 배열을 가지고 render 그려줌

//적군만들기
// x, y, init, update
//1. 적군은 위치가 랜덤
//2. 적군은 밑으로 내려옴 = y좌표가 증가
//3. 1초 마다 하나씩 적군이 나옴
//4. 적군의 우주선이 바닥에 닿으면 게임 오버
//5. 적군과 총알이 만나면 우주선이 사라지고 점수 1점 획득

//적군이 죽는다
//총알이 적군에게 닿는다
 
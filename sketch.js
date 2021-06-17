var PLAY = 1;
var END = 0;
var gameState = PLAY;

var sonic, sonic_running, sonic_collided;
var ground, invisibleGround, groundImage;
var obstaclesGroup, eggman, msonic;
var score=0;
var life=3;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  sonic_running = loadAnimation("sonic_running.png");
  sonic_collided = loadAnimation("sonic_fall.png");
  groundImage = loadImage("backg.jpg");
  
  eggman = loadImage("egg_man.png");
  msonic = loadImage("msonic.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  sonic = createSprite(50,180,20,50);
  sonic.addAnimation("running", sonic_running);
  sonic.scale = 0.07;
  sonic.setCollider("rectangle",0,50,900,850);
  sonic.debug=true;
  
  ground = createSprite(0,190,1200,10);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background("blue");
  textSize(20);
  fill(255);
  text("Score: "+ score, 25,20);
  text("Life: "+ life , 25,40);
  drawSprites();
  if (gameState===PLAY){
    score = score + Math.round(1 + 1*score/1000);
    console.log(sonic.y);
  
    if(score >= 0){
      ground.velocityX = -(6 + 3*score/100);
    }
  
    if(keyDown("space") && sonic.y >= 150) {
      sonic.velocityY = -15;
    }
  
    sonic.velocityY = sonic.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    sonic.collide(ground);
    
    spawnObstacles();
  
   if(obstaclesGroup.isTouching(sonic)){
   life = life-1;
   gameState = END;
    } 
   if(life === 0){
   gameOver.visible = true;
   }
  }
  
  else if (gameState === END ) {
    restart.visible = true;
    sonic.addAnimation("collided", sonic_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    sonic.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    
    //change the trex animation
    sonic.changeAnimation("collided",sonic_collided);
    sonic.scale =0.1;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
    reset();
    }
  }
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,150,10,40);    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(eggman);
              break;
      case 2: obstacle.addImage(msonic);
              break;
    }
        
    obstacle.velocityX = -(1 + 2*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
    obstacle.debug = true;
    obstacle.setCollider("rectangle",0,0,600,900);
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  sonic.changeAnimation("running",sonic_running);
  sonic.scale=0.07;
 
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  score = 0;
  if (life === 0){
  life = 3;
  }
}

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var database;
var index = 0;
var trexIndex = 0;
var tRex=[]
var skyImage;
function preload(){
 trex_running = loadAnimation("pics/trex1.png","pics/trex3.png","pics/trex4.png");
  trex_collided = loadAnimation("pics/trex_collided.png");
  
  groundImage = loadImage("pics/ground2.png");
  
  cloudImage = loadImage("pics/cloud.png");
  
  obstacle1 = loadImage("pics/obstacle1.png");
  obstacle2 = loadImage("pics/obstacle2.png");
  obstacle3 = loadImage("pics/obstacle3.png");
  obstacle4 = loadImage("pics/obstacle4.png");
  obstacle5 = loadImage("pics/obstacle5.png");
  obstacle6 = loadImage("pics/obstacle6.png");
  
  restartImg = loadImage("pics/restart.png")
  gameOverImg = loadImage("pics/gameOver.png")
  
  skyImage = loadImage("pics/sky.jpg");
  //jumpSound = loadSound("jump.mp3")
  //dieSound = loadSound("die.mp3")
// checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600,200);
 database = firebase.database();
 
  //var message = "This is a message";
 //console.log(message)
  
  trex = createSprite(50,160,20,50);
  trex.shapeColor= "red";
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.visible = false;
 // ground.addImage(groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("circle",0,0,40);
  //trex.debug = true
  
  score = 0;
  index = index + 1;

  if (index === trexIndex){
   // camera.position.y = tRex.
    camera.position.x = tRex[index-1].x;
    console.log("this worked")
  }
}

function draw() {
  
  background(skyImage);
  skyImage.velocityX = -(4 + 3* score/100)
  skyImage.x = skyImage.width /2;
  //displaying score
  textSize(25);
  fill("purple");
  strokeWeight(0.5);
  stroke("white");
  text("Score: "+ score, 450,40);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
   ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
   // if(score>0 && score%100 === 0){
     //  checkPointSound.play() 
    //  }
    
    if (ground.x < 30){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
      //  jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
   // spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        trex.velocityY = -12;
      //  jumpSound.play();
        gameState = END;
        //dieSound.play()
      
    }
  }
   else if (gameState === END) {
    trex.changeAnimation("collided", trex_collided);
     // gameOver.visible = true;
      restart.visible = true;

      textSize(30);
      fill("black");
      stroke("black");
      text("Game Over", 234,100);
     
     if(mousePressedOver(restart)) {
      reset();
    }

     
     //change the trex animation
      
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);


  drawSprites();
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation ("running", trex_running);
  score = 0;

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.shapeColor= "green";  
   obstacle.velocityX = -(6 + score/70);
   
   // generate random obstacles
   var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
             break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
   }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.shapeColor = "white";
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}



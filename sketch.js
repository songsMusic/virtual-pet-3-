var dog,sadDog,happyDog, database, foodS, foodStock;
var feed , addFood ; 
var fedTime , lastFed ; 
var foodObj ; 
var GameState , readState ; 
var bedroom, garden, washroom ; 


function preload()
{

// loading the images 
 sadDog = loadImage("images/dogImg.png") ; 
 happyDog = loadImage("images/dogImg1.png") ; 
bedroom =  loadImage("images/Bed Room.png");
garden =  loadImage("images/Garden.png");
washroom =  loadImage("images/Wash Room.png");

}

function setup() {
  
  database = firebase.database();
  createCanvas(400,500);

  readState=database.ref("gameState");
  readState.on("value",function(data){
    gameState = data.val();
    })

  
  dog = createSprite(250,300,150,150) ; 
  dog.scale = 0.15 ; 
  dog.addImage(sadDog) ; 
  foodStock = database.ref('food');
  foodStock.on("value" , readStock) ; 
  textSize(20); 

 // creating a object from the food class 
 foodObj = new Food(); 

 // creating the button for feeding the dog 
 feed = createButton("FEED THE DOG");
 feed.position(600,95);
 feed.mousePressed(feedDog); 

 //creating button for adding the food 
 addFood = createButton("ADD FOOD");
 addFood.position(900,95);
 addFood.mousePressed(addFoods);
}


function draw() {  


 foodObj.display();

 currentTime = hour();
 if(currentTime == (lastFed+1)){
 update("playing"); 
 foodObj.garden();
 }else if(currentTime == (lastFed+2)){
  update("sleeping"); 
  foodObj.bedroom();
  }else if(currentTime> (lastFed+2) && currentTime <= (lastFed+4) ){
    update("bathing"); 
    foodObj.washroom();
    } else{
      update("hungry")
      foodObj.display();
    }
 



 fedTime = database.ref('FeedTime') ;
 fedTime.on("value" , function(data){
   lastFed = data.val();
 })

 if(gameState!= "hungry"){
    feed.hide();
    addFood.hide()
    dog.remove();

 }else{
   feed.show();
   addFood.show();
   dog.addImage(sadDog)
 }

  drawSprites();

  stroke("black") ; 
  text ("FOOD REMAINING : " + foodS , 170,200); 
  textSize(15) ; 
  text ("PRESS THE UP ARROW KEY TO FEED THE DOG " , 130,10,300,20) ; 
  

}


function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}
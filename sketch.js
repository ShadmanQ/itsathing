// a singular player object
var player;
// create array of enemies
var enemies = [];

// control the spawning of enemies
var enemySpawnInterval = 250;
var lastEnemySpawn = 0;

var gameOver = false;

var gameStart = false;

var timer = 25000;

var SCENE_W = 5000;
var SCENE_H = 5000;

var frame;

function preload(){
	frame = loadImage("assets/land.jpg");
}


function setup() {
	// basically mandatory for mobile sketches
	pixelDensity(1);

	//createCanvas(windowWidth / 4, windowHeight / 4);
	createCanvas(windowWidth, windowHeight);

	// create player object
	player = new Player;

	camera.zoom = 4;

}

function draw() {

	background(frame);

	if(!gameOver) {

		if (player.diameter > 120 && player.diameter < 150 ){
			camera.zoom = 3.0;
		}

		if (player.diameter > 150 && player.diameter < 200){
			camera.zoom = 2.0;
			enemySpawnInterval = 150;
		}

		if (player.diameter > 200 && player.diameter < 250){
			camera.zoom = 1.0;
		}

		if (player.diameter > 250 && player.diameter < 300){
			camera.zoom = 0.5;
		}


		// time to spawn a new enemy?
		if(millis() > lastEnemySpawn + enemySpawnInterval) {
			lastEnemySpawn = millis();

			// what side should it come in from?
			var rando = int(random(4));

			if(rando == 0) {
				// come from the top
				var x = random(width);
				var y = 0;
				var xSpeed = random(-5,5);
				var ySpeed = random(1,5);
				var col = color(0,255,0);

				enemies.push(new Enemy(x,y,xSpeed,ySpeed,col));
			}

			if(rando == 1) {
				// come from the bottom
				var x = random(width);
				var y = height;
				var xSpeed = random(-5,5);
				var ySpeed = random(-1,-5);
				var col = color(255,0,0);

				enemies.push(new Enemy(x,y,xSpeed,ySpeed,col));
			}

			if(rando == 2) {
				// come from the left
				var x = 0;
				var y = random(height);
				var xSpeed = random(1,5);
				var ySpeed = random(-5,-5);
				var col = color(0,0,255);

				enemies.push(new Enemy(x,y,xSpeed,ySpeed,col));
			}

			if(rando == 3) {
				// come from the right
				var x = width;
				var y = random(height);
				var xSpeed = random(-1,-5);
				var ySpeed = random(-5,-5);
				var col = color(120,120,120);

				enemies.push(new Enemy(x,y,xSpeed,ySpeed,col));
			}

			
		}

	//	background(frame);

		player.update();
		player.display();

		// call all methods for enemies
		// go backwards cuz we might delete
		for(var i = enemies.length - 1; i >= 0; i--) {
			enemies[i].update();
			enemies[i].display();

			// is it marked for deletion?
			if(enemies[i].deleteMe) {
				enemies.splice(i,1);
			}
		}

	} else {
		// game is over!
		background(255,0,0);
		fill(255,255,0);
		textAlign(CENTER, CENTER);
		textSize(50);
		text("YOU LOSE!", width/2, height/2);
	}

}


// create a class
function Player () {
 
	// internal variables
	this.x = width/2;
	this.y = height/2;

	this.diameter = 80;
 
	this.update = function() {
		// move based on rotation of phone
		// accelerationX, accelerationY, accelerationZ
		// rotationX, rotationY, rotationZ

		this.y += rotationY;
		this.x += rotationX;

		// have we touched the sides?
		if(this.x < 0 || this.x > width) {
			gameOver = true;
		}
		if(this.y < 0 || this.y > height) {
			gameOver = true;
		}

	}

	this.sprite = createSprite(this.x,this.y,this.diameter,this.diameter);
 
	this.display = function() {
		fill(0);
		noStroke();
		ellipse(this.x, this.y, this.diameter, this.diameter);
	}
}




// create a class
function Enemy (x, y, xSpeed, ySpeed, hue) {
 
	// internal variables
	this.x = x;
	this.y = y;
	this.xSpeed = xSpeed;
	this.ySpeed = ySpeed;

	this.shade = hue;

	this.diameter = 40;

	this.deleteMe = false;
 
	this.update = function() {

		// move
		this.x += xSpeed;
		this.y += ySpeed;
		console.log(this.shade);

		// did we touch player?
		var distToPlayer = dist(this.x, this.y, player.x, player.y);
		// if so, lose
		if(distToPlayer < this.diameter/2 + player.diameter/2) {
			player.diameter +=10;
			this.deleteMe = true;
		}

		// have we touched the sides?
		if(this.x < 0 || this.x > width) {
			this.deleteMe = true;	// if so, mark for deletion
		}
		if(this.y < 0 || this.y > height) {
			this.deleteMe = true;
		}
	}
 
	this.display = function() {
		fill(this.shade);
		noStroke();
		ellipse(this.x, this.y, this.diameter, this.diameter);
	}
}
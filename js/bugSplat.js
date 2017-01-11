var menu = document.getElementById("start-menu");
var gameView = document.getElementById("game-view");
var ctx = gameView.getContext("2d");
var level = document.getElementById("level");
var score = document.getElementById("score");
var GAME_MENU = document.getElementById("game-menu");
var HIGH_SCORES = [];
var highScore = document.getElementsByClassName("high-score");

function getHighScore() {
	var high_score = 0;
	for (var i=0; i<HIGH_SCORES.length; i++) {
		if (HIGH_SCORES[i] > high_score) {
			high_score = HIGH_SCORES[i];
		}
	}
	return high_score;
} 

gameView.addEventListener("click", function(event){
	createKillZone(event);
});

var pause_play = document.getElementById("pause-play");
var pause_button = '<button onclick="GAME.pause()" id="pause">| |</button>';
var resume_button = '<button onclick="GAME.resume()" id="resume">&gt;</button>';
pause_play.onclick = function() {
	pause_play.classList.toggle('paused');
	if (pause_play.classList.contains('paused')) {
		// Paused
		pause_play.innerHTML = resume_button;
	} else {
		// Resumed
		pause_play.innerHTML = pause_button;
	}
}

function createKillZone(event) {
	
	var x = event.offsetX;
	var y = event.offsetY;
	var tempKillZone = new killZone(x,y);

	for (var j=GAME.ANTS.colony.length-1; j>=0; j--) {
		if (touching(tempKillZone, GAME.ANTS.colony[j])) {
			var points;
			if (GAME.ANTS.colony[j].type == "ORANGE") {
				points = 1;
			} else if (GAME.ANTS.colony[j].type == "RED") {
				points = 3;
			} else {
				points = 5;
			}
			current_score = score.innerHTML;
			new_score = parseInt(score.innerHTML) + points;
			score.innerHTML = new_score;
			GAME.ANTS.deadAnts.push(GAME.ANTS.colony[j]);
			GAME.ANTS.fadeAnt(GAME.ANTS.deadAnts[GAME.ANTS.deadAnts.length - 1], 1000);
			GAME.ANTS.colony.splice(j, 1);
		}
	}
}

window.GAME = window.GAME || {};

var killZone = function(x,y) {
	this.x = x;
	this.y = y;

	this.x_min = function() { return this.x - 30; };
	this.x_max = function() { return this.x + 30; };
	this.y_min = function() { return this.y - 30; };
	this.y_max = function() { return this.y + 30; };

	this.c1 = function() { return [this.x_min(), this.y_min()]; };
	this.c2 = function() { return [this.x_max(), this.y_min()]; };
	this.c3 = function() { return [this.x_min(), this.y_max()]; };
	this.c4 = function() { return [this.x_max(), this.y_max()]; };	
}

var Ant = function(x, colour) {
	this.type = colour;
	if (colour == "RED") {
		this.colour = '#b20000';
		if (parseInt(level.options[level.selectedIndex].text) == 2) {
			this.speed = 100;
		} else {
			this.speed = 75;
		}
	} else if (colour == "ORANGE") {
		this.colour = '#ffa500';
		if (parseInt(level.options[level.selectedIndex].text) == 2) {
			this.speed = 80;
		} else {
			this.speed = 60;
		}
	} else {
		this.colour = 'black';
		if (parseInt(level.options[level.selectedIndex].text) == 2) {
			this.speed = 200;
		} else {
			this.speed = 150;
		}
	}
	this.x = x;
	this.y = 0;
	this.rotation = 0;
	this.target = [];

	this.x_min = function() { return this.x - 5; };
	this.x_max = function() { return this.x + 5; };
	this.y_min = function() { return this.y - 20; };
	this.y_max = function() { return this.y + 20; };

	this.c1 = function() { return [this.x_min(), this.y_min()]; };
	this.c2 = function() { return [this.x_max(), this.y_min()]; };
	this.c3 = function() { return [this.x_min(), this.y_max()]; };
	this.c4 = function() { return [this.x_max(), this.y_max()]; };

	this.fadeStage = 1;
}

var Pie = function(x, y) {
	this.type = "pie";
	this.x = x;
	this.y = y;

	this.x_min = function() { return this.x - 10; };
	this.x_max = function() { return this.x + 10; };
	this.y_min = function() { return this.y - 10; };
	this.y_max = function() { return this.y + 10; };

	this.c1 = function() { return [this.x_min(), this.y_min()]; };
	this.c2 = function() { return [this.x_max(), this.y_min()]; };
	this.c3 = function() { return [this.x_min(), this.y_max()]; };
	this.c4 = function() { return [this.x_max(), this.y_max()]; };
}

// Used this tutorial as basis: https://viget.com/extend/time-based-animation
GAME.core = {

	startTimer: function() {
		GAME.core.timer = setInterval(function() {
		  updateTimer();
		}, 1000);
	},

	stopTimer: function() {
		clearInterval(GAME.core.timer);
	},

	frame: function() {
		GAME.core.setDelta();
		var game;
		if (game = GAME.core.update()) {
			GAME.core.render();
			GAME.core.animationFrame = window.requestAnimationFrame(GAME.core.frame);
		}
	},

	setDelta: function() {
		GAME.core.now = Date.now();
		GAME.core.delta = (GAME.core.now - GAME.core.then) / 1000;
		GAME.core.then = GAME.core.now;
	},

	update: function() {
		for (var j=0; j<GAME.ANTS.colony.length; j++) {
			var pie = GAME.ANTS.findPie(GAME.ANTS.colony[j]);
			var eating = touching(GAME.ANTS.colony[j], GAME.FOOD.pies[pie]);
			if (eating) {
				var gameover = GAME.FOOD.pieEaten(pie);
				if (gameover) {
					GAME.over();
					return false;
				}
			} else {
				GAME.ANTS.approachTarget(GAME.ANTS.colony[j]);
			}
		}
		for (var k=0; k<GAME.ANTS.deadAnts.length; k++) {

		}

		return true;
	},

	render: function() {
		ctx.clearRect(0, 0, gameView.width, gameView.height);
		for (var i=0; i<GAME.FOOD.pies.length; i++) {
			drawFood(GAME.FOOD.pies[i].x, GAME.FOOD.pies[i].y);
		}
		for (var j=0; j<GAME.ANTS.colony.length; j++) {
			drawAnt(GAME.ANTS.colony[j].x, GAME.ANTS.colony[j].y, GAME.ANTS.colony[j].colour, GAME.ANTS.colony[j].fadeStage, GAME.ANTS.colony[j].rotation);
		}
		for (var k=0; k<GAME.ANTS.deadAnts.length; k++) {
			drawAnt(GAME.ANTS.deadAnts[k].x, GAME.ANTS.deadAnts[k].y, GAME.ANTS.deadAnts[k].colour, GAME.ANTS.deadAnts[k].fadeStage, GAME.ANTS.deadAnts[k].rotation);
		}
	}
}

GAME.ANTS = {
	colony: [],
	deadAnts: [],

	getSpawnTime: function() {
		GAME.ANTS.antSpawn = getRandomIntInclusive(1, 3);
	},

	getAntColour: function() {
		var num = Math.random();
		if (num < 0.3) {
			return "BLACK";
		} else if (num < 0.6) {
			return "RED";
		} else {
			return "ORANGE";
		}
	},

	fadeAnt: function(ant, time) {
		if (time == 0) {
			ant.fadeStage = 0;
		} else {
			ant.fadeStage -= 0.5;
			setTimeout(function() {
				GAME.ANTS.fadeAnt(ant, time - 500);
			}, 1000);
		}
	},

	createAnt: function(time) {
		GAME.ANTS.getSpawnTime();
		GAME.ANTS.antQueue = setInterval(function() {
			GAME.ANTS.queueAnt();
		}, 1000);
	},

	queueAnt: function() {
		GAME.ANTS.antSpawn = GAME.ANTS.antSpawn - 1;
		if (GAME.ANTS.antSpawn == 0) {
			clearInterval(GAME.ANTS.antQueue);
			var x = getRandomIntInclusive(10, 390);
			var colour = GAME.ANTS.getAntColour();

			GAME.ANTS.colony.push(new Ant(x, colour));
			GAME.ANTS.createAnt();
		}
	},

	findPie: function(ant) {
		var x = ant.x;
		var y = ant.y;
		if (GAME.FOOD.pies[0]) {
			var pie_x = GAME.FOOD.pies[0].x;
			var pie_y = GAME.FOOD.pies[0].y;
		} else {
			return;
		}
		var pie = 0;

		var distance = Math.sqrt(((x-pie_x) * (x-pie_x)) + ((y-pie_y) * (y-pie_y)));
		for (var i=1; i<GAME.FOOD.pies.length; i++) {
			pie_x = GAME.FOOD.pies[i].x;
			pie_y = GAME.FOOD.pies[i].y;

			var new_distance = Math.sqrt(((x-pie_x) * (x-pie_x)) + ((y-pie_y) * (y-pie_y)));
			if (new_distance < distance) {
				distance = new_distance;
				pie = i;
			}
		}

		ant.target = [GAME.FOOD.pies[pie].x, GAME.FOOD.pies[pie].y];
		return pie;
	},

	approachTarget: function(ant) {
		var x = ant.x,
			y = ant.y,
			speed = ant.speed,
			movement = speed * GAME.core.delta;
			target_x = ant.target[0],
			target_y = ant.target[1];
		vx = target_x - x;
		vy = target_y - y;
		distance = Math.sqrt((vx * vx) + (vy * vy));

		var tx = target_x - x,
			ty = target_y - y,
			radians = Math.atan2(tx, ty);

		ant.rotation = Math.PI - radians;

		var vector_x = vx / distance;
		var vector_y = vy / distance;

		px = x + (vector_x * (movement));
		py = y + (vector_y * (movement));

		ant.x = px;
		ant.y = py;
	},
}

GAME.FOOD = {
	// Food only appears in the bottom 480px
	pies : [],

	bakePies : function() {
		for (var i=0; i<5; i++) {
			var x = getRandomIntInclusive(10, 390)
			var y = getRandomIntInclusive(130, 590);
			var pie = new Pie(x, y);

			while (GAME.FOOD.pieOverlapping(pie)) {
				x = getRandomIntInclusive(10, 390)
				y = getRandomIntInclusive(130, 590);
				pie = new Pie(x, y);
			}

			GAME.FOOD.pies.push(new Pie(x, y));
		}
	},

	pieOverlapping: function(pie) {
		for (var i=0; i<GAME.FOOD.pies.length; i++) {
			if (touching(pie, GAME.FOOD.pies[i])) {
				return true;
			}
		}
		return false;
	},

	pieEaten: function(index) {
		GAME.FOOD.pies.splice(index, 1);
		if (GAME.FOOD.pies.length == 0) {
			return true;
		}
		return false;
	}

}

GAME.play = function() {
	GAME.core.startTimer();
	GAME.FOOD.bakePies();
	GAME.ANTS.createAnt();
	GAME.core.then = Date.now();
	GAME.core.frame();
}

GAME.resume = function() {
	GAME.core.startTimer();
	GAME.core.then = Date.now();
	GAME.core.frame();
	console.log("resume");
	GAME.ANTS.createAnt();
}

GAME.pause = function() {
	GAME.core.stopTimer();
	clearInterval(GAME.ANTS.antQueue);
	window.cancelAnimationFrame(GAME.core.animationFrame);
	console.log("pause");
}

GAME.over = function() {
	GAME.FOOD.pies = [];
	GAME.core.stopTimer();
	clearInterval(GAME.ANTS.antQueue);
	window.cancelAnimationFrame(GAME.core.animationFrame);
	HIGH_SCORES.push(parseInt(score.innerHTML));
	[].slice.call(highScore).forEach(function ( div ) {
	    div.innerHTML = getHighScore();
	});

	GAME_MENU.classList.add("active");
}

GAME.exit = function() {
	game.style.display = "none";
	menu.style.display = "inline-block";
}

function updateTimer() {
	var timer = document.getElementById("timer");
	var timeLeft = timer.innerHTML;
	if (timeLeft == 0) {
		if (parseInt(level.options[level.selectedIndex].text) == 2) {
			GAME.over();
		}
		else {
			level.selectedIndex = 1;
			HIGH_SCORES.push(parseInt(score.innerHTML));
			start()
		}
	} else {
		timer.innerHTML = timeLeft - 1;
	}
}

function start() {
	game.style.display = "inline-block";
	menu.style.display = "none";
	var timer = document.getElementById("timer");
	timer.innerHTML = 60;
	score.innerHTML = 0;
	clearInterval(GAME.ANTS.antQueue);
	GAME.ANTS.colony = [];
	GAME.FOOD.pies = [];
	GAME_MENU.classList.remove("active");
	console.log("level: " + level.options[level.selectedIndex].text);
	GAME.play();
	displayLevel();
}

function displayLevel() {
	var level_display = document.getElementById("level-display");
	level_display.innerHTML = level.options[level.selectedIndex].text;
	var levelContainer = document.getElementById("level-container").classList.add("active");
	setTimeout(function() {
		var levelContainer = document.getElementById("level-container").classList.remove("active");
	}, 2000);
}

function touching(obj1, obj2) {
	x_min = obj1.x_min();
	x_max = obj1.x_max();
	y_min = obj1.y_min();
	y_max = obj1.y_max();

	c1 = obj2.c1();
	c2 = obj2.c2();
	c3 = obj2.c3();
	c4 = obj2.c4();
	x = obj2.x;
	y = obj2.y;

	return (( (inbetween(x_min, x_max, c1[0])) && (inbetween(y_min, y_max, c1[1])) ) || 
		( (inbetween(x_min, x_max, c2[0])) && (inbetween(y_min, y_max, c2[1])) ) || 
		( (inbetween(x_min, x_max, c3[0])) && (inbetween(y_min, y_max, c3[1])) ) || 
		( (inbetween(x_min, x_max, c4[0])) && (inbetween(y_min, y_max, c4[1])) )) ||
		( (inbetween(x_min, x_max, x)) && (inbetween(y_min, y_max, y)) );
}

function inbetween(min, max, target) {
	return (min <= target) && (target <= max);
}

function drawFood(x, y) {
	ctx.globalAlpha = 1;
	ctx.strokestyle = 'black';

	ctx.beginPath();
	ctx.fillStyle = '#cc6933';
	ctx.arc(x,y,10,0,1.5*Math.PI);
	ctx.lineTo(x,y);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = '#7c4ef7';
	ctx.arc(x,y,10,1.5*Math.PI,0);
	ctx.lineTo(x,y);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.strokestyle = 'black';
	ctx.moveTo(x-3, y-3);
	ctx.lineTo(x-5, y-5);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokestyle = 'black';
	ctx.moveTo(x+3, y+3);
	ctx.lineTo(x+5, y+5);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.strokestyle = 'black';
	ctx.moveTo(x-3, y+3);
	ctx.lineTo(x-5, y+5);
	ctx.stroke();
}

function drawAnt(x, y, colour, fadeStage, rotation) {
	ctx.strokestyle = colour;
	ctx.globalAlpha = fadeStage;

	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(rotation);

	ctx.save();
	ctx.translate(-1 * x, -1 * y);

	//ANTENNA
	ctx.beginPath();
	ctx.strokestyle = colour;
	ctx.moveTo(x+1, y-14);
	ctx.lineTo(x+3, y-16);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokestyle = colour;
	ctx.moveTo(x-1, y-14);
	ctx.lineTo(x-3, y-16);
	ctx.stroke();
	ctx.closePath();

	// HEAD
	ctx.beginPath();
	ctx.fillStyle = colour;
	ctx.arc(x,y-10,4,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();

	// MAIN BODY
	ctx.save();
	ctx.translate(0,0);
	ctx.scale(1,2);
	ctx.beginPath();
	ctx.fillStyle = colour;
	ctx.arc(x,y/2,3,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.restore();

	// TAIL
	ctx.save();
	ctx.translate(0,0);
	ctx.scale(1,2);
	ctx.beginPath();
	ctx.fillStyle = colour;
	ctx.arc(x,y/2 + 4,3,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.restore();

	// RIGHT LEGS
	ctx.beginPath();
	ctx.moveTo(x, y+2);
	ctx.strokeStyle = colour;
	ctx.lineTo(x+6,y+2);
	ctx.lineTo(x+7, y-1);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(x, y-4);
	ctx.strokeStyle = colour;
	ctx.lineTo(x+6,y-4);
	ctx.lineTo(x+7, y-7);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(x, y+8);
	ctx.strokeStyle = colour;
	ctx.lineTo(x+6,y+8);
	ctx.lineTo(x+7, y+6);
	ctx.stroke();
	ctx.closePath();

	// LEFT LEGS
	ctx.beginPath();
	ctx.moveTo(x, y+2);
	ctx.strokeStyle = colour;
	ctx.lineTo(x-6,y+2);
	ctx.lineTo(x-7, y-1);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(x, y-4);
	ctx.strokeStyle = colour;
	ctx.lineTo(x-6,y-4);
	ctx.lineTo(x-7, y-7);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(x, y+8);
	ctx.strokeStyle = colour;
	ctx.lineTo(x-6,y+8);
	ctx.lineTo(x-7, y+6);
	ctx.stroke();
	ctx.closePath();

	ctx.translate(x, y);
	ctx.restore();

	ctx.rotate(-1 * rotation);
	ctx.translate(-1 * x, -1 * y);
	ctx.restore();

}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
window.onload = function() {

	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		WIDTH = canvas.width = window.innerWidth,
		HEIGHT = canvas.height = window.innerHeight;

	V.init(WIDTH, HEIGHT);

	var xScreenRight = 0,
		xLastUpperObstacle = 0,
		xLastLowerObstacle = 0,
		frameCount = V.STARTING_FRAME_COUNT,
		playerStartedGame = false,
		score = 0,
		highscore = 0,
		xNextUpperObstacle = V.X_OBSTACLE_AVERAGE_DELTA,
		xNextLowerObstacle = V.X_OBSTACLE_AVERAGE_DELTA,
		sound = new Audio("Battle__Mortal_Melee.mp3"),
		theMusic = new Audio("The Strategy - Free Cinematic Music.mp3"),
		thePlayer = player.create(60, V.MARGIN_HEIGHT + V.ACTUAL_HEIGHT*2/3, V.PLAYER_HIDDEN_COLOR, V.PLATFORM_HEIGHT, V.PLATFORM_HEIGHT),
		theShooter = shooter.create(V.WIDTH*4/5, V.SHOOTER_Y_START, V.SHOOTER_RADIUS, V.SHOOTER_COLOR),
		obstacles = [];

	init();
	update();

	function init() {

		document.body.addEventListener("keydown", function(event) {
			playerStartedGame = true;
			switch (event.keyCode) {
				case 38: // up
					thePlayer.jumping = true;
					break;
				case 40: // down
					thePlayer.standing = true;
					break;
				case 37: // left
					thePlayer.movingLeft = true;
					break;
				case 39: // right
					thePlayer.movingRight = true;
					break;
				default:
					break;
			}
		});

		document.body.addEventListener("keyup", function(event) {
			switch (event.keyCode) {
				case 38: // up
					thePlayer.jumping = false;
					break;
				case 40: // down
					thePlayer.standing = false;
					break;
				case 37: // left
					thePlayer.movingLeft = false;
					break;
				case 39: // right
					thePlayer.movingRight = false;
					break;
				default:
					break;
			}
		});

		for (var x = -V.WIDTH; x <= 0; x += Math.random() * 5) {
			var pos = vector.create(V.WIDTH+x, V.HEIGHT-V.MARGIN_HEIGHT),
				size = V.PLATFORM_HEIGHT * Math.floor(Math.pow(Math.random() * 0.7 + 1.5, 2)),
				model = [
					vector.create(0, 0),
					vector.create(size, -size),
					vector.create(size, 0)
				],
				color = V.OBSTACLE_COLOR,
				poly = polygon.create(pos, model, color, size, size);

			obstacles.push(poly);
		}


		if(theMusic.readyState > 0)
    		theMusic.currentTime = 0;
		theMusic.play();
	}

	function update() {

		if (playerStartedGame) {
			frameCount++;
			xScreenRight += V.X_SCREEN_SPEED_PER_FRAME;

			handlePlayer();
			handleObstacles();
			handleCollisions();
			handleShooter();

			if (sound != null && sound.currentTime > 0.2) {
				sound.pause();
			}
		}

		if(theMusic.readyState > 0)
			if (theMusic.currentTime > 100)
    			theMusic.currentTime = 0.5;

		drawBackground();
		drawScore();
		
		// draw obstacles
		for (var i = 0; i < obstacles.length; i++) {
			GraphicsUtils.drawPoly(context, obstacles[i]);
		}

		if (frameCount < V.STARTING_FRAME_COUNT/2)
			drawInstructions();

		// draw player
		if (thePlayer.visible)
			GraphicsUtils.drawPoly(context, thePlayer.poly);
		else
			GraphicsUtils.drawPoly(context, thePlayer.poly, thePlayer.hiddenColor);

		// draw shooter
		GraphicsUtils.drawTarget(context, theShooter.part.pos.x, theShooter.part.pos.y, theShooter.radius, theShooter.color);

		requestAnimationFrame(update);
	}

	function drawInstructions() {

		context.font = String(V.FONT_SIZE) + "px Georgia";
		context.fillStyle = V.PLAYER_VISIBLE_COLOR;
		context.fillText("Press [left] / [right] to accelerate",200,V.MARGIN_HEIGHT+V.FONT_SIZE);
		context.fillText("Press [up] to jump",200,V.MARGIN_HEIGHT+2*V.FONT_SIZE);
		context.fillText("Press [down] to stand",200,V.MARGIN_HEIGHT+3*V.FONT_SIZE);
		context.fillText("Avoid being shot as long as possible",200,V.MARGIN_HEIGHT+4*V.FONT_SIZE);
		context.fillText("The shooter can't see you while you're covered by the panels",200,V.MARGIN_HEIGHT+5*V.FONT_SIZE);
		
		// show "press any..." if at the first frame
		if (playerStartedGame == false) {
			context.fillStyle = V.SHOOTER_COLOR;
			context.font = String(V.FONT_SIZE*3/2) + "px Georgia";
			context.fillText("Press any key when you feel ready. Good luck! ;)",200,V.MARGIN_HEIGHT+6.5*V.FONT_SIZE);
		}
	}

	function drawBackground() {

		context.clearRect(0, 0, WIDTH, HEIGHT);
		context.fillStyle = V.MARGIN_COLOR;
		context.fillRect(0, 0, V.WIDTH, V.MARGIN_HEIGHT);
		context.fillRect(0, V.HEIGHT, V.WIDTH, -V.MARGIN_HEIGHT);
		context.fillStyle = V.BACKGROUND_NORMAL_COLOR;
		context.fillRect(0, V.MARGIN_HEIGHT, V.WIDTH, V.HEIGHT-2*V.MARGIN_HEIGHT);
	}

	function drawScore() {

		if (frameCount - theShooter.lastShotFrame == 0 && theShooter.lastShotFrame != 0)
			highscore = Math.max(highscore, score);
		score = frameCount - theShooter.lastShotFrame;

		context.font = "20px Georgia";
		context.fillStyle = "#000";
		context.fillText("Highscore: "+highscore,10,V.MARGIN_HEIGHT+20);
		context.fillText("Score: "+score,10,V.MARGIN_HEIGHT+22+20);
	}

	function handlePlayer() {
		
		// check inputs: 1)jumping
		if (thePlayer.jumping && thePlayer.poly.part.pos.y == V.HEIGHT-V.MARGIN_HEIGHT) {
			thePlayer.poly.part.accelerate(V.PLAYER_JUMP_SPEED_VECTOR);
		}

		// check inputs: 2)standing
		if (thePlayer.standing && thePlayer.poly.part.pos.y == V.HEIGHT-V.MARGIN_HEIGHT) {
			thePlayer.poly.part.velocity.y = 0;
			thePlayer.poly.part.friction.x = V.PLAYER_DUCK_FRICTION;
		} else if (thePlayer.poly.part.pos.y == V.HEIGHT-V.MARGIN_HEIGHT) {
			thePlayer.poly.part.friction.x = V.PLAYER_MOVE_FRICTION;
		} else {
			thePlayer.poly.part.friction.x = 0;
		}
		
		// check inputs: 3)moving right
		if (thePlayer.movingRight && thePlayer.poly.part.pos.y == V.HEIGHT-V.MARGIN_HEIGHT) {
			thePlayer.poly.part.accelerate(V.PLAYER_MOVE_ACCELERATION_VECTOR);
		}

		// check inputs: 4)moving left
		if (thePlayer.movingLeft && thePlayer.poly.part.pos.y == V.HEIGHT-V.MARGIN_HEIGHT) {
			thePlayer.poly.part.accelerate(V.PLAYER_MOVE_DECCELERATION_VECTOR);
		}

		// check if player is visible
		thePlayer.visible = true;
		for (var i = 0; i < obstacles.length; i++) {
			var obstacle = obstacles[i];
			
			if (obstacle.hasPolyInside(thePlayer.poly)) {
				thePlayer.visible = false;
				break;
			}
		}

		// update 
		thePlayer.poly.part.update();
	}

	function handleObstacles() {
		
		// update the current obstacles
		for (var i = 0; i < obstacles.length; i++) {
			var obstacle = obstacles[i];
			obstacle.part.pos.x -= V.X_SCREEN_SPEED_PER_FRAME;
			if (obstacle.part.pos.x + obstacle.width < 0) {
				obstacles.splice(i, 1);
			}
		}

		// create a new obstacle if neccesary
		if (xNextLowerObstacle < xScreenRight) {
			xNextLowerObstacle = xScreenRight + V.X_OBSTACLE_AVERAGE_DELTA + (2*Math.random()-1) * V.X_OBSTACLE_DISPERSION_DELTA;

			var pos = vector.create(V.WIDTH, V.HEIGHT-V.MARGIN_HEIGHT),
				size = V.PLATFORM_HEIGHT * Math.floor(Math.pow(Math.random() * 0.7 + 1.5, 2)),
				model = [
					vector.create(0, 0),
					vector.create(size, -size),
					vector.create(size, 0)
				],
				color = V.OBSTACLE_COLOR,
				poly = polygon.create(pos, model, color, size, size);

			obstacles.push(poly);
		}	
	}

	function handleCollisions() {

		if (thePlayer.poly.part.pos.y > V.HEIGHT-V.MARGIN_HEIGHT) {
			thePlayer.poly.part.pos.y = V.HEIGHT-V.MARGIN_HEIGHT;
			thePlayer.poly.part.velocity.y *= -0.5;
		}

		if (thePlayer.poly.part.pos.y - thePlayer.poly.height < V.MARGIN_HEIGHT) {
			thePlayer.poly.part.pos.y = V.MARGIN_HEIGHT + thePlayer.poly.height;
			thePlayer.poly.part.velocity.mulTo(-0);
		}

		if (thePlayer.poly.part.pos.x + thePlayer.poly.width > V.WIDTH) {
			thePlayer.poly.part.pos.x = V.WIDTH - thePlayer.poly.width;
			thePlayer.poly.part.velocity.x = 0;
		}

		if (thePlayer.poly.part.pos.x < 0) {
			thePlayer.poly.part.pos.x = 0;
			thePlayer.poly.part.velocity.x = 0;
		}
	}

	function handleShooter() {

		// handle movement horizontally
		if (thePlayer.visible || theShooter.followingTargetX) {
			theShooter.followingTargetX = true;
			theShooter.targetX = thePlayer.poly.part.pos.x + thePlayer.poly.width * 3 / 4;

			if (theShooter.targetX > theShooter.part.pos.x) {
				if (theShooter.part.velocity.x < 0) {
					theShooter.part.friction.x = V.SHOOTER_FRICTION;
				} else {
					theShooter.part.friction.x = 0;
				}
				theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_RIGHT_VECTOR);
				if (theShooter.targetX < theShooter.part.afterUpdatePos().x) {
					theShooter.followingTargetX = false;
				}
			} else {
				if (theShooter.part.velocity.x > 0) {
					theShooter.part.friction.x = V.SHOOTER_FRICTION;
				} else {
					theShooter.part.friction.x = 0;
				}
				theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_LEFT_VECTOR);
				if (theShooter.targetX > theShooter.part.afterUpdatePos().x) {
					theShooter.followingTargetX = false;
				}
			}

			theShooter.part.velocity.x = MathUtils.clamp(theShooter.part.velocity.x, -V.SHOOTER_MAX_SPEED, V.SHOOTER_MAX_SPEED);
		} else {
			if (theShooter.part.pos.x + theShooter.radius < 0) {
				theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_RIGHT_VECTOR);
			} else if (theShooter.part.pos.x - theShooter.radius > V.WIDTH) {
				theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_LEFT_VECTOR);
			} else {
				if (theShooter.part.velocity.x >= 0) {
					if (theShooter.part.velocity.x > V.SHOOTER_AVG_SPEED) {
						theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_LEFT_VECTOR);
						if (theShooter.part.velocity.x < V.SHOOTER_AVG_SPEED) {
							theShooter.part.velocity.x = V.SHOOTER_AVG_SPEED
						}
					} else if (theShooter.part.velocity.x < V.SHOOTER_AVG_SPEED) {
						theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_RIGHT_VECTOR);
						if (theShooter.part.velocity.x > V.SHOOTER_AVG_SPEED) {
							theShooter.part.velocity.x = V.SHOOTER_AVG_SPEED
						}
					}
				} else {
					if (theShooter.part.velocity.x < -V.SHOOTER_AVG_SPEED) {
						theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_RIGHT_VECTOR);
						if (theShooter.part.velocity.x > -V.SHOOTER_AVG_SPEED) {
							theShooter.part.velocity.x = -V.SHOOTER_AVG_SPEED
						}
					} else if (theShooter.part.velocity.x > -V.SHOOTER_AVG_SPEED) {
						theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_LEFT_VECTOR);
						if (theShooter.part.velocity.x < -V.SHOOTER_AVG_SPEED) {
							theShooter.part.velocity.x = -V.SHOOTER_AVG_SPEED
						}
					}
				}
			}
		}

		// handle movement vertically
		if (thePlayer.visible || theShooter.followingTargetY) {
			theShooter.followingTargetY = true;
			theShooter.targetY = thePlayer.poly.part.pos.y - thePlayer.poly.height / 2;

			if (theShooter.targetY > theShooter.part.pos.y) {
				if (theShooter.part.velocity.y < 0) {
					theShooter.part.friction.y = V.SHOOTER_FRICTION;
				} else {
					theShooter.part.friction.y = 0;
				}
				theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_DOWN_VECTOR);
				if (theShooter.targetY < theShooter.part.afterUpdatePos().y) {
					theShooter.followingTargetY = false;
				}
			} else {
				if (theShooter.part.velocity.y > 0) {
					theShooter.part.friction.y = V.SHOOTER_FRICTION;
				} else {
					theShooter.part.friction.y = 0;
				}
				theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_UP_VECTOR);
				if (theShooter.targetY > theShooter.part.afterUpdatePos().y) {
					theShooter.followingTargetY = false;
				}
			}

			theShooter.part.velocity.y = MathUtils.clamp(theShooter.part.velocity.y, -V.SHOOTER_MAX_SPEED, V.SHOOTER_MAX_SPEED);
		} else {

			theShooter.targetY = V.MARGIN_HEIGHT + V.ACTUAL_HEIGHT - thePlayer.poly.height / 2;
			
			if (theShooter.targetY > theShooter.part.pos.y) {
				if (theShooter.part.velocity.y < 0) {
					theShooter.part.friction.y = V.SHOOTER_FRICTION;
				} else {
					theShooter.part.friction.y = 0;
				}
				theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_DOWN_VECTOR);
				if (theShooter.targetY < theShooter.part.afterUpdatePos().y) {
					theShooter.followingTargetY = false;
				}
			} else {
				if (theShooter.part.velocity.y > 0) {
					theShooter.part.friction.y = V.SHOOTER_FRICTION;
				} else {
					theShooter.part.friction.y = 0;
				}
				theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_UP_VECTOR);
				if (theShooter.targetY > theShooter.part.afterUpdatePos().y) {
					theShooter.followingTargetY = false;
				}
			}

			theShooter.part.velocity.y = MathUtils.clamp(theShooter.part.velocity.y, -V.SHOOTER_MAX_SPEED, V.SHOOTER_MAX_SPEED);
			/*
			if (theShooter.part.pos.y + theShooter.radius < V.MARGIN_HEIGHT) {
				theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_DOWN_VECTOR);
			} else if (theShooter.part.pos.y - theShooter.radius > V.MARGIN_HEIGHT + V.ACTUAL_HEIGHT) {
				theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_UP_VECTOR);
			} else {
				if (theShooter.part.velocity.y >= 0) {
					if (theShooter.part.velocity.y > V.SHOOTER_AVG_SPEED) {
						theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_UP_VECTOR);
						if (theShooter.part.velocity.y < V.SHOOTER_AVG_SPEED) {
							theShooter.part.velocity.y = V.SHOOTER_AVG_SPEED
						}
					} else if (theShooter.part.velocity.y < V.SHOOTER_AVG_SPEED) {
						theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_DOWN_VECTOR);
						if (theShooter.part.velocity.y > V.SHOOTER_AVG_SPEED) {
							theShooter.part.velocity.y = V.SHOOTER_AVG_SPEED
						}
					}
				} else {
					if (theShooter.part.velocity.y < -V.SHOOTER_AVG_SPEED) {
						theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_DOWN_VECTOR);
						if (theShooter.part.velocity.y > -V.SHOOTER_AVG_SPEED) {
							theShooter.part.velocity.y = -V.SHOOTER_AVG_SPEED
						}
					} else if (theShooter.part.velocity.y > -V.SHOOTER_AVG_SPEED) {
						theShooter.part.accelerate(V.SHOOTER_MOVE_ACCELERATE_UP_VECTOR);
						if (theShooter.part.velocity.y < -V.SHOOTER_AVG_SPEED) {
							theShooter.part.velocity.y = -V.SHOOTER_AVG_SPEED
						}
					}
				}
			}
			*/
		}
		

		// try to shoot player
		if (thePlayer.visible) {
			if (frameCount - theShooter.lastShotFrame > V.SHOOTER_SHOOT_DELAY_FRAMES) {
				if (thePlayer.poly.hasPointInside(theShooter.part.pos)) {
					sound.currentTime = 0;
					sound.play();

					theMusic.currentTime = 0.5;
					theMusic.play();

					theShooter.lastShotFrame = frameCount;
				}
			}
		}

		// update shooter
		theShooter.part.update();
	}
};


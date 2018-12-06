const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const print = document.getElementById("print");

var gameStarted = false;

var gameTicks = 0;

var keys = {
    space: 0,
    left: 0,
    up: 0,
    right: 0,
    down: 0,
};

document.addEventListener("keydown", function (event) {
    if (event.keyCode == 32) keys.space = 1;
    if (event.keyCode == 37) keys.left = 1;
    if (event.keyCode == 38) keys.up = 1;
    if (event.keyCode == 39) keys.right = 1;
    if (event.keyCode == 40) keys.down = 1;
})
document.addEventListener("keyup", function (event) {
    if (event.keyCode == 32) keys.space = 0;
    if (event.keyCode == 37) keys.left = 0;
    if (event.keyCode == 38) keys.up = 0;
    if (event.keyCode == 39) keys.right = 0;
    if (event.keyCode == 40) keys.down = 0;
})
var player = {
    x: 50,
    y: canvas.height / 2,
    width: 32,
    height: 20,
    moveSpeed: 2,
    hp: 100,
    score: 0,
    shotCooldown: 0,
}

var projectiles = new Array;

var enemies = new Array;

function startGame() {
    gameLoop();
    gameStarted = true;
}

gameLoop();

function gameLoop() {
    requestAnimationFrame(gameLoop);
    tick();
    render();
}

function tick() {
    console.log("");
    gameTicks++;
    if (keys.space && player.shotCooldown <= 0) shoot();
    if (keys.left) player.x -= player.moveSpeed;
    if (keys.up) player.y -= player.moveSpeed;
    if (keys.right) player.x += player.moveSpeed;
    if (keys.down) player.y += player.moveSpeed;

    //projectile logic
    for (i = 0; i < projectiles.length; i++) {
        projectiles[i].x += projectiles[i].speed;
        if (projectiles[i].x > canvas.width) projectiles.shift();
    }
    if (player.shotCooldown) player.shotCooldown--;

    //enemy logic
    if (gameTicks > 1000) spawnEnemy();

    for (i = 0; i < enemies.length; i++) {
        enemies[i].x -= enemies[i].speed;

        for (j = 0; j < projectiles.length; j++) {
        }
    }
}

function render() {
    //clear canvas
    ctx.fillStyle = "#012";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //draw player
    ctx.fillStyle = "#f00";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    //draw projectiles
    for (i = 0; i < projectiles.length; i++) {
        ctx.fillRect(projectiles[i].x, projectiles[i].y, projectiles[i].width, projectiles[i].height);
    }

    //draw enemies
    for (i = 0; i < enemies.length; i++) {
        ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
    }

    /*  UI  */

    //health
    ctx.fillStyle = "#333";
    ctx.fillRect(5, 5, 110, 20);
    ctx.fillStyle = "#000";
    ctx.fillRect(10, 10, 100, 10);
    ctx.fillStyle = "#0f0";
    ctx.fillRect(10, 10, player.hp, 10);
    ctx.fillStyle = "#000";
    ctx.textBaseline = "hanging"
    ctx.fillText(player.hp, 10, 10);

    //score
    ctx.fillStyle = "#fff";
    ctx.fillText("SCORE: " + player.score, 10, 30);
}

function shoot() {
    projectiles.push({
        x: player.x + (player.width / 2),
        y: player.y + (player.height / 2),
        width: 5,
        height: 5,
        speed: 5,
        active: true,
        firedByPlayer: true,
    });
    player.shotCooldown = 15;
}

function spawnEnemy() {
    gameTicks = 0;
    enemies.push({
        x: canvas.width + 50,
        y: Math.random() * canvas.height,
        width: 32,
        height: 32,
        speed: 1,
        hp: 50,
    })
}
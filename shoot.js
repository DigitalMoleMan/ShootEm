const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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
});
document.addEventListener("keyup", function (event) {
    if (event.keyCode == 32) keys.space = 0;
    if (event.keyCode == 37) keys.left = 0;
    if (event.keyCode == 38) keys.up = 0;
    if (event.keyCode == 39) keys.right = 0;
    if (event.keyCode == 40) keys.down = 0;
});
var gameTicks = new Number;
var rand = new Number;
var player = new Object;
var projectile = new Object;
var projectiles = new Array;
//enemies
var enemyTypes = new Array;
var enemyList = new Array;
var enemies = new Array;
//ui
var gui = new Object;



init();

function init() {
    gameTicks = 0;
    canvas.color = "#001020";
    canvas.x = 0;
    canvas.y = 0;
    player = {
        name: "player",
        color: "#0ff",
        x: 50,
        y: canvas.height / 2,
        width: 32,
        height: 32,
        damage: 10,
        firerate: 4,
        speed: 1,
        xSpeed: 0,
        ySpeed: 0,
        hp: 100,
        score: 0,
        shotCooldown: 0,
        projectile: {
            color: "#f00",
            width: 16,
            height: 4,
            damage: 10,
            xSpeed: 5,
            ySpeed: 0,
        },
    };


    enemyTypes = [{
        name: "basic",
        color: "#f00",
        width: 32,
        height: 32,
        xSpeed: -1,
        ySpeed: 0,
        hp: 50,
        scoreOnKill: 100,
        projectile: {
            color: "#f00",
            width: 16,
            height: 4,
            damage: 10,
            xSpeed: -5,
            ySpeed: 0,
        },
        spawnFreq: 50,
    }, {
        name: "speedy",
        color: "#f00",
        width: 48,
        height: 24,
        xSpeed: -2,
        ySpeed: 0,
        hp: 30,
        scoreOnKill: 25,
        projectile: {
            color: "#f00",
            width: 16,
            height: 4,
            damage: 10,
            xSpeed: -5,
            ySpeed: 0,
        },
        spawnFreq: 25,
    }, {
        name: "tank",
        color: "#f00",
        width: 64,
        height: 48,
        xSpeed: -.5,
        ySpeed: 0,
        hp: 150,
        scoreOnKill: 150,
        projectile: {
            color: "#f00",
            width: 16,
            height: 4,
            damage: 10,
            xSpeed: -5,
            ySpeed: 0,
        },
        spawnFreq: 10,
    }, ]

    for (i = 0; i < enemyTypes.length; i++) {
        for (j = 0; j < enemyTypes[i].spawnFreq; j++) {
            enemyList.push(i);
        };
    };

    gui = {
        healthBar: {
            color: "#0f0",
            x: 10,
            y: 10,
            width: player.hp,
            height: 10,
        },
        scoreCounter: {
            x: 10,
            y: 30,
        },
    }
    gameLoop();
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    tick();
    render();
}

function tick() {
    updateVariables();
    if (keys.space && player.shotCooldown <= 0) shootProjectile(player);
    if (keys.left) player.xSpeed -= player.speed;
    if (keys.up) player.ySpeed -= player.speed;
    if (keys.right) player.xSpeed += player.speed;
    if (keys.down) player.ySpeed += player.speed;

    player.xSpeed /= 1.2;
    player.ySpeed /= 1.2;

    move(player);

    updateProjectiles();

    //enemy logic
    if (gameTicks > 250 - (player.score / 100)) spawnEnemies();

    updateEnemies();
}

function updateVariables() {
    gameTicks++;
    gui.healthBar.width = player.hp;
}

function move(obj) {
    obj.x += obj.xSpeed;
    obj.y += obj.ySpeed;
}

function checkCollision(objA, objB) {
    if (objA.x + objA.width > objB.x && objA.x < objB.x + objB.width &&
        objA.y + objA.height > objB.y && objA.y < objB.y + objB.height) {
        return (true);
    } else {
        return (false);
    }
}

function shootProjectile(obj) {
    projectiles.push({
        color: obj.projectile.color,
        x: obj.x + (obj.width / 2),
        y: obj.y + (obj.height / 2) - (obj.projectile.height / 2),
        width: obj.projectile.width,
        height: obj.projectile.height,
        damage: obj.projectile.damage,
        xSpeed: obj.projectile.xSpeed,
        ySpeed: obj.projectile.ySpeed,
        firedBy: obj.name,
    });
    console.log(projectiles);
    player.shotCooldown = 100;

}

function updateProjectiles() {
    for (i = 0; i < projectiles.length; i++) {
        move(projectiles[i]);
        if (projectiles[i].x > canvas.width ||
            projectiles[i].x < canvas.x) {
            projectiles.splice(i, 1);
        }
    }
    if (player.shotCooldown) player.shotCooldown -= player.firerate;
}

function spawnEnemies() {
    gameTicks = 0;
    var enemyType = enemyTypes[enemyList[Math.floor(Math.random() * enemyList.length)]];
    enemies.push({
        name: enemyType.name,
        color: enemyType.color,
        x: canvas.width + Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: enemyType.width,
        height: enemyType.height,
        xSpeed: enemyType.xSpeed,
        ySpeed: enemyType.ySpeed,
        hp: enemyType.hp,
        scoreOnKill: enemyType.scoreOnKill,
        projectile: enemyType.projectile,
        lifetime: 0,
    });
}

function updateEnemies() {
    for (i = 0; i < enemies.length; i++) {
        enemies[i].lifetime++;
        enemies[i].color = "#f00";
        if (enemies[i].hp <= 0) {
            player.score += enemies[i].scoreOnKill;
            killEnemy(i);
        } else if ((enemies[i].x + enemies[i].width) < 0) { //remove enemies upon reaching the left side of the screen.
            killEnemy(i);
        } else if (checkCollision(enemies[i], player)) {
            player.hp -= enemies[i].hp;
            killEnemy(i);
        } else {

            move(enemies[i]);

            if (enemies[i].lifetime > 250) {
                shootProjectile(enemies[i]);
                enemies[i].lifetime = 0;
            }

            for (j = 0; j < projectiles.length; j++) {

                if (projectiles[j].firedBy == "player" && checkCollision(enemies[i], projectiles[j])) {
                    enemies[i].color = "#fff";
                    enemies[i].hp -= projectiles[j].damage;
                    projectiles.splice(j, 1);
                }
            }
        }
    }
}

function killEnemy(i) {
    enemies.splice(i, 1);
}

function render() {
    //clear canvas
    draw(canvas);

    //draw projectiles
    for (i = 0; i < projectiles.length; i++) {
        draw(projectiles[i]);
    };

    //draw player
    draw(player);

    //draw enemies
    for (i = 0; i < enemies.length; i++) {
        draw(enemies[i]);
    };

    /*  UI  */

    //health
    draw(gui.healthBar)
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "hanging"
    ctx.fillText(player.hp + "%", player.hp + 10, 10);

    //score
    ctx.fillStyle = "#fff";
    ctx.fillText("SCORE: " + player.score, 10, 30);
}

function draw(shape) {
    ctx.fillStyle = shape.color;
    ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
}
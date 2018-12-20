//canvas setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;


//input setup
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

var compatMode = 0; //compatability mode - disables features that might not work on all devices/browsers.
var gameStarted = false;
//images
var imageCollection = new Array

//game state
var gameOver = new Boolean;
var gameTicks = new Number;
var score = new Object;

//background
var background = new Object;

//player
var player = new Object;
var damageBuffer = new Number;

//enemies
var enemyTypes = new Array;
var enemyList = new Array;
var enemies = new Array;

//projectiles
var projectile = new Object;
var projectiles = new Array;

//ui
var gui = new Object;


init();

function init() {
    if (!compatMode) {
        imageCollection = document.images;
    }

    gameOver = false;
    gameTicks = 100;
    score = {
        total: 0,
        multiplier: 1.00,
    }
    canvas.color = "#000";
    canvas.x = 0;
    canvas.y = 0;

    background1 = {
        image: {
            src: imageCollection[1],
            x: 0,
            y: 0,
            width: 1024,
            height: 350,
            scale: true,
        },
    }
    background2 = {
        image: {
            src: imageCollection[1],
            x: 1024,
            y: 0,
            width: 1024,
            height: 350,
            scale: true,
        }
    }

    player = {
        name: "player",
        role: "player",
        color: "#0ff",
        image: {
            src: imageCollection[0],
            x: 50,
            y: canvas.height / 2,
            scale: false,
        },
        x: 50,
        y: canvas.height / 2,
        width: 16,
        height: 48,
        firerate: 4,
        speed: 1,
        xSpeed: 0,
        ySpeed: 0,
        hp: 100,
        shotCooldown: 0,
        projectile: {
            color: "#fff",
            width: 16,
            height: 4,
            damage: 10,
            xSpeed: 10,
            ySpeed: 0,
        },

    };
    damageBuffer = 0;

    enemyTypes = [{
        name: "basic",
        color: "#f00",
        width: 32,
        height: 32,
        xSpeed: -1,
        ySpeed: 0,
        hp: 50,
        pointsOnKill: 100,
        firerate: .25,
        projectile: {
            color: "#f0f",
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
        xSpeed: -3,
        ySpeed: 0,
        hp: 30,
        pointsOnKill: 50,
        firerate: 0,
        projectile: "none",
        spawnFreq: 35,
    }, {
        name: "tank",
        color: "#f00",
        width: 64,
        height: 48,
        xSpeed: -.5,
        ySpeed: 0,
        hp: 150,
        pointsOnKill: 150,
        firerate: .5,
        projectile: {
            color: "#f0f",
            width: 16,
            height: 12,
            damage: 25,
            xSpeed: -3,
            ySpeed: 0,
        },
        spawnFreq: 15,
    }, ]

    for (i = 0; i < enemyTypes.length; i++) {
        for (j = 0; j < enemyTypes[i].spawnFreq; j++) {
            enemyList.push(i);
        };
    };

    gui = {
        startMessage: {
            text: "ASSERT DOMINANCE!",
            x: canvas.width / 2,
            y: canvas.height / 2,
            font: "50px Arial",
            align: "center",
            baseline: "middle",
            duration: 100,
        },
        healthBar: {
            label: {
                text: "POWER:",
                x: 10,
                y: 10,
                font: "10px monospace",
                color: "#fff",
                align: "left",
                baseline: "top",
            },
            background: {
                color: "#000",
                x: 45,
                y: 10,
                width: (player.hp * 2) + 3,
                height: 10,
            },
            meter: {
                color: "#0f0",
                x: 10,
                y: 10,
                width: player.hp * 2,
                height: 10,
            },
        },
        scoreCounter: {
            label: {
                text: "SCORE:",
                x: 10,
                y: 30,
                font: "10px monospace",
                color: "#fff",
                align: "left",
                baseline: "top",
            },
            counter: {
                text: score.total,
                x: 50,
                y: 30,
                font: "10px monospace",
                color: "#fff",
                align: "left",
                baseline: "top",
            }
        },
        scoreMultiplier: {
            font: "10px monospace",
            color: "#fff",
            align: "left",
            baseline: "top",
            text: "x" + score.multiplier,
            x: 10,
            y: 50,
        },
        gameOverMessage: {
            text: "Game Over",
            color: "#fff",
            x: canvas.width / 2,
            y: canvas.height / 2,
            font: "50px Arial",
            align: "center",
            baseline: "middle",
        },
    }
    gameLoop();
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    if (!gameStarted) {
        draw(canvas);
        ctx.fillStyle = "#fff";
        ctx.font = "30px monospace"
        ctx.textAlign = "center";
        ctx.fillText("Press SPACE to start!", canvas.width / 2, canvas.height / 2);
        if (keys.space) gameStarted = true;
    } else {
        tick();
        render();
    }
}

function tick() {
    updateVariables();
    updatePlayer();
    updateProjectiles();
    updateEnemies();
}

function updateVariables() {
    gameTicks++;
    if (!compatMode) {
        background1.image.x -= 2;
        background1.image.x %= 1024;
        background2.image.x = background1.image.x + background1.image.width;
    }

    if (gui.startMessage.duration) gui.startMessage.duration--;
    gui.healthBar.width = player.hp;
    gui.scoreCounter.counter.text = score.total;
    gui.scoreMultiplier.text = "x" + score.multiplier;
}

function updatePlayer() {
    if (damageBuffer) {
        player.hp--;
        damageBuffer--;
    }
    if (player.hp > 0) {
        if (keys.space && player.shotCooldown <= 0) shootProjectile(player);
        if (keys.left) player.xSpeed -= player.speed;
        if (keys.up) player.ySpeed -= player.speed;
        if (keys.right) player.xSpeed += player.speed;
        if (keys.down) player.ySpeed += player.speed;
        player.xSpeed /= 1.2;
        player.ySpeed /= 1.2;

        if (player.shotCooldown) player.shotCooldown -= player.firerate;

        move(player);
        if (!compatMode) {
            player.image.x = player.x - 16;
            player.image.y = player.y;
        }
    } else {
        gameOver = true;
    }
}

function updateProjectiles() {
    for (i = 0; i < projectiles.length; i++) {
        if (projectiles[i].x > canvas.width ||
            projectiles[i].x + projectiles[i].width < canvas.x) {
            projectiles.splice(i, 1);
        } else {

            move(projectiles[i]);

            if (projectiles[i].firedBy == "enemy" && checkCollision(player, projectiles[i])) {
                player.color = "#fff";
                damageBuffer += projectiles[i].damage;
                score.multiplier = 1;
                projectiles.splice(i, 1);
            } else {
                for (j = 0; j < enemies.length; j++) {
                    //console.log(projectiles[i].firedBy);
                    if (projectiles[i].firedBy == "player" && checkCollision(enemies[j], projectiles[i])) {
                        enemies[j].color = "#fff";
                        enemies[j].hp -= projectiles[i].damage;

                        projectiles.splice(i, 1);
                    }
                }
            }
        }
    }
}

function updateEnemies() {

    if (gameTicks > 250 - (score.total / 100)) spawnEnemies();

    for (i = 0; i < enemies.length; i++) {
        var enemy = enemyTypes[enemies[i].type];
        if (enemies[i].hp <= 0) {
            addPoints(enemy.pointsOnKill);
            killEnemy(i);

        } else if ((enemies[i].x + enemies[i].width) < 0) { //remove enemies upon reaching the left side of the screen.
            killEnemy(i);

        } else if (checkCollision(enemies[i], player)) {
            damageBuffer += enemies[i].hp;
            killEnemy(i);
        } else {
            move(enemies[i]);

            if (enemies[i].shotCooldown) enemies[i].shotCooldown -= enemy.firerate;

            if (!enemies[i].shotCooldown) {
                shootProjectile(enemies[i]);
                enemies[i].shotCooldown = 100;
            }
        }
    }
}

function shootProjectile(obj) {
    projectiles.push({
        color: obj.projectile.color,
        x: obj.x + (obj.width / 2),
        y: obj.y + (obj.height / 2) - (obj.projectile.damage / 2),
        width: obj.projectile.damage,
        height: obj.projectile.damage,
        damage: obj.projectile.damage,
        xSpeed: obj.projectile.xSpeed,
        ySpeed: obj.projectile.ySpeed,
        firedBy: obj.role,
    });
    obj.shotCooldown = 100;
}

function spawnEnemies() {
    gameTicks = 0;
    var setType = enemyList[Math.floor(Math.random() * enemyList.length)];
    var enemyType = enemyTypes[setType];
    enemies.push({
        type: setType,
        name: enemyType.name,
        role: "enemy",
        color: enemyType.color,
        x: canvas.width + Math.random() * canvas.width,
        y: Math.random() * (canvas.height - 48),
        width: enemyType.width,
        height: enemyType.height,
        xSpeed: enemyType.xSpeed,
        ySpeed: enemyType.ySpeed,
        hp: enemyType.hp,
        //pointsOnKill: enemyType.pointsOnKill,
        //firerate: enemyType.firerate,
        projectile: enemyType.projectile,
        shotCooldown: 0,
    });
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

function addPoints(amt) {
    score.total += Math.floor(amt * score.multiplier);
    score.multiplier += (amt / 100);
}

function killEnemy(i) {
    enemies.splice(i, 1);
}

function render() {
    //clear canvas
    draw(canvas);
    ctx.font = "10px monospace";
    if (!compatMode) {
        image(background1);
        image(background2);
    }
    //draw projectiles
    for (i = 0; i < projectiles.length; i++) {
        draw(projectiles[i]);
    };

    //draw player
    if (!compatMode) {
        image(player);
    } else {
        draw(player);
    }
    player.color = "#0ff";

    //draw enemies
    for (i = 0; i < enemies.length; i++) {
        draw(enemies[i]);
        enemies[i].color = "#f00";
    };

    /*  UI  */

    //health

    draw(gui.healthBar.background);
    for (i = player.hp; i > 0; i--) {
        if (i <= player.hp - damageBuffer) {
            ctx.fillStyle = "#0f0";
        } else {
            ctx.fillStyle = "#f00";
        }
        ctx.fillRect(45 + (i * 2), 10, 1, 10);
    }
    text(gui.healthBar.label);

    //score
    text(gui.scoreCounter.label);
    text(gui.scoreCounter.counter);
    //multiplier
    ctx.font = 10 * score.multiplier + "px monospace";
    ctx.fillText("x" + score.multiplier, 10, 45);

    if (gui.startMessage.duration % 5) text(gui.startMessage);

    if (gameOver) {
        draw(canvas);
        text(gui.gameOverMessage);
    }
}

function draw(obj) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function image(obj) {
    if (obj.image.scale) {
        ctx.drawImage(obj.image.src, obj.image.x, obj.image.y, obj.image.width, obj.image.height);
    } else {
        ctx.drawImage(obj.image.src, obj.image.x, obj.image.y);
    }
}

function text(obj) {
    ctx.fillStyle = obj.color;
    ctx.font = obj.font;
    ctx.textAlign = obj.align;
    ctx.textBaseline = obj.baseline;
    ctx.fillText(obj.text, obj.x, obj.y);
}
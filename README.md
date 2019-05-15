# ShootEm

## Input

Player input handeled read by two EventListeners that are initiated at the start. Each key that the game uses is specified in the EventListeners and its status is stored in `keys[key]`. `keys[key]` is true while `key` is being pressed.

## Logic

* `init()` loads game textures, sets initial var values.

* `gameLoop()` is called using `requestAnimationFrame`. Calls `tick()` and `render()`.

	* `tick()` is called every frame. Calls functions to update game variables.

		* `updateVariables()` updates general game variables. 

		* `updatePlayer()` updates `player` variables, reads input from `keys`.

		* `updateProjectiles()` updates position for all projectiles based on `projectile.xSpeed`, checks collision for all projectiles.

		* `updateEnemies()` updates position for all enemies based on `enemyType.xSpeed`, checksCollision for all enemies, checks `hp` for all enemies and calls `killEnemy()` if it is below 0.

	* `move(obj)` updates `obj.x` and `obj.y` based on `obj.xSpeed` and `obj.ySpeed` respectively.

	* `checkCollision(objA, objB)` returns true if `objA` is touching `objB`. Both objects need to have `x`, `y`, `width` and `height` properties.
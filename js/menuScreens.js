/*
Spacewar-Javascript
This is a modern JS reboot of the 1962 classic PDP-1 Spacewar

Copyright (C) 2021  Ron Perkins - <hello@ronperkins.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
"use strict";

const gameOverPositions = [[180, 360], [230, 410]]
const startScreenPositions = [[190, 290], [190, 340]]

startScreen.init = () => {
  startScreen.stars = versusScreen.makeStars()
  startScreen.arrow = new ShipCursor(startScreenPositions, player1Vectors, 3);
}
startScreen.draw = () => {
  Game.context.clearRect(0, 0, Game.width, Game.height);
  // draw board
  drawCircle(Game.width/2, Game.height/2, Game.radius)
  startScreen.stars.forEach((value) => drawPoint(...value));

  startScreen.arrow.draw()
  writeCentered(150, "SPACEWAR", 5, 5);
  writeCentered(280, "1p start", 2);
  writeCentered(330, "2p start", 2);

  writeCentered(420, "enter - start", 1.2);
  writeCentered(450, "player 1- 'wasd'     player 2 - arrows", 1.2);
}
startScreen.update = () => {
  startScreen.arrow.update()
  if (Key.isDown(13)) {
    if (Game.keyTimeout > Date.now()) return;
    Game.keyTimeout = Date.now()+200;
    Game.laser2();
    if (startScreen.arrow.current === 0) Game.changeState(enemyScreen);
    else if (startScreen.arrow.current === 1) Game.changeState(versusScreen);
  }
}

gameOverScreen.init = () => {
  winner = (Game.player2.dead?"player 1 wins":"player 2 wins")
  winner = (Game.player2.dead && Game.player1.dead?"draw":winner)
  gameOverScreen.stars = versusScreen.makeStars()
  gameOverScreen.arrow = new ShipCursor(gameOverPositions, player1Vectors, 3);
}
gameOverScreen.draw = () => {
  Game.context.clearRect(0, 0, Game.width, Game.height);
  // draw board
  drawCircle(Game.width/2, Game.height/2, Game.radius)
  gameOverScreen.stars.forEach((value) => drawPoint(...value));

  gameOverScreen.arrow.draw()
  writeCentered(100, "GAME OVER", 5);
  if (gameMode === "versus" || winner === "draw") writeCentered(200, winner, 3);
  else writeCentered(200, (winner==="player 1 wins"?"you win":"you lose"), 3);
  writeCentered(350, "play again", 2);
  writeCentered(400, "menu", 2);
  writeCentered(570, VERSION);
}
gameOverScreen.update = () => {
  gameOverScreen.arrow.update()
  if (Key.isDown(13)) {
    if (Game.keyTimeout > Date.now()) return
    Game.keyTimeout = Date.now()+200;
    Game.laser2();
    if (gameOverScreen.arrow.current === 0) {
      if (gameMode === "versus") Game.changeState(versusScreen);
      else Game.changeState(enemyScreen);
    }
    else if (gameOverScreen.arrow.current === 1) Game.changeState(startScreen);
  } else if (Key.isDown(27)) {
    Game.laser1();
    Game.changeState(versusScreen);
  }
}

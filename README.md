# WarCardGame
A quick war card game for 2+ players

In order to play:
* Clone repo
* Run `NPM install` in terminal
* Then run `node server.js`
* Then in your browser navigate to localhost:3000/test
* This will run tests and in the console you can see the test game play through being logged
* To test the game on your own you can enter `let yourWarGameNameHere = new War(#ofPlayers, #ofSuits, #ofRanks);`
* From there you can move through turns manually using `yourWarGameNameHere.takeTurn();`, or you can just play through the whole game with `yourWarGameNameHere.playGame();`

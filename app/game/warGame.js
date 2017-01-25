
//basic class with 2 public properties
class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank; 
  }
};


class Deck {

  constructor(numberOfSuits = 4, numberOfRanks = 13) {

    //holds cards and acts similar to a Stack data structure
    this.storage = [];

    for (let i = 0; i < numberOfSuits; i++) {
      for (let j = 0; j < numberOfRanks; j++) {
        //creates a Card for every unique combo and adds to storage
        this.storage.push(new Card(i, j));
      }
    };


    
  }

  //simple lookup O(1)
  cardCount() {
    return this.storage.length;
  }

  //very effective shuffle with O(n)
  shuffle() {

    for (let i = 0; i < this.storage.length; i ++) {

      //random number in bounds of storage
      let randomNum = Math.floor(Math.random() * this.storage.length);

      //keep from switching with self to save a couple computations
      if (randomNum !== i) {

        //hold a card temporarily
        let temp = this.storage[i];

        //replace the held cards spot with random card
        this.storage[i] = this.storage[randomNum];

        //put held card where random came from
        this.storage[randomNum] = temp;
      }
    }
  }

  //simple lookup O(1)
  getCardAt(num) {
    return this.storage[num];
  }

  //simple remove O(1)
  deal() {
    return this.storage.pop();
  }

  //lose some efficiency here with O(n)
  receiveCard(card) {
    this.storage.unshift(card);
  }

};

class War {
  //builds a gamedeck and deals it out to players(a tuple with a player number and a deck)
  //pretty heavy function because of the number of loops and from the player decks receiving cards which is O(n) where n is their deck size every time
  constructor(numberOfPlayers = 2, numberOfSuits = 4, numberOfRanks = 13) {

    //holds players
    this.storage = [];

    for (let i = 0; i < numberOfPlayers; i ++) {
      //building players with their numbers and empty decks
      this.storage[i] = [ i+1, new Deck( 0, 0)];
    };

    //builds new deck
    let gameDeck = new Deck(numberOfSuits, numberOfRanks);


    //shuffle the deck to make sure that players aren't gettin sequential cards
    gameDeck.shuffle();

    //deal out cards to players using count to point at correct player
    let count = 0;
    while(gameDeck.cardCount() > 0) {

      //uses deal and receive card to make sure order is fair
      this.storage[count][1].receiveCard(gameDeck.deal());
    
      count ++;

      //keep count looping
      if (count == numberOfPlayers) {
        count = 0;
      }
    };

  }

  //simple lookup O(1)
  playersLeft() {
    return this.storage.length;
  }

  //quickly grabs card counts of each player and returns with their player number
  //O(n) where n is number of players
  cardCounts() {

    let counts = [];

    //loops over each player
    this.storage.forEach((player) => {

      //find the number of cards player has left
      let score = player[1].cardCount();

      //create tuple with that info and player number
      let playerScore = [player[0], score];

      //push to result array
      counts.push(playerScore);
    });
    return counts;
  }

  //this is the entire battle functionality and uses a recursive helper function
  //it has a pretty significant time complexity because it has each player deal O(n) where n is number of players
  //and that is just on the initial call, but when it goes deeper it calls the costly receiveCard potentially many times
  takeTurn(winners = [], cardsForGrabs = []) {

    //check if only one victor remains
    if (winners.length == 1) {

      //loop through players
      for (let i = 0; i < this.storage.length; i ++) {
        let player = this.storage[i];

        //if this player is the victor
        if (player[0] == winners[0]) {

          //they receive all the cards in the pot
          cardsForGrabs.forEach((card) => {
            player[1].receiveCard(card);
          });
        }

        //if anyone is out of cards
        if (player[1].cardCount() == 0) {

          //they are out
          this.storage.splice(i, 1);

          //and we step back to start off with the next player who took their spot(but not their number)
          i --;
        }
      };
    }
    else {

      //battle is still going or starting
      let currentBattle = [];
      this.storage.forEach((player) => {

        //check if the battle just started (and everyone is still in it)
        if (winners.length == 0) {

          //hands are built with player number and then card(s)
          let currentHand = [player[0]];

          //check to make sure we don't try and deal out of an empty deck
          if (player[1].cardCount() > 0) {
            currentHand.push(player[1].deal());
          }

          //send the player number and card tuple to the battlefield
          currentBattle.push(currentHand);
          
        }

        //this is for the case of war, so we check through the players to only include the ones still in the battle
        else if (winners.indexOf(player[0]) !== -1) {

          //set up hand the same way
          let warHand = [player[0]];
          for (let i = 0; i < 3; i ++) {

            //deal out 3 if possible, or less if the deck runs out
            if (player[1].cardCount() > 0) {
              warHand.push(player[1].deal());
            }
          }

          //send the player and their 1-3 cards to the battlefield
          currentBattle.push(warHand);
        } 
      });

      //set initialize highest score variable
      let highestScore = -1;

      //go through all the hands and find the winner(s)
      currentBattle.forEach((hand) => {

        let score = 0;
        let cards = [];

        //go through all the cards in the current hand and store then in cards variable leaving the 0th index which is the player number
        while(hand.length > 1) {
          cards.push(hand.pop())
        }

        let player = hand[0];

        //tally the score of the current hand
        //I changed the rules slightly here and instead of only considering the final card in a war I add them up for a combined score
        //I also didn't DQ players short of the 3 cards for the war
        //instead players have a chance for strong cards to overpower a bunch of weak cards if they are out numbered
        cards.forEach((card) => {
          score += card.rank;

          //store used cards in the pot after their values are accounted for
          cardsForGrabs.push(card);
        });

        //check to see if the current hand is in the lead
        if (score > highestScore) {

          //if they are outright lead it rewrites winners
          winners = [player];

          //and sets a new highest score
          highestScore = score;
        }
        else if (score == highestScore) {

          //otherwise it just adds the player to the winners for the next round
          winners.push(player);
        }
      });

      //call the function again with the new args
      this.takeTurn(winners, cardsForGrabs);
    }
  }

  //plays through an entire game logging the turns taken in the console
  //ends when 1 player is left and announces victor
  playGame() {

    //set a flag for the game to know when to stop
    let multiplePlayers = true;

    //initialize leader out here so it can be returned as the winner later
    let leader
    
    while(multiplePlayers) {

      //run a turn
      this.takeTurn();

      //keep track of leader and their score
      let topScore = 0;

      //get results of the turn
      let endOfTurnCounts = this.cardCounts();

      endOfTurnCounts.forEach((player) => {

        //watch for leader to change
        if (player[1] > topScore) {
          topScore = player[1];
          leader = player[0];
        }

        //log this players stats at the end of the turn
        console.log('player: ', player[0],'score: ', player[1]);
      });

      //check to see if the game is over
      if (endOfTurnCounts.length == 1) {
        multiplePlayers = false;

        //declare victor if game's over
        console.log('Player ',leader, ' wins!' )
      }
      else {

        //log the end of turn leader
        console.log('End of turn with player ', leader,' in the lead with ', topScore, ' cards!');
      }
    }

    //this returns the player number of the winner 
    return leader;
  };
};

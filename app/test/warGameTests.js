let expect = chai.expect;

describe ("War Game", () => {
  
  describe("Card", () => {

    let testCard = new Card(3, 4);

    it("has a suit", () => {
      
      expect(testCard.suit).to.equal(3)
    });

    it("has a rank", () => {
      
      expect(testCard.rank).to.equal(4)
    });

  });

  describe("Deck", () => {

    let testDeck = new Deck(4, 13);

    describe("builds a full deck", () => {
      
      it("has 52 cards", () => {
        
        let count = testDeck.cardCount();
        
        expect(count).to.equal(52);
      });
    });

    describe("cardCount", () => {

      let count = testDeck.cardCount();

      it("returns a number", () => {
        
        expect(count).to.be.a('number');
      });

      it("is between 0 and the deck size", () => {
        
        expect(count).to.be.within(0,53)
      });
    });

    describe("shuffle", () => {
      
      it("changes card locations", () => {
        
        let randomNums = [];

        for (let i = 0; i < 8; i ++) {
          
          let num = Math.floor(Math.random() * 51);
          
          randomNums.push(num);
        };

        let beforeShuffle = [];

        randomNums.forEach((num) => {
          
          beforeShuffle.push(testDeck.getCardAt(num));
        });

        testDeck.shuffle();

        let afterShuffle = [];

        randomNums.forEach((num) => {
          
          afterShuffle.push(testDeck.getCardAt(num));
        });

        expect(afterShuffle).to.not.deep.equal(beforeShuffle);
      });
    });

    describe("receiveCard", () => {
      
      let testCard = new Card(5, 4);
      
      let count = testDeck.cardCount();
      
      testDeck.receiveCard(testCard);
      
      let newCount = testDeck.cardCount();
      
      it("increases deck size", () => {

        expect(newCount).to.equal(count +1);
      });
    });

    describe("deal", () => {

      let testCard = testDeck.deal();

      it("returns a card", () => {
        
        expect(testCard).to.be.an.instanceOf(Card);
      });

      it("reduces size of deck by 1", () => {
        
        let firstCount = testDeck.cardCount();
        
        testDeck.deal();
        
        let secondCount = testDeck.cardCount();
        
        expect(firstCount).to.equal(secondCount + 1);
      });
    });

  });

  describe("War", () => {

    let testWar = new War(2, 4, 13);

    describe("playersLeft", () => {
      
      let players = testWar.playersLeft();

      it("returns a number", () => {
        
        expect(players).to.be.a('number');
      });

      it("is between 0 and the total number of players", () => {
        
        expect(players).to.be.within(0,3)
      });
    });

    describe("takeTurn", () => {

      let beforeTurn = testWar.cardCounts().slice();

      testWar.takeTurn();

      let afterTurn = testWar.cardCounts().slice();

      it("causes cards to change hands", () => {

        expect(beforeTurn).to.not.deep.equal(afterTurn);
      });
    });

    describe("cardCounts", () => {

      let counts = testWar.cardCounts().slice();

      it("returns an array", () => {

        expect(counts).to.be.an.instanceOf(Array);
      });
      it("returned array has as many entries as the players", () => {

        expect(counts.length).to.equal(2);
      });
    });
    describe("playGame", () => {

      let winner = testWar.playGame();

      let finalCounts = testWar.cardCounts();

      it("continues until one player is left", () => {

        expect(finalCounts.length).to.equal(1);
      });
      it("returns a winner", () => {

        expect(winner).to.be.a('number').within(0,3);
      });
    })
  });
});

let expect = require('chai').expect;
let mocha = require('mocha');

describe ("War Game", () => {
  
  describe("Card", () => {

    let testCard = new Card(3, 4);

    it("has a rank", () => {
      expect(testCard.rank).to.equal(4)
    });

    it("has a suit", () => {
      expect(testCard.suit).to.equal("hearts")
    });

  });

  describe("Deck", () => {

    beforeEach(() => {
      let testDeck = new Deck(4, 13);
    });

    describe("builds a full deck", () => {
      it("has 52 cards", () => {
        let count = testDeck.cardCount();
        expect(count).to.equal(52);
      });
      it("has 4 suits", () => {
        let suitsLeft = testDeck.suitsLeft();
        expect(suitsLeft.length).to.equal(4);
      });
      it("has 13 ranks", () => {
        let ranksLeft = testDeck.ranksLeft();
        expect(ranksLeft).to.equal(13)
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
          beforeShuffle.push(Deck.getCardAt(num));
        });

        Deck.shuffle();

        let afterShuffle = [];

        randomNums.forEach((num) => {
          afterShuffle.push(Deck.getCardAt(num));
        });

        expect(afterShuffle).to.not.deep.equal(beforeShuffle);
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

    describe("cardCount", () => {

      let count = testDeck.cardCount();

      it("returns a number", () => {
        expect(count).to.be.a('number');
      });

      it("is between 0 and the deck size", () => {
        expect(count).to.be.within(0,53)
      });
    });

    describe("suitsLeft", () => {
      let suits = testDeck.suitsLeft();

      it("returns an array", () => {
        expect(suits).to.be.an.instanceOf(Array);
      });

      it("the array is a list of strings", () => {
        expect(suits[0]).to.be.a('string');
      });

      it("whose length is eqaul to suits left", () => {
        expect(suits.length).to.equal(4);
      });
    });

    describe("ranksLeft", () => {
      let count = testDeck.ranksLeft();

      it("returns a number", () => {
        expect(count).to.be.a('number');
      });

      it("is between 0 and the deck size", () => {
        expect(count).to.be.within(0,14)
      });
    });

    describe("getCardAt", () => {
      let testCard = testDeck.getCardAt(16);

      it("returns a card", () => {
        expect(testCard).to.be.an.instanceOf(Card);
      });
    });

    describe("receiveCard", () => {
      let testCard = new Card(5, 4);
      testDeck.receiveCard(testCard);
      it("increases deck size", () => {
        expect(testDeck.cardCount()).to.equal(53);
      });
    });
  });

  describe("War", () => {

    beforeEach(() => {
      let testWar = new War(4, 13, 2)
    });

    describe("playersLeft", () => {
      let players = testWar.playersLeft();

      it("returns a number", () => {
        expect(players).to.be.a('number');
      });

      it("is between 0 and the total number of players", () => {
        expect(count).to.be.within(0,3)
      });
    });

    describe("takeTurn", () => {
      it("causes cards to change hands", () => {
        let beforeTurn = testWar.cardCounts();
        testWar.takeTurn(),
        let afterTurn = testWar.cardCounts();

        expect(beforeTurn).to.not.deep.equal(afterTurn);
      });
    });

    describe("cardCounts", () => {
      it("returns an array", () => {
        expect(testWar.cardCounts).to.be.an.instanceOf(Array);
      });
      it("returned array has as many entries as the players", () => {
        expect(testWar.cardCounts.length).to.equal(4);
      });
    });
  });
});

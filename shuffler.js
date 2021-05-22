/*
 * Javascript Card Shuffler
 * Michael Wohlfarth
 * 05.20.2021
 */

// import the filesystem module so we can write to files
var fs = require('fs')

var oFilename = ''
var iFilename = ''

/* argument checking to determine what's being asked of us */
if (process.argv.length < 3) {
  // we just want to shuffle a random deck of cards and 
  // output to the console.
  // don't change the input or output filenames since we
  // won't use them
}
else if (process.argv.length == 4) {
  // we might want to dump to console or use a file as input
  if (process.argv[2] == '-o') {
    // take the fourth argument as the output file
    oFilename = process.argv[3]
  }
  else if (process.argv[2] == '-i') {
    // take the fourth argument as the input file
    iFilename = process.argv[3]
  }
}
else if (process.argv.length == 6) {
  // we want both an input file and an output file
  if (process.argv[2] == '-o' && process.argv[4] == '-i') {
    // take fourth argument as the output file and
    // sixth argument as the input file
    oFilename = process.argv[3]
    iFilename = process.argv[5]
  }
  else if (process.argv[2] == '-i' && process.argv[4] == '-o') {
    // take fourth argument as the output file and
    // sixth argument as the input file
    iFilename = process.argv[3]
    oFilename = process.argv[5]
  }
}

/* now that we know what we need to do, we can start the shuffling */
if (iFilename == '') {
  // if there's no input filename, we need to construct the deck ourselves
  var deck = newDeck()
}
else {
  var deck = getDeckFromFile(iFilename)
}

/* shuffle the deck and print it out for the user */
var shuffledDeck = shuffle(deck)
console.log('Shuffled deck:')
console.log(shuffledDeck)

/* if the user wants us to print the deck to a file, do that */
if (oFilename != '') {
  var ret = writeDeckToFile(oFilename, shuffledDeck)
}

/* 
 * write a deck to a specified file
 */
function writeDeckToFile(oFilename, deck) {

  // open the file for writing
  var fileStream = fs.createWriteStream(oFilename)

  // when done writing, inform the user that we've printed the deck to a file
  fileStream.on('finish', function () {
    console.log('Wrote the shuffled deck to file named ' + oFilename)
  })

  // if an error occurs while attempting to write, inform the user
  fileStream.on('error', function () {
    throw new Error('An error occured when attempting to write the deck to the specified output file')
  })

  // construct the string before we write to the file so that we
  // avoid the overhead of writing to the file 52 times
  var deckString = '' 
  for (var i = 0; i < 52; i++) {
    deckString += shuffledDeck[i].suit + ' ' + shuffledDeck[i].rank + ' '
  }
  
  // write to the file
  fileStream.write(deckString)

  // close the file stream
  fileStream.end()
}

/*
 * returns a new deck, ordered in standard order
 */
function newDeck() {
  var deck = []
  for (suit = 0; suit < 4; suit++) {
    for (rank = 2; rank <= 14; rank++) {
      var card = {suit: '', rank: ''}
     
      // set the suit for the card
      switch (suit) {
      case 0: 
        card.suit = 'Spades'
        break
      case 1: 
        card.suit = 'Clubs'
        break
      case 2: 
        card.suit = 'Diamonds'
        break
      case 3: 
        card.suit = 'Hearts'
        break
      }

      // set the rank for the card
      switch (rank) {
      case 14: 
        card.rank = 'Ace'
        break
      case 13:
        card.rank = 'King'
        break
      case 12:
        card.rank = 'Queen'
        break
      case 11:
        card.rank = 'Jack'
        break
      default:
        card.rank = rank
        break
      }
     
      // add the card to the array 
      deck.push(card)
    }
  }

  // return the deck of cards
  return deck
}

/*
 * import a deck from the specified input file
 */
function getDeckFromFile(iFilename) {

  // get the deck from the file
  try {
    var data = fs.readFileSync(iFilename, 'utf8')
    console.log('Imported existing deck from ' + iFilename)
  } catch (err) {
    throw new Error('Error in reading deck from file')
  }

  // parse through the deck string to construct the array
  var splitData = data.split(' ')
  var deck = []
  for (var i = 0; i < 104; i += 2) {
      var card = {suit: splitData[i], rank: splitData[i + 1]}
     
      // convert numbered cards from strings back to ints
      if (card.rank != 'Jack' && 
          card.rank != 'Queen' && 
          card.rank != 'King' &&
          card.rank != 'Ace') {
        card.rank = parseInt(card.rank, 10)
      }

      deck.push(card)
  }
  
  return deck
}

/* 
 * shuffle the array in-place using Durstenfeld suffle algorithm 
 * (an optimized version of the Fisher-Yates algorithm) 
 */
function shuffle(cards) {
  for (var i = cards.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = cards[i]
    cards[i] = cards[j]
    cards[j] = temp
  } 

  return cards
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

function generateWinningNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function shuffle(arr) {
    var l = arr.length, i, holder;

    while(l){
        i = Math.floor(Math.random() * l--)
        holder = arr[l];
        arr[l] = arr[i];
        arr[i] = holder;
    }

    return arr;
}

function newGame() {
    return new Game();
}

Game.prototype.difference = function(){
    return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function(){
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guessedNumber){
    if(guessedNumber <= 0 || guessedNumber >= 101 || isNaN(guessedNumber)){
        throw 'That is an invalid guess.';
    }

    this.playersGuess = guessedNumber;
    return this.checkGuess();
}

Game.prototype.checkGuess = function(){
    if(this.pastGuesses.includes(this.playersGuess)){
        return 'You have already guessed that number.';
    } else if (this.playersGuess === this.winningNumber){
        return 'You Win!';
    } else {
        this.pastGuesses.push(this.playersGuess);

        if(this.pastGuesses.length >= 5){
            return 'You Lose.'
        } else {
            if(this.difference() < 10){
                return 'You\'re burning up!';
            } else if (this.difference() < 25) {
                return 'You\'re lukewarm.';
            } else if(this.difference() < 50){
                return 'You\'re a bit chilly.';
            } else {
                return 'You\'re ice cold!';
            }
        }
    }
}

Game.prototype.provideHint = function(){
    var hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];

    return shuffle(hintArray);
}

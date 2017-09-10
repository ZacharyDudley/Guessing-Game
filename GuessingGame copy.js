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
        alert('That is an invalid guess and you know it. The number must be between 1 and 100.');
        throw 'That is an invalid guess.';
    }

    this.playersGuess = guessedNumber;
    return this.checkGuess();
}

Game.prototype.checkGuess = function(){
    if(this.pastGuesses.includes(this.playersGuess)){
        return 'Player has already guessed that number.';
    } else if (this.playersGuess === this.winningNumber){
        return 'Player Wins.';
    } else {
        this.pastGuesses.push(this.playersGuess);

        if(this.pastGuesses.length >= 5){
            return 'Player Loses!'
        } else {
            if(this.difference() < 10){
                return 'Player is burning up!';
            } else if (this.difference() < 25) {
                return 'Player is lukewarm.';
            } else if(this.difference() < 50){
                return 'Player is a bit chilly.';
            } else {
                return 'Player is ice cold!';
            }
        }
    }
}

Game.prototype.provideHint = function(){
    var hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];

    return shuffle(hintArray);
}

//TEXT FIELDS
    var header = $('#headers').find('h1');
    var subHeader = $('#headers').find('h2');
    var subSubHeader = $('#headers').find('h3');

//HINT COUNT
    var numHints = 3
    var hintCount = numHints;

function submitGuess(game) {

    function endOfGame() {
        //DISABLE BUTTONS
        document.getElementById('btn-circle').disabled = true;
        document.getElementById('buttonHint').disabled = true;
        //DISPLAY TEXT
        header.text(response);
        subSubHeader.text('Click RESET to play again.');
        //DISABLE ENTER KEY
        $('#player-input').off('keypress');
        //DISABLE INPUT FIELD
        $('#player-input').prop('disabled', true);
    }

//GET PLAYER GUESS, CLEAR INPUT FIELD, SUBMIT GUESS
    var guess = +$('#player-input').val();
    $('#player-input').val('');
    var response = game.playersGuessSubmission(guess);
//ADD PAST GUESSES TO 'PREV GUESS' DISPLAY
    if (response != 'Player has already guessed that number.') {
        $('#guesses').find('.guess').each(function(){
            if ($(this).text() == "-") {
                $(this).text(guess);
                return false;
            }
        });
    }
//LOSING & WINNING
    if(response == "Player Loses!"){
        $('body').css({'background-color': '#888888'});
        endOfGame();
        subHeader.text('Computer cannot be beaten.');
        $('#player-input').attr('placeholder', ':)');
        $('#player-input').addClass('endGamePlaceholder');
    } else if(response == "Player Wins."){
        $('body').css({'background-color': '#444444'});
        endOfGame();
        subHeader.text('Player must have cheated.');
        $('#player-input').attr('placeholder', ':(');
        $('#player-input').addClass('endGamePlaceholder');
    } else {
        subHeader.text(response);
        if (game.isLower()) {
            subSubHeader.text('Try guessing higher.');
        } else {
            subSubHeader.text('Try guessing lower.');
        }
    }
}

$(document).ready(function(){
    var game = newGame();
    console.log(game.winningNumber);

//SUBMIT BUTTON
    $('.button-guess').on('click', function(){
        submitGuess(game);
    });

//ENTER KEY SUBMITS GUESS
    $('#player-input').on('keypress', function(e){
        if(e.which == 13){
            submitGuess(game);
        }
    });

//RESET GAME
    $('.btn-danger').click(function(){
        location.reload();
    });

//HINT BUTTON
    $('.btn-warning').click(function(){
        if (numHints == 0) {
            subSubHeader.text('Player does not get hints.');
        }

        if (hintCount > 0) {
            var arr = game.provideHint();
            subHeader.text(arr[0] + ' | ' + arr[1] + ' | ' + arr[2]);
            hintCount--;

            if (hintCount == 0) {
                subSubHeader.text('Player is out of hints.');
            } else if (hintCount == 1) {
                subSubHeader.text('Player has only ' + hintCount + ' hint left.');
            } else if (hintCount >= 2) {
                subSubHeader.text('Player has ' + hintCount + ' more hints.');
            }
        }
    });

});

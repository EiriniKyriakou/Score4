google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

const game = {
    plays: "none",
    moves: 0,
    cells: [],
    winner: false
};

var empty_cells = 42;
var old_date;
var new_date;
var sec;
var red_wins = 0;
var yellow_wins = 0;
var draws = 0;
var pie = 0;

function play(x, y) {
    updatePage(x,y)
    if (isValidMove(x, y)) {
        if (hasPlayerWon(x, y) === false) {
            getPlayerTurn();
        }else{
            pie = 1;
            drawChart()
            pie = 0;
        }
    }
}

function updatePage(x, y) {
    if (isValidMove(x, y)) {
        old_date = new_date;
        new_date = (new Date()).getTime();
        sec = Math.round((new_date - old_date) * 0.001);
        old_date = new_date;

        document.getElementById('p' + x + '_' + y).style.backgroundColor = game.plays;
        document.getElementById('p' + x + '_' + y).disabled = true;
        game.cells[x][y] = game.plays;
        game.moves++;
        empty_cells--;
        document.getElementById('info_box').innerHTML += "Move " + game.moves + ":  Player " + game.plays + ".<br>";
        document.getElementById('info_box').innerHTML += "Took the player " + sec + " sec to make a move.<br>"
        document.getElementById('info_box').innerHTML += "Empty Cells: " + empty_cells + ".<br><br>";
    }else{
        document.getElementById('info_box').innerHTML += "Invalide Move!<br>";
    }
}

function newGame() {
    games = red_wins + yellow_wins + draws;
    new_date = (new Date()).getTime();
    empty_cells = 42;
    document.getElementById('info_box').innerHTML = "";
    showWinsDraws();
    document.getElementById('info_box').innerHTML += "Empty Cells: " + empty_cells + ".<br><br>";
    game.plays = "none";
    game.moves = 0;
    game.winner = false;
    game.cells[0] = [null, null, null, null, null, null, null];
    game.cells[1] = [null, null, null, null, null, null, null];
    game.cells[2] = [null, null, null, null, null, null, null];
    game.cells[3] = [null, null, null, null, null, null, null];
    game.cells[4] = [null, null, null, null, null, null, null];
    game.cells[5] = [null, null, null, null, null, null, null];
    for (var i = 0; i <= 5; i++) {
        for (var j = 0; j <= 6; j++) {
            document.getElementById('p' + i + '_' + j).disabled = false;
            document.getElementById('p' + i + '_' + j).style.backgroundColor = "#3e5bdd"/*"white"*/;
            document.getElementById('p' + i + '_' + j).className = "";
        }
    }
    getPlayerTurn();
}

function isValidMove(x, y) {
    if (x != 5) {
        if (game.cells[x + 1][y] == null) {
            return false
        }
    }
    return true
}

function disableButtons() {
    for (var i = 0; i <= 5; i++) {
        for (var j = 0; j <= 6; j++) {
            document.getElementById('p' + i + '_' + j).disabled = true;
        }
    }
}

function horizontalWin(row) {
    var sum = 0;
    var blink=[null,null,null,null];
    for (var j = 0; j <= 6; j++) {
        if (game.cells[row][j] === game.plays) {
            blink[sum] = j;
            sum++;
            if (sum === 4) {
                for (var x=0; x<4; x++){
                    document.getElementById('p' + row + '_' + blink[x]).className = "blinking";
                }
                document.getElementById('info_box').innerHTML += "<br>Winner Horizontally Player: " + game.plays + " with " + game.moves + " moves.<br>";
                return true;
            }
        } else {
            sum = 0;
            blink=[null,null,null,null];
        }
    }
    return false;
}

function verticalWin(col) {
    var sum =0;
    for (var i = 0; i <= 5; i++) {
        if (game.cells[i][col] === game.plays) {
            sum++
            if (sum === 4) {
                for (var tmp=i; tmp!=i-4;tmp--){
                    document.getElementById('p' + tmp + '_' + col).className = "blinking";
                }
                document.getElementById('info_box').innerHTML += "<br>Winner Vertically Player: " + game.plays + " with " + game.moves + " moves.<br>";
                return true;
            }
        } else {
            sum = 0;
        }
    }
    return false;
}

function diagonialWin(x,y) {
    var sum = 0;
    var blink=[[null,null],[null,null],[null,null],[null,null]];
    var sum=0;
    var i=x;
    var j=y;
    //from left top to right bottom
    while(i!=5 && j!=6){
        i++;
        j++;
    }
    while(i>=0 && j>=0){
        if (game.cells[i][j] === game.plays){
            blink[sum] = [i,j];
            sum++;
            
            if (sum === 4){
                
                for (var k=0; k<4; k++){
                    document.getElementById('p' + blink[k][0] + '_' + blink[k][1]).className = "blinking";
                }
                document.getElementById('info_box').innerHTML+="Winner Diagonally Player: "+ game.plays+ " with "+game.moves+" moves.<br>";
                return true;
            }
        }else{
            sum=0;
            blink=[[null,null],[null,null],[null,null],[null,null]];
        }
        i--;
        j--;
    }

    //from right top to left bottom
    i=x;
    j=y;
    sum=0;
    blink=[[null,null],[null,null],[null,null],[null,null]];
    while(i!=5 && j!=0){
        i++;
        j--;
    }
    while(i>=0 && j>=0){
        if (game.cells[i][j] === game.plays){
            blink[sum] = [i,j];
            sum++;
            if (sum === 4){
                console.log(game.cells)
                for (var k=0; k<4; k++){
                    document.getElementById('p' + blink[k][0] + '_' + blink[k][1]).className = "blinking";
                    console.log('p' + blink[k][0] + '_' + blink[k][1])
                }
                document.getElementById('info_box').innerHTML+="Winner Diagonally Player: "+ game.plays+ " with "+game.moves+" moves.<br>";
                return true;
            }
        }else{
            sum=0;
            blink=[[null,null],[null,null],[null,null],[null,null]];
        }
        i--;
        j++;
    }


    return false;  
}

function isDraw(){
    if(game.moves === 42){
        return true;
    }
    return false;
}

function hasPlayerWon(x, y) {
    //console.log(cells);
    if (game.moves >= 7 && (horizontalWin(x) == true || verticalWin(y) == true || diagonialWin(x,y) == true)) {
        game.winner = true;
        document.getElementById('info_box').innerHTML += "Congrats Player " + game.plays + "!<br>";
        if (game.plays == "red"){
            red_wins++;
        }else{
            yellow_wins++;
        }
        disableButtons();
        return true
    }
    else if (isDraw()) {
        document.getElementById('info_box').innerHTML += "Draw!<br>";
        draws++
        return true
    }
    return false
}

function getPlayerTurn() {
    if (empty_cells == 42) {
        game.plays = "red"
    } else {
        if (game.plays == "red")
            game.plays = "yellow";
        else
            game.plays = "red";
    }

}

function showWinsDraws(){
    if (red_wins != 0){
        if (red_wins == 1){
            document.getElementById('info_box').innerHTML += "Red " +red_wins+ " win. <br>";
        }else{
            document.getElementById('info_box').innerHTML += "Red " +red_wins+ " wins. <br>";
        }
    }
    if (yellow_wins != 0 ){
        if (yellow_wins == 1){
            document.getElementById('info_box').innerHTML += "Yellow " +yellow_wins+ " win. <br>";
        }else{
            document.getElementById('info_box').innerHTML += "Yellow " +yellow_wins+ " wins. <br>";
        }
    }
    if (draws != 0){
        if (draws == 1){
            document.getElementById('info_box').innerHTML += draws +"draw. <br>";
        }else{
        document.getElementById('info_box').innerHTML += draws +"draws. <br>";
        }
    }
}

function drawChart() {
    if (pie == 0) {
        if (document.getElementById('piechart').style.display == "none") {
            document.getElementById('piechart').style.display = "block"
        } else {
            document.getElementById('piechart').style.display = "none"
        }
    }

    var data = google.visualization.arrayToDataTable([
      ['Wins',                  'How many'],
      ['Yellow Player Wins',    yellow_wins],
      ['Red Player Wins',       red_wins],
      ['Draws',                 draws]
    ]);

    var options = {
      title: 'Statistics'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
}
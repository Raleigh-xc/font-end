//------------------
//--
//------------------
var aNumCells = [];

$(function(){

    initContrainer();
    initDataArray();
    initNumCells();

    generateOneNum();
    generateOneNum();

    //GAME OVER
    $('#wrap').click(function(){
        $('#wrap').hide();
        $('#grid-container').removeClass('blur');
        newGame();
    });

    //init localStorage
    var iHistoryScore = window.localStorage.getItem('historyscore');
    if(iHistoryScore){
        $('.history-score').find('p').eq(1).text(iHistoryScore);
    }

    //do localStorage
    /*$(window).unload(function(){
        var iNewScore = $('.history-score').find('p').eq(1).text();
        if( iHistoryScore ){
            if(iNewScore > iHistoryScore){
                window.localStorage.setItem('historyscore',iNewScore);
            }
        }else{
            window.localStorage.setItem('historyscore',iNewScore);
        }

    });*/

});

function initContrainer(){

    for( var i = 0;i < 4 ; i++){
        for( var j = 0;j < 4 ; j++){

            var pos = getPosition(i,j);

            var sGridCell = '<div class="grid-cell" id="grid-cell-'+i+'-'+j+'"></div>';
            $('#grid-container').append(sGridCell);
            var oGridCell = $('#grid-cell-'+i+'-'+j);

            oGridCell.css(pos);

        }
    }

}

function initDataArray(){
    for( var i = 0;i < 4 ; i++){

        aNumCells[i] = [];

        for( var j = 0;j < 4 ; j++){

            aNumCells[i][j] = 0; 

        }
    }
}

function initNumCells(){

    $(".num-cell").remove();

    for( var i = 0;i < 4 ; i++){
        for( var j = 0;j < 4 ; j++){

            var pos = getPosition(i,j);

            var sNumCell = '<div class="num-cell" id="num-cell-'+i+'-'+j+'"></div>';
            $('#grid-container').append(sNumCell);
            var oNumCell = $('#num-cell-'+i+'-'+j);

            aNumCells[i][j].isHandled = false;
            
            if(aNumCells[i][j] == 0 ){
                oNumCell.css({
                    'width': 0,
                    'height': 0,
                    'top': pos.top + 50,
                    'left': pos.left + 50
                });
            }else{
                oNumCell.text(aNumCells[i][j]);
                oNumCell.css(pos);
                oNumCell.css({
                    'background': getNumCellBackground(aNumCells[i][j]),
                    'color': getNumCellColor(aNumCells[i][j]),
                    'font-size': getNumCellFontSize(aNumCells[i][j])
                });
            }
        }
    }

}

function generateOneNum(){

    if( noSpace()){
        return false;
    }

    var iNum = Math.random() < 0.5 ? 2 : 4;

    var arr = [];

    for( var i = 0;i < 4 ; i++){
        for( var j = 0;j < 4 ; j++){
            if(aNumCells[i][j] == 0){
                arr.push( 4*i + j);
            }
        }
    }

    var num = arr[Math.floor(Math.random()*arr.length)];
    var iRandomX = parseInt(num/4);
    var iRandomY = num%4;

    aNumCells[iRandomX][iRandomY] = iNum;

    showGeneratedNum(iRandomX,iRandomY,iNum);

}

$(document).keydown(function(evt){

    for( var i = 0;i < 4 ; i++){
        for( var j = 0;j < 4 ; j++){
            if( $('#num-cell-'+i+'-'+j).is(':animated') ){
                return false;
            }
        }
    }

    switch(evt.keyCode){
        case 37: 
        case 65://a
            moveLeft();
            break;
        case 38: 
        case 87://w
            moveTop();
            break;
        case 39: 
        case 68://d
            moveRight();
            break;
        case 40: 
        case 83://s
            moveDown();
            break;
    }

});

function moveLeft(){
    if( !canMoveLeft() ){
        return false;
    }

    for( var i = 0;i < 4 ; i++){
        for( var j = 1;j < 4 ; j++){

            if(aNumCells[i][j] != 0){
                
                for (var k = 0; k < j; k++) {
                    /*case1*/
                    if(aNumCells[i][k] == 0){
                        showNumCellMove(i,j,i,k);
                        aNumCells[i][k] = aNumCells[i][j];
                        aNumCells[i][j] = 0;
                        continue;
                    }
                    /*case2*/
                    if(aNumCells[i][k] == aNumCells[i][j] && noBlockHorizontal(i,k,j) && !aNumCells[i][k].isHandled){
                        showNumCellMove(i,j,i,k);
                        aNumCells[i][k] += aNumCells[i][j];
                        aNumCells[i][j] = 0;

                        aNumCells[i][k].isHandled = true;

                        //add score
                        updateScore(aNumCells[i][k]);

                        continue;
                    }

                }

            }

        }
    }

    setTimeout(initNumCells,200);
    setTimeout(generateOneNum,200);
    setTimeout(isGameOver,300);

}

function moveRight(){
    if( !canMoveRight() ){
        return false;
    }

    for( var i = 0;i < 4 ; i++){
        for( var j = 2;j >= 0 ; j--){

            if(aNumCells[i][j] != 0){
                
                for (var k = 3; k > j; k--) {
                    /*case1*/
                    if(aNumCells[i][k] == 0){
                        showNumCellMove(i,j,i,k);
                        aNumCells[i][k] = aNumCells[i][j];
                        aNumCells[i][j] = 0;
                        continue;
                    }
                    /*case2*/
                    if(aNumCells[i][k] == aNumCells[i][j] && noBlockHorizontal(i,j,k) && !aNumCells[i][k].isHandled){
                        showNumCellMove(i,j,i,k);
                        aNumCells[i][k] += aNumCells[i][j];
                        aNumCells[i][j] = 0;

                        aNumCells[i][k].isHandled = true;

                        //add score
                        updateScore(aNumCells[i][k]);

                        continue;
                    }

                }

            }

        }
    }

    setTimeout(initNumCells,200);
    setTimeout(generateOneNum,200);
    setTimeout(isGameOver,300);

}

function moveTop(){
    if( !canMoveTop() ){
        return false;
    }

    for( var j = 0;j < 4 ; j++){
        for( var i = 1;i < 4 ; i++){

            if(aNumCells[i][j] != 0){
                
                for (var k = 0; k < i; k++) {
                    /*case1*/
                    if(aNumCells[k][j] == 0){
                        showNumCellMove(i,j,k,j);
                        aNumCells[k][j] = aNumCells[i][j];
                        aNumCells[i][j] = 0;
                        continue;
                    }
                    /*case2*/
                    if(aNumCells[k][j] == aNumCells[i][j] && noBlockVertical(j,k,i) && !aNumCells[k][j].isHandled){
                        showNumCellMove(i,j,k,j);
                        aNumCells[k][j] += aNumCells[i][j];
                        aNumCells[i][j] = 0;

                        aNumCells[k][j].isHandled = true;

                        //add score
                        updateScore(aNumCells[k][j]);

                        continue;
                    }

                }

            }

        }
    }

    setTimeout(initNumCells,200);
    setTimeout(generateOneNum,200);
    setTimeout(isGameOver,300);

}

function moveDown(){
    if( !canMoveDown() ){
        return false;
    }

    for( var j = 0;j < 4 ; j++){
        for( var i = 2;i >= 0; i--){

            if(aNumCells[i][j] != 0){
                
                for (var k = 3; k > i; k--) {
                    /*case1*/
                    if(aNumCells[k][j] == 0){
                        showNumCellMove(i,j,k,j);
                        aNumCells[k][j] = aNumCells[i][j];
                        aNumCells[i][j] = 0;
                        continue;
                    }
                    /*case2*/
                    if(aNumCells[k][j] == aNumCells[i][j] && noBlockVertical(j,i,k) && !aNumCells[k][j].isHandled){
                        showNumCellMove(i,j,k,j);
                        aNumCells[k][j] += aNumCells[i][j];
                        aNumCells[i][j] = 0;

                        aNumCells[k][j].isHandled = true;

                        //add score
                        updateScore(aNumCells[k][j]);

                        continue;
                    }

                }

            }

        }
    }

    setTimeout(initNumCells,200);
    setTimeout(generateOneNum,200);
    setTimeout(isGameOver,300);

}

function isGameOver(){
    if(noSpace() && !canMoveLeft() && !canMoveRight() && !canMoveTop() && !canMoveDown()){
        $('#wrap').show();
        $('#grid-container').addClass('blur');
    }
}

function newGame(){
    //重置分数
    $('.score').find('p').eq(1).text(0);

    initDataArray();
    initNumCells();

    generateOneNum();
    generateOneNum();

}

//------------------
//--
//------------------
function getPosition(i,j){

    var pos = {
        left: 20 + 120*j,
        top: 20 + 120*i
    };
    return pos;

}

function getNumCellBackground(num){

    switch(num){
        case 2: return "#eee4da";break;
        case 4: return "#ede0c8";break;
        case 8: return "#f2b179";break;
        case 16: return "#f59563";break;
        case 32: return "#f67c5f";break;
        case 64: return "#f65e3b";break;
        case 128: return "#edcf72";break;
        case 256: return "#edcc61";break;
        case 512: return "#9c0";break;
        case 1024: return "#33b5e5";break;
        case 2048: return "#09c";break;
        case 4096: return "#a6c";break;
        case 8192: return "#93c";break;
    }

    return "#000";

}

function getNumCellColor(num){

    return num <= 4 ? "#776e65":"#fff";

}

function getNumCellFontSize(num){

    if( num > 99 && num <= 999){
        return '48px';
    }else if( num > 999){
        return '36px';
    }

    return '60px';
}

function canMoveLeft(){

    for( var i = 0;i < 4 ; i++){
        for( var j = 1;j < 4 ; j++){

            if(aNumCells[i][j] != 0){
                if(aNumCells[i][j-1] == 0 || aNumCells[i][j-1] == aNumCells[i][j]){
                    return true;
                }
            }

        }
    }
    
    return false;
}

function canMoveTop(){

    for( var j = 0;j < 4 ; j++){
        for( var i = 1;i < 4 ; i++){

            if(aNumCells[i][j] != 0){
                if(aNumCells[i-1][j] == 0 || aNumCells[i-1][j] == aNumCells[i][j]){
                    return true;
                }
            }

        }
    }
    
    return false;
}

function canMoveRight(){

    for( var i = 0;i < 4 ; i++){
        for( var j = 2;j >=0 ; j--){

            if(aNumCells[i][j] != 0){
                if(aNumCells[i][j+1] == 0 || aNumCells[i][j+1] == aNumCells[i][j]){
                    return true;
                }
            }

        }
    }
    
    return false;
}

function canMoveDown(){

    for( var j = 0;j < 4 ; j++){
        for( var i = 2;i >= 0 ; i--){

            if(aNumCells[i][j] != 0){
                if(aNumCells[i+1][j] == 0 || aNumCells[i+1][j] == aNumCells[i][j]){
                    return true;
                }
            }

        }
    }
    
    return false;
}

function noBlockHorizontal(row,col1,col2){

    for(var i=col1+1;i<col2;i++){
        if(aNumCells[row][i]!=0){
            return false;
        }
    }

    return true;

}

function noBlockVertical(col,row1,row2){

    for(var i=row1+1;i<row2;i++){
        if(aNumCells[i][col]!=0){
            return false;
        }
    }

    return true;

}

function noSpace(){

    for( var i = 0;i < 4 ; i++){
        for( var j = 0;j < 4 ; j++){

            if(aNumCells[i][j] == 0){
                return false;
            }

        }
    }

    return true;
}

//------------------
//--
//------------------
function showGeneratedNum(i,j,num){

    var oNumCell = $('#num-cell-'+i+'-'+j);
    oNumCell.css({
        'background': getNumCellBackground(num),
        'color': getNumCellColor(num)
    });
    oNumCell.text(num);

    oNumCell.animate({
        'width': '100px',
        'height': '100px',
        'top': getPosition(i,j).top + 'px',
        'left': getPosition(i,j).left + 'px'
    },50);
}

function showNumCellMove(row1,col1,row2,col2){
    var oNumCell = $('#num-cell-'+row1+'-'+col1);
    oNumCell.animate(getPosition(row2,col2),200);
}

function updateScore(score){

    var iScore = parseInt($('.score').find('p').eq(1).text()) + score;

    $('.score').find('p').eq(1).text(iScore);

    var iMaxScore = $('.history-score').find('p').eq(1).text();

    console.log(iScore+':'+iMaxScore);

    if(iScore > iMaxScore){
        $('.history-score').find('p').eq(1).text(iScore);

        window.localStorage.setItem('historyscore',iScore);
    }

}
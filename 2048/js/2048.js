//------------------
//--
//------------------
var aNumCells = [];
var aHandledCells = [];
var bGameOver = false;

var bTouchMoveEvent = false;
var bTouchEndEvent = false;

var count = 0;

/*初始化设备信息*/
var iBoxWidth = 720;
var iBoxHeight = 500;
var iNavWidth = 200;
var iContainerWidth = 500;
var iCellWidth = 100;
var iCellSpaceWidth = 20;

/*初始化触摸事件*/
var oTouchEvent = {
    sx : 0,
    sy : 0,
    ex : 0,
    ey : 0,
    sTime : 0,
    eTime : 0
}

$(function(){

    initSelfAdaption();
    //console.log(aNumCells);
    initContrainer();
    //console.log(aNumCells);
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
            $('.grid-cell').css({
                'height':iCellWidth+'px',
                'width':iCellWidth+'px'
            });

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

    console.log(aNumCells);

    $(".num-cell").remove();

    for( var i = 0;i < 4 ; i++){

        aHandledCells[i] = [];

        for( var j = 0;j < 4 ; j++){

            var pos = getPosition(i,j);

            var sNumCell = '<div class="num-cell" id="num-cell-'+i+'-'+j+'"></div>';
            $('#grid-container').append(sNumCell);
            var oNumCell = $('#num-cell-'+i+'-'+j);

            aHandledCells[i][j] = false;
            
            if(aNumCells[i][j] == 0 ){
                oNumCell.css({
                    'width': 0,
                    'height': 0,
                    'top': pos.top + iCellWidth*0.5,
                    'left': pos.left + iCellWidth*0.5
                });
            }else{
                oNumCell.text(aNumCells[i][j]);
                oNumCell.css(pos);
                oNumCell.css({
                    'background': getNumCellBackground(aNumCells[i][j]),
                    'color': getNumCellColor(aNumCells[i][j]),
                    'font-size': getNumCellFontSize(aNumCells[i][j])
                });
                oNumCell.css('line-height',iCellWidth+'px');
                oNumCell.css({
                    'width':iCellWidth,
                    'height':iCellWidth
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

    if(bGameOver && evt.keyCode == 13){
        $('#wrap').hide();
        $('#grid-container').removeClass('blur');
        newGame();
    }

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
            evt.preventDefault();
            moveLeft();
            break;
        case 38: 
        case 87://w
            evt.preventDefault();
            moveTop();
            break;
        case 39: 
        case 68://d
            evt.preventDefault();
            moveRight();
            break;
        case 40: 
        case 83://s
            evt.preventDefault();
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
                        break;
                    }
                    /*case2*/
                    if(aNumCells[i][k] == aNumCells[i][j] && noBlockHorizontal(i,k,j) && !aHandledCells[i][k]){
                        showNumCellMove(i,j,i,k);
                        aNumCells[i][k] += aNumCells[i][j];
                        aNumCells[i][j] = 0;

                        aHandledCells[i][k] = true;

                        //add score
                        updateScore(aNumCells[i][k]);

                        break;
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
                        break;
                    }
                    /*case2*/
                    if(aNumCells[i][k] == aNumCells[i][j] && noBlockHorizontal(i,j,k) && !aHandledCells[i][k]){
                        showNumCellMove(i,j,i,k);
                        aNumCells[i][k] += aNumCells[i][j];
                        aNumCells[i][j] = 0;

                        aHandledCells[i][k] = true;

                        //add score
                        updateScore(aNumCells[i][k]);

                        break;
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
                        break;
                    }
                    /*case2*/
                    if(aNumCells[k][j] == aNumCells[i][j] && noBlockVertical(j,k,i) && !aHandledCells[k][j]){
                        showNumCellMove(i,j,k,j);
                        aNumCells[k][j] += aNumCells[i][j];
                        aNumCells[i][j] = 0;

                        aHandledCells[k][j] = true;

                        //add score
                        updateScore(aNumCells[k][j]);

                        break;
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
                        break;
                    }
                    /*case2*/
                    if(aNumCells[k][j] == aNumCells[i][j] && noBlockVertical(j,i,k) && !aHandledCells[k][j]){
                        showNumCellMove(i,j,k,j);
                        aNumCells[k][j] += aNumCells[i][j];
                        aNumCells[i][j] = 0;

                        aHandledCells[k][j] = true;

                        //add score
                        updateScore(aNumCells[k][j]);

                        break;
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
        bGameOver = true;
    }
}

function newGame(){
    //重置分数
    $('.score').find('p').eq(1).text(0);

    bGameOver = false;

    initDataArray();
    initNumCells();

    generateOneNum();
    generateOneNum();

}

//add by raleigh 2016-08-06 15:17:35
function initSelfAdaption(){
    var iDeviceWidth = window.screen.availWidth;
    if(iDeviceWidth >= 720){
        return;
    }else{
        iBoxWidth = iDeviceWidth;
        iBoxHeight = iDeviceWidth;
        iNavWidth = iDeviceWidth;
        iContainerWidth = iDeviceWidth;
        iCellWidth = iDeviceWidth*0.2;
        iCellSpaceWidth = iDeviceWidth*0.04;
    }

    $('#game-box').css({
        'width':iBoxWidth
    });

    $('#nav').css({
        'width':iNavWidth+'px',
        'height':iNavWidth*0.5+'px',
    });

    $('#nav strong,#nav a').css({
        'width':iNavWidth*0.44+'px',
        'height':iNavWidth*0.2+'px',
        'line-height':iNavWidth*0.2+'px',
        'font-size':iNavWidth*0.1+'px',
        'margin':iCellSpaceWidth+'px'
    });

    $('#nav a').css({
        'font-size':iNavWidth*0.05+'px'
    });

    $('#nav .score,#nav .history-score').css({
        'width':iNavWidth*0.44+'px',
        'height':iNavWidth*0.2+'px',
        'line-height':iNavWidth*0.1+'px',
        'margin':iCellSpaceWidth+'px'
    });

    $('#nav .score').find('p').eq(0).css({
        'line-height':iNavWidth*0.09+'px',
        'height':iNavWidth*0.09+'px',
        'font-size':iNavWidth*0.05+'px'
    });

    $('#nav .score').find('p').eq(1).css({
        'line-height':iNavWidth*0.11+'px',
        'height':iNavWidth*0.11+'px',
        'font-size':iNavWidth*0.09+'px'
    });

    $('#nav .history-score').find('p').eq(0).css({
        'line-height':iNavWidth*0.09+'px',
        'height':iNavWidth*0.09+'px',
        'font-size':iNavWidth*0.05+'px'
    });

    $('#nav .history-score').find('p').eq(1).css({
        'line-height':iNavWidth*0.11+'px',
        'height':iNavWidth*0.11+'px',
        'font-size':iNavWidth*0.09+'px'
    });

    $('#grid-container').css({
        'height':iNavWidth+'px',
        'width':iNavWidth+'px'
    });

}

document.addEventListener('touchstart',function(evt){
    initTouchEvent(evt);
});

document.addEventListener('touchmove',function(evt){
    evt.preventDefault();
    doSomeThing(evt);
});

document.addEventListener('touchend',function(){

    bTouchEndEvent = true;

});

function initTouchEvent(evt){

    if(bGameOver){
        return;
    }

    for( var i = 0;i < 4 ; i++){
        for( var j = 0;j < 4 ; j++){
            if( $('#num-cell-'+i+'-'+j).is(':animated') ){
                return false;
            }
        }
    }

    oTouchEvent.sx = evt.touches[0].pageX;
    oTouchEvent.sy = evt.touches[0].pageY;
    oTouchEvent.sTime = new Date().getTime();

    bTouchMoveEvent = false;
    bTouchEndEvent = false;
}

function doSomeThing(evt){

    if(bTouchMoveEvent){
        return;
    }

    oTouchEvent.ex = evt.touches[0].pageX;
    oTouchEvent.ey = evt.touches[0].pageY;
    oTouchEvent.eTime = new Date().getTime();

    var dx = oTouchEvent.ex - oTouchEvent.sx;
    var dy = oTouchEvent.ey - oTouchEvent.sy;

    if(oTouchEvent.eTime - oTouchEvent.sTime < 50){
        return;
    }

    if(Math.abs(dx)<iCellWidth && Math.abs(dy)<iCellWidth){
        return;
    }

    if(Math.abs(dx)>=Math.abs(dy)){
        if(dx>0){
            //right
            moveRight();
        }else{
            //left
            moveLeft();
        }
    }else{
        if(dy>0){
            //down
            moveDown();
        }else{
            //top
            moveTop();
        }
    }

    document.title = count++;

    bTouchMoveEvent = true;

}

//------------------
//--
//------------------
function getPosition(i,j){

    var pos = {
        left: iCellSpaceWidth + (iCellWidth+iCellSpaceWidth)*j,
        top: iCellSpaceWidth + (iCellWidth+iCellSpaceWidth)*i,
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
        return 48*iCellWidth/100+'px';
    }else if( num > 999){
        return 36*iCellWidth/100+'px';
    }

    return 60*iCellWidth/100+'px';
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
        'color': getNumCellColor(num),
        'font-size':iCellWidth*60/100+'px',
        'line-height':iCellWidth+'px'
    });
    oNumCell.text(num);

    oNumCell.animate({
        'width': iCellWidth,
        'height': iCellWidth,
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

    if(iScore > iMaxScore){
        $('.history-score').find('p').eq(1).text(iScore);

        window.localStorage.setItem('historyscore',iScore);
    }

}
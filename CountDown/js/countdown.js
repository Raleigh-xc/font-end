/*

 */
var WIDTH = 1024;
var HEIGHT = 500;
var RADIUS = 6;
var TOP = 60;
var LEFT = 130;

var oDataEnd = new Date();
//oDataEnd.setDate(oDataEnd.getDate() + 2);
oDataEnd.setTime(oDataEnd.getTime() + 1*3600*1000);

var iRemainSec = 0;

var aColor = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

var aBall = [];

/*

 */
window.onload = function(){

    WIDTH = document.documentElement.clientWidth;
    HEIGHT = document.documentElement.clientHeight;

    LEFT = Math.round(WIDTH/5);
    RADIUS = Math.round(WIDTH*3/5/107)-1;
    TOP = Math.round(HEIGHT/5);


    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    iRemainSec = getRemianSec();

    renderMain(context);

    setInterval(function(){
        renderMain(context);
        update();
    },50);

}

/*
    update()
 */
function update(){

    var nextRemainSec = getRemianSec();
    var oNextHour = parseInt(nextRemainSec/3600);
    var oNextMinute = parseInt((nextRemainSec - oNextHour*3600)/60);
    var oNextSecond = nextRemainSec%60;

    var oCurHour = parseInt(iRemainSec/3600);
    var oCurMinute = parseInt((iRemainSec - oCurHour*3600)/60);
    var oCurSecond = iRemainSec%60;

    if(oNextSecond != oCurSecond){

        if(parseInt(oNextHour/10) != parseInt(oCurHour/10)){
            createBalls(LEFT,TOP,parseInt(oCurHour/10));
        }
        if(parseInt(oNextHour%10) != parseInt(oCurHour%10)){
            createBalls(LEFT+15*(RADIUS+1),TOP,parseInt(oCurHour%10));
        }

        if(parseInt(oNextMinute/10) != parseInt(oCurMinute/10)){
            createBalls(LEFT+39*(RADIUS+1),TOP,parseInt(oCurMinute/10));
        }
        if(parseInt(oNextMinute%10) != parseInt(oCurMinute%10)){
            createBalls(LEFT+54*(RADIUS+1),TOP,parseInt(oCurMinute%10));
        }

        if(parseInt(oNextSecond/10) != parseInt(oCurSecond/10)){
            createBalls(LEFT+78*(RADIUS+1),TOP,parseInt(oCurSecond/10));
        }
        if(parseInt(oNextSecond%10) != parseInt(oCurSecond%10)){
            createBalls(LEFT+93*(RADIUS+1),TOP,parseInt(oCurSecond%10));
        }

        iRemainSec = nextRemainSec;
    }

    updateBalls();

}

/*
    updateBalls()
 */
function updateBalls(){

    for (var i = 0; i < aBall.length; i++) {

        aBall[i].x += aBall[i].vx;
        aBall[i].y += aBall[i].vy;
        aBall[i].vy += aBall[i].g;

        if(aBall[i].y >= HEIGHT - RADIUS){
            aBall[i].y = HEIGHT - RADIUS;
            aBall[i].vy *= -0.75;
        }
    }

    //optimization
    var count = 0
    for (var i = 0; i < aBall.length; i++) {
        if(aBall[i].x > 0 - RADIUS && aBall[i].x < WIDTH + RADIUS){
            aBall[count++] = aBall[i];
        }
    }

    while(aBall.length > Math.min(300,count)){
        aBall.pop();
    }
}

/*
    createBalls()
 */
function createBalls(x,y,num){
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {

            if(digit[num][i][j]==1){

                var oBall = {
                    x : x + j*2*(RADIUS+1) + (RADIUS+1),
                    y : y + i*2*(RADIUS+1) + (RADIUS+1),
                    g : 1.5 + Math.random(),
                    vx : Math.pow(-1,Math.ceil(Math.random()*2))*4,
                    vy : -5,
                    color : aColor[ Math.floor(Math.random()*aColor.length) ]
                };

                aBall.push(oBall);

            }
        }
    }
}

/*
    getRemianSec()
 */
function getRemianSec(){
    var oDataNow = new Date();
    var iRemainSec = (oDataEnd.getTime() - oDataNow.getTime())/1000;

    if(iRemainSec <= 0){
        iRemainSec = 0;
    }

    return Math.round(iRemainSec);
}

/*
    renderMain()
 */
function renderMain(context){

    context.clearRect(0,0,context.canvas.width,context.canvas.height);

    var oHour = parseInt(iRemainSec/3600);
    var oMinute = parseInt((iRemainSec - oHour*3600)/60);
    var oSecond = iRemainSec%60;

    renderDigit(LEFT,TOP,parseInt(oHour/10),context);
    renderDigit(LEFT+15*(RADIUS+1),TOP,parseInt(oHour%10),context);
    renderDigit(LEFT+30*(RADIUS+1),TOP,10,context);
    renderDigit(LEFT+39*(RADIUS+1),TOP,parseInt(oMinute/10),context);
    renderDigit(LEFT+54*(RADIUS+1),TOP,parseInt(oMinute%10),context);
    renderDigit(LEFT+69*(RADIUS+1),TOP,10,context);
    renderDigit(LEFT+78*(RADIUS+1),TOP,parseInt(oSecond/10),context);
    renderDigit(LEFT+93*(RADIUS+1),TOP,parseInt(oSecond%10),context);

    for (var i = 0; i < aBall.length; i++) {

        context.fillStyle = aBall[i].color;

        context.beginPath();
        context.arc(aBall[i].x,aBall[i].y,RADIUS,0,2*Math.PI);
        context.closePath();
        context.fill();

    }
}

/*
    renderDigit()
 */
function renderDigit(x,y,num,context){

    context.fillStyle = 'rgb(0,102,153)';

    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {

            if(digit[num][i][j]==1){

                context.beginPath();
                context.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);
                context.closePath();
                context.fill();

            }

        }
    }
}
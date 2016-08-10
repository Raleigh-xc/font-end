function getStyle(obj,attr){

    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];

}

function startMove(obj,json,fn,baseNum){

    clearInterval(obj.timer);

    var num = 8;

    if(baseNum){
        num = baseNum;
    }

    obj.timer = setInterval(function(){

        var bStop = true;

        for(attr in json){

            var iCur = 0;

            if(attr == 'opacity'){
                iCur = parseInt(parseFloat(getStyle(obj,attr))*100);
            }else{
                iCur = parseInt(getStyle(obj,attr));
            }

            var iSpeed = (json[attr] - iCur)/num;

            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

            if(iCur != json[attr]){
                bStop = false;
            }

            if(attr == 'opacity'){
                obj.style.filter = 'alpha(opacity:'+ (iCur + iSpeed) + ')';
                obj.style.opacity = (iCur + iSpeed)/100;
            }else{
                obj.style[attr] = iCur + iSpeed + 'px';
            }
        }

        if(bStop){
                
            clearInterval(obj.timer);

            if(fn){
                fn();
            }
        }

    },30);
}

function getByClassName( parent,tagName,className ){

    var aEls = parent.getElementsByTagName(tagName);

    var arr = [];

    for (var i = 0; i < aEls.length; i++) {

        var aClassName = aEls[i].className.split(' ');

        for (var j = 0; j < aClassName.length; j++) {

            if(aClassName[j] == className){
                arr.push(aEls[i]);
                break;
            }

        }

    }

    return arr;

}

function bindEvent(obj,sEvent,fn){
    if(obj.attachEvent){
        obj.attachEvent('on'+sEvent,fn);
    }else{
        obj.addEventListener(sEvent,fn,false);
    }
}

function unBindEvent(obj,sEvent,fn){
    if(obj.detachEvent){
        obj.detachEvent('on'+sEvent,fn);
    }else{
        obj.removeEventListener(sEvent,fn,false);
    }
}
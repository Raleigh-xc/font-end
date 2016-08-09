var iNow = 0;

window.onload = function(){

    bindEvent(document,'mousewheel',mouseWheel);
    bindEvent(document,'DOMMouseScroll',mouseWheel);

    navListSwitchByClick();

    doSwitch();

}

function mouseWheel(ev){

    var aContentList = getByClassName(document.body,'ul','content-list');
    var aLists = aContentList[0].children;

    var ev = ev || window.event;

    var bDown = ev.wheelDelta ? ev.wheelDelta < 0 : ev.detail > 0;

    if(bDown){
        //down
        if(iNow == aLists.length - 1){
            return;
        }

        //alert(iNow+':'+(aLists.length - 1))

        iNow++;
        doSwitch();

    }else{
        //top
        if(iNow == 0){
            return;
        }

        iNow--;
        doSwitch();

    }

    if(ev.preventDefault){
        ev.preventDefault();
    }

    unBindEvent(document,'mousewheel',mouseWheel);
    unBindEvent(document,'DOMMouseScroll',mouseWheel);

    setTimeout(function(){
        bindEvent(document,'mousewheel',mouseWheel);
        bindEvent(document,'DOMMouseScroll',mouseWheel);
    },1000);

    return false;
}

function doSwitch(){

    var aContentList = getByClassName(document.body,'ul','content-list');

    var aContents = aContentList[0].querySelectorAll('.content');

    var iHeight = aContentList[0].offsetHeight;

    var oBanner = document.getElementById('banner');

    if(iNow == 0){
        oBanner.style.opacity = 0;
        oBanner.style.filter = 'alpha(opacity:'+0+')';
    }else{
        oBanner.style.opacity = 1;
        oBanner.style.filter = 'alpha(opacity:'+100+')';
    }

    startMove(aContentList[0],{'top': -iHeight*iNow},function(){

        navListSwitch();

        if(aContents[iNow].isAnimated){
            return;
        }

        startMove(aContents[iNow].querySelector('.title-underline'),{'width':700},function(){
            startMove(aContents[iNow].querySelector('.section'),{'height':220});
        });
        //startMove(aContents[iNow].querySelector('.section-underline'),{'width':700});
        aContents[iNow].isAnimated = true;
    });

}

function navListSwitch(){

    var aNav = getByClassName(document.body,'ul','nav-list');
    var aNavList = aNav[0].getElementsByTagName('li');

    for (var i = 0; i < aNavList.length; i++) {
        aNavList[i].className = '';
    }

    aNavList[iNow].className = 'active';

}

function navListSwitchByClick(){

    var aNav = getByClassName(document.body,'ul','nav-list');
    var aNavList = aNav[0].getElementsByTagName('li');

    for (var i = 0; i < aNavList.length; i++) {
        
        /*aNavList[i].index = i;
        aNavList[i].onclick =function(){
            iNow = this.index;
            doSwitch();
        };*/

        (function (i){
            aNavList[i].onclick =function(){
                if(iNow == i){
                    return;
                }
                iNow = i;
                doSwitch();
            };
        })(i);

    }

}
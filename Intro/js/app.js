var iNow = 0;
var arrBg = ['body-bg.jpg','body-bg2.jpg','body-bg3.jpg','body-bg4.jpg','body-bg5.jpg'];

window.onload = function(){

    bindEvent(document,'mousewheel',mouseWheel);
    bindEvent(document,'DOMMouseScroll',mouseWheel);
    navListSwitchByClick();
    doSwitch();

}

/*鼠标滚轮事件*/
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

    /*设置1s的触发间隔，防止一滚到底*/
    unBindEvent(document,'mousewheel',mouseWheel);
    unBindEvent(document,'DOMMouseScroll',mouseWheel);

    setTimeout(function(){
        bindEvent(document,'mousewheel',mouseWheel);
        bindEvent(document,'DOMMouseScroll',mouseWheel);
    },1000);

    return false;
}

/*页面切换*/
function doSwitch(){

    var aContentList = getByClassName(document.body,'ul','content-list');

    var aContents = aContentList[0].querySelectorAll('.content');

    var iHeight = aContentList[0].offsetHeight;

    var oBanner = document.getElementById('banner');

    var _iNow = iNow;

    if(_iNow == 0){
        oBanner.style.opacity = 0;
        oBanner.style.filter = 'alpha(opacity:'+0+')';
    }else{
        oBanner.style.opacity = 1;
        oBanner.style.filter = 'alpha(opacity:'+100+')';
    }

    navListSwitch();

    startMove(aContentList[0],{'top': -iHeight*_iNow},function(){

        if(aContents[_iNow].isAnimated){
            return;
        }

        if (iNow == 0){
            startMove(aContents[_iNow].querySelector('.section'),{'height':170},function(){
                document.querySelector('.nav-list').style.display = 'block';
            },80);
            aContents[_iNow].isAnimated = true;
        }else{
            startMove(aContents[_iNow].querySelector('.title-underline'),{'width':700},function(){
                startMove(aContents[_iNow].querySelector('.section'),{'height':220});
                aContents[_iNow].isAnimated = true;
            });
        }
        
    });

}

/*导航切换*/
function navListSwitch(){

    var aNav = getByClassName(document.body,'ul','nav-list');
    var aNavList = aNav[0].getElementsByTagName('li');

    for (var i = 0; i < aNavList.length; i++) {
        aNavList[i].className = '';
    }

    aNavList[iNow].className = 'active';

}

/*导航的鼠标点击事件*/
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
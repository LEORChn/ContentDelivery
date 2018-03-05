// ==UserScript==
// @name         Fake-Youtube Helper ver.cn
// @namespace
// @version      1.0
// @description  Fix so much problem. Caution: This script is not for really Youtube.
// @author       LEORChn
// @match        http*://198.13.56.205:8700/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
(function(){
    recheck();
})();
function recheck(){ doEvents();
    var a=ft('a');
    for(var i=0,len=a.length;i<len;i++)
        if(gfun(a[i].href)=='testtube'){
            start();
            return;
        }
    setTimeout(recheck,1000);
}
function start(){
    var m=location.href;
    switch(gfun(m)){
        case'results':
            fix_watch_page_link();
            fix_img();
            break;
        case'watch':
            fix_img();
            fix_player();
    }
}
function fix_watch_page_link(){
    for(var a=ft('a'),i=0,len=a.length;i<len;i++)
        a[i].href=a[i].href.replace('45.32.76.85:9999','198.13.56.205:8700');
}
function fix_img(){
    for(var a=ft('img'),i=0,len=a.length;i<len;i++){
        var tmp=a[i].getAttribute('data-thumb');
        if(tmp) a[i].src=tmp;
    }
}
function fix_player(){
    var a=fv('player-api');
    a.innerHTML='<video src="http://45.32.76.85:9999/download?v='+gvid()+'&type=video" style="width:100%;height:100%" controls="controls" autoplay="true">Failed</video>';
}
function gfun(url){return url.split('?')[0].split('/')[3];}
function gvid(){return location.href.split('v=')[1].split('&')[0];}
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function tip(s){console.log(s);}
function doEvents(){console.log('doEvents');}
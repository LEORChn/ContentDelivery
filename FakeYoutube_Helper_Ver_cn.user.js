// ==UserScript==
// @name         Fake-Youtube Helper
// @namespace
// @version      1.1
// @description  Fix so much problem. Caution: This script is not for really Youtube.
// @author       LEORChn
// @match        http*://198.13.56.205:8700/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
var vip;
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
    init_play_server();
    var m=location.href;
    switch(gfun(m)){
        case'watch':
            fix_player();
        case'results':
            fix_watch_page_link();
            fix_img();
            break;
    }
}
function fix_watch_page_link(){
    var ip=vip.split('//')[1];
    for(var a=ft('a'),i=0,len=a.length;i<len;i++)
        a[i].href=a[i].href.replace(ip,'198.13.56.205:8700');
}
function fix_img(){
    for(var a=ft('img'),i=0,len=a.length;i<len;i++){
        var tmp=a[i].getAttribute('data-thumb');
        if(tmp) a[i].src=tmp;
    }
}
function fix_player(){
    var a=fv('player-api');
    a.innerHTML='<video src="'+vip+'/download?v='+gvid()+'&type=video" style="width:100%;height:100%" controls="controls" autoplay="true">Failed</video>';
}
function init_play_server(){
    for(var a=ft('a'),i=0,len=a.length,fstr=0;i<len;i++){
        fstr=a[i].href.indexOf('/watch?');
        if(fstr>0){
            vip=a[i].href.substring(0,fstr);
            return;
        }
    }
}
function gfun(url){return url.split('?')[0].split('/')[3];}
function gvid(){return location.href.split('v=')[1].split('&')[0];}
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function tip(s){console.log(s);}
function doEvents(){console.log('doEvents');}
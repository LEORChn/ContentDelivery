// ==UserScript==
// @name         Fake-Youtube Helper
// @name:zh-CN   假油管的助手
// @namespace    https://greasyfork.org/users/159546
// @version      1.3.1
// @description  Fix so much problem. Caution: This script is not for really Youtube.
// @description:zh-CN 修复了油管的很多问题。注意：这个脚本不是给真的油管使用。
// @author       LEORChn
// @match        http*://198.13.34.55:8700/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
var vip,fun;
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
    initPlayServer();
    fun=gfun(location.href);
    switch(fun){
        case'user':
        case'watch':
            fix_player();
        case'results':
        case'channel':
        case'':
            fix_watch_page_link();
            fix_img();
            break;
    }
    addfeature();
}
function fix_watch_page_link(){
    var ip=vip.split('//')[1],hexip='';
    for(var i=0,len=4,h=ip.split(':')[0].split('.');i<len;i++) hexip+=(h[i]>15?'':'0')+parseInt(h[i],10).toString(16);
    for(var a=ft('a'),i=0,len=a.length;i<len;i++)
        if(a[i].href.indexOf(ip)>0)
            a[i].href=a[i].href.replace(vip,'')+'&pid='+hexip;
}
function fix_img(){
    for(var a=ft('img'),i=0,len=a.length;i<len;i++){
        var tmp=a[i].getAttribute('data-thumb');
        if(tmp) a[i].src=tmp;
    }
}
function fix_player(){
    var a,vid;
    switch(fun){
        case'user':a=fv('upsell-video');if(a==null)return;vid=a.getAttribute('data-video-id');break;
        case'watch':a=fix_fullpage();vid=gvid();break;
    }
    vp=ct('video');
    a.appendChild(vp);
    vp.outerHTML='<video id="leorvp" src="'+vip+'/live?v='+vid+'" style="width:100%;height:100%" controls="controls" autoPlay>Failed</video>';
    a.className=a.className.replace('off-screen-target','');
    for(var i=0,b=ft('button'),len=b.length;i<len;i++) if(b[i].parentElement.id=='watch7-player-age-gate-content'){b[i].remove();break;}
    fc('meh')[0].className='';
    a=fv('player-unavailable'); a.className=a.className.replace('player-height','');
    vp=a=fv('leorvp');
    a.onclick=function(){if(a.paused)a.play();else a.pause();};
}
function fix_fullpage(){
    var w=fv('playerbox'),o=fv('placeholder-player'),l=absLeft(o),t=absTop(o)-100;
    if(w)return o;
    w=ct('div');
    w.id='playerbox';
    w.className='player-width player-height';
    w.style.cssText='position:absolute;left:'+l+'px;top:'+t+'px;z-index:5222';
    ft('body')[0].appendChild(w);
    var limtip=fv('player-unavailable');
    limtip.style.color='#ffffff';limtip.style.backgroundColor='transparent';
    w.appendChild(limtip);
    return w;
}
function initPlayServer(){
    for(var a=ft('a'),i=0,len=a.length,fstr=0;i<len;i++){
        fstr=a[i].href.indexOf('/watch?');
        if(fstr>0){
            vip=a[i].href.substring(0,fstr);
            return;
        }
    }
    gbakip();
}
function gbakip(){
    if(location.href.indexOf('pid=')==0)return;
    var ip=location.href.split('pid=')[1].split('&')[0].match(/[0-9a-fA-F]{2}/g);
    for(var i=0,len=4;i<4;i++) ip[i]=parseInt(ip[i],16);
    vip='http://'+ip.join('.')+':9999';
}
function gfun(url){return url.split('?')[0].split('/')[3];}
function gvid(){return location.href.split('v=')[1].split('&')[0];}
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function fc(cname){return document.getElementsByClassName(cname);}
function ct(tag,to){to=document.createElement(tag);return to;}
function tip(s){console.log(s);}
function doEvents(){console.log('doEvents');}
function absTop(e){var l=0;while(e){l+=e.offsetTop;e=e.parentElement;}return l;}
function absLeft(e){var l=0;while(e){l+=e.offsetLeft;e=e.parentElement;}return l;}
//----- -----
var vp,ctl;
function addfeature(){
    switch(fun){
        case'watch':
            initPlayerControl();
    }
    funny();
}
function initPlayerControl(){
    fv('placeholder-player').outerHTML+='<div id="vpctl" class="player-width"></div>';
    ctl=fv('vpctl');
    vpctl.onselectstart=function(){return false;};
    vpctl.style.cursor='default';
    vshareEntry(); loopEntry(); downloadEntry(); fullPageEntry(); playSpeedEntry();
}
function vshareEntry(){
    var n=ct('a');
    n.onclick=function(){prompt('Press Ctrl+C','http://youtu.be/'+gvid());};
    n.innerText='share, ';
    ctl.appendChild(n);
    n=ct('a');
    n.onclick=function(){prompt('Press Ctrl+C','http://youtu.be/'+gvid()+'?t='+parseInt(vp.currentTime)+'s');};
    n.innerText='with timestamp';
    ctl.appendChild(n);
}
function loopEntry(){
    var n=ct('text');
    n.innerHTML='<input type="checkbox" id="looper" /><text id="loopertext">loop </text>';
    ctl.appendChild(n);
    fv('looper').onchange=loopStatOC;
    fv('loopertext').onclick=loopStat;
}
function loopStat(){ var e=fv('looper'); e.checked=!e.checked; loopStatOC(); }
function loopStatOC(){ vp.loop=fv('looper').checked; }
function downloadEntry(){
    var n=ct('text');
    n.innerHTML='<a id="vdlgo" target="_blank">Download</a><select id="vdltype" style="width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+
        '<option>Video</option><option>Audio</option><option>Video (Live-Play Source)</option></select>';
    ctl.appendChild(n);
    download_seturl();
    n=fv('vdltype');
    n.onclick=download_seturl;
}
function download_seturl(){
    var dl=vip+'/download?v='+gvid()+'&type=',vdlgo=fv('vdlgo');
    switch(fv('vdltype').selectedIndex){
        case 0:vdlgo.href=dl+'video';break;
        case 1:vdlgo.href=dl+'audio';break;
        case 2:vdlgo.href=fv('leorvp').src;
    }
}
function playSpeedEntry(){
    var n=ct('text');
    n.innerHTML='Playback speed<select id="vpps"><option>0.5</option><option>0.8</option><option selected>1</option>'+
        '<option>1.2</option><option>1.3</option><option>1.5</option><option>2</option></select>';
    ctl.appendChild(n); n.style.cssText='float:right';
    fv('vpps').onclick=function(e){vp.playbackRate=parseFloat(e.target.options[e.target.selectedIndex].innerText);};
}
function fullPageEntry(){
    var n=ct('a');
    n.innerText='Fullpage';
    n.style.cssText='float:right;margin-left:5px';
    ctl.appendChild(n);
    n.onclick=function(){
        var pb=fv('playerbox'),o=fix_fullpage(),l=absLeft(o),t=absTop(o)-100;
        pb.style.cssText=pb.style.cssText?'':'position:absolute;left:'+l+'px;top:'+t+'px;z-index:5222';
        pb.className=pb.style.cssText?'player-width player-height':'fullpagescreen';
    };
    vp.ondblclick=n.onclick;
    n=ct('style');
    n.type='text/css';
    n.innerHTML='.fullpagescreen{background-color:#404040;position:absolute;width:100%;height:100%;top:0px;left:0px;z-index:5222}';
    //alert(n.outerHTML);
    ft('body')[0].appendChild(n);
}
function funny(){
    //for(var i=0,b=fc('yt-uix-button-content'),len=b.length;i<len;i++) if(b[i]&&!b[i].parentNode.href&&isNaN(b[i].innerText)) funny_1_do(b[i]);
}
function funny_1_do(b){b.innerText='';b.parentNode.remove();}

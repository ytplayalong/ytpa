(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[300],{7734:function(e,t,r){Promise.resolve().then(r.bind(r,5060)),Promise.resolve().then(r.bind(r,4267))},5060:function(e,t,r){"use strict";r.d(t,{default:function(){return W}});var n=r(7437),a=r(9376),i=r(2641),s=r(2265),l=r(2828);class o{interpolate(e){var t,r,n,a,i,s,l,o,c,h;for(s=h=this.x.length-2;(h<=0?s<=0:s>=0)&&!(this.x[s]<=e);h<=0?s+=1:s-=1);return t=this.x[s+1]-this.x[s],o=Math.pow(l=(e-this.x[s])/t,2),r=2*(c=Math.pow(l,3))-3*o+1,a=c-2*o+l,n=-2*c+3*o,i=c-o,r*this.y[s]+a*t*this.m[s]+n*this.y[s+1]+i*t*this.m[s+1]}constructor(e,t){var r,n,a,i,s,l,o,c,h,d,u,m,p,g,x,f,v;for(s=0,o=e.length,a=[],l=[],r=[],n=[],i=[],c=[],g=o-1;0<=g?s<g:s>g;0<=g?s+=1:s-=1)a[s]=(t[s+1]-t[s])/(e[s+1]-e[s]),s>0&&(l[s]=(a[s-1]+a[s])/2);for(s=0,l[0]=a[0],l[o-1]=a[o-2],h=[],x=o-1;0<=x?s<x:s>x;0<=x?s+=1:s-=1)0===a[s]&&h.push(s);for(d=0,m=h.length;d<m;d++)l[s=h[d]]=l[s+1]=0;for(s=0,f=o-1;0<=f?s<f:s>f;0<=f?s+=1:s-=1)r[s]=l[s]/a[s],n[s]=l[s+1]/a[s],i[s]=Math.pow(r[s],2)+Math.pow(n[s],2),c[s]=3/Math.sqrt(i[s]);for(s=0,h=[],v=o-1;0<=v?s<v:s>v;0<=v?s+=1:s-=1)i[s]>9&&h.push(s);for(u=0,p=h.length;u<p;u++)l[s=h[u]]=c[s]*r[s]*a[s],l[s+1]=c[s]*n[s]*a[s];this.x=e.slice(0,o),this.y=t.slice(0,o),this.m=l}}function c(){let{innerWidth:e,innerHeight:t}=window;return{width:e,height:t}}var h=r(4267);let d="osmd";class u extends l.OpenSheetMusicDisplay{setup(){this.rules.FingeringPosition=1,this.rules.FingeringOffsetY=1,this.rules.FingeringPositionFromXML=!1}}let m=async(e,t,r,n)=>{let a=new u(d,{drawCredits:!1,drawPartNames:!1,measureNumberInterval:4});return a.setup(),await a.load(e),a.setCustomPageFormat(t,r),a.Zoom=n,a.render(),a},p=(e,t,r)=>[...Array(r)].map((n,a)=>e+(t-e)*a/r),g=(e,t)=>{let r=e.GraphicSheet.MeasureList,n=r.map(e=>{var t;return null===(t=e[0])||void 0===t?void 0:t.stave.x}),a=Object.entries(t).map(e=>[parseFloat(e[0]),e[1]]);if(a.sort((e,t)=>e[0]-t[0]),a=[[0,0]].concat(a),!h.settingsManager.isHorizontalMode()){let e=r.map(e=>{var t;return null===(t=e[0])||void 0===t?void 0:t.stave.y}),t=e[0];e=e.map(e=>e-t);let a=0,i=[[0,0]],s=[];e.forEach((e,t)=>{if(!isNaN(e)){if(e!=a){let e=i[i.length-1],r=p(e[1],a,t-e[0]);s=s.concat(r),i.push([t,a])}a=e}});let l=i[i.length-1],o=e.length-1;if(l[0]!=o){i.push([o,a]);let e=p(l[1],a,o-l[0]);(s=s.concat(e)).push(a)}n=s}let i=a.length,[s,l]=a[0],c=[],d=[];for(let e=0;e<i-1;++e){let[t,r]=a[e+1];if(void 0!==n[r-1]){for(let e=l;e<r;++e){let a=n[e-1];if(void 0!==a){let n=s+(t-s)*(e-l)/(r-l);c.push(n),d.push(a)}}s=t,l=r}}c.push(s),d.push(n[l-1]),[1,2].forEach(e=>{c.push(s+5*e),d.push(n[l-1])});let u=h.settingsManager.isHorizontalMode()?.3:0,m=new o(c,d);return(e,t)=>{let r=u*window.innerWidth;return Math.max(0,m.interpolate(e)*t-r)}},x=e=>{let[t,r]=(0,s.useState)({x:0,y:0}),[a,i]=(0,s.useState)(null),{height:l}=function(){let[e,t]=(0,s.useState)(c());return(0,s.useEffect)(()=>{function e(){t(c())}return window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[]),e}(),o=h.settingsManager.getZoom(),u=Math.max(150,.2*l),p=Math.max(Math.min(1,u/260),.5)*o,x=u*p,f=h.settingsManager.isHorizontalMode()?4e4*x:window.innerWidth,{getTime:v,measureMap:y,xml:w}=e;(0,s.useEffect)(()=>((async()=>{let e=h.settingsManager.isHorizontalMode()?u*o:1e5;i({ip:g(await m(w,f,e,p),y)})})(),()=>{i(null)}),[w,y,u,o,f]),(0,s.useEffect)(()=>{if(null!==a){let e=a.ip,t=setInterval(async()=>{let t=e(await v(),p);r(h.settingsManager.isHorizontalMode()?{x:t,y:0}:{x:0,y:t})},20);return()=>{clearInterval(t)}}},[v,a,p]);let M=h.settingsManager.isHorizontalMode()?u*o:800;return(0,n.jsx)("div",{style:{overflow:"hidden"},children:(0,n.jsx)("div",{id:d,style:{height:"".concat(M+t.y,"px"),width:"".concat(f,"px"),marginLeft:"-".concat(t.x,"px"),marginTop:"-".concat(t.y,"px")}})})};var f=r(5259),v=r(5061),y=r(8138);let w=[1,0,-1],M=async e=>(await fetch(e)).text(),j=(e,t,r,n)=>{let a=(0,i.s1)(e,t);a.childNodes.forEach(e=>{e.nodeName===r&&e.id!==n&&a.removeChild(e)})},I=e=>{let t=e.cloneNode(!0);return t.xmlStandalone=e.xmlStandalone,t},E=e=>{let t=e.parts[e.currPartIdx].id,r=I(e.origXml);j(r,"part-list","score-part",t),j(r,"score-partwise","part",t);let n=h.settingsManager.getFingering();return(0,i.p4)(r,e.pitch,e.octave,n),r},N=e=>{let t=(0,i.s1)(e,"score-partwise"),r=[],n=t.getElementsByTagName("score-part");for(let e=0;e<n.length;++e)r.push({id:n[e].id,name:n[e].getElementsByTagName("part-name")[0].textContent});return r},P=()=>h.settingsManager.getInstrumentKey(),b=e=>{let{scoreInfo:t,player:r}=e,a="/mxl/".concat(t.fileName,".musicxml"),l="https://musescore.com/user/83726533/scores/".concat(t.source),{t:o}=(0,y.Z)(),[c,h]=(0,s.useState)(null);if((0,s.useEffect)(()=>{(async()=>{let e=await M(a),t=(0,i.ON)(e),r={xml:t,parts:N(t),currPartIdx:0,origXml:t,pitch:P(),octave:0};h({...r,xml:E(r)})})()},[a]),null!==c){let e=c.pitch,s=c.currPartIdx,d=c.octave,u=(t,r,n)=>{if(t===s&&r===e&&n===d)return;let a={...c,currPartIdx:t,pitch:r,octave:n},i=E(a);h({...a,xml:i,currPartIdx:t})},m=e=>e>0?"+".concat(e):"".concat(e),p=o("octave"),g=0===d?p:"".concat(p,": ").concat(m(d)),y=w.map(t=>({name:m(t),onClick:()=>u(s,e,t),key:m(t)})),M=(0,n.jsx)(f.H,{options:y,children:g}),j=e=>u(s,e,d),I=i.xj.map((e,t)=>({name:e,onClick:()=>j(e),key:e})),N=o("instrumentKeyShort"),P=(0,n.jsx)(f.H,{options:I,children:"".concat(N,": ").concat(e)}),b=(0,n.jsxs)("div",{style:v.Pp,children:[P,M]}),S=(0,n.jsx)(x,{xml:c.xml,measureMap:t.measureMap,getTime:r.getTime},a),k=(0,n.jsx)("div",{style:{width:i.g1.width,maxWidth:i.g1.maxWidth,margin:"auto"},children:(0,n.jsxs)("div",{style:{...v.yR,...v.W9},children:[(0,n.jsxs)("h4",{children:[o("viewSheetsOn"),(0,n.jsx)("br",{}),(0,n.jsx)("a",{href:l,target:"_blank",children:"MuseScore.com"})]}),b]})}),C=(0,n.jsx)("div",{style:{width:i.g1.width,maxWidth:i.g1.maxWidth,margin:"auto"},children:(0,n.jsxs)("div",{style:{...v.yR,...v.W9},children:[(0,n.jsx)("h3",{children:t.name}),(0,n.jsx)("h3",{children:"-"}),(0,n.jsx)("h3",{children:t.artist})]})});return(0,n.jsxs)(n.Fragment,{children:[C,r.comp,k,S]})}return(0,n.jsx)("div",{className:"container",children:(0,n.jsx)("div",{style:v.yR,children:"Loading..."})})};var S=r(5107);let k=e=>{let t=(0,s.useRef)(),r=(0,s.useCallback)(async()=>await t.current.getInternalPlayer().getCurrentTime(),[t]);return{comp:(0,n.jsx)(C,{playerRef:t,videoId:e}),getTime:r}},C=e=>{let{videoId:t,playerRef:r}=e,a={...i.g1,playerVars:{autoplay:1}},l=s.createElement(S.Z,{videoId:t,opts:a,ref:r,onReady:()=>console.log("I'm ready, loaded ".concat(t,"!"))});return(0,n.jsx)("div",{style:{...i.g1,margin:"auto"},children:(0,n.jsx)("div",{style:v.yR,children:l})})},H=e=>{let{scoreInfo:t}=e,r=k(t.videoId);return(0,n.jsx)(b,{scoreInfo:t,player:r})};var W=()=>{let e=(0,a.usePathname)().split("/")[3],t=i.f$.filter(t=>t.videoId===e);if(0===t.length)return(0,n.jsxs)("h3",{children:["YouTube score with ID ",(0,n.jsx)("b",{children:e})," not found :("]});let r=t[0];return(0,n.jsx)(H,{scoreInfo:r})}}},function(e){e.O(0,[170,822,648,739,209,971,117,744],function(){return e(e.s=7734)}),_N_E=e.O()}]);
(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[300],{7734:function(e,t,r){Promise.resolve().then(r.bind(r,7826)),Promise.resolve().then(r.bind(r,2635))},7826:function(e,t,r){"use strict";r.d(t,{default:function(){return S}});var n=r(7437),a=r(6463),i=r(1938),l=r(2265),s=r(573);class o{interpolate(e){var t,r,n,a,i,l,s,o,c,u;for(l=u=this.x.length-2;(u<=0?l<=0:l>=0)&&!(this.x[l]<=e);u<=0?l+=1:l-=1);return t=this.x[l+1]-this.x[l],o=Math.pow(s=(e-this.x[l])/t,2),r=2*(c=Math.pow(s,3))-3*o+1,a=c-2*o+s,n=-2*c+3*o,i=c-o,r*this.y[l]+a*t*this.m[l]+n*this.y[l+1]+i*t*this.m[l+1]}constructor(e,t){var r,n,a,i,l,s,o,c,u,h,d,m,p,x,g,f,v;for(l=0,o=e.length,a=[],s=[],r=[],n=[],i=[],c=[],x=o-1;0<=x?l<x:l>x;0<=x?l+=1:l-=1)a[l]=(t[l+1]-t[l])/(e[l+1]-e[l]),l>0&&(s[l]=(a[l-1]+a[l])/2);for(l=0,s[0]=a[0],s[o-1]=a[o-2],u=[],g=o-1;0<=g?l<g:l>g;0<=g?l+=1:l-=1)0===a[l]&&u.push(l);for(h=0,m=u.length;h<m;h++)s[l=u[h]]=s[l+1]=0;for(l=0,f=o-1;0<=f?l<f:l>f;0<=f?l+=1:l-=1)r[l]=s[l]/a[l],n[l]=s[l+1]/a[l],i[l]=Math.pow(r[l],2)+Math.pow(n[l],2),c[l]=3/Math.sqrt(i[l]);for(l=0,u=[],v=o-1;0<=v?l<v:l>v;0<=v?l+=1:l-=1)i[l]>9&&u.push(l);for(d=0,p=u.length;d<p;d++)s[l=u[d]]=c[l]*r[l]*a[l],s[l+1]=c[l]*n[l]*a[l];this.x=e.slice(0,o),this.y=t.slice(0,o),this.m=s}}let c="osmd";class u extends s.OpenSheetMusicDisplay{setup(){this.rules.FingeringPosition=1,this.rules.FingeringOffsetY=1,this.rules.FingeringPositionFromXML=!1}}let h=async e=>{let t=new u(c,{drawCredits:!1,drawPartNames:!1,measureNumberInterval:4});return t.setup(),await t.load(e),t.setCustomPageFormat(4e4,2e3),t.render(),t},d=(e,t)=>{let r=e.GraphicSheet.MeasureList.map(e=>{var t;return null===(t=e[0])||void 0===t?void 0:t.stave.x}),n=Object.entries(t),a=n[n.length-1],i=parseInt(a[0]),l=[1,2,3,4,5].map(e=>["".concat(i+5*e),a[1]]),s=(n=[["0",0]].concat(n).concat(l)).length,c=e=>{let[t,r]=n[e];return[parseFloat(t),r]},[u,h]=c(0),d=[],m=[];for(let e=0;e<s-1;++e){let[t,n]=c(e+1);if(void 0!==r[n-1]){for(let e=h;e<n;++e){let a=r[e-1];if(void 0!==a){let r=u+(t-u)*(e-h)/(n-h);d.push(r),m.push(a)}}u=t,h=n}}d.push(u),m.push(r[h-1]);let p=new o(d,m);return e=>{let t=.3*window.innerWidth;return Math.max(0,p.interpolate(e)-t)}},m=e=>{let[t,r]=(0,l.useState)(0),[a,i]=(0,l.useState)(null),{getTime:s,measureMap:o,xml:u}=e;(0,l.useEffect)(()=>((async()=>{i({ip:d(await h(u),o)})})(),()=>{i(null)}),[u,o]);let m=Math.round(4e4-t-window.innerWidth);return(0,l.useEffect)(()=>{if(null!==a){let e=a.ip,t=setInterval(async()=>{r(e(await s()))},20);return()=>{clearInterval(t)}}},[s,a]),(0,n.jsx)("div",{style:{overflow:"hidden"},children:(0,n.jsx)("div",{id:c,style:{height:"250px",width:"".concat(4e4,"px"),marginLeft:"-".concat(t,"px"),marginRight:"-".concat(m,"px")}})})};var p=r(2635),x=r(4294),g=r(234);let f=[1,0,-1],v=async e=>(await fetch(e)).text(),w=(e,t,r,n)=>{let a=(0,i.s1)(e,t);a.childNodes.forEach(e=>{e.nodeName===r&&e.id!==n&&a.removeChild(e)})},y=e=>{let t=e.cloneNode(!0);return t.xmlStandalone=e.xmlStandalone,t},j=e=>{let t=e.parts[e.currPartIdx].id,r=y(e.origXml);w(r,"part-list","score-part",t),w(r,"score-partwise","part",t);let n=p.settingsManager.getFingering();return(0,i.p4)(r,e.pitch,e.octave,n),r},I=e=>{let t=(0,i.s1)(e,"score-partwise"),r=[],n=t.getElementsByTagName("score-part");for(let e=0;e<n.length;++e)r.push({id:n[e].id,name:n[e].getElementsByTagName("part-name")[0].textContent});return r},P=()=>{let e=localStorage.getItem("pitch");return null!==e&&i.xj.includes(e)?e:i.xj[0]},M=e=>{let{measureMap:t,player:r,fileName:a}=e,[s,o]=(0,l.useState)(null);if((0,l.useEffect)(()=>{(async()=>{let e=await v(a),t=(0,i.ON)(e),r={xml:t,parts:I(t),currPartIdx:0,origXml:t,pitch:P(),octave:0};o({...r,xml:j(r)})})()},[a]),null!==s){let e=s.pitch,l=s.currPartIdx,c=s.parts,u=c[l],h=s.octave,d=(t,r,n)=>{if(t===l&&r===e&&n===h)return;let a={...s,currPartIdx:t,pitch:r,octave:n},i=j(a);o({...a,xml:i,currPartIdx:t})},p=c.map((t,r)=>({name:t.name,onClick:()=>d(r,e,h),key:t.name})),v=c.length<=1?null:(0,n.jsx)(x.H,{options:p,children:"Select Part"}),w=e=>e>0?"+".concat(e):"".concat(e),y=0===h?"Octave":"Octave ".concat(w(h)),I=f.map(t=>({name:w(t),onClick:()=>d(l,e,t),key:w(t)})),P=(0,n.jsx)(x.H,{options:I,children:y}),M=e=>d(l,e,h),N=i.xj.map((e,t)=>({name:e,onClick:()=>M(e),key:e})),k=(0,n.jsx)(x.H,{options:N,children:"Pitch: ".concat(e)}),C=(0,n.jsxs)("div",{style:g.Pp,children:[v,k,P]}),E=(0,n.jsx)(m,{xml:s.xml,measureMap:t,getTime:r.getTime},a),S=(0,n.jsxs)("div",{style:{...g.W9,width:i.g1.width,margin:"auto"},children:[(0,n.jsxs)("h4",{children:["Part: ",u.name]}),C]});return(0,n.jsxs)(n.Fragment,{children:[r.comp,S,E]})}return(0,n.jsx)("div",{children:"Something did not work out!"})};var N=r(565);let k=e=>{let t=(0,l.useRef)(),r=(0,l.useCallback)(async()=>await t.current.getInternalPlayer().getCurrentTime(),[t]);return{comp:(0,n.jsx)(C,{playerRef:t,videoId:e}),getTime:r}},C=e=>{let{videoId:t,playerRef:r}=e,a={...i.g1,playerVars:{autoplay:1}},s=l.createElement(N.Z,{videoId:t,opts:a,ref:r,onReady:()=>console.log("I'm ready, loaded ".concat(t,"!"))});return(0,n.jsx)("div",{style:{...i.g1,margin:"auto",marginTop:"0.5em"},children:s})},E=e=>{let{scoreInfo:t}=e,r=k(t.videoId),a="/mxl/".concat(t.fileName,".musicxml");return(0,n.jsx)(M,{measureMap:t.measureMap,player:r,fileName:a})};var S=()=>{let e=(0,a.usePathname)().split("/")[3],t=i.f$.filter(t=>t.videoId===e);if(0===t.length)return(0,n.jsxs)("h3",{children:["YouTube score with ID ",(0,n.jsx)("b",{children:e})," not found :("]});let r=t[0];return(0,n.jsx)(E,{scoreInfo:r})}}},function(e){e.O(0,[170,389,138,702,666,971,23,744],function(){return e(e.s=7734)}),_N_E=e.O()}]);
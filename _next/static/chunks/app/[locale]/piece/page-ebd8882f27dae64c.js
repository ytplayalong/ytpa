(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[308],{3841:(e,t,r)=>{Promise.resolve().then(r.bind(r,2904)),Promise.resolve().then(r.bind(r,5425))},2904:(e,t,r)=>{"use strict";r.d(t,{Loading:()=>a});var i=r(5155),n=r(3517),s=r(5552);let a=e=>{let{title:t,addComp:r}=e,{t:a}=(0,n.A)(),l=null!=t?t:(0,i.jsx)("h4",{children:t}),o=(0,i.jsxs)(i.Fragment,{children:[l,(0,i.jsx)("p",{children:a("loading")})]});return r?(0,i.jsx)("div",{className:"container",children:(0,i.jsx)("div",{style:s.yG,children:o})}):o}},5425:(e,t,r)=>{"use strict";r.d(t,{QueryScore:()=>T});var i=r(5155),n=r(6046),s=r(2115),a=r(8005),l=r(5552),o=r(7929);let c=e=>{let t=(0,s.useRef)(),r=(0,s.useCallback)(async()=>{var e;return await (null===(e=t.current)||void 0===e?void 0:e.getInternalPlayer().getCurrentTime())},[t]);return{comp:(0,i.jsx)(d,{playerRef:t,videoId:e}),getTime:r}},d=e=>{let{videoId:t,playerRef:r}=e,n={...o.$n,playerVars:{autoplay:1}},c=s.createElement(a.A,{videoId:t,opts:n,ref:r,onReady:()=>console.log("I'm ready, loaded ".concat(t,"!"))});return(0,i.jsx)("div",{style:{...o.$n,margin:"auto"},children:(0,i.jsx)("div",{style:l.yG,children:c})})};var h=r(648),u=r(3517),m=r(3883),p=r(2904),g=r(8604);function x(){let{innerWidth:e,innerHeight:t}=window;return{width:e,height:t}}class f{interpolate(e){let t,r,i,n,s,a,l,o,c,d;for(a=d=this.x.length-2;(d<=0?a<=0:a>=0)&&!(this.x[a]<=e);d<=0?a+=1:a-=1);return t=this.x[a+1]-this.x[a],o=Math.pow(l=(e-this.x[a])/t,2),r=2*(c=Math.pow(l,3))-3*o+1,n=c-2*o+l,i=-2*c+3*o,s=c-o,r*this.y[a]+n*t*this.m[a]+i*this.y[a+1]+s*t*this.m[a+1]}constructor(e,t){let r,i,n,s,a,l,o,c,d,h,u,m,p,g,x,f,y;for(a=0,o=e.length,n=[],l=[],r=[],i=[],s=[],c=[],g=o-1;0<=g?a<g:a>g;0<=g?a+=1:a-=1)n[a]=(t[a+1]-t[a])/(e[a+1]-e[a]),a>0&&(l[a]=(n[a-1]+n[a])/2);for(a=0,l[0]=n[0],l[o-1]=n[o-2],d=[],x=o-1;0<=x?a<x:a>x;0<=x?a+=1:a-=1)0===n[a]&&d.push(a);for(h=0,m=d.length;h<m;h++)l[a=d[h]]=l[a+1]=0;for(a=0,f=o-1;0<=f?a<f:a>f;0<=f?a+=1:a-=1)r[a]=l[a]/n[a],i[a]=l[a+1]/n[a],s[a]=Math.pow(r[a],2)+Math.pow(i[a],2),c[a]=3/Math.sqrt(s[a]);for(a=0,d=[],y=o-1;0<=y?a<y:a>y;0<=y?a+=1:a-=1)s[a]>9&&d.push(a);for(u=0,p=d.length;u<p;u++)l[a=d[u]]=c[a]*r[a]*n[a],l[a+1]=c[a]*i[a]*n[a];this.x=e.slice(0,o),this.y=t.slice(0,o),this.m=l}}var y=r(5735);let v="osmd";class j extends g.OpenSheetMusicDisplay{setup(){this.rules.FingeringPosition=1,this.rules.FingeringOffsetY=1,this.rules.FingeringPositionFromXML=!1}}let w=async(e,t,r,i)=>{let n=new j(v,{drawCredits:!1,drawPartNames:!1,measureNumberInterval:4});return n.setup(),await n.load(e),n.setCustomPageFormat(t,r),n.Zoom=i,n.render(),n},I=(e,t,r)=>[...Array(r)].map((i,n)=>e+(t-e)*n/r),b=(e,t)=>{let r=e.GraphicSheet.MeasureList,i=r.map(e=>{var t;return null===(t=e[0])||void 0===t?void 0:t.stave.x}),n=Object.entries(t).map(e=>[parseFloat(e[0]),e[1]]);if(n.sort((e,t)=>e[0]-t[0]),n=[[0,0]].concat(n),!y.f.isHorizontalMode()){let e=r.map(e=>{var t;return null===(t=e[0])||void 0===t?void 0:t.stave.y}),t=e[0];e=e.map(e=>e-t);let n=0,s=[[0,0]],a=[];e.forEach((e,t)=>{if(isNaN(e)){console.log("Found Nan :(");return}if(e!=n){let e=s[s.length-1],r=I(e[1],n,t-e[0]);a=a.concat(r),s.push([t,n])}n=e});let l=s[s.length-1],o=e.length-1;if(l[0]!=o){s.push([o,n]);let e=I(l[1],n,o-l[0]);(a=a.concat(e)).push(n)}i=a}let s=n.length,[a,l]=n[0],o=[],c=[];for(let e=0;e<s-1;++e){let[t,r]=n[e+1];if(void 0!==i[r-1]){for(let e=l;e<r;++e){let n=i[e-1];if(void 0!==n){let i=a+(t-a)*(e-l)/(r-l);o.push(i),c.push(n)}}a=t,l=r}}o.push(a),c.push(i[l-1]),[1,2].forEach(e=>{o.push(a+5*e),c.push(i[l-1])});let d=y.f.isHorizontalMode()?.3:0,h=new f(o,c);return(e,t)=>Math.max(0,(e<=o[0]?c[0]:e>=o[o.length-1]?c[c.length-1]:h.interpolate(e))*t-d*window.innerWidth)},A=e=>{let[t,r]=(0,s.useState)({x:0,y:0}),[n,a]=(0,s.useState)(null),{height:l}=function(){let[e,t]=(0,s.useState)(x());return(0,s.useEffect)(()=>{function e(){t(x())}return window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[]),e}(),o=y.f.getZoom(),c=Math.max(150,.2*l),d=Math.max(Math.min(1,c/260),.5)*o,h=c*d,u=y.f.isHorizontalMode()?4e4*h:window.innerWidth,{getTime:m,measureMap:p,xml:g}=e;(0,s.useEffect)(()=>((async()=>{let e=y.f.isHorizontalMode()?c*o:1e5;a({ip:b(await w(g,u,e,d),p)})})(),()=>{a(null)}),[g,p,c,o,d,u]),(0,s.useEffect)(()=>{if(null!==n){let e=n.ip,t=setInterval(async()=>{let t=e(await m(),d);r(y.f.isHorizontalMode()?{x:t,y:0}:{x:0,y:t})},20);return()=>{clearInterval(t)}}},[m,n,d]);let f=y.f.isHorizontalMode()?c*o:800;return(0,i.jsx)("div",{style:{overflow:"hidden"},children:(0,i.jsx)("div",{id:v,style:{height:"".concat(f+t.y,"px"),width:"".concat(u,"px"),marginLeft:"-".concat(t.x,"px"),marginTop:"-".concat(t.y,"px")}})})};var C=r(5432);let S=[1,0,-1],k=async e=>(await fetch(e)).text(),F=(e,t,r,i)=>{let n=(0,o.qU)(e,t);n.childNodes.forEach(e=>{e.nodeName===r&&e.id!==i&&n.removeChild(e)})},N=e=>{let t=e.cloneNode(!0);return t.xmlStandalone=e.xmlStandalone,t},M=e=>{let t=e.parts[e.currPartIdx].id,r=N(e.origXml);F(r,"part-list","score-part",t),F(r,"score-partwise","part",t);let i=y.f.getFingering();return(0,o.mg)(r,e.pitch,e.octave,i),r},E=e=>{let t=(0,o.qU)(e,"score-partwise"),r=[];for(let e of t.getElementsByTagName("score-part"))r.push({id:e.id,name:e.getElementsByTagName("part-name")[0].textContent});return r},U=()=>y.f.getInstrumentKey(),D=e=>{let{scoreInfo:t,player:r}=e,n="/mxl/".concat(t.fileName,".musicxml"),a="https://musescore.com/user/83726533/scores/".concat(t.source),c=(0,C.N)(),{t:d}=(0,u.A)(),[g,x]=(0,s.useState)(null);if((0,s.useEffect)(()=>{(async()=>{let e=await k(n),t=(0,o.NO)(e),r={xml:t,parts:E(t),currPartIdx:0,origXml:t,pitch:U(),octave:0};x({...r,xml:M(r)})})()},[n]),null!==g){let e=g.pitch,s=g.currPartIdx,u=g.octave,p=(t,r,i)=>{if(t===s&&r===e&&i===u)return;let n={...g,currPartIdx:t,pitch:r,octave:i},a=M(n);x({...n,xml:a,currPartIdx:t})},f=e=>e>0?"+".concat(e):"".concat(e),y=d("octave"),v=0===u?y:"".concat(y,": ").concat(f(u)),j=S.map(t=>({name:f(t),onClick:()=>p(s,e,t),key:f(t)})),w=(0,i.jsx)(m.D4,{options:j,children:v}),I=e=>p(s,e,u),b=o.S4.map((e,t)=>({name:e,onClick:()=>I(e),key:e})),C=d("instrumentKeyShort"),k=(0,i.jsx)(m.D4,{options:b,children:"".concat(C,": ").concat(e)}),F=c.options[0],N={...F,onClick:()=>F.onClick(t.videoId),key:"addFav"},E={...l.zA,style:{...l.zA.style,minWidth:"30px"}},U=(0,i.jsx)(m.D4,{options:[N],wrapper:(e,t)=>(0,i.jsxs)("button",{onClick:t,...E,children:[(0,i.jsx)(h.a95,{})," "]}),children:"..."}),D=(0,i.jsxs)("div",{style:l.eL,children:[U,k,w]}),z=(0,i.jsx)(A,{xml:g.xml,measureMap:t.measureMap,getTime:r.getTime},n),L=(0,i.jsx)("div",{style:{width:o.$n.width,maxWidth:o.$n.maxWidth,margin:"auto"},children:(0,i.jsxs)("div",{style:{...l.yG,...l.Xe},children:[(0,i.jsxs)("h4",{children:[d("viewSheetsOn"),(0,i.jsx)("br",{}),(0,i.jsx)("a",{href:a,target:"_blank",children:"MuseScore.com"})]}),D]})}),P=(0,i.jsx)("div",{style:{width:o.$n.width,maxWidth:o.$n.maxWidth,margin:"auto"},children:(0,i.jsxs)("div",{style:{...l.yG,...l.Xe},children:[(0,i.jsx)("h3",{children:t.name}),(0,i.jsx)("h3",{children:"-"}),(0,i.jsx)("h3",{children:t.artist})]})});return(0,i.jsxs)(i.Fragment,{children:[P,r.comp,L,z,c.overlay]})}return(0,i.jsx)(p.Loading,{addComp:!0})};var z=r(2521);let L=e=>{let t=o.wA.filter(t=>t.videoId===e.scoreId);if(0===t.length)return(0,i.jsxs)("h3",{children:["YouTube score with ID ",(0,i.jsx)("b",{children:e.scoreId})," not found :("]});let r=t[0];return(0,i.jsx)(P,{scoreInfo:r})},P=e=>{let{scoreInfo:t}=e,r=c(t.videoId);return(0,i.jsx)(D,{scoreInfo:t,player:r})},T=()=>{let e=(0,n.useSearchParams)().get("scoreId");return void 0===e||"string"!=typeof e?(0,i.jsx)(z.To404,{}):(0,i.jsx)(L,{scoreId:e})}},5432:(e,t,r)=>{"use strict";r.d(t,{f:()=>j,N:()=>v});var i=r(5155),n=r(8173),s=r.n(n),a=r(648),l=r(3517),o=r(5688),c=r(3883),d=r(2115),h=r(5552);let u=e=>{let[t,r]=(0,d.useState)(!1),{t:n}=(0,l.A)();return{open:()=>r(!0),component:(0,i.jsx)(i.Fragment,{children:t&&(0,i.jsx)("div",{style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"rgba(0, 0, 0, 0.8)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:1e3},children:(0,i.jsxs)("div",{style:{backgroundColor:"white",padding:"20px",borderRadius:"10px",textAlign:"center",maxWidth:"300px"},children:[(0,i.jsx)("p",{style:{margin:"0 0 20px"},children:e}),(0,i.jsx)("button",{onClick:()=>{r(!1)},...h.zA,children:n("close")})]})})})}};var m=r(7929);let p="80px",g={font:"inherit",color:"inherit",textDecoration:"none",height:p,display:"block",padding:0,margin:0},x={paddingTop:0,paddingBottom:0,paddingRight:0},f={...x,paddingLeft:".4em"},y=(e,t)=>(0,i.jsx)(s(),{style:g,href:t,children:(0,i.jsx)("div",{style:{height:p,alignContent:"center"},children:e})}),v=()=>{let{t:e}=(0,l.A)(),t=u(e("notLoggedIn"));return{options:[{name:e("favoritesAdd"),onClick:e=>{o.Ay.userLoggedIn()||t.open(),o.Ay.addFavorite(e)}}],overlay:t.component}},j=e=>{let{scores:t,sortInfo:r,options:n}=e,{t:s,getLink:o}=(0,l.A)(),d=n||[],h=d.map(e=>({key:e.name,...e})),u=(0,c.KS)((0,i.jsx)(a.a95,{}),h,(e,t)=>(0,i.jsx)("div",{onClick:t,style:{display:"flex",height:p,alignContent:"center",alignItems:"center",justifyContent:"center"},children:e}),{width:"100%"}),g={textAlign:"left",...f},v=d.length>0,j=v?"38%":"40%",I=m.Ul.map(e=>{let t="";return void 0!==r&&r.by===e&&(t=r.ascending?"▴":"▾"),(0,i.jsxs)("th",{onClick:()=>null==r?void 0:r.sortClick(e),style:{cursor:"pointer",width:j,...g},children:[s(e),t]},e)}),b=v?(0,i.jsx)("th",{style:{width:"4%",...g}}):void 0,A=(0,i.jsx)("thead",{style:{width:"100%"},children:(0,i.jsxs)("tr",{style:{width:"100%"},children:[(0,i.jsx)("th",{style:{width:"10%",...g}}),I,(0,i.jsx)("th",{style:{width:"10%",...g},children:s("songKey")}),b]})});return(0,i.jsxs)("table",{style:{width:"100%",borderCollapse:"separate",borderSpacing:"0 ".concat("6px")},children:[A,(0,i.jsx)("tbody",{children:t.map(e=>{let t=v?(0,i.jsx)("td",{style:f,children:u(e.videoId)}):void 0,r=o("/piece?scoreId=".concat(e.videoId));return(0,i.jsxs)("tr",{style:{cursor:"pointer",height:p},className:"hoverlink",children:[(0,i.jsx)("td",{style:x,children:y((0,i.jsx)("img",{height:p,src:"https://img.youtube.com/vi/".concat(e.videoId,"/default.jpg"),alt:"YouTube thumbnail of ".concat(e.name," by ").concat(e.artist)}),r)}),m.Ul.map(t=>{var n;return(0,i.jsx)("td",{style:f,children:y(null===(n=e[t])||void 0===n?void 0:n.trim(),r)},"td-".concat(t))}),(0,i.jsx)("td",{style:f,children:y(w(e.keys),r)}),t]},e.videoId)})})]})},w=e=>e.map(m.Gn).join(", ")},2521:(e,t,r)=>{"use strict";r.d(t,{To404:()=>l});var i=r(5155),n=r(6046),s=r(2115),a=r(3517);let l=()=>{let{getLink:e}=(0,a.A)(),t=(0,n.useRouter)();return(0,s.useEffect)(()=>{t.push(e("/404"))}),(0,i.jsx)(i.Fragment,{})}},5688:(e,t,r)=>{"use strict";r.d(t,{Ay:()=>d,Rb:()=>m,iZ:()=>u});var i=r(9904),n=r(4565),s=r(7058),a=r(2115);let l={apiKey:"AIzaSyCVJ76vO0YNHlGwCtvkKfDe5rWLxFiIzgA",authDomain:"ytpa-f7aca.firebaseapp.com",projectId:"ytpa-f7aca",storageBucket:"ytpa-f7aca.firebasestorage.app",messagingSenderId:"374268704603",appId:"1:374268704603:web:646ec6a00d2b5d45968c7e",measurementId:"G-860EZ6JGNF"};class o{userLoggedIn(){let e=this.firebaseAuth.currentUser;return!!(null==e?void 0:e.emailVerified)}currentUser(){return this.firebaseAuth.currentUser}getUserName(){var e,t;return(null!==(t=null===(e=c.currentUser())||void 0===e?void 0:e.email)&&void 0!==t?t:"@").split("@")[0]}getAuth(){return this.firebaseAuth}async signOut(){try{await (0,n.CI)(this.firebaseAuth)}catch(e){console.error("Error signing out:",e)}}async signIn(e,t){try{if(!(await (0,n.x9)(this.firebaseAuth,e,t)).user.emailVerified)return{error:"Email not verified!"}}catch(e){return{error:"Sign-in failed, error: ".concat(e)}}return{info:"Sucessfully signed-in."}}async signUp(e,t){try{let r=(await (0,n.eJ)(this.firebaseAuth,e,t)).user;return await (0,n.gA)(r),console.log("Success: Created user ".concat(r.uid,"!")),{info:"Created user account, verify your email and log in."}}catch(e){return{error:"Sign-up failed, error: ".concat(e)}}}async addFavorite(e){let t=this.getUserDoc(),r=await (0,s.x7)(t);if(r.exists()){let i=Array.from(new Set([...r.data().allFavorites||[],e]));await (0,s.mZ)(t,{allFavorites:i})}else console.log("creating new"),await (0,s.BN)(t,{allFavorites:[e]})}async getFavorites(){let e=this.getUserDoc(),t=await (0,s.x7)(e);return t.exists()&&t.data().allFavorites||[]}async removeFromFavorites(e){let t=this.getUserDoc(),r=await (0,s.x7)(t);if(r.exists()){let i=(r.data().allFavorites||[]).filter(t=>t!=e);await (0,s.mZ)(t,{allFavorites:i})}}async storeUserDoc(e){let t=this.currentUser();if(null==t)return"Not logged-in.";try{await (0,s.BN)((0,s.H9)(this.firestoreDb,"users",t.uid),e)}catch(e){return e}}getUserDoc(){let e=this.currentUser();console.assert(null!=e);let t=e.uid;return(0,s.H9)(this.firestoreDb,"users",t)}constructor(){let e=(0,i.Wp)(l);this.firebaseAuth=(0,n.xI)(e),this.firestoreDb=(0,s.aU)(e)}}let c=new o,d=c,h=e=>{var t;return(null!==(t=e.email)&&void 0!==t?t:"user@").split("@")[0]},u=()=>{let[e,t]=(0,a.useState)(void 0);return(0,a.useEffect)(()=>{let e=c.getAuth(),r=(0,n.hg)(e,e=>{e?localStorage.setItem("username",h(e)):localStorage.removeItem("username"),t(e||null)});return()=>r()},[]),e},m=e=>{let t=null;if(e)t=h(e);else if(void 0===e){console.log("Grabbing username from localstorage");let e=localStorage.getItem("username");null!==e&&(t=e)}return t}}},e=>{var t=t=>e(e.s=t);e.O(0,[992,697,479,849,114,173,861,751,687,441,517,358],()=>t(3841)),_N_E=e.O()}]);
(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[695],{5536:(e,t,r)=>{Promise.resolve().then(r.bind(r,2252))},2252:(e,t,r)=>{"use strict";r.d(t,{Favorites:()=>v});var i=r(5155),n=r(2115),s=r(3517),a=r(5688),o=r(5552),l=r(7929),c=r(2904),d=r(8173),u=r.n(d);let h=()=>{let{t:e,getLink:t}=(0,s.A)(),r=(0,a.iZ)();return{component:(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("p",{children:[e("loginRequiredForPageAccess")," ",(0,i.jsx)(u(),{href:t("/login"),children:e("loginHere")})]}),(0,i.jsxs)("p",{children:[e("alreadyHaveAccount")," ",(0,i.jsx)(u(),{href:t("/register"),children:e("registerHere")})]})]}),user:r}};var g=r(5432);let f={loadingStatus:"loading",favorites:[]},v=()=>{let{t:e}=(0,s.A)(),t=h(),[r,d]=(0,n.useState)(f),u=async()=>{d({loadingStatus:"succeeded",favorites:await a.Ay.getFavorites()}),console.log("Loaded favorites")},v=e("favorites"),p=t=>(0,i.jsx)("div",{className:"container",children:(0,i.jsxs)("div",{style:o.yG,children:[(0,i.jsx)("h4",{children:e("favorites")}),t]})});if((0,n.useEffect)(()=>{t.user&&u()},[r.loadingStatus,t.user]),null===t.user)return console.log("Not logged-in"),p(t.component);if("loading"===r.loadingStatus||void 0===t.user)return(0,i.jsx)(c.Loading,{title:v,addComp:!0});if(0==r.favorites.length)return p("No favorites added yet");let y=new Set(r.favorites),m=l.wA.filter(e=>y.has(e.videoId));m=m.reverse();let b=async e=>{await a.Ay.removeFromFavorites(e),d({favorites:r.favorites.filter(t=>t!=e),loadingStatus:"succeeded"})},x=[{name:e("favoritesRemove"),onClick:b}];return p((0,i.jsx)(g.f,{scores:m,options:x}))}},2904:(e,t,r)=>{"use strict";r.d(t,{Loading:()=>a});var i=r(5155),n=r(3517),s=r(5552);let a=e=>{let{title:t,addComp:r}=e,{t:a}=(0,n.A)(),o=null!=t?t:(0,i.jsx)("h4",{children:t}),l=(0,i.jsxs)(i.Fragment,{children:[o,(0,i.jsx)("p",{children:a("loading")})]});return r?(0,i.jsx)("div",{className:"container",children:(0,i.jsx)("div",{style:s.yG,children:l})}):l}},5432:(e,t,r)=>{"use strict";r.d(t,{f:()=>x,N:()=>b});var i=r(5155),n=r(8173),s=r.n(n),a=r(648),o=r(3517),l=r(5688),c=r(3883),d=r(2115),u=r(5552);let h=e=>{let[t,r]=(0,d.useState)(!1),{t:n}=(0,o.A)();return{open:()=>r(!0),component:(0,i.jsx)(i.Fragment,{children:t&&(0,i.jsx)("div",{style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"rgba(0, 0, 0, 0.8)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:1e3},children:(0,i.jsxs)("div",{style:{backgroundColor:"white",padding:"20px",borderRadius:"10px",textAlign:"center",maxWidth:"300px"},children:[(0,i.jsx)("p",{style:{margin:"0 0 20px"},children:e}),(0,i.jsx)("button",{onClick:()=>{r(!1)},...u.zA,children:n("close")})]})})})}};var g=r(7929);let f="80px",v={font:"inherit",color:"inherit",textDecoration:"none",height:f,display:"block",padding:0,margin:0},p={paddingTop:0,paddingBottom:0,paddingRight:0},y={...p,paddingLeft:".4em"},m=(e,t)=>(0,i.jsx)(s(),{style:v,href:t,children:(0,i.jsx)("div",{style:{height:f,alignContent:"center"},children:e})}),b=()=>{let{t:e}=(0,o.A)(),t=h(e("notLoggedIn"));return{options:[{name:e("favoritesAdd"),onClick:e=>{l.Ay.userLoggedIn()||t.open(),l.Ay.addFavorite(e)}}],overlay:t.component}},x=e=>{let{scores:t,sortInfo:r,options:n}=e,{t:s,getLink:l}=(0,o.A)(),d=n||[],u=d.map(e=>({key:e.name,...e})),h=(0,c.KS)((0,i.jsx)(a.a95,{}),u,(e,t)=>(0,i.jsx)("div",{onClick:t,style:{display:"flex",height:f,alignContent:"center",alignItems:"center",justifyContent:"center"},children:e}),{width:"100%"}),v={textAlign:"left",...y},b=d.length>0,x=b?"38%":"40%",w=g.Ul.map(e=>{let t="";return void 0!==r&&r.by===e&&(t=r.ascending?"▴":"▾"),(0,i.jsxs)("th",{onClick:()=>null==r?void 0:r.sortClick(e),style:{cursor:"pointer",width:x,...v},children:[s(e),t]},e)}),O=b?(0,i.jsx)("th",{style:{width:"4%",...v}}):void 0,A=(0,i.jsx)("thead",{style:{width:"100%"},children:(0,i.jsxs)("tr",{style:{width:"100%"},children:[(0,i.jsx)("th",{style:{width:"10%",...v}}),w,(0,i.jsx)("th",{style:{width:"10%",...v},children:s("songKey")}),O]})});return(0,i.jsxs)("table",{style:{width:"100%",borderCollapse:"separate",borderSpacing:"0 ".concat("6px")},children:[A,(0,i.jsx)("tbody",{children:t.map(e=>{let t=b?(0,i.jsx)("td",{style:y,children:h(e.videoId)}):void 0,r=l("/piece?scoreId=".concat(e.videoId));return(0,i.jsxs)("tr",{style:{cursor:"pointer",height:f},className:"hoverlink",children:[(0,i.jsx)("td",{style:p,children:m((0,i.jsx)("img",{height:f,src:"https://img.youtube.com/vi/".concat(e.videoId,"/default.jpg"),alt:"YouTube thumbnail of ".concat(e.name," by ").concat(e.artist)}),r)}),g.Ul.map(t=>{var n;return(0,i.jsx)("td",{style:y,children:m(null===(n=e[t])||void 0===n?void 0:n.trim(),r)},"td-".concat(t))}),(0,i.jsx)("td",{style:y,children:m(j(e.keys),r)}),t]},e.videoId)})})]})},j=e=>e.map(g.Gn).join(", ")},5688:(e,t,r)=>{"use strict";r.d(t,{Ay:()=>d,Rb:()=>g,iZ:()=>h});var i=r(9904),n=r(4565),s=r(7058),a=r(2115);let o={apiKey:"AIzaSyCVJ76vO0YNHlGwCtvkKfDe5rWLxFiIzgA",authDomain:"ytpa-f7aca.firebaseapp.com",projectId:"ytpa-f7aca",storageBucket:"ytpa-f7aca.firebasestorage.app",messagingSenderId:"374268704603",appId:"1:374268704603:web:646ec6a00d2b5d45968c7e",measurementId:"G-860EZ6JGNF"};class l{userLoggedIn(){let e=this.firebaseAuth.currentUser;return!!(null==e?void 0:e.emailVerified)}currentUser(){return this.firebaseAuth.currentUser}getUserName(){var e,t;return(null!==(t=null===(e=c.currentUser())||void 0===e?void 0:e.email)&&void 0!==t?t:"@").split("@")[0]}getAuth(){return this.firebaseAuth}async signOut(){try{await (0,n.CI)(this.firebaseAuth)}catch(e){console.error("Error signing out:",e)}}async signIn(e,t){try{if(!(await (0,n.x9)(this.firebaseAuth,e,t)).user.emailVerified)return{error:"Email not verified!"}}catch(e){return{error:"Sign-in failed, error: ".concat(e)}}return{info:"Sucessfully signed-in."}}async signUp(e,t){try{let r=(await (0,n.eJ)(this.firebaseAuth,e,t)).user;return await (0,n.gA)(r),console.log("Success: Created user ".concat(r.uid,"!")),{info:"Created user account, verify your email and log in."}}catch(e){return{error:"Sign-up failed, error: ".concat(e)}}}async addFavorite(e){let t=this.getUserDoc(),r=await (0,s.x7)(t);if(r.exists()){let i=Array.from(new Set([...r.data().allFavorites||[],e]));await (0,s.mZ)(t,{allFavorites:i})}else console.log("creating new"),await (0,s.BN)(t,{allFavorites:[e]})}async getFavorites(){let e=this.getUserDoc(),t=await (0,s.x7)(e);return t.exists()&&t.data().allFavorites||[]}async removeFromFavorites(e){let t=this.getUserDoc(),r=await (0,s.x7)(t);if(r.exists()){let i=(r.data().allFavorites||[]).filter(t=>t!=e);await (0,s.mZ)(t,{allFavorites:i})}}async storeUserDoc(e){let t=this.currentUser();if(null==t)return"Not logged-in.";try{await (0,s.BN)((0,s.H9)(this.firestoreDb,"users",t.uid),e)}catch(e){return e}}getUserDoc(){let e=this.currentUser();console.assert(null!=e);let t=e.uid;return(0,s.H9)(this.firestoreDb,"users",t)}constructor(){let e=(0,i.Wp)(o);this.firebaseAuth=(0,n.xI)(e),this.firestoreDb=(0,s.aU)(e)}}let c=new l,d=c,u=e=>{var t;return(null!==(t=e.email)&&void 0!==t?t:"user@").split("@")[0]},h=()=>{let[e,t]=(0,a.useState)(void 0);return(0,a.useEffect)(()=>{let e=c.getAuth(),r=(0,n.hg)(e,e=>{e?localStorage.setItem("username",u(e)):localStorage.removeItem("username"),t(e||null)});return()=>r()},[]),e},g=e=>{let t=null;if(e)t=u(e);else if(void 0===e){console.log("Grabbing username from localstorage");let e=localStorage.getItem("username");null!==e&&(t=e)}return t}},3435:(e,t,r)=>{"use strict";r.d(t,{k5:()=>d});var i=r(2115),n={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},s=i.createContext&&i.createContext(n),a=["attr","size","title"];function o(){return(o=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e}).apply(this,arguments)}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,i)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach(function(t){var i,n;i=t,n=r[t],(i=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var i=r.call(e,t||"default");if("object"!=typeof i)return i;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(i))in e?Object.defineProperty(e,i,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[i]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function d(e){return t=>i.createElement(u,o({attr:c({},e.attr)},t),function e(t){return t&&t.map((t,r)=>i.createElement(t.tag,c({key:r},t.attr),e(t.child)))}(e.child))}function u(e){var t=t=>{var r,{attr:n,size:s,title:l}=e,d=function(e,t){if(null==e)return{};var r,i,n=function(e,t){if(null==e)return{};var r={};for(var i in e)if(Object.prototype.hasOwnProperty.call(e,i)){if(t.indexOf(i)>=0)continue;r[i]=e[i]}return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(i=0;i<s.length;i++)r=s[i],!(t.indexOf(r)>=0)&&Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}(e,a),u=s||t.size||"1em";return t.className&&(r=t.className),e.className&&(r=(r?r+" ":"")+e.className),i.createElement("svg",o({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},t.attr,n,d,{className:r,style:c(c({color:e.color||t.color},t.style),e.style),height:u,width:u,xmlns:"http://www.w3.org/2000/svg"}),l&&i.createElement("title",null,l),e.children)};return void 0!==s?i.createElement(s.Consumer,null,e=>t(e)):t(n)}}},e=>{var t=t=>e(e.s=t);e.O(0,[992,697,479,114,173,861,687,441,517,358],()=>t(5536)),_N_E=e.O()}]);
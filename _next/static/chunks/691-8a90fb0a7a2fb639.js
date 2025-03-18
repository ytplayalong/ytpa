"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[691],{2222:(e,t,r)=>{r.d(t,{f:()=>j,N:()=>x});var n=r(5155),i=r(6874),a=r.n(i),o=r(2515),s=r(8568),l=r(6587),c=r(3056),d=r(2115),u=r(5685);let h=e=>{let[t,r]=(0,d.useState)(!1),{t:i}=(0,s.A)();return{open:()=>r(!0),component:(0,n.jsx)(n.Fragment,{children:t&&(0,n.jsx)("div",{style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"rgba(0, 0, 0, 0.8)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:1e3},children:(0,n.jsxs)("div",{style:{backgroundColor:"white",padding:"20px",borderRadius:"10px",textAlign:"center",maxWidth:"300px"},children:[(0,n.jsx)("p",{style:{margin:"0 0 20px"},children:e}),(0,n.jsx)("button",{onClick:()=>{r(!1)},...u.zA,children:i("close")})]})})})}};var g=r(9683);let p="80px",m={font:"inherit",color:"inherit",textDecoration:"none",height:p,display:"block",padding:0,margin:0},y={paddingTop:0,paddingBottom:0,paddingRight:0},v={...y,paddingLeft:".4em"},f=(e,t)=>(0,n.jsx)(a(),{style:m,href:t,children:(0,n.jsx)("div",{style:{height:p,alignContent:"center"},children:e})}),x=()=>{let{t:e}=(0,s.A)(),t=h(e("notLoggedIn"));return{options:[{name:e("favoritesAdd"),onClick:e=>{l.Ay.userLoggedIn()||t.open(),l.Ay.addFavorite(e)}}],overlay:t.component}},j=e=>{let{scores:t,sortInfo:r,options:i}=e,{t:a,getLink:l}=(0,s.A)(),d=i||[],u=d.map(e=>({key:e.name,...e})),h=(0,c.KS)((0,n.jsx)(o.a95,{}),u,(e,t)=>(0,n.jsx)("div",{onClick:t,style:{display:"flex",height:p,alignContent:"center",alignItems:"center",justifyContent:"center"},children:e}),{width:"100%"}),m={textAlign:"left",...v},x=d.length>0,j=x?"38%":"40%",O=g.Ul.map(e=>{let t="";return void 0!==r&&r.by===e&&(t=r.ascending?"▴":"▾"),(0,n.jsxs)("th",{onClick:()=>null==r?void 0:r.sortClick(e),style:{cursor:"pointer",width:j,...m},children:[a(e),t]},e)}),w=x?(0,n.jsx)("th",{style:{width:"4%",...m}}):void 0,A=(0,n.jsx)("thead",{style:{width:"100%"},children:(0,n.jsxs)("tr",{style:{width:"100%"},children:[(0,n.jsx)("th",{style:{width:"10%",...m}}),O,(0,n.jsx)("th",{style:{width:"10%",...m},children:a("songKey")}),w]})});return(0,n.jsxs)("table",{style:{width:"100%",borderCollapse:"separate",borderSpacing:"0 ".concat("6px")},children:[A,(0,n.jsx)("tbody",{children:t.map(e=>{let t=x?(0,n.jsx)("td",{style:v,children:h(e.videoId)}):void 0,r=l("/piece?scoreId=".concat(e.videoId));return(0,n.jsxs)("tr",{style:{cursor:"pointer",height:p},className:"hoverlink",children:[(0,n.jsx)("td",{style:y,children:f((0,n.jsx)("img",{height:p,src:"https://img.youtube.com/vi/".concat(e.videoId,"/default.jpg"),alt:"YouTube thumbnail of ".concat(e.name," by ").concat(e.artist)}),r)}),g.Ul.map(t=>{var i;return(0,n.jsx)("td",{style:v,children:f(null===(i=e[t])||void 0===i?void 0:i.trim(),r)},"td-".concat(t))}),(0,n.jsx)("td",{style:v,children:f(b(e.keys),r)}),t]},e.videoId)})})]})},b=e=>e.map(g.Gn).join(", ")},4436:(e,t,r)=>{r.d(t,{k5:()=>d});var n=r(2115),i={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},a=n.createContext&&n.createContext(i),o=["attr","size","title"];function s(){return(s=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach(function(t){var n,i,a;n=e,i=t,a=r[t],(i=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=typeof n)return n;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(i))in n?Object.defineProperty(n,i,{value:a,enumerable:!0,configurable:!0,writable:!0}):n[i]=a}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function d(e){return t=>n.createElement(u,s({attr:c({},e.attr)},t),function e(t){return t&&t.map((t,r)=>n.createElement(t.tag,c({key:r},t.attr),e(t.child)))}(e.child))}function u(e){var t=t=>{var r,{attr:i,size:a,title:l}=e,d=function(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r={};for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){if(t.indexOf(n)>=0)continue;r[n]=e[n]}return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],!(t.indexOf(r)>=0)&&Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}(e,o),u=a||t.size||"1em";return t.className&&(r=t.className),e.className&&(r=(r?r+" ":"")+e.className),n.createElement("svg",s({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},t.attr,i,d,{className:r,style:c(c({color:e.color||t.color},t.style),e.style),height:u,width:u,xmlns:"http://www.w3.org/2000/svg"}),l&&n.createElement("title",null,l),e.children)};return void 0!==a?n.createElement(a.Consumer,null,e=>t(e)):t(i)}},6587:(e,t,r)=>{r.d(t,{Ay:()=>d,Rb:()=>g,iZ:()=>h});var n=r(3915),i=r(3004),a=r(5317),o=r(2115);let s={apiKey:"AIzaSyCVJ76vO0YNHlGwCtvkKfDe5rWLxFiIzgA",authDomain:"ytpa-f7aca.firebaseapp.com",projectId:"ytpa-f7aca",storageBucket:"ytpa-f7aca.firebasestorage.app",messagingSenderId:"374268704603",appId:"1:374268704603:web:646ec6a00d2b5d45968c7e",measurementId:"G-860EZ6JGNF"};class l{userLoggedIn(){let e=this.firebaseAuth.currentUser;return!!(null==e?void 0:e.emailVerified)}currentUser(){return this.firebaseAuth.currentUser}getUserName(){var e,t;return(null!==(t=null===(e=c.currentUser())||void 0===e?void 0:e.email)&&void 0!==t?t:"@").split("@")[0]}getAuth(){return this.firebaseAuth}async signOut(){try{await (0,i.CI)(this.firebaseAuth)}catch(e){console.error("Error signing out:",e)}}async signIn(e,t){try{if(!(await (0,i.x9)(this.firebaseAuth,e,t)).user.emailVerified)return{error:"Email not verified!"}}catch(e){return{error:"Sign-in failed, error: ".concat(e)}}return{info:"Sucessfully signed-in."}}async signUp(e,t){try{let r=(await (0,i.eJ)(this.firebaseAuth,e,t)).user;return await (0,i.gA)(r),console.log("Success: Created user ".concat(r.uid,"!")),{info:"Created user account, verify your email and log in."}}catch(e){return{error:"Sign-up failed, error: ".concat(e)}}}async addFavorite(e){let t=this.getUserDoc(),r=await (0,a.x7)(t);if(r.exists()){let n=Array.from(new Set([...r.data().allFavorites||[],e]));await (0,a.mZ)(t,{allFavorites:n})}else console.log("creating new"),await (0,a.BN)(t,{allFavorites:[e]})}async getFavorites(){let e=this.getUserDoc(),t=await (0,a.x7)(e);return t.exists()&&t.data().allFavorites||[]}async removeFromFavorites(e){let t=this.getUserDoc(),r=await (0,a.x7)(t);if(r.exists()){let n=(r.data().allFavorites||[]).filter(t=>t!=e);await (0,a.mZ)(t,{allFavorites:n})}}async storeUserDoc(e){let t=this.currentUser();if(null==t)return"Not logged-in.";try{await (0,a.BN)((0,a.H9)(this.firestoreDb,"users",t.uid),e)}catch(e){return e}}getUserDoc(){let e=this.currentUser();console.assert(null!=e);let t=e.uid;return(0,a.H9)(this.firestoreDb,"users",t)}constructor(){let e=(0,n.Wp)(s);this.firebaseAuth=(0,i.xI)(e),this.firestoreDb=(0,a.aU)(e)}}let c=new l,d=c,u=e=>{var t;return(null!==(t=e.email)&&void 0!==t?t:"user@").split("@")[0]},h=()=>{let[e,t]=(0,o.useState)(void 0);return(0,o.useEffect)(()=>{let e=c.getAuth(),r=(0,i.hg)(e,e=>{e?localStorage.setItem("username",u(e)):localStorage.removeItem("username"),t(e||null)});return()=>r()},[]),e},g=e=>{let t=null;if(e)t=u(e);else if(void 0===e){console.log("Grabbing username from localstorage");let e=localStorage.getItem("username");null!==e&&(t=e)}return t}},9442:(e,t,r)=>{r.d(t,{ListScores:()=>f,$:()=>v});var n=r(5155),i=r(2115),a=r(8568);let o=JSON.parse("[[2,2],[2,4],[3,2],[3,4],[4,4],[5,4],[6,8],[7,8],[12,8]]"),s={Á:"A",Ă:"A",Ắ:"A",Ặ:"A",Ằ:"A",Ẳ:"A",Ẵ:"A",Ǎ:"A",Â:"A",Ấ:"A",Ậ:"A",Ầ:"A",Ẩ:"A",Ẫ:"A",Ä:"A",Ǟ:"A",Ȧ:"A",Ǡ:"A",Ạ:"A",Ȁ:"A",À:"A",Ả:"A",Ȃ:"A",Ā:"A",Ą:"A",Å:"A",Ǻ:"A",Ḁ:"A",Ⱥ:"A",Ã:"A",Ꜳ:"AA",Æ:"AE",Ǽ:"AE",Ǣ:"AE",Ꜵ:"AO",Ꜷ:"AU",Ꜹ:"AV",Ꜻ:"AV",Ꜽ:"AY",Ḃ:"B",Ḅ:"B",Ɓ:"B",Ḇ:"B",Ƀ:"B",Ƃ:"B",Ć:"C",Č:"C",Ç:"C",Ḉ:"C",Ĉ:"C",Ċ:"C",Ƈ:"C",Ȼ:"C",Ď:"D",Ḑ:"D",Ḓ:"D",Ḋ:"D",Ḍ:"D",Ɗ:"D",Ḏ:"D",ǲ:"D",ǅ:"D",Đ:"D",Ƌ:"D",Ǳ:"DZ",Ǆ:"DZ",É:"E",Ĕ:"E",Ě:"E",Ȩ:"E",Ḝ:"E",Ê:"E",Ế:"E",Ệ:"E",Ề:"E",Ể:"E",Ễ:"E",Ḙ:"E",Ë:"E",Ė:"E",Ẹ:"E",Ȅ:"E",È:"E",Ẻ:"E",Ȇ:"E",Ē:"E",Ḗ:"E",Ḕ:"E",Ę:"E",Ɇ:"E",Ẽ:"E",Ḛ:"E",Ꝫ:"ET",Ḟ:"F",Ƒ:"F",Ǵ:"G",Ğ:"G",Ǧ:"G",Ģ:"G",Ĝ:"G",Ġ:"G",Ɠ:"G",Ḡ:"G",Ǥ:"G",Ḫ:"H",Ȟ:"H",Ḩ:"H",Ĥ:"H",Ⱨ:"H",Ḧ:"H",Ḣ:"H",Ḥ:"H",Ħ:"H",Í:"I",Ĭ:"I",Ǐ:"I",Î:"I",Ï:"I",Ḯ:"I",İ:"I",Ị:"I",Ȉ:"I",Ì:"I",Ỉ:"I",Ȋ:"I",Ī:"I",Į:"I",Ɨ:"I",Ĩ:"I",Ḭ:"I",Ꝺ:"D",Ꝼ:"F",Ᵹ:"G",Ꞃ:"R",Ꞅ:"S",Ꞇ:"T",Ꝭ:"IS",Ĵ:"J",Ɉ:"J",Ḱ:"K",Ǩ:"K",Ķ:"K",Ⱪ:"K",Ꝃ:"K",Ḳ:"K",Ƙ:"K",Ḵ:"K",Ꝁ:"K",Ꝅ:"K",Ĺ:"L",Ƚ:"L",Ľ:"L",Ļ:"L",Ḽ:"L",Ḷ:"L",Ḹ:"L",Ⱡ:"L",Ꝉ:"L",Ḻ:"L",Ŀ:"L",Ɫ:"L",ǈ:"L",Ł:"L",Ǉ:"LJ",Ḿ:"M",Ṁ:"M",Ṃ:"M",Ɱ:"M",Ń:"N",Ň:"N",Ņ:"N",Ṋ:"N",Ṅ:"N",Ṇ:"N",Ǹ:"N",Ɲ:"N",Ṉ:"N",Ƞ:"N",ǋ:"N",Ñ:"N",Ǌ:"NJ",Ó:"O",Ŏ:"O",Ǒ:"O",Ô:"O",Ố:"O",Ộ:"O",Ồ:"O",Ổ:"O",Ỗ:"O",Ö:"O",Ȫ:"O",Ȯ:"O",Ȱ:"O",Ọ:"O",Ő:"O",Ȍ:"O",Ò:"O",Ỏ:"O",Ơ:"O",Ớ:"O",Ợ:"O",Ờ:"O",Ở:"O",Ỡ:"O",Ȏ:"O",Ꝋ:"O",Ꝍ:"O",Ō:"O",Ṓ:"O",Ṑ:"O",Ɵ:"O",Ǫ:"O",Ǭ:"O",Ø:"O",Ǿ:"O",Õ:"O",Ṍ:"O",Ṏ:"O",Ȭ:"O",Ƣ:"OI",Ꝏ:"OO",Ɛ:"E",Ɔ:"O",Ȣ:"OU",Ṕ:"P",Ṗ:"P",Ꝓ:"P",Ƥ:"P",Ꝕ:"P",Ᵽ:"P",Ꝑ:"P",Ꝙ:"Q",Ꝗ:"Q",Ŕ:"R",Ř:"R",Ŗ:"R",Ṙ:"R",Ṛ:"R",Ṝ:"R",Ȑ:"R",Ȓ:"R",Ṟ:"R",Ɍ:"R",Ɽ:"R",Ꜿ:"C",Ǝ:"E",Ś:"S",Ṥ:"S",Š:"S",Ṧ:"S",Ş:"S",Ŝ:"S",Ș:"S",Ṡ:"S",Ṣ:"S",Ṩ:"S",Ť:"T",Ţ:"T",Ṱ:"T",Ț:"T",Ⱦ:"T",Ṫ:"T",Ṭ:"T",Ƭ:"T",Ṯ:"T",Ʈ:"T",Ŧ:"T",Ɐ:"A",Ꞁ:"L",Ɯ:"M",Ʌ:"V",Ꜩ:"TZ",Ú:"U",Ŭ:"U",Ǔ:"U",Û:"U",Ṷ:"U",Ü:"U",Ǘ:"U",Ǚ:"U",Ǜ:"U",Ǖ:"U",Ṳ:"U",Ụ:"U",Ű:"U",Ȕ:"U",Ù:"U",Ủ:"U",Ư:"U",Ứ:"U",Ự:"U",Ừ:"U",Ử:"U",Ữ:"U",Ȗ:"U",Ū:"U",Ṻ:"U",Ų:"U",Ů:"U",Ũ:"U",Ṹ:"U",Ṵ:"U",Ꝟ:"V",Ṿ:"V",Ʋ:"V",Ṽ:"V",Ꝡ:"VY",Ẃ:"W",Ŵ:"W",Ẅ:"W",Ẇ:"W",Ẉ:"W",Ẁ:"W",Ⱳ:"W",Ẍ:"X",Ẋ:"X",Ý:"Y",Ŷ:"Y",Ÿ:"Y",Ẏ:"Y",Ỵ:"Y",Ỳ:"Y",Ƴ:"Y",Ỷ:"Y",Ỿ:"Y",Ȳ:"Y",Ɏ:"Y",Ỹ:"Y",Ź:"Z",Ž:"Z",Ẑ:"Z",Ⱬ:"Z",Ż:"Z",Ẓ:"Z",Ȥ:"Z",Ẕ:"Z",Ƶ:"Z",Ĳ:"IJ",Œ:"OE",ᴀ:"A",ᴁ:"AE",ʙ:"B",ᴃ:"B",ᴄ:"C",ᴅ:"D",ᴇ:"E",ꜰ:"F",ɢ:"G",ʛ:"G",ʜ:"H",ɪ:"I",ʁ:"R",ᴊ:"J",ᴋ:"K",ʟ:"L",ᴌ:"L",ᴍ:"M",ɴ:"N",ᴏ:"O",ɶ:"OE",ᴐ:"O",ᴕ:"OU",ᴘ:"P",ʀ:"R",ᴎ:"N",ᴙ:"R",ꜱ:"S",ᴛ:"T",ⱻ:"E",ᴚ:"R",ᴜ:"U",ᴠ:"V",ᴡ:"W",ʏ:"Y",ᴢ:"Z",á:"a",ă:"a",ắ:"a",ặ:"a",ằ:"a",ẳ:"a",ẵ:"a",ǎ:"a",â:"a",ấ:"a",ậ:"a",ầ:"a",ẩ:"a",ẫ:"a",ä:"a",ǟ:"a",ȧ:"a",ǡ:"a",ạ:"a",ȁ:"a",à:"a",ả:"a",ȃ:"a",ā:"a",ą:"a",ᶏ:"a",ẚ:"a",å:"a",ǻ:"a",ḁ:"a",ⱥ:"a",ã:"a",ꜳ:"aa",æ:"ae",ǽ:"ae",ǣ:"ae",ꜵ:"ao",ꜷ:"au",ꜹ:"av",ꜻ:"av",ꜽ:"ay",ḃ:"b",ḅ:"b",ɓ:"b",ḇ:"b",ᵬ:"b",ᶀ:"b",ƀ:"b",ƃ:"b",ɵ:"o",ć:"c",č:"c",ç:"c",ḉ:"c",ĉ:"c",ɕ:"c",ċ:"c",ƈ:"c",ȼ:"c",ď:"d",ḑ:"d",ḓ:"d",ȡ:"d",ḋ:"d",ḍ:"d",ɗ:"d",ᶑ:"d",ḏ:"d",ᵭ:"d",ᶁ:"d",đ:"d",ɖ:"d",ƌ:"d",ı:"i",ȷ:"j",ɟ:"j",ʄ:"j",ǳ:"dz",ǆ:"dz",é:"e",ĕ:"e",ě:"e",ȩ:"e",ḝ:"e",ê:"e",ế:"e",ệ:"e",ề:"e",ể:"e",ễ:"e",ḙ:"e",ë:"e",ė:"e",ẹ:"e",ȅ:"e",è:"e",ẻ:"e",ȇ:"e",ē:"e",ḗ:"e",ḕ:"e",ⱸ:"e",ę:"e",ᶒ:"e",ɇ:"e",ẽ:"e",ḛ:"e",ꝫ:"et",ḟ:"f",ƒ:"f",ᵮ:"f",ᶂ:"f",ǵ:"g",ğ:"g",ǧ:"g",ģ:"g",ĝ:"g",ġ:"g",ɠ:"g",ḡ:"g",ᶃ:"g",ǥ:"g",ḫ:"h",ȟ:"h",ḩ:"h",ĥ:"h",ⱨ:"h",ḧ:"h",ḣ:"h",ḥ:"h",ɦ:"h",ẖ:"h",ħ:"h",ƕ:"hv",í:"i",ĭ:"i",ǐ:"i",î:"i",ï:"i",ḯ:"i",ị:"i",ȉ:"i",ì:"i",ỉ:"i",ȋ:"i",ī:"i",į:"i",ᶖ:"i",ɨ:"i",ĩ:"i",ḭ:"i",ꝺ:"d",ꝼ:"f",ᵹ:"g",ꞃ:"r",ꞅ:"s",ꞇ:"t",ꝭ:"is",ǰ:"j",ĵ:"j",ʝ:"j",ɉ:"j",ḱ:"k",ǩ:"k",ķ:"k",ⱪ:"k",ꝃ:"k",ḳ:"k",ƙ:"k",ḵ:"k",ᶄ:"k",ꝁ:"k",ꝅ:"k",ĺ:"l",ƚ:"l",ɬ:"l",ľ:"l",ļ:"l",ḽ:"l",ȴ:"l",ḷ:"l",ḹ:"l",ⱡ:"l",ꝉ:"l",ḻ:"l",ŀ:"l",ɫ:"l",ᶅ:"l",ɭ:"l",ł:"l",ǉ:"lj",ſ:"s",ẜ:"s",ẛ:"s",ẝ:"s",ḿ:"m",ṁ:"m",ṃ:"m",ɱ:"m",ᵯ:"m",ᶆ:"m",ń:"n",ň:"n",ņ:"n",ṋ:"n",ȵ:"n",ṅ:"n",ṇ:"n",ǹ:"n",ɲ:"n",ṉ:"n",ƞ:"n",ᵰ:"n",ᶇ:"n",ɳ:"n",ñ:"n",ǌ:"nj",ó:"o",ŏ:"o",ǒ:"o",ô:"o",ố:"o",ộ:"o",ồ:"o",ổ:"o",ỗ:"o",ö:"o",ȫ:"o",ȯ:"o",ȱ:"o",ọ:"o",ő:"o",ȍ:"o",ò:"o",ỏ:"o",ơ:"o",ớ:"o",ợ:"o",ờ:"o",ở:"o",ỡ:"o",ȏ:"o",ꝋ:"o",ꝍ:"o",ⱺ:"o",ō:"o",ṓ:"o",ṑ:"o",ǫ:"o",ǭ:"o",ø:"o",ǿ:"o",õ:"o",ṍ:"o",ṏ:"o",ȭ:"o",ƣ:"oi",ꝏ:"oo",ɛ:"e",ᶓ:"e",ɔ:"o",ᶗ:"o",ȣ:"ou",ṕ:"p",ṗ:"p",ꝓ:"p",ƥ:"p",ᵱ:"p",ᶈ:"p",ꝕ:"p",ᵽ:"p",ꝑ:"p",ꝙ:"q",ʠ:"q",ɋ:"q",ꝗ:"q",ŕ:"r",ř:"r",ŗ:"r",ṙ:"r",ṛ:"r",ṝ:"r",ȑ:"r",ɾ:"r",ᵳ:"r",ȓ:"r",ṟ:"r",ɼ:"r",ᵲ:"r",ᶉ:"r",ɍ:"r",ɽ:"r",ↄ:"c",ꜿ:"c",ɘ:"e",ɿ:"r",ś:"s",ṥ:"s",š:"s",ṧ:"s",ş:"s",ŝ:"s",ș:"s",ṡ:"s",ṣ:"s",ṩ:"s",ʂ:"s",ᵴ:"s",ᶊ:"s",ȿ:"s",ɡ:"g",ᴑ:"o",ᴓ:"o",ᴝ:"u",ť:"t",ţ:"t",ṱ:"t",ț:"t",ȶ:"t",ẗ:"t",ⱦ:"t",ṫ:"t",ṭ:"t",ƭ:"t",ṯ:"t",ᵵ:"t",ƫ:"t",ʈ:"t",ŧ:"t",ᵺ:"th",ɐ:"a",ᴂ:"ae",ǝ:"e",ᵷ:"g",ɥ:"h",ʮ:"h",ʯ:"h",ᴉ:"i",ʞ:"k",ꞁ:"l",ɯ:"m",ɰ:"m",ᴔ:"oe",ɹ:"r",ɻ:"r",ɺ:"r",ⱹ:"r",ʇ:"t",ʌ:"v",ʍ:"w",ʎ:"y",ꜩ:"tz",ú:"u",ŭ:"u",ǔ:"u",û:"u",ṷ:"u",ü:"u",ǘ:"u",ǚ:"u",ǜ:"u",ǖ:"u",ṳ:"u",ụ:"u",ű:"u",ȕ:"u",ù:"u",ủ:"u",ư:"u",ứ:"u",ự:"u",ừ:"u",ử:"u",ữ:"u",ȗ:"u",ū:"u",ṻ:"u",ų:"u",ᶙ:"u",ů:"u",ũ:"u",ṹ:"u",ṵ:"u",ᵫ:"ue",ꝸ:"um",ⱴ:"v",ꝟ:"v",ṿ:"v",ʋ:"v",ᶌ:"v",ⱱ:"v",ṽ:"v",ꝡ:"vy",ẃ:"w",ŵ:"w",ẅ:"w",ẇ:"w",ẉ:"w",ẁ:"w",ⱳ:"w",ẘ:"w",ẍ:"x",ẋ:"x",ᶍ:"x",ý:"y",ŷ:"y",ÿ:"y",ẏ:"y",ỵ:"y",ỳ:"y",ƴ:"y",ỷ:"y",ỿ:"y",ȳ:"y",ẙ:"y",ɏ:"y",ỹ:"y",ź:"z",ž:"z",ẑ:"z",ʑ:"z",ⱬ:"z",ż:"z",ẓ:"z",ȥ:"z",ẕ:"z",ᵶ:"z",ᶎ:"z",ʐ:"z",ƶ:"z",ɀ:"z",ﬀ:"ff",ﬃ:"ffi",ﬄ:"ffl",ﬁ:"fi",ﬂ:"fl",ĳ:"ij",œ:"oe",ﬆ:"st",ₐ:"a",ₑ:"e",ᵢ:"i",ⱼ:"j",ₒ:"o",ᵣ:"r",ᵤ:"u",ᵥ:"v",ₓ:"x"},l=e=>e.replace(/[^A-Za-z0-9 ]/g,e=>s[e]||e);var c=r(5685),d=r(9683),u=r(2222);let h=e=>{let[t,r]=(0,i.useState)(void 0),a=(0,n.jsx)("input",{placeholder:e,onChange:e=>r(e.target.value),value:t,style:c.C8});return[t,a]},g=()=>{let[e,t]=(0,i.useState)({by:"name",ascending:!0});return{sortFun:(t,r)=>{var n,i;let a=l(null===(n=t[e.by])||void 0===n?void 0:n.toLowerCase()),o=l(null===(i=r[e.by])||void 0===i?void 0:i.toLowerCase()),s=e.ascending?1:-1;return void 0===a?s:void 0===o?-s:a<o?-s:a>o?s:0},sortClick:r=>{let n={...e};n.ascending=!n.ascending,n.by!==r&&(n.ascending=!0,n.by=r),t(n)},...e}},p={minWidth:"18px",minHeight:"18px"},m=()=>{let e=o.map(()=>!0),[t,r]=(0,i.useState)(e);return[(0,n.jsx)("div",{style:c.Xe,children:o.map((e,a)=>(0,n.jsxs)(i.Fragment,{children:[(0,n.jsx)("label",{htmlFor:"time-".concat(e),children:"".concat(e[0],"/").concat(e[1])}),(0,n.jsx)("input",{type:"checkbox",name:"time-".concat(e),checked:t[a],onChange:()=>{let e=[...t];e[a]=!e[a],r(e)},style:p})]},"time-".concat(e)))}),new Set(o.filter((e,r)=>t[r]).map(e=>"".concat(e[0],",").concat(e[1])))]},y=()=>{let e=[1,2,3,4,5,6],t=[1,2,3,4,5],r=[0,...t,...e.map(e=>-e)],[a,o]=(0,i.useState)(r),s=e=>a.includes(e),l=e=>{-1===a.indexOf(e)?o([e,...a]):o(a.filter(t=>t!==e))};return[a,(0,n.jsxs)("div",{children:[(0,n.jsxs)("div",{style:c.Xe,children:[(0,n.jsx)("label",{htmlFor:"none",children:"0 #"}),(0,n.jsx)("input",{type:"checkbox",name:"none",id:"none",checked:s(0),onChange:()=>l(0),style:p}),t.map(e=>(0,n.jsxs)(i.Fragment,{children:[(0,n.jsx)("label",{htmlFor:"sharp-".concat(e),children:"".concat(e," #")}),(0,n.jsx)("input",{type:"checkbox",checked:s(e),onChange:()=>l(e),style:p})]},"sharp-".concat(e)))]}),(0,n.jsx)("div",{style:c.Xe,children:e.map(e=>(0,n.jsxs)(i.Fragment,{children:[(0,n.jsx)("label",{htmlFor:"flat-".concat(e),children:"".concat(e," ♭")}),(0,n.jsx)("input",{type:"checkbox",checked:s(-e),onChange:()=>l(-e),style:p})]},"flat-".concat(e)))})]})]},v=e=>{let{t}=(0,a.A)(),[r,i]=h(t("txtFilterDefault")),o=g(),[s,c]=y(),[d,u]=m(),p={paddingTop:"1em"},v=(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("div",{className:"row",style:p,children:[(0,n.jsx)("div",{className:"twocols",children:t("search")}),(0,n.jsx)("div",{className:"twocols rightcol",children:i})]}),(0,n.jsx)("div",{className:"row",style:p,children:(0,n.jsx)("div",{className:"twocols",children:t("filter")})}),(0,n.jsxs)("div",{className:"row",style:p,children:[(0,n.jsx)("div",{className:"twocols",children:t("songKey")}),(0,n.jsx)("div",{className:"twocols rightcol",children:c})]}),(0,n.jsxs)("div",{className:"row",style:p,children:[(0,n.jsx)("div",{className:"twocols",children:t("timeSignature")}),(0,n.jsx)("div",{className:"twocols rightcol",children:d})]})]});return{scores:(e=>{if(r){let t=l(r.toLocaleLowerCase());e=e.filter(e=>{var r,n;return(null===(r=l(e.name))||void 0===r?void 0:r.toLocaleLowerCase().includes(t))||(null===(n=l(e.artist))||void 0===n?void 0:n.toLocaleLowerCase().includes(t))})}return e.sort(o.sortFun),e})(e).filter(e=>{let t=e.keys;return 0!==e.times.map(e=>"".concat(e[0],",").concat(e[1])).filter(e=>u.has(e)).length&&0!==t.filter(e=>s.includes(e)).length}),comp:v,sortInfo:o}},f=()=>{let{scores:e,comp:t,sortInfo:r}=v((0,d.$0)()),i=(0,u.N)(),o=(0,n.jsx)(u.f,{scores:e,sortInfo:r,options:i.options}),{t:s}=(0,a.A)(),l=s("totScores",{num:e.length});return(0,n.jsxs)(n.Fragment,{children:[t,(0,n.jsx)("div",{style:{paddingTop:"2em",paddingBottom:"1em"},children:l}),o,i.overlay]})}}}]);
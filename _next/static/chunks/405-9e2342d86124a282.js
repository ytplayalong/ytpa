"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{5685:(e,t,r)=>{r.d(t,{C8:()=>l,Lv:()=>g,No:()=>o,Vq:()=>n,Xe:()=>c,eL:()=>u,yG:()=>d,zA:()=>s});var a=r(8951);let n="6px",i={border:"none",cursor:"pointer",padding:"0.5em",minWidth:"100px",borderRadius:n,backgroundColor:a.Sq},s={style:i,className:"hoverlink"},o=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return{style:{...i,...e},className:"hoverlink ".concat(t)}},l={boxSizing:"border-box",width:"100%",minHeight:"40px",borderRadius:n},c={justifyContent:"space-between",display:"flex"},u={display:"flex",justifyContent:"center",textAlign:"center",alignItems:"center"},d={padding:"8px"},g={paddingLeft:"8px",paddingRight:"8px"}},6587:(e,t,r)=>{r.d(t,{Ay:()=>u,Rb:()=>m,iZ:()=>g});var a=r(3915),n=r(3004),i=r(5317),s=r(2115);let o={apiKey:"AIzaSyCVJ76vO0YNHlGwCtvkKfDe5rWLxFiIzgA",authDomain:"ytpa-f7aca.firebaseapp.com",projectId:"ytpa-f7aca",storageBucket:"ytpa-f7aca.firebasestorage.app",messagingSenderId:"374268704603",appId:"1:374268704603:web:646ec6a00d2b5d45968c7e",measurementId:"G-860EZ6JGNF"};class l{userLoggedIn(){let e=this.firebaseAuth.currentUser;return!!(null==e?void 0:e.emailVerified)}currentUser(){return this.firebaseAuth.currentUser}getUserName(){var e,t;return(null!=(t=null==(e=c.currentUser())?void 0:e.email)?t:"@").split("@")[0]}getAuth(){return this.firebaseAuth}async signOut(){try{await (0,n.CI)(this.firebaseAuth)}catch(e){console.error("Error signing out:",e)}}async signIn(e,t){try{if(!(await (0,n.x9)(this.firebaseAuth,e,t)).user.emailVerified)return{error:"Email not verified!"}}catch(e){return{error:"Sign-in failed, error: ".concat(e)}}return{info:"Sucessfully signed-in."}}async signUp(e,t){try{let r=(await (0,n.eJ)(this.firebaseAuth,e,t)).user;return await (0,n.gA)(r),console.log("Success: Created user ".concat(r.uid,"!")),{info:"Created user account, verify your email and log in."}}catch(e){return{error:"Sign-up failed, error: ".concat(e)}}}async addFavorite(e){let t=this.getUserDoc(),r=await (0,i.x7)(t);if(r.exists()){let a=Array.from(new Set([...r.data().allFavorites||[],e]));await (0,i.mZ)(t,{allFavorites:a})}else console.log("creating new"),await (0,i.BN)(t,{allFavorites:[e]})}async getFavorites(){let e=this.getUserDoc(),t=await (0,i.x7)(e);return t.exists()&&t.data().allFavorites||[]}async removeFromFavorites(e){let t=this.getUserDoc(),r=await (0,i.x7)(t);if(r.exists()){let a=(r.data().allFavorites||[]).filter(t=>t!=e);await (0,i.mZ)(t,{allFavorites:a})}}async storeUserDoc(e){let t=this.currentUser();if(null==t)return"Not logged-in.";try{await (0,i.BN)((0,i.H9)(this.firestoreDb,"users",t.uid),e)}catch(e){return e}}getUserDoc(){let e=this.currentUser();console.assert(null!=e);let t=e.uid;return(0,i.H9)(this.firestoreDb,"users",t)}constructor(){let e=(0,a.Wp)(o);this.firebaseAuth=(0,n.xI)(e),this.firestoreDb=(0,i.aU)(e)}}let c=new l,u=c,d=e=>{var t;return(null!=(t=e.email)?t:"user@").split("@")[0]},g=()=>{let[e,t]=(0,s.useState)(void 0);return(0,s.useEffect)(()=>{let e=c.getAuth(),r=(0,n.hg)(e,e=>{e?localStorage.setItem("username",d(e)):localStorage.removeItem("username"),t(e||null)});return()=>r()},[]),e},m=e=>{let t=null;if(e)t=d(e);else if(void 0===e){console.log("Grabbing username from localstorage");let e=localStorage.getItem("username");null!==e&&(t=e)}return t}},8568:(e,t,r)=>{r.d(t,{A:()=>o});var a=r(9757),n=r(7985),i=r(5695),s=r(1218);n.Ay.use(s.r9).init({fallbackLng:a.q,lng:a.q,interpolation:{escapeValue:!1},resources:a.FG});let o=()=>{let e=(0,i.usePathname)(),{t,i18n:r}=(0,s.Bd)(),n=e.split("/")[1],o=a.Yj.includes(n)?n:a.q;return r.language!==o&&r.changeLanguage(o),{t,i18n:r,getLink:e=>"/"+n+e,currentLang:o}}},8951:(e,t,r)=>{r.d(t,{Sq:()=>i,tW:()=>a,uK:()=>n});let a="#fcbbbb",n="#bdffce",i="#d4d4d4"},9515:(e,t,r)=>{r.d(t,{cF:()=>u});var a=r(5155),n=r(2115),i=r(8951),s=r(8568),o=r(5685);let l=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),c=e=>(0,a.jsxs)("div",{className:"row",style:{marginTop:"0.5em"},children:[(0,a.jsx)("div",{className:"twocols",children:(0,a.jsx)("label",{className:"twocols",htmlFor:e.name,children:e.label})}),(0,a.jsx)("div",{className:"twocols rightcol",children:(0,a.jsx)("input",{type:e.type,style:{...o.C8,resize:"vertical"},value:e.value,onChange:e.onChange,name:e.name,id:e.name})})]});function u(e){var t;let{t:r}=(0,s.A)(),[u,d]=(0,n.useState)({email:"",password:"",...e.initState}),[g,m]=(0,n.useState)({}),f=async t=>{if(console.log("Submitting:",u),t.preventDefault(),!l(u.email))return void m({error:"Please enter a valid email address."});let r=await e.onSubmit(u);r.error&&d(e=>({...e,password:""})),m(r)},h=e=>{let{name:t,value:r}=e.target;d(e=>({...e,[t]:r}))},v=(0,a.jsx)(a.Fragment,{});g.error&&(v=(0,a.jsx)("div",{style:{backgroundColor:i.tW,marginTop:10,...o.C8},children:(0,a.jsx)("h3",{style:{padding:10},children:g.error})}));let p=(0,a.jsx)(a.Fragment,{});return g.info&&(p=(0,a.jsx)("div",{style:{backgroundColor:i.uK,marginTop:10,...o.C8},children:(0,a.jsx)("h3",{style:{padding:10},children:g.info})})),(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("h4",{children:e.title}),(0,a.jsxs)("form",{onSubmit:f,children:[(0,a.jsx)(c,{name:"email",type:"text",onChange:h,value:u.email,label:r("email")}),(0,a.jsx)(c,{name:"password",type:"password",onChange:h,value:u.password,label:r("password")}),null==(t=e.addForms)?void 0:t.map(e=>{let t={...e,onChange:h,value:u[e.name]};return(0,n.createElement)(c,{...t,key:e.name})}),(0,a.jsx)("div",{className:"row",style:{marginTop:"0.5em"},children:(0,a.jsx)("button",{type:"submit",...o.zA,children:r("submit")})})]}),v,p]})}},9757:(e,t,r)=>{r.d(t,{FG:()=>a,Yj:()=>n,q:()=>i});let a={en:{translation:{langName:"English",language:"Language",loading:"Loading...",helpTitle:"Help",favorites:"Favorites",favoritesAdd:"Add to favorites",favoritesRemove:"Remove from favorites",close:"Close",login:"Login",loginHere:"Log in here",loggedInAs:"Logged-in as",loginRequiredForPageAccess:"Login is required to access this page.",notLoggedIn:"Not logged-in.",logout:"Log out",noAccount:"No account?",alreadyHaveAccount:"Already have an account?",register:"Register",registerHere:"Register here",password:"Password",passwordConfirm:"Confirm password",forgotPassword:"Forgot your password?",settingsTitle:"Settings",instrumentKey:"Instrument Tuning",instrumentKeyShort:"Tuning",octave:"Octave",timeSignature:"Time Signature",sheetZoom:"Sheet scaling",fingering:"Fingering",fingerNone:"None",fingerThreeValves:"3 Valves",fingerTrombone:"Trombone",songKey:"Key",clef:"Clef",bassClef:"Bass",trebleClef:"Treble",totScores:"Number of pieces: {{num}}",filter:"Filter",txtFilterDefault:"Enter keyword(s)",allScores:"All Pieces",allScoresTxt:"There is a total of <num /> pieces of music available for playing along including the corresponding sheet music. They all can be accessed under <all/>. Or just jump right in and choose a <random />",findAllHereTxt:"More pieces can be found here: <all/>",randomScore:"Random Piece",recentScores:"Recently Added Pieces",recentTxt:"The most recently added scores are listed below. Choose one by clicking on it and start playing right away.",name:"Name",artist:"Artist",search:"Search",submit:"Submit",fullName:"Full Name",email:"Email Address",message:"Message",contact:"Contact",contactTxt:"If you have any questions, need assistance, or want to provide us with helpful feedback, please don't hesitate to use the following contact form.",intro:"Welcome! We are pleased to offer a wide variety of sheet music for a variety of musical styles and instruments. Our website features interactive sheet music that is synced with corresponding music videos, allowing you to play along with the video as you practice.",viewSheetsOn:"View sheet music on",sheetMoveMode:"Synchronization mode",horizontalMode:"Horizontal",verticalMode:"Vertical"}},es:{translation:{langName:"Espa\xf1ol",language:"Lenguaje",loading:"Cargando...",helpTitle:"Ayuda",settingsTitle:"Ajustes",favorites:"Favoritos",favoritesAdd:"A\xf1adir a mis favoritos",favoritesRemove:"Eliminar de favoritos",close:"Cierrar",login:"Iniciar",loginHere:"Iniciar aqui",loggedInAs:"Conectado como",loginRequiredForPageAccess:"Es necesario iniciar sesi\xf3n para acceder a esta p\xe1gina.",notLoggedIn:"No conectado.",logout:"Cerrar sesi\xf3n",noAccount:"\xbfNo tiene cuenta?",alreadyHaveAccount:"\xbfYa tiene una cuenta?",register:"Registrar",registerHere:"Registrar aqui",password:"Contrase\xf1a",passwordConfirm:"Confirmar contrase\xf1a",forgotPassword:"\xbfOlvid\xf3 su contrase\xf1a?",instrumentKey:"Afinaci\xf3n de instrumento",instrumentKeyShort:"Afinaci\xf3n",octave:"Octava",timeSignature:"Tipo de comp\xe1s",sheetZoom:"Escalado de partituras",fingering:"Digitaciones",fingerNone:"Ninguno",fingerThreeValves:"3 V\xe1lvulas",fingerTrombone:"Tromb\xf3n",songKey:"Tonalidad",clef:"Clave",bassClef:"Fa",trebleClef:"Sol",totScores:"N\xfamero de canciones: {{num}}",filter:"Filtro",txtFilterDefault:"Insertar palabras clave",allScores:"Toda la m\xfasica",allScoresTxt:"En total hay <num /> piezas. Se puede acceder a ellas a trav\xe9s del siguiente enlace <all/>. O elige una pieza al azar: <random />",findAllHereTxt:"Encontrar\xe1 m\xe1s piezas aqu\xed: <all/>",randomScore:"Pieza al azar",recentScores:"Piezas recientes",recentTxt:"Las piezas m\xe1s recientes se muestran a continuaci\xf3n.",name:"Nombre",artist:"Artista",search:"B\xfasqueda",submit:"Enviar",fullName:"Nombre",email:"Direcci\xf3n de correo electr\xf3nico",message:"Mensaje",contact:"Contacto",contactTxt:"Si tiene alguna pregunta, necesita ayuda o desea brindarnos comentarios \xfatiles, no dude en utilizar el siguiente formulario de contacto.",intro:"\xa1Bienvenido! Nos complace ofrecer una amplia variedad de partituras para una variedad de estilos e instrumentos musicales. Nuestro sitio web presenta partituras interactivas que se sincronizan con los videos musicales correspondientes, lo que le permite reproducir el video mientras practica.",viewSheetsOn:"Ver partitura en",sheetMoveMode:"Modo de sincronizaci\xf3n",horizontalMode:"Horizontal",verticalMode:"Vertical"}},de:{translation:{langName:"Deutsch",language:"Sprache",loading:"L\xe4dt...",helpTitle:"Hilfe",favorites:"Favoriten",favoritesAdd:"Zu Favoriten hinzuf\xfcgen",favoritesRemove:"Von Favoriten entfernen",close:"Schliessen",login:"Anmelden",loginHere:"Hier anmelden",loggedInAs:"Eingeloggt als",loginRequiredForPageAccess:"F\xfcr den Zugriff auf diese Seite ist ein Login erforderlich.",notLoggedIn:"Nicht eingeloggt.",logout:"Abmelden",noAccount:"Kein Benutzerkonto?",alreadyHaveAccount:"Haben Sie bereits ein Konto?",register:"Registrieren",registerHere:"Hier registrieren",password:"Passwort",passwordConfirm:"Best\xe4tige Passwort",forgotPassword:"Passwort vergessen?",settingsTitle:"Einstellungen",instrumentKey:"Instrumentenstimmung",instrumentKeyShort:"Stimmung",octave:"Oktave",timeSignature:"Taktart",sheetZoom:"Notenskalierung",fingering:"Griffe",fingerNone:"Keine",fingerThreeValves:"3 Ventile",fingerTrombone:"Posaune",songKey:"Tonart",clef:"Schl\xfcssel",bassClef:"Bass",trebleClef:"Violin",totScores:"Anzahl Lieder: {{num}}",filter:"Filter",txtFilterDefault:"Liedname oder K\xfcnstler",allScores:"Alle Lieder",allScoresTxt:"Es stehen total <num /> Lieder zur Verf\xfcgung mit den dazugeh\xf6rigen Noten. Alle k\xf6nnen unter <all/> gefunden werden. Alternativ kann ein zuf\xe4lliges gew\xe4hlt werden unter folgendem Link: <random />",findAllHereTxt:"Mehr St\xfccke gibt es hier: <all/>",randomScore:"Zuf\xe4lliges St\xfcck",recentScores:"K\xfcrzlich hinzugef\xfcgte Lieder",recentTxt:"Die neusten verf\xfcgbaren St\xfccke sind unten aufgef\xfchrt.",name:"Name",artist:"K\xfcnstler",search:"Suche",submit:"Absenden",fullName:"Vor- und Nachname",email:"Email Addresse",message:"Nachricht",contact:"Kontakt",contactTxt:"Wenn Sie Fragen haben, Hilfe ben\xf6tigen oder uns hilfreiches Feedback geben m\xf6chten, nutzen Sie bitte das folgende Kontaktformular.",intro:"Willkommen! Wir freuen uns, eine gro\xdfe Auswahl an Noten f\xfcr verschiedene Musikstile und Instrumente anbieten zu k\xf6nnen. Auf unserer Website finden Sie interaktive Noten, die mit entsprechenden Musikvideos synchronisiert sind, so dass Sie beim \xdcben zum Video mitspielen k\xf6nnen.",viewSheetsOn:"Schauen Sie sich die Noten an auf",sheetMoveMode:"Synchronisierungsmodus",horizontalMode:"Horizontal",verticalMode:"Vertikal"}}},n=Object.keys(a),i="en"}}]);
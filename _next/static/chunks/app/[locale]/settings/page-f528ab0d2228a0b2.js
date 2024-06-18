(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[955],{6472:function(e,n,t){Promise.resolve().then(t.bind(t,7915))},7915:function(e,n,t){"use strict";t.d(n,{default:function(){return y}});var i=t(7437),s=t(6242),r=t(234),a=t(7138),l=t(2265);let o={position:"relative",display:"inline-block"},c={border:"none",cursor:"pointer"},u={position:"absolute",zIndex:1},g={textDecoration:"none",display:"block"},d=(e,n)=>{let[t,r]=(0,l.useState)(!1),{getLink:d}=(0,s.Z)(),m={...u,display:t?"block":"none"};return(0,i.jsxs)("div",{style:o,children:[(0,i.jsxs)("button",{style:c,onClick:()=>r(!t),children:[e," ▾"]}),(0,i.jsx)("div",{style:m,children:n.map(e=>e.url?(0,i.jsx)(a.default,{href:d(e.url),style:g,children:e.name},e.key):(0,i.jsx)("button",{style:g,onClick:()=>{e.onClick(),r(!1)},children:e.name},e.key))})]})},m=["C","B♭","F","E♭"];class f{getStorage(){return window.localStorage}get(e,n){var t;return(null===(t=this.getStorage())||void 0===t?void 0:t.getItem(e))||n[0]}getClef(){return this.get(this.clefKey,this.clefOptions)}setClef(e){var n;null===(n=this.getStorage())||void 0===n||n.setItem(this.clefKey,e)}getClefOptions(e){return this.clefOptions.map(n=>({name:e(n),onClick:()=>this.setClef(n),key:n}))}getInstrumentKey(){return this.get(this.instrumentKeyKey,m)}setInstrumentKey(e){localStorage.setItem(this.instrumentKeyKey,e)}getInstrumentKeyOptions(){return m.map(e=>({name:e,onClick:()=>this.setInstrumentKey(e),key:e}))}getFingering(){return this.get(this.fingeringKey,this.fingeringOptions)}setFingering(e){localStorage.setItem(this.fingeringKey,e)}getFingeringOptions(e){return this.fingeringOptions.map(n=>({name:e(n),onClick:()=>this.setFingering(n),key:n}))}constructor(){this.clefOptions=["trebleClef","bassClef"],this.clefKey="clef",this.instrumentKeyKey="instrumentKey",this.fingeringKey="fingering",this.fingeringOptions=["fingerNone","fingerThreeValves","fingerTrombone"]}}let h=new f;var y=()=>{let{t:e}=(0,s.Z)(),n=h.getInstrumentKeyOptions(),t=d(h.getInstrumentKey(),n),a=h.getClefOptions(e),l=d(e(h.getClef()),a),o=h.getFingeringOptions(e),c=d(e(h.getFingering()),o);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("h4",{children:e("settingsTitle")}),(0,i.jsxs)("div",{className:"row",children:[(0,i.jsx)("div",{style:r.O,children:e("instrumentKey")}),(0,i.jsx)("div",{style:r.O,children:t}),(0,i.jsx)("div",{style:r.O,children:e("clef")}),(0,i.jsx)("div",{style:r.O,children:l}),(0,i.jsx)("div",{style:r.O,children:e("fingering")}),(0,i.jsx)("div",{style:r.O,children:c})]})]})}},234:function(e,n,t){"use strict";t.d(n,{O:function(){return i}});let i={float:"left",width:"50%"}},6242:function(e,n,t){"use strict";var i=t(244),s=t(6027),r=t(6463),a=t(89);s.ZP.use(a.Db).init({fallbackLng:i.al,lng:i.al,interpolation:{escapeValue:!1},resources:i.v0}),n.Z=()=>{let e=(0,r.usePathname)(),{t:n,i18n:t}=(0,a.$G)(),s=e.split("/")[1],l=i.a2.includes(s)?s:i.al;return t.language!==l&&t.changeLanguage(l),{t:n,i18n:t,getLink:e=>"/"+s+e,currentLang:l}}},244:function(e,n,t){"use strict";t.d(n,{a2:function(){return s},al:function(){return r},v0:function(){return i}});let i={en:{translation:{langName:"English",language:"Language",helpTitle:"Help",settingsTitle:"Settings",instrumentKey:"Instrument Tuning",timeSignature:"Time Signature",fingering:"Fingering",fingerNone:"None",fingerThreeValves:"3 Valves",fingerTrombone:"Trombone",songKey:"Key",clef:"Clef",bassClef:"Bass",trebleClef:"Treble",totScores:"Number of pieces: {{num}}",filter:"Filter",txtFilterDefault:"Enter keyword(s)",allScores:"All Scores",allScoresTxt:"There is a total of <num /> scores available for playing along including the corresponding sheet music. They all can be accessed under <all/>. Or just jump right in and choose a <random />",randomScore:"Random Piece",recentScores:"Recently Added Pieces",recentTxt:"The most recently added scores are listed below. Choose one by clicking on it and start playing right away.",name:"Name",artist:"Artist",search:"Search",submit:"Submit",fullName:"Full Name",email:"Email Address",message:"Message",contact:"Contact",contactTxt:"If you have any questions, need assistance, or want to provide us with helpful feedback, please don't hesitate to use the following contact form.",intro:"Welcome to our sheet music website! We are pleased to offer a wide variety of sheet music for a variety of musical styles and instruments. Our website features interactive sheet music that is synced with corresponding music videos, allowing you to play along with the video as you practice."}},es:{translation:{langName:"Espa\xf1ol",language:"Lenguaje",helpTitle:"Ayuda",settingsTitle:"Ajustes",instrumentKey:"Afinaci\xf3n de instrumento",timeSignature:"Tipo de comp\xe1s",fingering:"Digitaciones",fingerNone:"Ninguno",fingerThreeValves:"3 V\xe1lvulas",fingerTrombone:"Tromb\xf3n",songKey:"Tonalidad",clef:"Clave",bassClef:"Fa",trebleClef:"Sol",totScores:"N\xfamero de canciones: {{num}}",filter:"Filtro",txtFilterDefault:"Insertar palabras clave",allScores:"Toda la m\xfasica",allScoresTxt:"En total hay <num /> piezas. Se puede acceder a ellas a trav\xe9s del siguiente enlace <all/>. O elige una pieza al azar: <random />",randomScore:"Pieza al azar",recentScores:"Piezas recientes",recentTxt:"Las piezas m\xe1s recientes se muestran a continuaci\xf3n.",name:"Nombre",artist:"Artista",search:"B\xfasqueda",submit:"Enviar",fullName:"Nombre",email:"Direcci\xf3n de correo electr\xf3nico",message:"Mensaje",contact:"Contacto",contactTxt:"Si tiene alguna pregunta, necesita ayuda o desea brindarnos comentarios \xfatiles, no dude en utilizar el siguiente formulario de contacto.",intro:"\xa1Bienvenido a nuestro sitio web de partituras! Nos complace ofrecer una amplia variedad de partituras para una variedad de estilos e instrumentos musicales. Nuestro sitio web presenta partituras interactivas que se sincronizan con los videos musicales correspondientes, lo que le permite reproducir el video mientras practica."}},de:{translation:{langName:"Deutsch",language:"Sprache",helpTitle:"Hilfe",settingsTitle:"Einstellungen",instrumentKey:"Instrumentenstimmung",timeSignature:"Taktart",fingering:"Griffe",fingerNone:"Keine",fingerThreeValves:"3 Ventile",fingerTrombone:"Posaune",songKey:"Tonart",clef:"Schl\xfcssel",bassClef:"Bass",trebleClef:"Violin",totScores:"Anzahl Lieder: {{num}}",filter:"Filter",txtFilterDefault:"Liedname oder K\xfcnstler",allScores:"Alle Lieder",allScoresTxt:"Es stehen total <num /> Lieder zur Verf\xfcgung mit den dazugeh\xf6rigen Noten. Alle k\xf6nnen unter <all/> gefunden werden. Alternativ kann ein zuf\xe4lliges gew\xe4hlt werden unter folgendem Link: <random />",randomScore:"Zuf\xe4lliges St\xfcck",recentScores:"K\xfcrzlich hinzugef\xfcgte Lieder",recentTxt:"Die neusten verf\xfcgbaren St\xfccke sind unten aufgef\xfchrt.",name:"Name",artist:"K\xfcnstler",search:"Suche",submit:"Absenden",fullName:"Vor- und Nachname",email:"Email Addresse",message:"Nachricht",contact:"Kontakt",contactTxt:"Wenn Sie Fragen haben, Hilfe ben\xf6tigen oder uns hilfreiches Feedback geben m\xf6chten, nutzen Sie bitte das folgende Kontaktformular.",intro:"Willkommen auf unserer Noten-Website! Wir freuen uns, eine gro\xdfe Auswahl an Noten f\xfcr verschiedene Musikstile und Instrumente anbieten zu k\xf6nnen. Auf unserer Website finden Sie interaktive Noten, die mit entsprechenden Musikvideos synchronisiert sind, so dass Sie beim \xdcben zum Video mitspielen k\xf6nnen."}}},s=Object.keys(i),r="en"}},function(e){e.O(0,[389,138,971,23,744],function(){return e(e.s=6472)}),_N_E=e.O()}]);
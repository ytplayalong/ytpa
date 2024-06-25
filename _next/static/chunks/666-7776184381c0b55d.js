"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[666],{2635:function(e,t,a){a.d(t,{settingsManager:function(){return u}});var n=a(7437),i=a(6242),s=a(234),r=a(4294),l=a(1938);class o{getStorage(){return window.localStorage}get(e,t){var a;return(null===(a=this.getStorage())||void 0===a?void 0:a.getItem(e))||t[0]}getClef(){return this.get(this.clefKey,this.clefOptions)}setClef(e){var t;null===(t=this.getStorage())||void 0===t||t.setItem(this.clefKey,e)}getClefOptions(e){return this.clefOptions.map(t=>({name:e(t),onClick:()=>this.setClef(t),key:t}))}getInstrumentKey(){return this.get(this.instrumentKeyKey,l.xj)}setInstrumentKey(e){localStorage.setItem(this.instrumentKeyKey,e)}getInstrumentKeyOptions(){return l.xj.map(e=>({name:e,onClick:()=>this.setInstrumentKey(e),key:e}))}getFingering(){return this.get(this.fingeringKey,this.fingeringOptions)}setFingering(e){localStorage.setItem(this.fingeringKey,e)}getFingeringOptions(e){return this.fingeringOptions.map(t=>({name:e(t),onClick:()=>this.setFingering(t),key:t}))}constructor(){this.clefOptions=["trebleClef","bassClef"],this.clefKey="clef",this.instrumentKeyKey="instrumentKey",this.fingeringKey="fingering",this.fingeringOptions=["fingerNone","fingerThreeValves","fingerTrombone"]}}let u=new o;t.default=()=>{let{t:e}=(0,i.Z)(),t=u.getInstrumentKeyOptions(),a=(0,r.v)(u.getInstrumentKey(),t),l=u.getClefOptions(e),o=e(u.getClef()),m=(0,r.v)(o,l),g=u.getFingeringOptions(e),c=e(u.getFingering()),d=(0,r.v)(c,g);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("h4",{children:e("settingsTitle")}),(0,n.jsxs)("div",{className:"row",style:{marginBottom:"0.2em"},children:[(0,n.jsx)("div",{style:s.OD,children:e("instrumentKey")}),(0,n.jsx)("div",{style:s.OD,children:a})]}),(0,n.jsxs)("div",{className:"row",style:{marginBottom:"0.2em"},children:[(0,n.jsx)("div",{style:s.OD,children:e("clef")}),(0,n.jsx)("div",{style:s.OD,children:m})]}),(0,n.jsxs)("div",{className:"row",style:{marginBottom:"0.2em"},children:[(0,n.jsx)("div",{style:s.OD,children:e("fingering")}),(0,n.jsx)("div",{style:s.OD,children:d})]})]})}},4294:function(e,t,a){a.d(t,{H:function(){return c},v:function(){return g}});var n=a(7437),i=a(6242),s=a(7138),r=a(2265),l=a(234);let o={position:"relative",display:"inline-block"},u={position:"absolute",zIndex:1},m={...l.jn,textDecoration:"none",display:"block",borderRadius:0},g=(e,t)=>{let[a,g]=(0,r.useState)(!1),{getLink:c}=(0,i.Z)(),d={...u,display:a?"block":"none"};return(0,n.jsxs)("div",{style:o,children:[(0,n.jsxs)("button",{style:l.jn,onClick:()=>g(!a),children:[e," ▾"]}),(0,n.jsx)("div",{style:d,children:t.map(e=>e.url?(0,n.jsx)(s.default,{href:c(e.url),style:m,children:e.name},e.key):(0,n.jsx)("button",{style:m,onClick:()=>{e.onClick(),g(!1)},children:e.name},e.key))})]})},c=e=>g(e.children,e.options)},234:function(e,t,a){a.d(t,{OD:function(){return n},Pp:function(){return l},W9:function(){return r},hG:function(){return s},jn:function(){return i}});let n={float:"left",width:"50%"},i={border:"none",cursor:"pointer",padding:"0.5em",minWidth:"100px",borderRadius:"5px"},s={boxSizing:"border-box",width:"100%",minHeight:"40px",borderRadius:"7px"},r={justifyContent:"space-between",display:"flex"},l={display:"flex",justifyContent:"center",textAlign:"center",alignItems:"center"}},1938:function(e,t,a){a.d(t,{f$:function(){return l},Bq:function(){return T},vr:function(){return o},s1:function(){return g},z8:function(){return s},ON:function(){return m},g1:function(){return u},MR:function(){return r},p4:function(){return b},xj:function(){return p}});var n=a(2635),i=JSON.parse('[{"keys":[-5],"times":[[2,4]],"source":"18241966","videoId":"pyGJfRl39Rw","measureMap":{"3":3,"239":177},"fileName":"Bas_Aut","name":"Bas Aut","artist":"Pat\xe9 de Fu\xe1","language":"instrumental"},{"keys":[-1,-2],"times":[[2,4]],"source":"18676897","videoId":"nKqIW7jdA4k","measureMap":{"8":9,"123":113},"fileName":"Sechselaeuten_Marsch","name":"Z\xfcrcher Sechsel\xe4utenmarsch","artist":"Stadtmusik Z\xfcrich","language":"instrumental"},{"keys":[-3,-2],"times":[[2,2]],"source":"18676885","videoId":"KFIVi59aqGg","measureMap":{"5":5,"158":137,"243":211},"fileName":"Swing_Flags_Swing","name":"Swing Flags Swing","artist":"Swiss Army Concert Band & Major Christoph Walter","language":"instrumental"},{"keys":[2],"times":[[4,4]],"source":"18676870","videoId":"hyaI5VWINmE","measureMap":{"2":1,"119":105},"fileName":"Contrato_Limosna","name":"Contrato Limosna","artist":"The Locos","language":"spanish"},{"keys":[-6],"times":[[4,4]],"source":"18676864","videoId":"fVb8dBQ7jKg","measureMap":{"1":1,"175":99},"fileName":"Out_Mais_Non","name":"Oui mais... Non","artist":"Myl\xe8ne Farmer","language":"french"},{"keys":[0],"times":[[4,4]],"source":"18676669","videoId":"cyeVIrbF8NY","measureMap":{"7":5,"173":99},"fileName":"De_Plan","name":"D\xe4 Plan","artist":"Querbeat","language":"german"},{"keys":[0],"times":[[4,4]],"source":"18676663","videoId":"MFIpx1wbIBY","measureMap":{"1":1,"255":128},"fileName":"Mahalageasca","name":"Mahalageasca","artist":"Shantel","language":"instrumental"},{"keys":[1],"times":[[4,4]],"source":"18676645","videoId":"IWeyp0tpClQ","measureMap":{"2":2,"143":83},"fileName":"Ni_tu_ni_nadie","name":"Ni t\xfa ni nadie","artist":"Alaska y Dinarama","language":"spanish"},{"keys":[-5],"times":[[4,4]],"source":"18676444","videoId":"PQZhN65vq9E","measureMap":{"3":2,"66":31,"88":41,"101":47,"125":58},"fileName":"Youve_Got_the_Love","name":"You\'ve Got the Love","artist":"Florence + The Machine","language":"english"},{"keys":[-2],"times":[[2,4]],"source":"18676435","videoId":"xgG4Z9vKrH4","measureMap":{"3":4,"44":38},"fileName":"Bucovina","name":"Bucovina","artist":"Shantel","language":"instrumental"},{"keys":[-1],"times":[[4,4]],"source":"18676420","videoId":"3jtOPKs-4n8","measureMap":{"2":3,"217":166},"fileName":"Algo_Mejor","name":"Algo Mejor","artist":"The Locos","language":"spanish"},{"keys":[1,3],"times":[[4,4]],"source":"18676198","videoId":"zGH9xqbcZf8","measureMap":{"4":4,"222":175},"fileName":"A_la_Mierda","name":"A la Mierda","artist":"Ska-P","language":"spanish"},{"keys":[-3],"times":[[4,4]],"source":"18676180","videoId":"rKCl8S2IkZU","measureMap":{"4":4,"120":91},"fileName":"Fuego_y_Dinamita","name":"Fuego y Dinamita","artist":"The Locos","language":"spanish"},{"keys":[0],"times":[[4,4]],"source":"18676108","videoId":"KIvz5zYXCoI","measureMap":{"4":3,"97":58},"fileName":"Summer_Wine","name":"Summer Wine","artist":"Ville Valo & Natalia Avelon","language":"english"},{"keys":[2,3,4],"times":[[4,4]],"source":"18675976","videoId":"hNQCWw8rt0w","measureMap":{"6":4,"199":80},"fileName":"Nessaja","name":"Nessaja","artist":"Peter Maffay","language":"german"},{"keys":[-6],"times":[[4,4]],"source":"18675967","videoId":"6o8wG0j0HPc","measureMap":{"3":2,"176":85},"fileName":"La_Colegiala","name":"La Colegiala","artist":"Pat\xe9 de Fu\xe1","language":"spanish"},{"keys":[1],"times":[[4,4]],"source":"18675001","videoId":"y2q5R9HU7C0","measureMap":{"3":2,"166":59},"fileName":"Skal","name":"SK\xc5L!","artist":"Miracle Of Sound","language":"english"},{"keys":[3],"times":[[4,4],[6,8]],"source":"18674980","videoId":"Q0flkeqtMnE","measureMap":{"1":2,"43":25,"46":27,"160":132,"169":136},"fileName":"Como_Un_Animal","name":"Como Un Animal","artist":"The Locos","language":"spanish"},{"keys":[-2],"times":[[4,4]],"source":"18674962","videoId":"aT9VcFMtOmo","measureMap":{"1":2,"197":113},"fileName":"Eisbaer","name":"Eisb\xe4r","artist":"Querbeat","language":"german"},{"keys":[-4],"times":[[4,4]],"source":"18674938","videoId":"qkrrqTEH_zg","measureMap":{"4":2,"157":64},"fileName":"Vincent","name":"Vincent","artist":"Sarah Connor","language":"german"},{"keys":[4],"times":[[12,8]],"source":"18674923","videoId":"Mq0IqiFXIZQ","measureMap":{"23":1,"28":4,"80":33},"fileName":"La_Polenta","name":"La Polenta Taragnarock","artist":"Nanowar Of Steel ft. Giorgio Mastrota","language":"italian"},{"keys":[4],"times":[[4,4]],"source":"18674896","videoId":"SR5sxe1IQUo","measureMap":{"22":3,"241":107},"fileName":"Alperose","name":"Alperose","artist":"Polo Hofer & Die Schmetterband","language":"german"},{"keys":[3],"times":[[4,4]],"source":"18674878","videoId":"VzBQL5b36ww","measureMap":{"9":5,"118":55},"fileName":"Up_In_The_Sky","name":"Up In The Sky","artist":"77 Bombay Street","language":"english"},{"keys":[-1],"times":[[4,4]],"source":"18674857","videoId":"zebtU_O_-tk","measureMap":{"3":3,"88":41},"fileName":"Hacia_el_Sur","name":"Hacia el Sur","artist":"Pat\xe9 de Fu\xe1","language":"spanish"},{"keys":[3],"times":[[4,4]],"source":"18674839","videoId":"CxMcKK93c_g","measureMap":{"3":3,"55":40},"fileName":"Nur_es_Wort","name":"Nur es Wort","artist":"Jule X","language":"german"},{"keys":[2],"times":[[4,4]],"source":"18674830","videoId":"0pjSULftl1o","measureMap":{"12":1,"135":88},"fileName":"City_Streets","name":"City Streets","artist":"Charly Lownoise & Re-Style","language":"english"},{"keys":[1],"times":[[4,4]],"source":"18242404","videoId":"fbChSuSQIo4","measureMap":{"11":8,"235":156},"fileName":"An_Tagen_wie_diesen","name":"An Tagen wie diesen","artist":"Fettes Brot","language":"german"},{"keys":[1],"times":[[4,4]],"source":"18674806","videoId":"GCG6-DNXOZY","measureMap":{"3":1,"149":61},"fileName":"Alles_Gute","name":"Alles Gute","artist":"Faber","language":"german"},{"keys":[-4],"times":[[3,4]],"source":"18674791","videoId":"jIw70Gwdwz0","measureMap":{"1":1,"107":87},"fileName":"Alma_Corazon_y_Vida","name":"Alma Corazon y Vida","artist":"Los Panchos","language":"spanish"},{"keys":[-3],"times":[[4,4]],"source":"18674656","videoId":"dGWQqRyO8gA","measureMap":{"5":1,"142":92},"fileName":"Empty_Walls","name":"Empty Walls","artist":"Serj Tankian","language":"english"},{"keys":[0],"times":[[4,4]],"source":"18674653","videoId":"GwTgGrM3tFg","measureMap":{"13":8,"157":85},"fileName":"Trampolin","name":"Trampolin","artist":"F\xe4aschtb\xe4nkler","language":"german"},{"keys":[-5],"times":[[4,4]],"source":"18242371","videoId":"tmPws7eXcVk","measureMap":{"2":1,"177":103},"fileName":"Desenchantee","name":"D\xe9senchant\xe9e","artist":"Kate Ryan","language":"french"},{"keys":[-3],"times":[[4,4]],"source":"18674632","videoId":"8lF4YcIHKa8","measureMap":{"5":3,"231":99},"fileName":"SAT","name":"SAT","artist":"Boban Markovic Orkestar","language":"instrumental"},{"keys":[-2],"times":[[4,4]],"source":"18674605","videoId":"KNZwqmEb004","measureMap":{"6":3,"292":97},"fileName":"Revolution_of_Two","name":"Revolution of Two","artist":"Avatar","language":"english"},{"keys":[-1],"times":[[4,4],[2,4]],"source":"18236494","videoId":"DinJw_QZa-o","measureMap":{"5":1,"12":5,"53":28,"112":61},"fileName":"Nikodem","name":"Nikodem","artist":"Warszawska Orkiestra Sentymentalna","language":"polish"},{"keys":[0],"times":[[4,4]],"source":"18674581","videoId":"GOxDTGGV_5Q","measureMap":{"13":9,"63":41,"154":99},"fileName":"Ciganka","name":"Ciganka / Ciganočka","artist":"Skupina Belin","language":"slovenian"},{"keys":[1],"times":[[4,4]],"source":"18674533","videoId":"GM2tH3_FysI","measureMap":{"2":2,"51":40,"82":64},"fileName":"Lets_Call_It","name":"Let\'s Call It","artist":"Sick Leave","language":"english"},{"keys":[0],"times":[[4,4]],"source":"18674518","videoId":"Vij2l_G-4ok","measureMap":{"5":3,"106":45},"fileName":"Txikia","name":"Txikia","artist":"Arene 6","language":"spanish"},{"keys":[-4],"times":[[4,4],[2,4]],"source":"18674500","videoId":"nE_5BCzLZhw","measureMap":{"13":7,"80":35},"fileName":"El_Tren_De_La_Alegria","name":"El Tren De La Alegr\xeda","artist":"Pat\xe9 de Fu\xe1","language":"spanish"},{"keys":[-1],"times":[[3,4]],"source":"18237109","videoId":"vm4aLTZ3Y3s","measureMap":{"33":33,"86":85},"fileName":"El_vals_del_circo","name":"El Vals del Circo","artist":"Pat\xe9 de Fu\xe1","language":"spanish"},{"keys":[0],"times":[[4,4],[2,4]],"source":"18674482","videoId":"li6rgm1_MR0","measureMap":{"6":4,"20":12,"79":44},"fileName":"Makam_Dub","name":"Makam Dub","artist":"Youthie & Kino Doscun","language":"instrumental"}]');let s=e=>e>=0?"".concat(e,"#"):"".concat(-e,"♭"),r=["name","artist"],l=i,o=()=>[...l],u={height:"390px",width:"640px"},m=e=>new window.DOMParser().parseFromString(e,"text/xml"),g=(e,t)=>{let a=e.getElementsByTagName(t);return console.assert(1===a.length),a[0]},c={C:0,D:2,E:4,F:5,G:7,A:9,B:11},d=[["C",0],["C",1],["D",0],["D",1],["E",0],["F",0],["F",1],["G",0],["G",1],["A",0],["A",1],["B",0]],f=[["C",0],["D",-1],["D",0],["E",-1],["E",0],["F",0],["G",-1],["G",0],["A",-1],["A",0],["B",-1],["B",0]],h={C:[0,0],"B♭":[2,2],F:[7,1],"E♭":[9,3]},p=Object.keys(h),y=f.length,v=(e,t,a,n,i)=>{let s=c[e]+n+a,[r,l]=i[s%y];return[r,l,s>=y?t+1:t]},k=(e,t)=>{let a=e.getElementsByTagName("attributes")[0];if(!a)return null;let n=a.getElementsByTagName("fifths");if(0===n.length)return null;let i=n[0],s=parseInt(i.textContent)+t;return s>6?s-=12:s<-6&&(s+=12),i.textContent="".concat(s),s>=0?d:f},N={3:[void 0,void 0,void 0,void 0,void 0,void 0,"123","13","23","12","1","2"],4:["0","123","13","23","12","1","2","0","23","12","1","2"],5:["0","12","1","2","0","1","2","0","23","12","1","2"],6:["0","12","1"]},S={0:"1",2:"2",1:"3",12:"4",23:"5",13:"6",123:"7"},b=(e,t,a,i)=>{var s;let[r,l]=h[t],o=e.getElementsByTagName("measure"),u=n.settingsManager.getClef(),m=e.getElementsByTagName("clef")[0],g=null===(s=m.getElementsByTagName("clef-octave-change")[0])||void 0===s?void 0:s.textContent,d=g?parseInt(g):0;if("Bass"===u){a-=1;for(let e=0;e<m.children.length;++e){let t=m.children[e],a=t.tagName;"sign"===a?t.textContent="F":"line"===a&&(t.textContent="4")}}let f=null;for(let t=0;t<o.length;++t){let n=o[t],s=k(n,l);null!==s&&(f=s),console.assert(null!==f,"Invalid scale!");let m=n.getElementsByTagName("note");for(let t=0;t<m.length;++t){let n=m[t],s=n.getElementsByTagName("pitch")[0];if(!s)continue;let l=s.getElementsByTagName("step")[0],o=s.getElementsByTagName("octave")[0],g=s.getElementsByTagName("alter")[0],h=g?Number.parseInt(g.textContent):0,p=Number.parseInt(o.textContent),[y,k,b]=v(l.textContent,p+a,h,r,f);if(l.textContent=y,o.textContent=b.toString(),g)0!==k?g.textContent=k.toString():s.removeChild(g);else if(0!==k){let t=e.createElement("alter");t.textContent=k.toString(),s.appendChild(t)}if(null!==i){let t=c[y]+k,a=N[("bass"===u?b+1:b)-d],s=void 0!==a?a[t]:void 0;void 0!==s&&"fingerNone"!==i&&("fingerTrombone"===i&&(s=S[s]),I(e,n,s))}let C=n.getElementsByTagName("accidental")[0];C&&n.removeChild(C)}}},I=(e,t,a)=>{{let n=t.getElementsByTagName("notations")[0],i=n||e.createElement("notations"),s=e.createElement("technical"),r=e.createElement("fingering");r.textContent=a,i.appendChild(s),s.appendChild(r),n||t.appendChild(i)}},C=(e,t)=>Math.floor(Math.random()*(t-e+1)+e),T=()=>{let e=C(0,l.length-1);return l[e]}},6242:function(e,t,a){var n=a(244),i=a(6027),s=a(6463),r=a(89);i.ZP.use(r.Db).init({fallbackLng:n.al,lng:n.al,interpolation:{escapeValue:!1},resources:n.v0}),t.Z=()=>{let e=(0,s.usePathname)(),{t,i18n:a}=(0,r.$G)(),i=e.split("/")[1],l=n.a2.includes(i)?i:n.al;return a.language!==l&&a.changeLanguage(l),{t,i18n:a,getLink:e=>"/"+i+e,currentLang:l}}},244:function(e,t,a){a.d(t,{a2:function(){return i},al:function(){return s},v0:function(){return n}});let n={en:{translation:{langName:"English",language:"Language",helpTitle:"Help",settingsTitle:"Settings",instrumentKey:"Instrument Tuning",timeSignature:"Time Signature",fingering:"Fingering",fingerNone:"None",fingerThreeValves:"3 Valves",fingerTrombone:"Trombone",songKey:"Key",clef:"Clef",bassClef:"Bass",trebleClef:"Treble",totScores:"Number of pieces: {{num}}",filter:"Filter",txtFilterDefault:"Enter keyword(s)",allScores:"All Pieces",allScoresTxt:"There is a total of <num /> pieces of music available for playing along including the corresponding sheet music. They all can be accessed under <all/>. Or just jump right in and choose a <random />",randomScore:"Random Piece",recentScores:"Recently Added Pieces",recentTxt:"The most recently added scores are listed below. Choose one by clicking on it and start playing right away.",name:"Name",artist:"Artist",search:"Search",submit:"Submit",fullName:"Full Name",email:"Email Address",message:"Message",contact:"Contact",contactTxt:"If you have any questions, need assistance, or want to provide us with helpful feedback, please don't hesitate to use the following contact form.",intro:"Welcome to our sheet music website! We are pleased to offer a wide variety of sheet music for a variety of musical styles and instruments. Our website features interactive sheet music that is synced with corresponding music videos, allowing you to play along with the video as you practice.",viewSheetsOn:"View sheet music on"}},es:{translation:{langName:"Espa\xf1ol",language:"Lenguaje",helpTitle:"Ayuda",settingsTitle:"Ajustes",instrumentKey:"Afinaci\xf3n de instrumento",timeSignature:"Tipo de comp\xe1s",fingering:"Digitaciones",fingerNone:"Ninguno",fingerThreeValves:"3 V\xe1lvulas",fingerTrombone:"Tromb\xf3n",songKey:"Tonalidad",clef:"Clave",bassClef:"Fa",trebleClef:"Sol",totScores:"N\xfamero de canciones: {{num}}",filter:"Filtro",txtFilterDefault:"Insertar palabras clave",allScores:"Toda la m\xfasica",allScoresTxt:"En total hay <num /> piezas. Se puede acceder a ellas a trav\xe9s del siguiente enlace <all/>. O elige una pieza al azar: <random />",randomScore:"Pieza al azar",recentScores:"Piezas recientes",recentTxt:"Las piezas m\xe1s recientes se muestran a continuaci\xf3n.",name:"Nombre",artist:"Artista",search:"B\xfasqueda",submit:"Enviar",fullName:"Nombre",email:"Direcci\xf3n de correo electr\xf3nico",message:"Mensaje",contact:"Contacto",contactTxt:"Si tiene alguna pregunta, necesita ayuda o desea brindarnos comentarios \xfatiles, no dude en utilizar el siguiente formulario de contacto.",intro:"\xa1Bienvenido a nuestro sitio web de partituras! Nos complace ofrecer una amplia variedad de partituras para una variedad de estilos e instrumentos musicales. Nuestro sitio web presenta partituras interactivas que se sincronizan con los videos musicales correspondientes, lo que le permite reproducir el video mientras practica.",viewSheetsOn:"Ver partitura en"}},de:{translation:{langName:"Deutsch",language:"Sprache",helpTitle:"Hilfe",settingsTitle:"Einstellungen",instrumentKey:"Instrumentenstimmung",timeSignature:"Taktart",fingering:"Griffe",fingerNone:"Keine",fingerThreeValves:"3 Ventile",fingerTrombone:"Posaune",songKey:"Tonart",clef:"Schl\xfcssel",bassClef:"Bass",trebleClef:"Violin",totScores:"Anzahl Lieder: {{num}}",filter:"Filter",txtFilterDefault:"Liedname oder K\xfcnstler",allScores:"Alle Lieder",allScoresTxt:"Es stehen total <num /> Lieder zur Verf\xfcgung mit den dazugeh\xf6rigen Noten. Alle k\xf6nnen unter <all/> gefunden werden. Alternativ kann ein zuf\xe4lliges gew\xe4hlt werden unter folgendem Link: <random />",randomScore:"Zuf\xe4lliges St\xfcck",recentScores:"K\xfcrzlich hinzugef\xfcgte Lieder",recentTxt:"Die neusten verf\xfcgbaren St\xfccke sind unten aufgef\xfchrt.",name:"Name",artist:"K\xfcnstler",search:"Suche",submit:"Absenden",fullName:"Vor- und Nachname",email:"Email Addresse",message:"Nachricht",contact:"Kontakt",contactTxt:"Wenn Sie Fragen haben, Hilfe ben\xf6tigen oder uns hilfreiches Feedback geben m\xf6chten, nutzen Sie bitte das folgende Kontaktformular.",intro:"Willkommen auf unserer Noten-Website! Wir freuen uns, eine gro\xdfe Auswahl an Noten f\xfcr verschiedene Musikstile und Instrumente anbieten zu k\xf6nnen. Auf unserer Website finden Sie interaktive Noten, die mit entsprechenden Musikvideos synchronisiert sind, so dass Sie beim \xdcben zum Video mitspielen k\xf6nnen.",viewSheetsOn:"Schauen Sie sich die Noten an auf"}}},i=Object.keys(n),s="en"}}]);
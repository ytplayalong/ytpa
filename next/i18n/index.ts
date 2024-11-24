export const RESSOURCES = {
  en: {
    translation: {
      langName: "English",
      language: "Language",
      helpTitle: "Help",
      favorites: "Favorites",
      login: "Login",
      register: "Register",
      password: "Password",
      settingsTitle: "Settings",
      instrumentKey: "Instrument Tuning",
      instrumentKeyShort: "Tuning",
      octave: "Octave",
      timeSignature: "Time Signature",
      sheetZoom: "Sheet scaling",
      fingering: "Fingering",
      fingerNone: "None",
      fingerThreeValves: "3 Valves",
      fingerTrombone: "Trombone",
      songKey: "Key",
      clef: "Clef",
      bassClef: "Bass",
      trebleClef: "Treble",
      totScores: "Number of pieces: {{num}}",
      filter: "Filter",
      txtFilterDefault: "Enter keyword(s)",
      allScores: "All Pieces",
      allScoresTxt:
        "There is a total of <num /> pieces of music available for playing along including the corresponding sheet music. They all can be accessed under <all/>. Or just jump right in and choose a <random />",
      randomScore: "Random Piece",
      recentScores: "Recently Added Pieces",
      recentTxt:
        "The most recently added scores are listed below. Choose one by clicking on it and start playing right away.",
      name: "Name",
      artist: "Artist",
      search: "Search",
      submit: "Submit",
      fullName: "Full Name",
      email: "Email Address",
      message: "Message",
      contact: "Contact",
      contactTxt:
        "If you have any questions, need assistance, or want to provide us with helpful feedback, please don't hesitate to use the following contact form.",
      intro:
        "Welcome! We are pleased to offer a wide variety of sheet music for a variety of musical styles and instruments. Our website features interactive sheet music that is synced with corresponding music videos, allowing you to play along with the video as you practice.",
      viewSheetsOn: "View sheet music on",
      sheetMoveMode: "Synchronization mode",
      horizontalMode: "Horizontal",
      verticalMode: "Vertical",
    },
  },
  es: {
    translation: {
      langName: "Español",
      language: "Lenguaje",
      helpTitle: "Ayuda",
      settingsTitle: "Ajustes",
      favorites: "Favoritos",
      login: "Iniciar",
      register: "Registrar",
      password: "Contraseña",
      instrumentKey: "Afinación de instrumento",
      instrumentKeyShort: "Afinación",
      octave: "Octava",
      timeSignature: "Tipo de compás",
      sheetZoom: "Escalado de partituras",
      fingering: "Digitaciones",
      fingerNone: "Ninguno",
      fingerThreeValves: "3 Válvulas",
      fingerTrombone: "Trombón",
      songKey: "Tonalidad",
      clef: "Clave",
      bassClef: "Fa",
      trebleClef: "Sol",
      totScores: "Número de canciones: {{num}}",
      filter: "Filtro",
      txtFilterDefault: "Insertar palabras clave",
      allScores: "Toda la música",
      allScoresTxt:
        "En total hay <num /> piezas. Se puede acceder a ellas a través del siguiente enlace <all/>. O elige una pieza al azar: <random />",
      randomScore: "Pieza al azar",
      recentScores: "Piezas recientes",
      recentTxt: "Las piezas más recientes se muestran a continuación.",
      name: "Nombre",
      artist: "Artista",
      search: "Búsqueda",
      submit: "Enviar",
      fullName: "Nombre",
      email: "Dirección de correo electrónico",
      message: "Mensaje",
      contact: "Contacto",
      contactTxt:
        "Si tiene alguna pregunta, necesita ayuda o desea brindarnos comentarios útiles, no dude en utilizar el siguiente formulario de contacto.",
      intro:
        "¡Bienvenido! Nos complace ofrecer una amplia variedad de partituras para una variedad de estilos e instrumentos musicales. Nuestro sitio web presenta partituras interactivas que se sincronizan con los videos musicales correspondientes, lo que le permite reproducir el video mientras practica.",
      viewSheetsOn: "Ver partitura en",
      sheetMoveMode: "Modo de sincronización",
      horizontalMode: "Horizontal",
      verticalMode: "Vertical",
    },
  },
  de: {
    translation: {
      langName: "Deutsch",
      language: "Sprache",
      helpTitle: "Hilfe",
      favorites: "Favoriten",
      login: "Anmelden",
      register: "Registrieren",
      password: "Passwort",
      settingsTitle: "Einstellungen",
      instrumentKey: "Instrumentenstimmung",
      instrumentKeyShort: "Stimmung",
      octave: "Oktave",
      timeSignature: "Taktart",
      sheetZoom: "Notenskalierung",
      fingering: "Griffe",
      fingerNone: "Keine",
      fingerThreeValves: "3 Ventile",
      fingerTrombone: "Posaune",
      songKey: "Tonart",
      clef: "Schlüssel",
      bassClef: "Bass",
      trebleClef: "Violin",
      totScores: "Anzahl Lieder: {{num}}",
      filter: "Filter",
      txtFilterDefault: "Liedname oder Künstler",
      allScores: "Alle Lieder",
      allScoresTxt:
        "Es stehen total <num /> Lieder zur Verfügung mit den dazugehörigen Noten. Alle können unter <all/> gefunden werden. Alternativ kann ein zufälliges gewählt werden unter folgendem Link: <random />",
      randomScore: "Zufälliges Stück",
      recentScores: "Kürzlich hinzugefügte Lieder",
      recentTxt: "Die neusten verfügbaren Stücke sind unten aufgeführt.",
      name: "Name",
      artist: "Künstler",
      search: "Suche",
      submit: "Absenden",
      fullName: "Vor- und Nachname",
      email: "Email Addresse",
      message: "Nachricht",
      contact: "Kontakt",
      contactTxt:
        "Wenn Sie Fragen haben, Hilfe benötigen oder uns hilfreiches Feedback geben möchten, nutzen Sie bitte das folgende Kontaktformular.",
      intro:
        "Willkommen! Wir freuen uns, eine große Auswahl an Noten für verschiedene Musikstile und Instrumente anbieten zu können. Auf unserer Website finden Sie interaktive Noten, die mit entsprechenden Musikvideos synchronisiert sind, so dass Sie beim Üben zum Video mitspielen können.",
      viewSheetsOn: "Schauen Sie sich die Noten an auf",
      sheetMoveMode: "Synchronisierungsmodus",
      horizontalMode: "Horizontal",
      verticalMode: "Vertikal",
    },
  },
};

export const LANGUAGES = Object.keys(RESSOURCES) as string[];
export const defaultLocale = "en";

export const getStaticLocaleParams = () => {
  return LANGUAGES.map((locale) => ({ locale }));
};

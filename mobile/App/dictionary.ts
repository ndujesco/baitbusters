// constants.ts
export type LangKey = 'english' | 'french' | 'hausa' | 'yoruba' | 'swahili' | 'amharic' | 'igbo';

export const APP_DICTIONARY: Record<
  LangKey,
  {
    app: {
      title: string;
      subtitle: string;
    };
    smsStatusDisplay: string;
    listeningLabel: string;
    somethingCount: (count: number) => string;
    languageOptionsDisplay: { key: LangKey; label: string }[];
    tabs: { activity: string; settings: string; subscriptions: string };
    ui: {
      yes: string;
      no: string;
      report: string;
      unknown: string;
      close: string;
      permissionGrantedFeedback: string;
      permissionDeniedFeedback: string;
    };
    statusLabels: {
      canListenSms: string;
      canListenNotifications: string;
      canPostNotifications: string;
      canDisplayOverApps: string;
    };
    permissions: {
      title: string;
      smsTitle: string;
      overLayTitle: string;
      notificationsTitle: string;
      postNotificationsTitle: string;
      needPermissions: string;
      off: string;
      enabled:string
    };
    controls: {
      startListening: string;
      stopListening: string;
      clearLogs: string;
      confirmClearLogs: string;
      logsCleared: string;
      deleted: string,
    };
    subscriptions: {
      title: string;
  subtitle: string;
  subscribed: string;
  autoRenew: string;
  subscribeButton: string;
  confirmTitle: string;
  confirmMessage: (price: number, name: string) => string;
  cancel: string;
  confirm: string;
  successTitle: string;
  successMessage: (name: string) => string;
  done: string;
  errorTitle: string;
  errorMessage: (balance: number) => string;
  ok: string;
  renewalTitle: string;
  renewalMessage: (name: string, date: string) => string;
  close: string;
  messagesLabel: string;
  detectionsLabel: string;
  plans: {
    standardName: string;
    premiumName: string;
    enterpriseName: string;

    standardDesc: string;
    premiumDesc: string;
    enterpriseDesc: string;
  };
    }
    activity: {
      logTitle: string;
      noMessages: string;
      spamDetected: string;
      potentialSpam: string;
      messageFrom: (from?: string) => string;
      reportButton: string;
      pill: {
        spam: string;
        potential: string;
        ok: string;
      };
    };
    errors: {
      invalidMessageBody: string;
      invalidMessageStructure: string;
      messageIdNotFound: string;
      permissionRequestFailed: string;
    };
    settings: {
      title: string;
      languageLabel: string;
      persistNotice: string;
      spamFilterLabel: string;
      languageSetMessage: (langLabel: string) => string;
    };
    general: {
      from: string,
    }
  }
> = {
  english: {
    app: {
      title: 'Aegis',
      subtitle: 'Phishing interceptor.',
    },
    general: {
      from: 'From',
    },
    subscriptions: {
  title: "Subscription Plans",
  subtitle: "Choose a plan and pay directly with your mobile airtime.",
  subscribed: "✅ Subscribed",
  autoRenew: "Auto-renew",
  subscribeButton: "Subscribe",
  confirmTitle: "Confirm Payment",
  confirmMessage: (price: number, name: string) =>
    `You are about to pay ₦${price} for the ${name} plan.`,
  cancel: "Cancel",
  confirm: "Confirm",
  successTitle: "Payment Successful",
  successMessage: (name: string) => `Your ${name} plan has been activated.`,
  done: "Done",
  errorTitle: "Insufficient Balance",
  errorMessage: (balance: number) =>
    `Your balance (₦${balance}) is not enough for this plan.`,
  ok: "OK",
  renewalTitle: "Renewal Info",
  renewalMessage: (name: string, date: string) =>
    `Your ${name} plan will renew on ${date}.`,
  close: "Close",
  messagesLabel: "messages",
  detectionsLabel: "detections",
  plans: {
    standardName: "Standard",
    premiumName: "Premium",
    enterpriseName: "Enterprise",
    standardDesc: "A balanced plan for regular users and small businesses.",
    premiumDesc: "For professionals needing extra fraud detection capacity.",
    enterpriseDesc: "High-volume detection for organizations and large teams.",
  },
},

    smsStatusDisplay: 'Listening to SMS messages',
    listeningLabel: 'Statuses',
    somethingCount: (count: number) => `You have ${count} new messages`,
    languageOptionsDisplay: [
      { key: 'english', label: 'English' },
      { key: 'french', label: 'French' },
      { key: 'hausa', label: 'Hausa' },
      { key: 'yoruba', label: 'Yoruba' },
      { key: 'swahili', label: 'Swahili' },
      { key: 'amharic', label: 'Amharic' },
      { key: 'igbo', label: 'Igbo' },
    ],
    tabs: { activity: 'Activity', settings: 'Settings', subscriptions: 'Subscription' },
    ui: {
      yes: 'Yes',
      no: 'No',
      report: 'Report',
      unknown: 'Unknown',
      close: 'Close',
      permissionGrantedFeedback: 'Permission Granted!',
      permissionDeniedFeedback: 'Permission Denied!'
    },
    statusLabels: {
      canListenSms: 'Can listen to SMS',
      canListenNotifications: 'Can listen to notifications',
      canPostNotifications: 'Can post notifications',
      canDisplayOverApps: 'Can display over apps',
    },
    permissions: {
      title: 'Permissions required',
      smsTitle: 'Read SMS',
      overLayTitle: 'Display Over Apps',  
      notificationsTitle: 'Notification Listener',
      postNotificationsTitle: 'Can Send Notifications',
      needPermissions: 'Permissions required',
      enabled: 'Enabled',
      off: 'Off'
    },
    controls: {
      startListening: 'Start Listening',
      stopListening: 'Stop Listening',
      clearLogs: 'Clear Logs',
      confirmClearLogs: 'Are you sure you want to clear all logs?',
      logsCleared: 'Logs Cleared',
      deleted: 'Deleted',
    },
    activity: {
      logTitle: 'Spam Logs',
      noMessages: 'No messages yet — waiting for incoming spam.',
      spamDetected: 'Spam detected',
      potentialSpam: 'Potential Spam Message Detected. Please Report to confirm!',
      messageFrom: (from?: string) => `From ${from?? 'Unknown sender'}`,
      reportButton: 'Report',
      pill: {
        spam: 'SPAM',
        potential: 'Potential',
        ok: 'OK',
      },
    },
    errors: {
      invalidMessageBody: 'Invalid message body sent. Please do not edit the prompt message.',
      invalidMessageStructure: 'Invalid message body structure. Please do not edit the prompt message.',
      messageIdNotFound: 'Message ID not found in logs. Please do not edit the prompt message.',
      permissionRequestFailed: "Permission request failed",

    },
    settings: {
      title: 'Settings',
      languageLabel: 'Language',
      persistNotice: 'Language and toggles are saved locally',
      spamFilterLabel: 'Spam filter (send bvn / send nin)',
      languageSetMessage: (langLabel: string) => `Language set to ${langLabel}`,

    },
  },
  french: {
    app: {
      title: 'Aegis',
      subtitle: "Intercepteur d'hameçonnage.",
    },
    general: {
      from: 'De',
    },
    smsStatusDisplay: 'Écoute des messages SMS',
    listeningLabel: 'Statut',
    somethingCount: (count: number) => `Vous avez ${count} nouveaux messages`,
languageOptionsDisplay: [
      { key: 'english', label: 'Anglais' },
      { key: 'french', label: 'Français' }, // Note: 'Fench' was likely a typo for 'French'
      { key: 'hausa', label: 'Haoussa' },
      { key: 'yoruba', label: 'Yoruba' },
      { key: 'swahili', label: 'Swahili' },
      { key: 'amharic', label: 'Amharique' },
      { key: 'igbo', label: 'Igbo' },
    ],    tabs: { activity: 'Activité', settings: 'Paramètres' },
    ui: {
      yes: 'Oui',
      no: 'Non',
      report: 'Signaler',
      unknown: 'Inconnu',
    },
    statusLabels: {
      canListenSms: 'Peut écouter les SMS',
      canListenNotifications: 'Peut écouter les notifications',
      canPostNotifications: 'Peut envoyer des notifications',
    },
    permissions: {
      title: 'Autorisations requises',
      smsTitle: 'Peut lire les SMS',
      notificationsTitle: "Écouteur de notifications",
      postNotificationsTitle: 'Peut envoyer des notifications',
      needPermissions: 'Autorisation requise',
      enabled: 'Activé',
      off: 'Désactivé'
    },
    controls: {
      startListening: "Démarrer l'écoute",
      stopListening: 'Arrêter',
      clearLogs: 'Effacer les journaux',
      confirmClearLogs: 'Êtes-vous sûr de vouloir effacer tous les journaux?',
      logsCleared: 'Journaux effacés',
      deleted: 'Supprimé',
    },
    activity: {
      logTitle: 'Journaux de Spam',
      noMessages: 'Pas encore de messages — en attente de SMS entrants.',
      spamDetected: 'Spam détecté',
      potentialSpam: "Message potentiellement spam. Veuillez signaler pour confirmer!",
      messageFrom: (from?: string) => `De ${from?? 'Expéditeur inconnu'}`,
      reportButton: 'Signaler',
      pill: {
        spam: 'SPAM',
        potential: 'Potentiel',
        ok: "OK",
      },
    },
    errors: {
      invalidMessageBody: "Corps du message invalide. Veuillez ne pas modifier le message d'invite.",
      invalidMessageStructure: "Structure du message invalide. Veuillez ne pas modifier le message d'invite.",
      messageIdNotFound: "ID du message introuvable dans les journaux. Veuillez ne pas modifier le message d'invite.",
    },
    settings: {
      title: 'Paramètres',
      languageLabel: 'Langue',
      persistNotice: 'La langue et les paramètres sont sauvegardés localement',
      spamFilterLabel: 'Filtre anti-spam (send bvn / send nin)',
    },
  },
  hausa: {
    app: {
      title: 'Aegis',
      subtitle: 'Mai Kama Saƙon Zamba.',
    },
    general: {
      from: 'Daga',
    },
    smsStatusDisplay: 'Ana sauraron saƙonnin SMS',
    listeningLabel: 'Matsayi',
    somethingCount: (count: number) => `Kuna da sabbin saƙonni ${count}`,
languageOptionsDisplay: [
      { key: 'english', label: 'Turanci' },
      { key: 'french', label: 'Faransanci' },
      { key: 'hausa', label: 'Hausa' },
      { key: 'yoruba', label: 'Yarbanci' },
      { key: 'swahili', label: 'Sawuahili' }, // or 'Harshen Sawuahili'
      { key: 'amharic', label: 'Amharik' }, // or 'Harshen Amharik'
      { key: 'igbo', label: 'Inyamuranci' }, // or 'Harshen Igbo'
    ],    tabs: { activity: 'Ayyuka', settings: 'Saiti' },
    ui: {
      yes: 'Eh',
      no: 'A\'a',
      report: 'Ba da rahoto',
      unknown: 'Ba a sani ba',
    },
    statusLabels: {
      canListenSms: 'Zai iya sauraron SMS',
      canListenNotifications: 'Zai iya sauraron Sanarwa',
      canPostNotifications: 'Zai iya aika Sanarwa',
    },
    permissions: {
      title: 'Ana buƙatar izini',
      smsTitle: 'Karanta SMS',
      notificationsTitle: 'Mai Sauraron Sanarwa',
      postNotificationsTitle: 'Zai iya Aika Sanarwa',
      needPermissions: 'Ana buƙatar izini',
      enabled: 'An kunna',
      off: 'A kashe'
    },
    controls: {
      startListening: 'Fara Sauraro',
      stopListening: 'Daina Sauraro',
      clearLogs: 'Share Rajista',
      confirmClearLogs: 'Ka tabbata kana son share dukkan rajista?',
      logsCleared: 'An Share Rajista',
      deleted: 'An goge',
    },
    activity: {
      logTitle: 'Rajistar Saƙonnin Takara',
      noMessages: 'Babu saƙonni tukuna — ana jiran saƙonnin takara masu shigowa.',
      spamDetected: 'An gano saƙon takara',
      potentialSpam: 'An Gano Saƙon da Zai Iya Zama Takara. Da fatan za a ba da rahoto don tabbatarwa!',
      messageFrom: (from?: string) => `Daga ${from?? 'Mai aiko da ba a sani ba'}`,
      reportButton: 'Ba da rahoto',
      pill: {
        spam: 'TAKARA',
        potential: 'Mai yiwuwa',
        ok: 'LAFIYA',
      },
    },
    errors: {
      invalidMessageBody: 'An aiko da rubutun saƙo mara inganci. Don Allah kar a gyara saƙon.',
      invalidMessageStructure: 'Tsarin rubutun saƙo mara inganci. Don Allah kar a gyara saƙon.',
      messageIdNotFound: 'Ba a sami ID na saƙo a cikin rajista ba. Don Allah kar a gyara saƙon.',
    },
    settings: {
      title: 'Saiti',
      languageLabel: 'Harshe',
      persistNotice: 'Ana adana harshe da saituna a cikin na\'ura',
      spamFilterLabel: 'Matatar saƙonnin takara (aika bvn / aika nin)',
    },
  },
  yoruba: {
    app: {
      title: 'Aegis',
      subtitle: 'Adakoja Ifiranṣẹ Ajeseku.',
    },
    general: {
      from: 'Lati',
    },
    smsStatusDisplay: 'N gbo ifiranṣẹ SMS',
    listeningLabel: 'Àwọn ipò',
    somethingCount: (count: number) => `O ni ifiranṣẹ titun ${count}`,
    languageOptionsDisplay: [
      { key: 'english', label: 'Èdè Gẹ̀ẹ́gùn' }, // or ' Gẹ̀ẹ́gùn'
      { key: 'french', label: 'Èdè Faranṣé' }, // or 'Èdè Faranṣé'
      { key: 'hausa', label: 'Èdè Hausa' }, // or 'Èdè Hausa'
      { key: 'yoruba', label: 'Èdè Yorùbá' }, // or 'Èdè Yorùbá'
      { key: 'swahili', label: 'Èdè Swahili' }, // or 'Èdè Swahili'
    { key: 'amharic', label: 'Èdè Amhariki' }, // or 'Èdè Amhariki'
      { key: 'igbo', label: 'Èdè Igbo' }, // or 'Èdè Igbo'
    ],
    tabs: { activity: 'Ìgbésẹ̀', settings: 'Ètò' },
    ui: {
      yes: 'Bẹẹni',
      no: 'Bẹẹkọ',
      report: 'Fisun',
      unknown: 'Aimọ',
    },
    statusLabels: {
      canListenSms: 'Le gbo SMS',
      canListenNotifications: 'Le gbo àwọn ifitonileti',
      canPostNotifications: 'Le fi ifitonileti ranṣẹ',
    },
    permissions: {
      title: 'Àwọn ìyọǹda tí a nílò',
      smsTitle: 'Ka SMS',
      notificationsTitle: 'Olugbọran Ifitonileti',
      postNotificationsTitle: 'Le Fi Ifitonileti Ranṣẹ',
      needPermissions: 'A nilo ìyọǹda',
      enabled: 'Ti ṣiṣẹ',
      off: 'Ti pa'
    },
    controls: {
      startListening: 'Bẹrẹ Gbigbọran',
      stopListening: 'Duro Gbigbọran',
      clearLogs: 'Pa Àkọsílẹ̀ Rẹ́',
      confirmClearLogs: 'Ṣe o da ọ loju pe o fẹ pa gbogbo àkọsílẹ̀ rẹ́?',
      logsCleared: 'Àkọsílẹ̀ ti parẹ́',
      deleted: 'Ti parẹ́',
    },
    activity: {
      logTitle: 'Àkọsílẹ̀ Àwọn Ifiranṣẹ Pàápàà',
      noMessages: 'Ko si ifiranṣẹ sibẹsibẹ — nduro de ifiranṣẹ pàápàà ti nwọle.',
      spamDetected: 'A ri ifiranṣẹ pàápàà',
      potentialSpam: 'A ri ifiranṣẹ ti o le jẹ pàápàà. Jọwọ fisun lati jẹrisi!',
      messageFrom: (from?: string) => `Lati ọdọ ${from?? 'Olufiranṣẹ aimọ'}`,
      reportButton: 'Fisun',
      pill: {
        spam: 'PÀÁPÀÀ',
        potential: 'O le jẹ',
        ok: 'O DARA',
      },
    },
    errors: {
      invalidMessageBody: 'Ara ifiranṣẹ ti a fi ranṣẹ ko tọ. Jọwọ maṣe yi ifiranṣẹ pada.',
      invalidMessageStructure: 'Ètò ara ifiranṣẹ ko tọ. Jọwọ maṣe yi ifiranṣẹ pada.',
      messageIdNotFound: 'A ko ri ID ifiranṣẹ ninu àkọsílẹ̀. Jọwọ maṣe yi ifiranṣẹ pada.',
    },
    settings: {
      title: 'Ètò',
      languageLabel: 'Èdè',
      persistNotice: 'A n fi ede ati àwọn ètò pamọ́ sí agbègbè',
      spamFilterLabel: 'Ajẹsẹ ifiranṣẹ pàápàà (fi bvn ranṣẹ / fi nin ranṣẹ)',
    },
  },
  swahili: {
    app: {
      title: 'Aegis',
      subtitle: 'Kizuia Ulaghai.',
    },
    general: {
      from: 'Kutoka',
    },
    smsStatusDisplay: 'Inasikiliza jumbe za SMS',
    listeningLabel: 'Hali',
    somethingCount: (count: number) => `Una jumbe ${count} mpya`,
    languageOptionsDisplay: [
      { key: 'english', label: 'Kiingereza' },
      { key: 'french', label: 'Kifaransa' },
      { key: 'hausa', label: 'Kihausa' },
      { key: 'yoruba', label: 'Kiyoruba' },
      { key: 'swahili', label: 'Kiswahili' },
      { key: 'amharic', label: 'Kiamhari' },
      { key: 'igbo', label: 'Kiigbo' },
    ],
    tabs: { activity: 'Shughuli', settings: 'Mipangilio' },
    ui: {
      yes: 'Ndiyo',
      no: 'Hapana',
      report: 'Ripoti',
      unknown: 'Haijulikani',
    },
    statusLabels: {
      canListenSms: 'Inaweza kusikiliza SMS',
      canListenNotifications: 'Inaweza kusikiliza arifa',
      canPostNotifications: 'Inaweza kutuma arifa',
    },
    permissions: {
      title: 'Ruhusa zinahitajika',
      smsTitle: 'Soma SMS',
      notificationsTitle: 'Msikilizaji wa Arifa',
      postNotificationsTitle: 'Inaweza Kutuma Arifa',
      needPermissions: 'Ruhusa inahitajika',
      enabled: 'Imewashwa',
      off: 'Imezimwa'
    },
    controls: {
      startListening: 'Anza Kusikiliza',
      stopListening: 'Acha Kusikiliza',
      clearLogs: 'Futa Kumbukumbu',
      confirmClearLogs: 'Una uhakika unataka kufuta kumbukumbu zote?',
      logsCleared: 'Kumbukumbu Zimefutwa',
      deleted: 'Imefutwa',
    },
    activity: {
      logTitle: 'Kumbukumbu za Taka',
      noMessages: 'Hakuna jumbe bado — inasubiri taka zinazoingia.',
      spamDetected: 'Taka imegunduliwa',
      potentialSpam: 'Ujumbe unaoweza kuwa taka umegunduliwa. Tafadhali ripoti ili kuthibitisha!',
      messageFrom: (from?: string) => `Kutoka kwa ${from?? 'Mtumaji asiyejulikana'}`,
      reportButton: 'Ripoti',
      pill: {
        spam: 'TAKA',
        potential: 'Uwezekano',
        ok: 'SAWA',
      },
    },
    errors: {
      invalidMessageBody: 'Mwili wa ujumbe uliotumwa si sahihi. Tafadhali usihariri ujumbe wa kidokezo.',
      invalidMessageStructure: 'Muundo wa mwili wa ujumbe si sahihi. Tafadhali usihariri ujumbe wa kidokezo.',
      messageIdNotFound: 'Kitambulisho cha ujumbe hakipatikani kwenye kumbukumbu. Tafadhali usihariri ujumbe wa kidokezo.',
    },
    settings: {
      title: 'Mipangilio',
      languageLabel: 'Lugha',
      persistNotice: 'Lugha na swichi huhifadhiwa ndani ya kifaa',
      spamFilterLabel: 'Kichujio cha taka (tuma bvn / tuma nin)',
    },
  },
  amharic: {
    app: {
      title: 'Aegis',
      subtitle: 'የማስገር ጣልቃ ገብ።',
    },
    general: {
      from: 'ከ',
    },
    smsStatusDisplay: 'የኤስኤምኤስ መልዕክቶችን በማዳመጥ ላይ',
    listeningLabel: 'ሁኔታዎች',
    somethingCount: (count: number) => `እርስዎ ${count} አዲስ መልዕክቶች አሉዎት`,
    languageOptionsDisplay: [
      { key: 'english', label: 'እንግሊዝኛ' },
      { key: 'french', label: 'ፈረንሳይኛ' },
      { key: 'hausa', label: 'ሃውሳ' },
      { key: 'yoruba', label: 'ዮሩባ' },
      { key: 'swahili', label: 'ስዋሂሊ' },
      { key: 'amharic', label: 'አማርኛ' },
      { key: 'igbo', label: 'ኢግቦ' },
    ],
    tabs: { activity: 'እንቅስቃሴ', settings: 'ቅንብሮች' },
    ui: {
      yes: 'አዎ',
      no: 'አይ',
      report: 'ሪፖርት አድርግ',
      unknown: 'ያልታወቀ',
    },
    statusLabels: {
      canListenSms: 'ኤስኤምኤስ ማዳመጥ ይችላል',
      canListenNotifications: 'ማሳወቂያዎችን ማዳመጥ ይችላል',
      canPostNotifications: 'ማሳወቂያዎችን መለጠፍ ይችላል',
    },
    permissions: {
      title: 'ፈቃዶች ያስፈልጋሉ',
      smsTitle: 'ኤስኤምኤስ ያንብቡ',
      notificationsTitle: 'የማሳወቂያ አድማጭ',
      postNotificationsTitle: 'ማሳወቂያዎችን መላክ ይችላል',
      needPermissions: 'ፈቃድ ያስፈልጋል',
      enabled: 'ነቅቷል',
      off: 'ጠፍቷል'
    },
    controls: {
      startListening: 'ማዳመጥ ጀምር',
      stopListening: 'ማዳመጥ አቁም',
      clearLogs: 'መዝገቦችን አጽዳ',
      confirmClearLogs: 'ሁሉንም መዝገቦች ማጽዳት እንደሚፈልጉ እርግጠኛ ነዎት?',
      logsCleared: 'መዝገቦች ጸድተዋል',
      deleted: 'ተሰርዟል',
    },
    activity: {
      logTitle: 'የአይፈለጌ መልእክት መዝገቦች',
      noMessages: 'እስካሁን ምንም መልዕክቶች የሉም — ገቢ አይፈለጌ መልዕክቶችን በመጠበቅ ላይ።',
      spamDetected: 'አይፈለጌ መልእክት ተገኝቷል',
      potentialSpam: 'ሊሆን የሚችል አይፈለጌ መልእክት ተገኝቷል። ለማረጋገጥ እባክዎ ሪፖርት ያድርጉ!',
      messageFrom: (from?: string) => `ከ ${from?? 'ያልታወቀ ላኪ'}`,
      reportButton: 'ሪፖርት አድርግ',
      pill: {
        spam: 'አይፈለጌ',
        potential: 'ሊሆን የሚችል',
        ok: 'እሺ',
      },
    },
    errors: {
      invalidMessageBody: 'ልክ ያልሆነ የመልዕክት አካል ተልኳል። እባክዎ የማስተዋወቂያ መልዕክቱን አያርትዑ።',
      invalidMessageStructure: 'ልክ ያልሆነ የመልዕክት አካል መዋቅር። እባክዎ የማስተዋወቂያ መልዕክቱን አያርትዑ።',
      messageIdNotFound: 'የመልዕክት መታወቂያ በመዝገቦች ውስጥ አልተገኘም። እባክዎ የማስተዋወቂያ መልዕክቱን አያርትዑ።',
    },
    settings: {
      title: 'ቅንብሮች',
      languageLabel: 'ቋንቋ',
      persistNotice: 'ቋንቋ እና መቀያየሪያዎች በአካባቢው ይቀመጣሉ',
      spamFilterLabel: 'የአይፈለጌ መልእክት ማጣሪያ (bvn ላክ / nin ላክ)',
    },
  },
  igbo: {
    app: {
      title: 'Aegis',
      subtitle: 'Onye Nchọta Ozi Ngbako.',
    },
    general: {
      from: 'Site na',
    },
    smsStatusDisplay: 'Na-ege ntị na ozi SMS',
    listeningLabel: 'Ọnọdụ',
    somethingCount: (count: number) => `Ị nwere ozi ọhụrụ ${count}`,
languageOptionsDisplay: [
      { key: 'english', label: 'Asụsụ Beke' },
      { key: 'french', label: 'Asụsụ French' },
      { key: 'hausa', label: 'Asụsụ Awausa' },
      { key: 'yoruba', label: 'Asụsụ Yoruba' },
      { key: 'swahili', label: 'Asụsụ Swahili' },
      { key: 'amharic', label: 'Asụsụ Amharik' },
      { key: 'igbo', label: 'Asụsụ Igbo' },
    ],    tabs: { activity: 'Ihe Omume', settings: 'Ntọala' },
    ui: {
      yes: 'Ee',
      no: 'Mba',
      report: 'Kọọ',
      unknown: 'Amaghị',
    },
    statusLabels: {
      canListenSms: 'Nwere ike ige ntị na SMS',
      canListenNotifications: 'Nwere ike ige ntị na ngosi',
      canPostNotifications: 'Nwere ike izipu ngosi',
    },
    permissions: {
      title: 'Ikike achọrọ',
      smsTitle: 'Gụọ SMS',
      notificationsTitle: 'Onye Nlele Ngosi',
      postNotificationsTitle: 'Nwere ike Izipu Ngosi',
      needPermissions: 'Achọrọ ikike',
      enabled: 'Enyere ya ohere',
      off: 'Agbanwunyere'
    },
    controls: {
      startListening: 'Malite Ige Ntị',
      stopListening: 'Kwụsị Ige Ntị',
      clearLogs: 'Hichapụ Ndekọ',
      confirmClearLogs: 'Ị ji n\'aka na ịchọrọ ihichapụ ndekọ niile?',
      logsCleared: 'Ehichapụla Ndekọ',
      deleted: 'Ehichapụla',
    },
    activity: {
      logTitle: 'Ndekọ Ozi Junk',
      noMessages: 'Onweghị ozi ma — na-eche ozi junk na-abata.',
      spamDetected: 'Achọpụtala ozi junk',
      potentialSpam: 'Achọpụtala ozi nwere ike ịbụ junk. Biko kọọ ka i kwado!',
      messageFrom: (from?: string) => `Site na ${from?? 'Onye zitere amaghị'}`,
      reportButton: 'Kọọ',
      pill: {
        spam: 'JUNK',
        potential: 'O kwere omume',
        ok: 'Ọ DỊ MMA',
      },
    },
    errors: {
      invalidMessageBody: 'Ezipụla isi ozi ezighi ezi. Biko edegharịla ozi ahụ.',
      invalidMessageStructure: 'Ọdịdị isi ozi ezighi ezi. Biko edegharịla ozi ahụ.',
      messageIdNotFound: 'Ahụghị ID ozi na ndekọ. Biko edegharịla ozi ahụ.',
    },
    settings: {
      title: 'Ntọala',
      languageLabel: 'Asụsụ',
      persistNotice: 'A na-echekwa asụsụ na ntọala na mpaghara',
      spamFilterLabel: 'Ihe nzacha ozi junk (zipu bvn / zipu nin)',
    },
  },
};
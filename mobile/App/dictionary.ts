// constants.ts
export type LangKey = 'english' | 'french' | 'hausa' | 'yoruba' | 'swahili' | 'amharic' | 'igbo';


export const APP_DICTIONARY:  Record<
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
  }> = {
  english: {
    app: { title: 'Aegis', subtitle: 'Phishing interceptor.' },
    general: { from: 'From' },
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
    subscriptions: {
      title: "Subscription Plans",
      subtitle: "Choose a plan and pay directly with your mobile airtime.",
      subscribed: "✅ Subscribed",
      autoRenew: "Auto-renew",
      subscribeButton: "Subscribe",
      confirmTitle: "Confirm Payment",
      confirmMessage: (price: number, name: string) =>
        `You are about to pay $${price} for the ${name} plan.`,
      cancel: "Cancel",
      confirm: "Confirm",
      successTitle: "Payment Successful",
      successMessage: (name: string) => `Your ${name} plan has been activated.`,
      done: "Done",
      errorTitle: "Insufficient Balance",
      errorMessage: (balance: number) =>
        `Your balance ($${balance}) is not enough for this plan.`,
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
    activity: {
      logTitle: 'Spam Logs',
      noMessages: 'No messages yet — waiting for incoming spam.',
      spamDetected: 'Spam detected',
      potentialSpam: 'Potential Spam Message Detected. Please Report to confirm!',
      messageFrom: (from?: string) => `From ${from ?? 'Unknown sender'}`,
      reportButton: 'Report',
      pill: { spam: 'SPAM', potential: 'Potential', ok: 'OK' },
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
    app: { title: 'Aegis', subtitle: "Intercepteur d'hameçonnage." },
    general: { from: 'De' },
    smsStatusDisplay: 'Écoute des messages SMS',
    listeningLabel: 'Statut',
    somethingCount: (count: number) => `Vous avez ${count} nouveaux messages`,
    languageOptionsDisplay: [
      { key: 'english', label: 'Anglais' },
      { key: 'french', label: 'Français' },
      { key: 'hausa', label: 'Haoussa' },
      { key: 'yoruba', label: 'Yoruba' },
      { key: 'swahili', label: 'Swahili' },
      { key: 'amharic', label: 'Amharique' },
      { key: 'igbo', label: 'Igbo' },
    ],
    tabs: { activity: 'Activité', settings: 'Paramètres', subscriptions: 'Abonnement' },
    ui: {
      yes: 'Oui',
      no: 'Non',
      report: 'Signaler',
      unknown: 'Inconnu',
      close: 'Fermer',
      permissionGrantedFeedback: 'Permission accordée!',
      permissionDeniedFeedback: 'Permission refusée!'
    },
    statusLabels: {
      canListenSms: 'Peut écouter les SMS',
      canListenNotifications: 'Peut écouter les notifications',
      canPostNotifications: 'Peut envoyer des notifications',
      canDisplayOverApps: 'Peut s\'afficher sur d\'autres applis',
    },
    permissions: {
      title: 'Autorisations requises',
      smsTitle: 'Peut lire les SMS',
      overLayTitle: 'Afficher sur d\'autres applis',
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
    subscriptions: {
      title: "Plans d'abonnement",
      subtitle: "Choisissez un plan et payez directement avec votre crédit mobile.",
      subscribed: "✅ Abonné",
      autoRenew: "Renouvellement auto",
      subscribeButton: "Souscrire",
      confirmTitle: "Confirmer le paiement",
      confirmMessage: (price: number, name: string) =>
        `Vous allez payer $${price} pour le forfait ${name}.`,
      cancel: "Annuler",
      confirm: "Confirmer",
      successTitle: "Paiement réussi",
      successMessage: (name: string) => `Votre forfait ${name} a été activé.`,
      done: "Terminé",
      errorTitle: "Solde insuffisant",
      errorMessage: (balance: number) =>
        `Votre solde ($${balance}) n'est pas assez élevé pour ce forfait.`,
      ok: "OK",
      renewalTitle: "Info de renouvellement",
      renewalMessage: (name: string, date: string) =>
        `Votre forfait ${name} sera renouvelé le ${date}.`,
      close: "Fermer",
      messagesLabel: "messages",
      detectionsLabel: "détections",
      plans: {
        standardName: "Standard",
        premiumName: "Premium",
        enterpriseName: "Entreprise",
        standardDesc: "Un forfait équilibré pour les utilisateurs réguliers et les petites entreprises.",
        premiumDesc: "Pour les professionnels nécessitant une capacité supplémentaire de détection de fraude.",
        enterpriseDesc: "Détection à volume élevé pour les organisations et grandes équipes.",
      },
    },
    activity: {
      logTitle: 'Journaux de spam',
      noMessages: 'Pas encore de messages — en attente de SMS entrants.',
      spamDetected: 'Spam détecté',
      potentialSpam: "Message potentiellement spam. Veuillez signaler pour confirmer!",
      messageFrom: (from?: string) => `De ${from ?? 'Expéditeur inconnu'}`,
      reportButton: 'Signaler',
      pill: { spam: 'SPAM', potential: 'Potentiel', ok: 'OK' },
    },
    errors: {
      invalidMessageBody: "Corps du message invalide. Veuillez ne pas modifier le message d'invite.",
      invalidMessageStructure: "Structure du message invalide. Veuillez ne pas modifier le message d'invite.",
      messageIdNotFound: "ID du message introuvable dans les journaux. Veuillez ne pas modifier le message d'invite.",
      permissionRequestFailed: "La demande d'autorisation a échoué",
    },
    settings: {
      title: 'Paramètres',
      languageLabel: 'Langue',
      persistNotice: 'La langue et les paramètres sont sauvegardés localement',
      spamFilterLabel: 'Filtre anti-spam (send bvn / send nin)',
      languageSetMessage: (langLabel: string) => `Langue définie sur ${langLabel}`,
    },
  },
  hausa: {
    app: { title: 'Aegis', subtitle: 'Mai Kama Saƙon Zamba.' },
    general: { from: 'Daga' },
    smsStatusDisplay: 'Ana sauraron saƙonnin SMS',
    listeningLabel: 'Matsayi',
    somethingCount: (count: number) => `Kuna da sabbin saƙonni ${count}`,
    languageOptionsDisplay: [
      { key: 'english', label: 'Turanci' },
      { key: 'french', label: 'Faransanci' },
      { key: 'hausa', label: 'Hausa' },
      { key: 'yoruba', label: 'Yarbanci' },
      { key: 'swahili', label: 'Sahuahili' },
      { key: 'amharic', label: 'Amharik' },
      { key: 'igbo', label: 'Inyamuranci' },
    ],
    tabs: { activity: 'Ayyuka', settings: 'Saituna', subscriptions: 'Shirye-shiryen Biyan Kuɗi' },
    ui: {
      yes: 'Eh',
      no: 'A\'a',
      report: 'Ba da rahoto',
      unknown: 'Ba a sani ba',
      close: 'Rufe',
      permissionGrantedFeedback: 'An ba da izini!',
      permissionDeniedFeedback: 'An ƙi izini!',
    },
    statusLabels: {
      canListenSms: 'Zai iya sauraron SMS',
      canListenNotifications: 'Zai iya sauraron sanarwa',
      canPostNotifications: 'Zai iya aika sanarwa',
      canDisplayOverApps: 'Zai iya nuna sama da aikace-aikace',
    },
    permissions: {
      title: 'Ana buƙatar izini',
      smsTitle: 'Karanta SMS',
      overLayTitle: 'Nuna sama da aikace-aikace',
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
    subscriptions: {
      title: "Shirye-shiryen Biyan Kuɗi",
      subtitle: "Zaɓi shiri ka biya kai tsaye da kuɗin wayarka.",
      subscribed: "✅ An biya kuɗi",
      autoRenew: "Sabuntawa Ta atomatik",
      subscribeButton: "Yi biyan kuɗi",
      confirmTitle: "Tabbatar da Biyan Kuɗi",
      confirmMessage: (price: number, name: string) =>
        `Za a biya $${price} don shirin ${name}.`,
      cancel: "Soke",
      confirm: "Tabbatar",
      successTitle: "Biyan Kuɗi Ya Yi Nasara",
      successMessage: (name: string) => `An kunna shirin ${name} naka.`,
      done: "An yi",
      errorTitle: "Ba isasshen Kuɗi",
      errorMessage: (balance: number) =>
        `Ba kuɗinka ($${balance}) bai isa don wannan shiri ba.`,
      ok: "OK",
      renewalTitle: "Bayani Na Sabuntawa",
      renewalMessage: (name: string, date: string) =>
        `Za a sabunta shirin ${name} naka a ranar ${date}.`,
      close: "Rufe",
      messagesLabel: "saƙonni",
      detectionsLabel: "ganowa",
      plans: {
        standardName: "Matsakaici",
        premiumName: "Na Ƙwararru",
        enterpriseName: "Kasuwanci",
        standardDesc: "Shiri mai daidaito ga masu amfani da yawa da ƙananan kamfanoni.",
        premiumDesc: "Don ƙwararru da suke buƙatar ƙarin iyaka.",
        enterpriseDesc: "Matsakaicin gano maƙarƙashiya don manyan ƙungiyoyi.",
      },
    },
    activity: {
      logTitle: 'Rajistar Saƙonnin Takara',
      noMessages: 'Babu saƙonni tukuna — ana jiran saƙonnin takara masu shigowa.',
      spamDetected: 'An gano saƙon takara',
      potentialSpam: 'An Gano Saƙon da Zai Iya Zama Takara. Da fatan za a ba da rahoto don tabbatarwa!',
      messageFrom: (from?: string) => `Daga ${from ?? 'Mai aiko da ba a sani ba'}`,
      reportButton: 'Ba da rahoto',
      pill: { spam: 'TAKARA', potential: 'Mai yiwuwa', ok: 'LAFIYA' },
    },
    errors: {
      invalidMessageBody: 'An aiko da rubutun saƙo mara inganci. Don Allah kar a gyara saƙon.',
      invalidMessageStructure: 'Tsarin rubutun saƙo mara inganci. Don Allah kar a gyara saƙon.',
      messageIdNotFound: 'Ba a sami ID na saƙo a cikin rajista ba. Don Allah kar a gyara saƙon.',
      permissionRequestFailed: "Neman izinin ya gaza",
    },
    settings: {
      title: 'Saituna',
      languageLabel: 'Harshe',
      persistNotice: 'Ana adana harshe da saituna a cikin na\'ura',
      spamFilterLabel: 'Matatar saƙonnin takara (aika bvn / aika nin)',
      languageSetMessage: (langLabel: string) => `An saita harshe zuwa ${langLabel}.`,
    },
  },
  yoruba: {
    app: { title: 'Aegis', subtitle: 'Adákoja Ifiranṣẹ Ajeseku.' },
    general: { from: 'Lati' },
    smsStatusDisplay: 'N ńgbọ́ ifiranṣẹ SMS',
    listeningLabel: 'Ipò',
    somethingCount: (count: number) => `O ní ìfẹ́ránṣẹ́ tuntun ${count}`,
    languageOptionsDisplay: [
      { key: 'english', label: 'Èdè Gẹ̀ẹ́sì' },
      { key: 'french', label: 'Èdè Faranṣé' },
      { key: 'hausa', label: 'Èdè Hausa' },
      { key: 'yoruba', label: 'Èdè Yorùbá' },
      { key: 'swahili', label: 'Èdè Swahili' },
      { key: 'amharic', label: 'Èdè Amhariki' },
      { key: 'igbo', label: 'Èdè Igbo' },
    ],
    tabs: { activity: 'Ìgbésẹ̀', settings: 'Ètò', subscriptions: 'Àwọn Ètò Alábapín' },
    ui: {
      yes: 'Bẹẹni',
      no: 'Bẹẹkọ',
      report: 'Fisun',
      unknown: 'Aimọ',
      close: 'Pa dé',
      permissionGrantedFeedback: 'Ìyànda ti fún!',
      permissionDeniedFeedback: 'Ìyànda ti kọ́!',
    },
    statusLabels: {
      canListenSms: 'Lé gbọ́ SMS',
      canListenNotifications: 'Lé gbọ́ àwọn ifitonileti',
      canPostNotifications: 'Lé fi ifitonileti ránṣẹ́',
      canDisplayOverApps: 'Lé fihan lórí àwọn ohun èlò mìíràn',
    },
    permissions: {
      title: 'Àwọn ìyọǹda tí a nílò',
      smsTitle: 'Ka SMS',
      overLayTitle: 'Fihan lórí àwọn ohun èlò míìrán',
      notificationsTitle: 'Olùgbọ́ Ifitonileti',
      postNotificationsTitle: 'Lé fi ifitonileti ránṣẹ́',
      needPermissions: 'A nílò ìyọǹda',
      enabled: 'Ti ṣiṣẹ́',
      off: 'Ti pa',
    },
    controls: {
      startListening: 'Bẹrẹ Gbọ́',
      stopListening: 'Duro Gbọ́',
      clearLogs: 'Pa Àkọsílẹ̀ Rẹ',
      confirmClearLogs: 'Ṣé o dá ọ́ lójú pé o fẹ́ pa gbogbo àkọsílẹ̀ rẹ?',
      logsCleared: 'Àkọsílẹ̀ ti parẹ́',
      deleted: 'Ti parẹ́',
    },
    subscriptions: {
      title: 'Àwọn Ètò Alábapín',
      subtitle: 'Yan ètò kan kí o san taara pẹ̀lú owó foonu alágbèéká rẹ.',
      subscribed: '✅ Ṣe alabapin',
      autoRenew: 'Àtúnlè àifọwọ́kọ',
      subscribeButton: 'Ṣe alabapin',
      confirmTitle: 'jẹ́wọ́ ìsanwó',
      confirmMessage: (price: number, name: string) =>
        `O ń lọ láti san $${price} fún ètò ${name}.`,
      cancel: 'Fagilé',
      confirm: 'Jẹ́wọ́',
      successTitle: 'Ìsanwó ṣeyè',
      successMessage: (name: string) => `Ètò ${name} rẹ ti ṣiṣẹ́.`,
      done: 'Parí',
      errorTitle: 'Àìní Iwọ̀n Owo',
      errorMessage: (balance: number) =>
        `Bálùù ọkọ rẹ ($${balance}) kò tó fún ètò yìí.`,
      ok: 'OK',
      renewalTitle: 'Ìwé Àsìkò Ìgbépadàgbá',
      renewalMessage: (name: string, date: string) =>
        `A ó tún ṣe éyí ${name} rẹ ní ọjọ́ ${date}.`,
      close: 'Pa dé',
      messagesLabel: 'ìfẹ́ránṣẹ́',
      detectionsLabel: 'ìmọ̀ọkan',
      plans: {
        standardName: 'Àtẹ́lẹ̀sẹ̀',
        premiumName: 'Alápọpọ̀',
        enterpriseName: 'Ilé-iṣẹ́',
        standardDesc: 'Ètò tó yẹ fún àwọn olùmúlò alákọsílẹ̀ àti àwọn ilé iṣẹ́ kékeré.',
        premiumDesc: 'Fún àwọn akosemose tó nílò àgbáwọlé àwárí èké tó pọ̀ síi.',
        enterpriseDesc: 'Àwárí tó pọ̀ gan-an fún àwọn alásàkọ́ọ̀ọ́ àti ẹgbẹ́ ńlá.',
      },
    },
    activity: {
      logTitle: 'Àkọsílẹ̀ Ìfẹ́ránṣẹ́ Ajeseku',
      noMessages: 'Kò sí ìfẹ́ránṣẹ́ kan sibẹ̀sibẹ̀ — ń dúró de ìfẹ́ránṣẹ́ àjeseku tó ń bọ.',
      spamDetected: 'Àjeseku tí mọ́',
      potentialSpam: 'Ìfẹ́ránṣẹ́ tó lè jẹ́ àjeseku ti mọ́. Jọwọ fi àrẹ́wọ̀n síi!',
      messageFrom: (from?: string) => `Látọ̀ ${from ?? 'Olùfiranṣẹ́ àìmọ̀'}`,
      reportButton: 'Fisun',
      pill: { spam: 'ÀJÉSÉKÚ', potential: 'O lè jẹ́', ok: 'DÁRA' },
    },
    errors: {
      invalidMessageBody: 'Ara ìfẹ́ránṣẹ́ tó rán kò pe. Jọwọ má ṣe ṣe àtúnṣe.',
      invalidMessageStructure: 'Ètò ara ìfẹ́ránṣẹ́ kò pe. Jọwọ má ṣe ṣe àtúnṣe.',
      messageIdNotFound: 'ID ìfẹ́ránṣẹ́ kò sì nínú àkọsílẹ̀. Jọwọ má ṣe ṣe àtúnṣe.',
      permissionRequestFailed: 'Àìní ìbẹ̀wò ìyànda.',
    },
    settings: {
      title: 'Ètò',
      languageLabel: 'Èdè',
      persistNotice: 'A ń fi èdè àti ètò pamọ́ sí agbègbè',
      spamFilterLabel: 'Àtọbọ ìfẹ́ránṣẹ́ àjeseku (fi bvn ranṣẹ / fi nin ranṣẹ)',
      languageSetMessage: (langLabel: string) => `Èdè ti ṣètò sí ${langLabel}`,
    },
  },
  swahili: {
    app: { title: 'Aegis', subtitle: 'Kizuia Ulaghai.' },
    general: { from: 'Kutoka' },
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
    tabs: { activity: 'Shughuli', settings: 'Mipangilio', subscriptions: 'Mipango ya Usajili' },
    ui: {
      yes: 'Ndiyo',
      no: 'Hapana',
      report: 'Ripoti',
      unknown: 'Haijulikani',
      close: 'Funga',
      permissionGrantedFeedback: 'Ruhusa Imekubaliwa!',
      permissionDeniedFeedback: 'Ruhusa Imekataliwa!',
    },
    statusLabels: {
      canListenSms: 'Inaweza kusikiliza SMS',
      canListenNotifications: 'Inaweza kusikiliza arifa',
      canPostNotifications: 'Inaweza kutuma arifa',
      canDisplayOverApps: 'Inaweza kuonyesha juu ya programu nyingine',
    },
    permissions: {
      title: 'Ruhusa Zinahitajika',
      smsTitle: 'Soma SMS',
      overLayTitle: 'Onyesha Juu ya Programu',
      notificationsTitle: 'Msimamizi wa Arifa',
      postNotificationsTitle: 'Inaweza Kutuma Arifa',
      needPermissions: 'Ruhusa Zinahitajika',
      enabled: 'Imewashwa',
      off: 'Imezimwa',
    },
    controls: {
      startListening: 'Anza Kusikiliza',
      stopListening: 'Acha Kusikiliza',
      clearLogs: 'Futa Kumbukumbu',
      confirmClearLogs: 'Una uhakika unataka kufuta kumbukumbu zote?',
      logsCleared: 'Kumbukumbu Zimefutwa',
      deleted: 'Imefutwa',
    },
    subscriptions: {
      title: 'Mpango wa Usajili',
      subtitle: 'Chagua mpango na lipa moja kwa moja kwa salio lako la simu.',
      subscribed: '✅ Umejisajili',
      autoRenew: 'Tena kwa Mwaka',
      subscribeButton: 'Jiunge',
      confirmTitle: 'Thibitisha Malipo',
      confirmMessage: (price: number, name: string) =>
        `Unakaribia kulipa $${price} kwa mpango wa ${name}.`,
      cancel: 'Ghairi',
      confirm: 'Thibitisha',
      successTitle: 'Malipo Yamefanikiwa',
      successMessage: (name: string) => `Mpango wako wa ${name} umeamilishwa.`,
      done: 'Imekamilika',
      errorTitle: 'Salio Haijatosha',
      errorMessage: (balance: number) =>
        `Salio lako ($${balance}) halitoshi kwa mpango huu.`,
      ok: 'Sawa',
      renewalTitle: 'Taarifa ya Ukarabati',
      renewalMessage: (name: string, date: string) =>
        `Mpango wako wa ${name} utaendelea tarehe ${date}.`,
      close: 'Funga',
      messagesLabel: 'ujumbe',
      detectionsLabel: 'utambuzi',
      plans: {
        standardName: "Kawaida",
        premiumName: "Zaidi",
        enterpriseName: "Biashara",
        standardDesc: "Mpango ulio na uwiano kwa watumiaji wa kawaida na biashara ndogo.",
        premiumDesc: "Kwa wataalamu wanaohitaji uwezo wa ziada wa kugundua ulaghai.",
        enterpriseDesc: "Ugunduzi mkubwa kwa mashirika na timu kubwa.",
      },
    },
    activity: {
      logTitle: 'Kumbukumbu za Taka',
      noMessages: 'Hakuna ujumbe bado — inasubiri taka zinazoingia.',
      spamDetected: 'Taka imegunduliwa',
      potentialSpam: 'Ujumbe unaoweza kuwa taka umegunduliwa. Tafadhali ripoti ili kuthibitisha!',
      messageFrom: (from?: string) => `Kutoka kwa ${from ?? 'Mtumaji asiyejulikana'}`,
      reportButton: 'Ripoti',
      pill: { spam: 'TAKA', potential: 'Inawezekana', ok: 'SAWA' },
    },
    errors: {
      invalidMessageBody: 'Mwili wa ujumbe uliotumwa si sahihi. Tafadhali usihariri ujumbe wa kidokezo.',
      invalidMessageStructure: 'Muundo wa ujumbe hauko sahihi. Tafadhali usihariri ujumbe wa kidokezo.',
      messageIdNotFound: 'Kitambulisho cha ujumbe hakipatikani kwenye kumbukumbu. Tafadhali usihariri ujumbe wa kidokezo.',
      permissionRequestFailed: 'Omba ruhusa limefeli',
    },
    settings: {
      title: 'Mipangilio',
      languageLabel: 'Lugha',
      persistNotice: 'Lugha na swichi huhifadhiwa ndani ya kifaa',
      spamFilterLabel: 'Kichujio cha taka (tuma bvn / tuma nin)',
      languageSetMessage: (langLabel: string) => `Lugha imewekwa kwa ${langLabel}`,
    },
  },
  amharic: {
    app: { title: 'Aegis', subtitle: 'የማስገር ጣልቃ ገብ።' },
    general: { from: 'ከ' },
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
    tabs: { activity: 'እንቅስቃሴ', settings: 'ቅንብሮች', subscriptions: 'የተመዘጋጁ እቅዶች' },
    ui: {
      yes: 'አዎ',
      no: 'አይ',
      report: 'ሪፖርት አድርግ',
      unknown: 'ያልታወቀ',
      close: 'ዝጋ',
      permissionGrantedFeedback: 'ፈቃድ ተሰጥቷል!',
      permissionDeniedFeedback: 'ፈቃድ ተከለከለ!',
    },
    statusLabels: {
      canListenSms: 'የኤስኤምኤስ መልዕክቶችን ማዳመጥ ይችላል',
      canListenNotifications: 'ማሳወቂያዎችን ማዳመጥ ይችላል',
      canPostNotifications: 'ማሳወቂያዎችን መላክ ይችላል',
      canDisplayOverApps: 'በሌሎች መተግበሪያዎች ላይ ማሳየት ይችላል',
    },
    permissions: {
      title: 'ፈቃዶች ያስፈልጋሉ',
      smsTitle: 'ኤስኤምኤስ ያንብቡ',
      overLayTitle: 'በሌሎች መተግበሪያዎች ላይ ማሳየት',
      notificationsTitle: 'የማሳወቂያ አድማጭ',
      postNotificationsTitle: 'ማሳወቂያዎችን መላክ ይችላል',
      needPermissions: 'ፈቃድ ያስፈልጋል',
      enabled: 'ነቅቷል',
      off: 'ጠፍቷል',
    },
    controls: {
      startListening: 'ማዳመጥ ጀምር',
      stopListening: 'ማዳመጥ አቁም',
      clearLogs: 'መዝገቦችን አጽዳ',
      confirmClearLogs: 'ሁሉንም መዝገቦች ማጽዳት እንደሚፈልጉ እርግጠኛ ነዎት?',
      logsCleared: 'መዝገቦች ጸድተዋል',
      deleted: 'ተሰርዟል',
    },
    subscriptions: {
      title: "የተመዘጋጁ እቅዶች",
      subtitle: "እቅድ ይምረጡ እና በሞባይል የሚያስተላልፍዎት ክሬዲት በቀጥታ ይክፈሉ።",
      subscribed: "✅ ተመዝግቧል",
      autoRenew: "ራስ-ሰር ማዘመን",
      subscribeButton: "ይመዝገቡ",
      confirmTitle: "ክፍያን ያረጋግጡ",
      confirmMessage: (price: number, name: string) =>
        `እርስዎ አሁን ለ ${name} እቅድ በ  $${price} መክፈል ነበር።`,
      cancel: "ሰርዝ",
      confirm: "አረጋግጥ",
      successTitle: "ክፍያው ተሳክቷል",
      successMessage: (name: string) => `ለ${name} እቅድ መዋቅሩ ተከናወነ።`,
      done: "ተከናውኗል",
      errorTitle: "በቂ ብር የለም",
      errorMessage: (balance: number) =>
        `ለዚህ እቅድ የሚያስፈልገው በይፋ ($${balance}) አልበቂም።`,
      ok: "እሺ",
      renewalTitle: "የመነሻ የተስተካከል መረጃ",
      renewalMessage: (name: string, date: string) =>
        `የ${name} እቅድዎ በ${date} ይቀጥላል።`,
      close: "ዝጋ",
      messagesLabel: "መልዕክቶች",
      detectionsLabel: "ምልክቶች",
      plans: {
        standardName: "ወርሓዊ",
        premiumName: "ዓላማዊ",
        enterpriseName: "ድርጅት",
        standardDesc: "ለተለመዱ ተጠቃሚዎችና ለትንሽ ቢዝነስ ተመጣጣኝ እቅድ።",
        premiumDesc: "ተጨማሪ የፍጹም ጥቃቅን ብድር የሚያስፈልጋቸው ባለሞያዎች ለማዘጋጀት።",
        enterpriseDesc: "ለድርጅቶች እና ለትልቅ ቡድኖች ከፍተኛ ድምብ ጥንቃቄ።",
      },
    },
    activity: {
      logTitle: 'የአይፈለጌ መልዕክት መዝገቦች',
      noMessages: 'ጠንቅቆ የሚጠብቅ ምንም መልዕክት የለም።',
      spamDetected: 'አይፈለጌ መልዕክት ተገኝቷል',
      potentialSpam: 'ሊሆን የሚችል አይፈለጌ መልዕክት ተገኝቷል። ለማረጋገጥ እባክዎ ሪፖርት ያድርጉ!',
      messageFrom: (from?: string) => `ከ ${from ?? 'ያልታወቀ ላኪ'}`,
      reportButton: 'ሪፖርት',
      pill: { spam: 'አይፈለጌ', potential: 'ሊሆን የሚችል', ok: 'እሺ' },
    },
    errors: {
      invalidMessageBody: 'ልክ ያልሆነ የመልዕክት አካል ተልኳል። እባክዎ መልዕክቱን አያርትዑ።',
      invalidMessageStructure: 'ልክ ያልሆነ የመልዕክት መዋቅር። እባክዎ መልዕክቱን አያርትዑ።',
      messageIdNotFound: 'የመልዕክት መታወቂያ በመዝገቦች ውስጥ አልተገኘም። እባክዎ መልዕክቱን አያርትዑ።',
      permissionRequestFailed: 'ማረጋገጫ ለመስጠት ሞክር አልተሳካም።',
    },
    settings: {
      title: 'ቅንብሮች',
      languageLabel: 'ቋንቋ',
      persistNotice: 'ቋንቋ እና መቀያየሪያዎች በአካባቢው ይቀመጣሉ',
      spamFilterLabel: 'የአይፈለጌ መልዕክት ማጣሪያ (bvn ላክ / nin ላክ)',
      languageSetMessage: (langLabel: string) => `ቋንቋው ወደ ${langLabel} ተቀይሯል`,
    },
  },
  igbo: {
    app: { title: 'Aegis', subtitle: 'Onye Nchọpụta Ozi Ajeseku.' },
    general: { from: 'Si' },
    smsStatusDisplay: 'Na-ege ntị na SMS ozi',
    listeningLabel: 'Ọnọdụ',
    somethingCount: (count: number) => `Ị nwere ozi ọhụrụ ${count}`,
    languageOptionsDisplay: [
      { key: 'english', label: 'Asụsụ Bekee' },
      { key: 'french', label: 'Asụsụ France' },
      { key: 'hausa', label: 'Asụsụ Hausa' },
      { key: 'yoruba', label: 'Asụsụ Yoruba' },
      { key: 'swahili', label: 'Asụsụ Swahili' },
      { key: 'amharic', label: 'Asụsụ Amharik' },
      { key: 'igbo', label: 'Asụsụ Igbo' },
    ],
    tabs: { activity: 'Ihe Omume', settings: 'Ntọala', subscriptions: 'Atụmatụ Ndenye' },
    ui: {
      yes: 'Ee',
      no: 'Mba',
      report: 'Kọọrọ',
      unknown: 'Amaghị',
      close: 'Mechiri',
      permissionGrantedFeedback: 'E nyere ikike!',
      permissionDeniedFeedback: 'A jụpụtara ikike!',
    },
    statusLabels: {
      canListenSms: 'Enwere ike ige SMS',
      canListenNotifications: 'Enwere ike ige ngosi',
      canPostNotifications: 'Enwere ike izipu ngosi',
      canDisplayOverApps: 'Enwere ike igosipụta n’elu ngwa ndị ọzọ',
    },
    permissions: {
      title: 'A chọkwara ikike',
      smsTitle: 'Gụọ SMS',
      overLayTitle: 'Gosipụta n\'elu ngwa',
      notificationsTitle: 'Nlele ngosi',
      postNotificationsTitle: 'Enwere ike izipu ngosi',
      needPermissions: 'A chọkwara ikike',
      enabled: 'Kwadoro',
      off: 'Kagbuo',
    },
    controls: {
      startListening: 'Malite Ige Ntị',
      stopListening: 'Kwusi Ige Ntị',
      clearLogs: 'Hichapụ Ndekọ',
      confirmClearLogs: 'Ị jide na ịchọrọ ihichapụ ndekọ niile?',
      logsCleared: 'E hichapụla ndekọ',
      deleted: 'Ezuru',
    },
    subscriptions: {
      title: "Atụmatụ Ndenye aha",
      subtitle: "Họrọ atụmatụ ma kwụọ ụgwọ ozugbo site na ụgwọ ekwentị gị.",
      subscribed: "✅ E debanyere aha",
      autoRenew: "Ndenye akpaka",
      subscribeButton: "Debanye aha",
      confirmTitle: "Nkwenye Ịkwụ Ụgwọ",
      confirmMessage: (price: number, name: string) =>
        `Ị ga-akwụ $${price} maka atụmatụ ${name}.`,
      cancel: "Kpọchie",
      confirm: "Kwenye",
      successTitle: "Ịkwụ Ụgwọ Gara Ọma",
      successMessage: (name: string) => `${name} atụmatụ gị agbakwụnyeghị.`,
      done: "Ọzọchara",
      errorTitle: "Ego adịghị ezu",
      errorMessage: (balance: number) =>
        `Ego gị ($${balance}) ezughi ezu maka atụmatụ a.`,
      ok: "Ọ bụrịrị ya",
      renewalTitle: "Ozi Mgbakwunye",
      renewalMessage: (name: string, date: string) =>
        `Atụmatụ ${name} gị ga-agbanwe na ${date}.`,
      close: "Mechiri",
      messagesLabel: "ozi",
      detectionsLabel: "nwale",
      plans: {
        standardName: "Nke Ụtụtụ",
        premiumName: "Nke Ọkachamara",
        enterpriseName: "Ndị Ọrụ",
        standardDesc: "Atụmatụ kwekọrọ maka ndị ọrụ na azụmahịa nta.",
        premiumDesc: "Maka ndị ọkachamara choro ikike nchọpụta aghụghọ.",
        enterpriseDesc: "Nchọpụta buru ibu maka ndị ọrụ na nnukwu òtù.",
      },
    },
    activity: {
      logTitle: 'Ndekọ Ozi Ajeseku',
      noMessages: 'Ọnweghị ozi - na-eche ozi aghụghọ na-abata.',
      spamDetected: 'A chọpụtala ozi aghụghọ',
      potentialSpam: 'A chọpụtala ozi o kwere mee ka ọ bụrụ aghụghọ. Biko kọọrọ iji gosi ya!',
      messageFrom: (from?: string) => `Si ${from ?? 'Onye zitere amaghị'}`,
      reportButton: 'Kọọrọ',
      pill: { spam: 'AGHỤGHỌ', potential: 'O kwere mee', ok: 'O DỊ MMA' },
    },
errors: {
  invalidMessageBody: 'Ozi ezighi ezi ezipụrụ. Biko ejighị aka gbanwee ozi ndabere.',
  invalidMessageStructure: 'Usoro ozi ezighi ezi. Biko ejighị aka gbanwee ozi ndabere.',
  messageIdNotFound: 'A pụghị ịchọta ID ozi ahụ na ndekọ. Biko ejighị aka gbanwee ozi ndabere.',
  permissionRequestFailed: 'Arịrịọ ikike adịghị aga nke ọma. Biko nwaa ọzọ.',
},

settings: {
  title: 'Ntọala',
  languageLabel: 'Asụsụ',
  persistNotice: 'A na-echekwa asụsụ na ntọala gị n’ime ekwentị.',
  spamFilterLabel: 'Nzacha ozi aghụghọ (dịka “zipu BVN” ma ọ bụ “zipu NIN”).',
  languageSetMessage: (langLabel) => `Asụsụ etinyere bụ ${langLabel}.`,
},

  },
};

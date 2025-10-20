// constants.ts
export type LangKey = 'english' | 'french';

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
    tabs: { activity: string; settings: string };
    ui: {
      yes: string;
      no: string;
      report: string;
      unknown: string;
    };
    statusLabels: {
      canListenSms: string;
      canListenNotifications: string;
      canPostNotifications: string;
    };
    permissions: {
      title: string;
      smsTitle: string;
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
    };
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
    };
    settings: {
      title: string;
      languageLabel: string;
      persistNotice: string;
      spamFilterLabel: string;
    };
  }
> = {
  english: {
    app: {
      title: 'BaitBusters',
      subtitle: 'Phishing interceptor.',
    },
    smsStatusDisplay: 'Listening to SMS messages',
    listeningLabel: 'Statuses',
    somethingCount: (count: number) => `You have ${count} new messages`,
    languageOptionsDisplay: [
      { key: 'english', label: 'English' },
      { key: 'french', label: 'French' },
    ],
    tabs: { activity: 'Activity', settings: 'Settings' },
    ui: {
      yes: 'Yes',
      no: 'No',
      report: 'Report',
      unknown: 'Unknown',
    },
    statusLabels: {
      canListenSms: 'Can listen to SMS',
      canListenNotifications: 'Can listen to notifications',
      canPostNotifications: 'Can post notifications',
    },
    permissions: {
      title: 'Permissions required',
      smsTitle: 'Read SMS',
      notificationsTitle: 'Notification Listener',
      postNotificationsTitle: 'Can Send Notifications',
      needPermissions: 'Permissions required',
      enabled: 'Enabled',
      off: 'Off'
    },
    controls: {
      startListening: 'Start Listening',
      stopListening: 'Stop Listening',
      clearLogs: 'Clear logs',
    },
    activity: {
      logTitle: 'Spam Logs',
      noMessages: 'No messages yet — waiting for incoming spam.',
      spamDetected: 'Spam detected',
      potentialSpam: 'Potential Spam Message Detected. Please Report to confirm!',
      messageFrom: (from?: string) => `From ${from ?? 'Unknown sender'}`,
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
    },
    settings: {
      title: 'Settings',
      languageLabel: 'Language',
      persistNotice: 'Language and toggles are saved locally',
      spamFilterLabel: 'Spam filter (send bvn / send nin)',
    },
  },
  french: {
    app: {
      title: 'BaitBusters',
      subtitle: "Intercepteur d'hameçonnage.",
    },
    smsStatusDisplay: 'Écoute des messages SMS',
    listeningLabel: 'Statut',
    somethingCount: (count: number) => `Vous avez ${count} nouveaux messages`,
    languageOptionsDisplay: [
      { key: 'english', label: 'Anglais' },
      { key: 'french', label: 'Français' },
    ],
    tabs: { activity: 'Activité', settings: 'Paramètres' },
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
    },
    activity: {
      logTitle: 'Journaux de Spam',
      noMessages: 'Pas encore de messages — en attente de SMS entrants.',
      spamDetected: 'Spam détecté',
      potentialSpam: "Message potentiellement spam. Veuillez signaler pour confirmer !",
      messageFrom: (from?: string) => `De ${from ?? 'Expéditeur inconnu'}`,
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
};

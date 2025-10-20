// constants.ts
export type LangKey = 'english' | 'french';

export const APP_DICTIONARY: Record<
  LangKey,
  {
    smsStatusDisplay: string;
    listeningLabel: string;
    somethingCount: (count: number) => string;
    languageOptionsDisplay: { key: LangKey; label: string }[];
    tabs: { activity: string; settings: string };
    permissions: {
      smsTitle: string;
      notificationsTitle: string;
      postNotificationsTitle: string;
      needPermissions: string;
    };
    controls: {
      startListening: string;
      stopListening: string;
      clearLogs: string;
    };
    activity: {
      noMessages: string;
      spamDetected: string;
      potentialSpam: string;
      messageFrom: (from?: string) => string;
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
    smsStatusDisplay: 'Listening to SMS messages',
    listeningLabel: 'Statuses',
    somethingCount: (count: number) => `You have ${count} new messages`,
    languageOptionsDisplay: [
      { key: 'english', label: 'English' },
      { key: 'french', label: 'French' },
    ],
    tabs: { activity: 'Activity', settings: 'Settings' },
    permissions: {
      smsTitle: 'SMS',
      notificationsTitle: 'Notification Listener',
      postNotificationsTitle: 'Can Send Notifications',
      needPermissions: 'Permissions required',
    },
    controls: {
      startListening: 'Start Listening',
      stopListening: 'Stop Listening',
      clearLogs: 'Clear logs',
    },
    activity: {
      noMessages: 'No messages yet — waiting for incoming spam.',
      spamDetected: 'Spam detected',
      potentialSpam: 'Potential Spam Message Detected. Please Report to confirm!',
      messageFrom: (from?: string) => `From ${from ?? 'Unknown sender'}`,
    },
    settings: {
      title: 'Settings',
      languageLabel: 'Language',
      persistNotice: 'Language and toggles are saved locally',
      spamFilterLabel: 'Spam filter (send bvn / send nin)',
    },
  },
  french: {
    smsStatusDisplay: 'Écoute des messages SMS',
    listeningLabel: 'Statut',
    somethingCount: (count: number) => `Vous avez ${count} nouveaux messages`,
    languageOptionsDisplay: [
      { key: 'english', label: 'Anglais' },
      { key: 'french', label: 'Français' },
    ],
    tabs: { activity: 'Activité', settings: 'Paramètres' },
    permissions: {
      smsTitle: 'SMS',
      notificationsTitle: "Écouteur de notifications",
      postNotificationsTitle: 'Peut envoyer des notifications',
      needPermissions: 'Autorisation requise',
    },
    controls: {
      startListening: 'Démarrer l\'écoute',
      stopListening: 'Arrêter',
      clearLogs: 'Effacer les journaux',
    },
    activity: {
      noMessages: 'Pas encore de messages — en attente de SMS entrants.',
      spamDetected: 'Spam détecté',
      potentialSpam: '',
      messageFrom: (from?: string) => `De ${from ?? 'Expéditeur inconnu'}`,
    },
    settings: {
      title: 'Paramètres',
      languageLabel: 'Langue',
      persistNotice: 'La langue et les paramètres sont sauvegardés localement',
      spamFilterLabel: 'Filtre anti-spam (send bvn / send nin)',
    },
  },
};

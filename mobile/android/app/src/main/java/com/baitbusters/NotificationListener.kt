package com.baitbusters

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.content.Intent

class NotificationListener : NotificationListenerService() {

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val packageName = sbn.packageName
        val extras = sbn.notification.extras
        val title = extras.getString("android.title") ?: ""
        val text = extras.getCharSequence("android.text")?.toString() ?: ""

        // Only messaging/email apps
        if (
            packageName.contains("whatsapp") ||
            packageName.contains("gmail") ||
            packageName.contains("yahoo") ||
            packageName.contains("messenger") ||
            packageName.contains("telegram") ||
            packageName.contains("outlook") ||
            packageName.contains("mail")

        ) {
            // Send broadcast that your RN module will listen to
            val intent = Intent("com.baitbusters.NOTIFICATION_LISTENER")
            intent.putExtra("packageName", packageName)
            intent.putExtra("title", title)
            intent.putExtra("text", text)
            sendBroadcast(intent)
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) {}
}

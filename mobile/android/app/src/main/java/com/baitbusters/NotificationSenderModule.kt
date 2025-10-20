// NotificationSenderModule.kt
package com.baitbusters

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NotificationSenderModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val CHANNEL_ID_DEFAULT = "baitbusters_notifications_default"
    private val CHANNEL_ID_ALERT = "baitbusters_notifications_alert"

    override fun getName() = "NotificationSenderModule"

    init {
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val nm = reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            // Default channel (regular notifications with actions)
            val defaultName = "BaitBusters Notifications"
            val defaultDescription = "General notifications and actions"
            val defaultImportance = NotificationManager.IMPORTANCE_HIGH // keep high so actions are visible
            val defaultChannel = NotificationChannel(CHANNEL_ID_DEFAULT, defaultName, defaultImportance).apply {
                description = defaultDescription
                enableLights(true)
                enableVibration(true)
            }
            nm.createNotificationChannel(defaultChannel)

            // Alert channel (full-screen, urgent)
            val alertName = "BaitBusters Alerts"
            val alertDescription = "Urgent spam alerts (full-screen)"
            val alertImportance = NotificationManager.IMPORTANCE_HIGH
            val alertChannel = NotificationChannel(CHANNEL_ID_ALERT, alertName, alertImportance).apply {
                description = alertDescription
                enableLights(true)
                enableVibration(true)
            }
            nm.createNotificationChannel(alertChannel)
        }
    }

    /**
     * Simple notification (kept for compatibility). Uses default channel.
     */
    @ReactMethod
    fun sendNotification(title: String, message: String) {
        try {
            val notificationId = (System.currentTimeMillis() and 0x7fffffff).toInt()

            val builder = NotificationCompat.Builder(reactContext, CHANNEL_ID_DEFAULT)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setAutoCancel(true)

            val notificationManager =
                reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.notify(notificationId, builder.build())
        } catch (e: Exception) {
            // swallow to avoid crashing native bridge; optionally log
        }
    }

    /**
     * Action-required notification: high-priority notification that includes a button
     * which opens the SMS app pre-filled with the provided phone number and body.
     * Uses the DEFAULT channel but set to high priority so it stands out.
     */
    @ReactMethod
    fun sendNotificationWithSmsAction(
        title: String,
        message: String,
        actionTitle: String,
        phoneNumber: String,
        smsBody: String
    ) {
        try {
            // Intent to open SMS composer with prefilled body
            val smsIntent = Intent(Intent.ACTION_SENDTO).apply {
                data = Uri.parse("smsto:$phoneNumber")
                putExtra("sms_body", smsBody)
                // allow starting activity from app context
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }

            val notificationId = (System.currentTimeMillis() and 0x7fffffff).toInt()

            val pendingIntent = PendingIntent.getActivity(
                reactContext,
                notificationId,
                smsIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val builder = NotificationCompat.Builder(reactContext, CHANNEL_ID_DEFAULT)
                .setSmallIcon(android.R.drawable.ic_dialog_alert)
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setDefaults(NotificationCompat.DEFAULT_ALL) // sound + vibrate
                .setAutoCancel(true)
                .addAction(android.R.drawable.ic_menu_send, actionTitle, pendingIntent)

            val notificationManager =
                reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.notify(notificationId, builder.build())
        } catch (e: Exception) {
            // avoid crashing native method — optionally log the error
        }
    }

    /**
     * High-priority full-screen alert (urgent). This tries to use a full-screen intent
     * so the alert can appear prominently even if the device is locked or user is in another app.
     *
     * Note: Full-screen intents are respected by Android when the notification has HIGH importance
     * and the device policy allows it. Use responsibly to avoid poor UX.
     */
    @ReactMethod
    fun sendHighPriorityAlert(title: String, message: String) {
        try {
            // Launch the app's main activity when tapped / for the full-screen intent.
            // Replace MainActivity::class.java with your actual activity class if different.
            val launchIntent = Intent(reactContext, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }
            val fsRequestCode = (System.currentTimeMillis() and 0x7fffffff).toInt()
            val fullScreenPendingIntent = PendingIntent.getActivity(
                reactContext,
                fsRequestCode,
                launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val notificationId = (System.currentTimeMillis() and 0x7fffffff).toInt()

            val builder = NotificationCompat.Builder(reactContext, CHANNEL_ID_ALERT)
                .setSmallIcon(android.R.drawable.ic_dialog_alert)
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setFullScreenIntent(fullScreenPendingIntent, true)
                .setDefaults(NotificationCompat.DEFAULT_ALL)
                .setAutoCancel(true)

            val notificationManager =
                reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.notify(notificationId, builder.build())
        } catch (e: Exception) {
            // optionally log
        }
    }
}

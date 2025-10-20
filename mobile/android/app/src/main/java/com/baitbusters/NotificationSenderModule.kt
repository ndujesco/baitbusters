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

    // -------------------------------
    // 🔧 Notification Channel Setup
    // -------------------------------
    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val nm = reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            // Default channel
            val defaultChannel = NotificationChannel(
                CHANNEL_ID_DEFAULT,
                "BaitBusters Notifications",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "General notifications and actions"
                enableLights(true)
                enableVibration(true)
            }
            nm.createNotificationChannel(defaultChannel)

            // Alert channel
            val alertChannel = NotificationChannel(
                CHANNEL_ID_ALERT,
                "BaitBusters Alerts",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Urgent spam alerts (full-screen)"
                enableLights(true)
                enableVibration(true)
            }
            nm.createNotificationChannel(alertChannel)
        }
    }

    // -------------------------------
    // 📢 Simple Notification (Tap opens app)
    // -------------------------------
    @ReactMethod
    fun sendNotification(title: String, message: String) {
        try {
            val notificationId = (System.currentTimeMillis() and 0x7fffffff).toInt()

            // Intent to open the app when notification tapped
            val appIntent = Intent(reactContext, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }

            val appPendingIntent = PendingIntent.getActivity(
                reactContext,
                notificationId,
                appIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val builder = NotificationCompat.Builder(reactContext, CHANNEL_ID_DEFAULT)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setAutoCancel(true)
                .setContentIntent(appPendingIntent) // Opens app when tapped

            val notificationManager =
                reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.notify(notificationId, builder.build())
        } catch (e: Exception) {
            // Prevent native crash
        }
    }

    // -------------------------------
    // 💬 Notification with SMS Action
    // -------------------------------
    @ReactMethod
    fun sendNotificationWithSmsAction(
        title: String,
        message: String,
        actionTitle: String,
        phoneNumber: String,
        smsBody: String
    ) {
        try {
            val notificationId = (System.currentTimeMillis() and 0x7fffffff).toInt()

            // 1️⃣ Intent for the SMS action button
            val smsIntent = Intent(Intent.ACTION_VIEW).apply {
                data = Uri.parse("sms:$phoneNumber?t=${System.currentTimeMillis()}")
                putExtra("address", phoneNumber)
                putExtra("sms_body", smsBody)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }

            val smsPendingIntent = PendingIntent.getActivity(
                reactContext,
                notificationId,
                smsIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            // 2️⃣ Intent to open the app when notification tapped
            val appIntent = Intent(reactContext, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }

            val appPendingIntent = PendingIntent.getActivity(
                reactContext,
                notificationId + 1,
                appIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            // 3️⃣ Build the notification
            val builder = NotificationCompat.Builder(reactContext, CHANNEL_ID_DEFAULT)
                .setSmallIcon(android.R.drawable.ic_dialog_alert)
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setDefaults(NotificationCompat.DEFAULT_ALL)
                .setAutoCancel(true)
                .setContentIntent(appPendingIntent) // Tap notification body → opens app
                .addAction(android.R.drawable.ic_menu_send, actionTitle, smsPendingIntent) // Button → opens SMS

            val notificationManager =
                reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.notify(notificationId, builder.build())
        } catch (e: Exception) {
            // Prevent native crash
        }
    }

    // -------------------------------
    // 🚨 High-Priority Full-Screen Alert
    // -------------------------------
    @ReactMethod
    fun sendHighPriorityAlert(title: String, message: String) {
        try {
            val notificationId = (System.currentTimeMillis() and 0x7fffffff).toInt()

            val launchIntent = Intent(reactContext, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }

            val fullScreenPendingIntent = PendingIntent.getActivity(
                reactContext,
                notificationId,
                launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val builder = NotificationCompat.Builder(reactContext, CHANNEL_ID_ALERT)
                .setSmallIcon(android.R.drawable.ic_dialog_alert)
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setFullScreenIntent(fullScreenPendingIntent, true)
                .setDefaults(NotificationCompat.DEFAULT_ALL)
                .setAutoCancel(true)
                .setContentIntent(fullScreenPendingIntent) // also open app on tap

            val notificationManager =
                reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.notify(notificationId, builder.build())
        } catch (e: Exception) {
            // Prevent native crash
        }
    }
}

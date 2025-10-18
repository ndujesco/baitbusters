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

    private val CHANNEL_ID = "baitbusters_notifications"

    override fun getName() = "NotificationSenderModule"

    init {
        createNotificationChannel()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "BaitBusters Notifications"
            val descriptionText = "Channel for app notifications"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }
            val notificationManager: NotificationManager =
                reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    /**
     * Original simple notification (unchanged).
     */
    @ReactMethod
    fun sendNotification(title: String, message: String) {
        val builder = NotificationCompat.Builder(reactContext, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)

        val notificationManager =
            reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(System.currentTimeMillis().toInt(), builder.build())
    }

    /**
     * New: send a notification that contains one action button which opens the SMS app
     * with the provided phoneNumber and smsBody.
     *
     * Parameters:
     *  - title: notification title
     *  - message: notification body text
     *  - actionTitle: text to show on the action button (e.g. "Reply via SMS")
     *  - phoneNumber: recipient (short code or number) to open in SMS app
     *  - smsBody: pre-filled message body in the SMS composer
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
            // Intent that opens the SMS app with the phone number and message prefilled
            val smsIntent = Intent(Intent.ACTION_SENDTO).apply {
                data = Uri.parse("smsto:$phoneNumber")
                putExtra("sms_body", smsBody)
                // ensure we open an activity from outside the app context
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }

            // unique id to use both as requestCode and notification id
            val notificationId = System.currentTimeMillis().toInt()

            val pendingIntent = PendingIntent.getActivity(
                reactContext,
                notificationId,
                smsIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val builder = NotificationCompat.Builder(reactContext, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setAutoCancel(true)
                .addAction(android.R.drawable.ic_menu_send, actionTitle, pendingIntent)

            val notificationManager =
                reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.notify(notificationId, builder.build())
        } catch (e: Exception) {
            // avoid crashing native method — optionally log the error with your preferred logger
        }
    }
}

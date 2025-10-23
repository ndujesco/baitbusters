package com.baitbusters

import android.app.*
import android.content.Context
import android.content.Intent
import android.os.Build
import android.telephony.SmsManager
import androidx.core.app.NotificationCompat

class SmsForegroundService : Service() {

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val phoneNumber = intent?.getStringExtra("phoneNumber") ?: ""
        val message = intent?.getStringExtra("message") ?: ""

        startForegroundNotification()

        sendSms(phoneNumber, message)
        stopSelf() // stop service after sending
        return START_NOT_STICKY
    }

    private fun startForegroundNotification() {
        val channelId = "sms_service_channel"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "SMS Service",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("SATITURE SMS Service")
            .setContentText("Sending SMS in background...")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .build()

        startForeground(1001, notification)
    }

    private fun sendSms(phoneNumber: String, message: String) {
        try {
            val smsManager = SmsManager.getDefault()
            val parts = smsManager.divideMessage(message)
            smsManager.sendMultipartTextMessage(phoneNumber, null, parts, null, null)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun onBind(intent: Intent?) = null
}

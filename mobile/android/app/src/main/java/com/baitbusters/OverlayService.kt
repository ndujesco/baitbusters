package com.baitbusters

import android.app.*
import android.content.*
import android.graphics.Color
import android.graphics.PixelFormat
import android.os.Build
import android.view.*
import android.widget.*
import androidx.core.app.NotificationCompat

class OverlayService : Service() {

    private var windowManager: WindowManager? = null
    private var overlayView: View? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val title = intent?.getStringExtra("title") ?: "Popup"
        val message = intent?.getStringExtra("message") ?: "Message"
        val buttonText = intent?.getStringExtra("buttonText") ?: "CLOSE"
        val buttonColor = intent?.getIntExtra("buttonColor", Color.RED) ?: Color.RED

        showOverlay(title, message, buttonText, buttonColor)
        startForegroundNotification()
        return START_NOT_STICKY
    }

    private fun startForegroundNotification() {
        val channelId = "overlay_service_channel"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Overlay Service Channel",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("SATITURE running")
            .setContentText("Overlay service active")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .build()

        startForeground(1, notification)
    }

    private fun showOverlay(title: String, message: String, buttonText: String, buttonColor: Int) {
        if (overlayView != null) return

        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

        val layoutParams = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else
                WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
                    WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT
        )

        val inflater = getSystemService(LAYOUT_INFLATER_SERVICE) as LayoutInflater
        overlayView = inflater.inflate(R.layout.popup_overlay, null)

        // Set title, message
        overlayView?.findViewById<TextView>(R.id.popupTitle)?.text = title
        overlayView?.findViewById<TextView>(R.id.popupMessage)?.text = message

        // Set dynamic button
        val closeButton = overlayView?.findViewById<Button>(R.id.popupClose)
        closeButton?.text = buttonText
        closeButton?.setBackgroundColor(buttonColor)
        closeButton?.setOnClickListener {
            removeOverlay()
        }

        windowManager?.addView(overlayView, layoutParams)
    }

    private fun removeOverlay() {
        if (overlayView != null) {
            windowManager?.removeView(overlayView)
            overlayView = null
        }
        stopSelf()
    }

    override fun onDestroy() {
        super.onDestroy()
        removeOverlay()
    }

    override fun onBind(intent: Intent?) = null
}

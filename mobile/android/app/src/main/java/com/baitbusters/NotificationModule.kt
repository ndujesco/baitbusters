package com.baitbusters

import android.content.BroadcastReceiver
import android.content.ComponentName
import android.provider.Settings
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

import com.facebook.react.bridge.Promise

class NotificationListenerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            intent?.let {
                val packageName = it.getStringExtra("packageName") ?: ""
                val title = it.getStringExtra("title") ?: ""
                val text = it.getStringExtra("text") ?: ""

                val messageJson =
                    """{"packageName":"$packageName","title":"$title","text":"$text"}"""

                reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("onNotificationReceived", messageJson)
            }
        }
    }

    override fun getName(): String = "NotificationListenerModule"

    @ReactMethod
    fun startListening() {
        val filter = IntentFilter("com.baitbusters.NOTIFICATION_LISTENER")
        reactApplicationContext.registerReceiver(receiver, filter)
    }

    @ReactMethod
    fun requestPermission() {
        val intent = Intent(android.provider.Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent)
    }

    @ReactMethod
fun isPermissionGranted(promise: Promise) {
    try {
        val enabledListeners = Settings.Secure.getString(
            reactApplicationContext.contentResolver,
            "enabled_notification_listeners"
        ) ?: ""

        // Correctly point to your NotificationListener service
        val cn = ComponentName(
            reactApplicationContext,
            NotificationListener::class.java // <-- THE FIX IS HERE
        )

        // Check if your service is in the enabled list
        val granted = enabledListeners.contains(cn.flattenToString())
        promise.resolve(granted)
    } catch (e: Exception) {
        promise.reject("ERROR_CHECKING_PERMISSION", e)
    }
}
}

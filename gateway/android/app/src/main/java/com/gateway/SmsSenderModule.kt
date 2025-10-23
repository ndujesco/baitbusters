package com.baitbusters

import android.content.Intent
import android.os.Build
import android.telephony.SmsManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise


class SmsSenderModule(private val reactContext: ReactApplicationContext) 
    : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "SmsSenderModule"

@ReactMethod
fun sendSMS(phoneNumber: String, message: String, promise: Promise) {
    try {
        val context = reactApplicationContext
        val intent = Intent(context, SmsForegroundService::class.java)
        intent.putExtra("phoneNumber", phoneNumber)
        intent.putExtra("message", message)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }

        promise.resolve("SMS request sent for $phoneNumber")
    } catch (e: Exception) {
        promise.reject("SMS_ERROR", "Failed to send SMS: ${e.message}", e)
    }
}

}

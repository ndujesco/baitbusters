package com.gateway

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
            val smsManager = SmsManager.getDefault()
            val parts = smsManager.divideMessage(message)
            smsManager.sendMultipartTextMessage(phoneNumber, null, parts, null, null)

            promise.resolve("SMS sent successfully to $phoneNumber")
        } catch (e: Exception) {
            promise.reject("SMS_ERROR", "Failed to send SMS: ${e.message}", e)
        }
    }
}

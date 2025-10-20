package com.baitbusters

import android.content.Intent
import android.net.Uri
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SmsIntentModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "SmsIntentModule"

    @ReactMethod
    fun openSmsApp(phoneNumber: String, message: String, promise: Promise) {
        try {
            // Use ACTION_VIEW with "sms:" to avoid appending to previous drafts
            val uri = Uri.parse("sms:$phoneNumber?t=${System.currentTimeMillis()}") // random param to break caching
            val intent = Intent(Intent.ACTION_VIEW, uri).apply {
                putExtra("address", phoneNumber)
                putExtra("sms_body", message)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }

            reactContext.startActivity(intent)
            promise.resolve("SMS app opened")
        } catch (e: Exception) {
            promise.reject("SMS_INTENT_ERROR", "Failed to open SMS app: ${e.message}", e)
        }
    }
}

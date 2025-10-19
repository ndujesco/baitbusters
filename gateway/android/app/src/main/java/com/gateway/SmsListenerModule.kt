package com.gateway

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.telephony.SmsMessage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.json.JSONObject

class SmsListenerModule(private val reactContext: ReactApplicationContext)
    : ReactContextBaseJavaModule(reactContext) {

    private var smsReceiver: BroadcastReceiver? = null

    override fun getName(): String = "SmsListenerModule"

    private fun sendEvent(eventName: String, message: String) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, message)
    }

    private fun registerSMSReceiver() {
        // Prevent registering more than once
        if (smsReceiver != null) return

        smsReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                val extras = intent?.extras ?: return
                val pdus = extras.get("pdus") as? Array<*> ?: return

                for (pdu in pdus) {
                    val sms = SmsMessage.createFromPdu(pdu as ByteArray)
                    val messageBody = sms.messageBody
                    val sender = sms.originatingAddress
                    val timestamp = sms.timestampMillis

                    val json = JSONObject()
                    json.put("messageBody", messageBody)
                    json.put("senderPhoneNumber", sender)
                    json.put("timestamp", timestamp)

                    sendEvent("onSMSReceived", json.toString())
                }
            }
        }

        val filter = IntentFilter("android.provider.Telephony.SMS_RECEIVED")
        reactContext.registerReceiver(smsReceiver, filter)
    }

    @ReactMethod
    fun startListeningToSMS() {
        registerSMSReceiver()
    }

    @ReactMethod
    fun stopListeningToSMS() {
        smsReceiver?.let {
            reactContext.unregisterReceiver(it)
            smsReceiver = null
        }
    }
}

package com.baitbusters

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class OverlayPermissionModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "OverlayPermissionModule"

    /**
     * Check if the app can draw over other apps
     */
    @ReactMethod
    fun isPermissionGranted(promise: Promise) {
        try {
            val granted = Settings.canDrawOverlays(reactContext)
            promise.resolve(granted)
        } catch (e: Exception) {
            promise.reject("CHECK_PERMISSION_ERROR", e)
        }
    }

    /**
     * Open overlay settings screen (automatically)
     */
    @ReactMethod
    fun requestPermission() {
        try {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:${reactContext.packageName}")
            ).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }

            reactContext.startActivity(intent)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    /**
     * Try to auto-grant overlay permission (Android 6+ allows user confirmation)
     */
    @ReactMethod
    fun ensurePermission(promise: Promise) {
        try {
            if (Settings.canDrawOverlays(reactContext)) {
                promise.resolve(true)
            } else {
                val intent = Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:${reactContext.packageName}")
                ).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                reactContext.startActivity(intent)
                promise.resolve(false)
            }
        } catch (e: Exception) {
            promise.reject("ENSURE_PERMISSION_ERROR", e)
        }
    }
}

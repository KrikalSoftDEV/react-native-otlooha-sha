package com.wan.waqaf360.location

import android.app.Activity
import android.content.Intent
import android.content.IntentSender
import com.facebook.react.bridge.*
import com.google.android.gms.common.api.ResolvableApiException
import com.google.android.gms.location.*

class LocationSettingsModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private var locationSettingsPromise: Promise? = null
    private val REQUEST_CHECK_SETTINGS = 214

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String = "LocationSettings"

    @ReactMethod
    fun promptForEnableLocation(promise: Promise) {
        locationSettingsPromise = promise

        val locationRequest = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            10000L
        ).build()

        val builder = LocationSettingsRequest.Builder()
            .addLocationRequest(locationRequest)
            .setAlwaysShow(true)

        val client: SettingsClient = LocationServices.getSettingsClient(reactContext)

        client.checkLocationSettings(builder.build())
            .addOnSuccessListener {
                promise.resolve(true)
            }
            .addOnFailureListener { e ->
                if (e is ResolvableApiException) {
                    try {
                        val activity: Activity? = currentActivity
                        if (activity != null) {
                            e.startResolutionForResult(activity, REQUEST_CHECK_SETTINGS)
                        } else {
                            promise.reject("NO_ACTIVITY", "Current activity is null")
                        }
                    } catch (ex: IntentSender.SendIntentException) {
                        promise.reject("INTENT_FAILED", ex.message)
                    }
                } else {
                    promise.reject("UNRESOLVABLE", e.message)
                }
            }
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == REQUEST_CHECK_SETTINGS) {
            if (resultCode == Activity.RESULT_OK) {
                locationSettingsPromise?.resolve(true)
            } else {
                locationSettingsPromise?.reject("CANCELLED", "User cancelled location enable")
            }
            locationSettingsPromise = null
        }
    }

    override fun onNewIntent(intent: Intent?) {
        // No-op
    }
}

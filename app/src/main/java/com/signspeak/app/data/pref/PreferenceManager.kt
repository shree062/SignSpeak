package com.signspeak.app.data.pref

import android.content.Context
import android.content.SharedPreferences

class PreferenceManager(context: Context) {

    private val prefs: SharedPreferences =
        context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)

    companion object {
        private const val PREF_NAME = "signspeak_preferences"
        private const val KEY_IS_LOGGED_IN = "is_logged_in"
        private const val KEY_CURRENT_USER_ID = "current_user_id"
        private const val KEY_CURRENT_USER_NAME = "current_user_name"
        private const val KEY_CURRENT_USER_EMAIL = "current_user_email"
        private const val KEY_OFFLINE_MODE = "offline_mode"
        private const val KEY_TTS_SPEED = "tts_speed"
        private const val KEY_TTS_PITCH = "tts_pitch"
        private const val KEY_TTS_LANGUAGE = "tts_language"
        private const val KEY_CONFIDENCE_THRESHOLD = "confidence_threshold"
        private const val KEY_NOTIFICATIONS_ENABLED = "notifications_enabled"
        private const val KEY_DARK_MODE = "dark_mode"
    }

    var isLoggedIn: Boolean
        get() = prefs.getBoolean(KEY_IS_LOGGED_IN, false)
        set(value) = prefs.edit().putBoolean(KEY_IS_LOGGED_IN, value).apply()

    var currentUserId: Long
        get() = prefs.getLong(KEY_CURRENT_USER_ID, 1L)
        set(value) = prefs.edit().putLong(KEY_CURRENT_USER_ID, value).apply()

    var currentUserName: String
        get() = prefs.getString(KEY_CURRENT_USER_NAME, "Shree Nithiy") ?: "Shree Nithiy"
        set(value) = prefs.edit().putString(KEY_CURRENT_USER_NAME, value).apply()

    var currentUserEmail: String
        get() = prefs.getString(KEY_CURRENT_USER_EMAIL, "shree@signspeak.ai") ?: "shree@signspeak.ai"
        set(value) = prefs.edit().putString(KEY_CURRENT_USER_EMAIL, value).apply()

    var isOfflineMode: Boolean
        get() = prefs.getBoolean(KEY_OFFLINE_MODE, false)
        set(value) = prefs.edit().putBoolean(KEY_OFFLINE_MODE, value).apply()

    var ttsSpeed: Float
        get() = prefs.getFloat(KEY_TTS_SPEED, 1.0f)
        set(value) = prefs.edit().putFloat(KEY_TTS_SPEED, value).apply()

    var ttsPitch: Float
        get() = prefs.getFloat(KEY_TTS_PITCH, 1.0f)
        set(value) = prefs.edit().putFloat(KEY_TTS_PITCH, value).apply()

    var ttsLanguage: String
        get() = prefs.getString(KEY_TTS_LANGUAGE, "en-US") ?: "en-US"
        set(value) = prefs.edit().putString(KEY_TTS_LANGUAGE, value).apply()

    var confidenceThreshold: Float
        get() = prefs.getFloat(KEY_CONFIDENCE_THRESHOLD, 0.70f)
        set(value) = prefs.edit().putFloat(KEY_CONFIDENCE_THRESHOLD, value).apply()

    var notificationsEnabled: Boolean
        get() = prefs.getBoolean(KEY_NOTIFICATIONS_ENABLED, true)
        set(value) = prefs.edit().putBoolean(KEY_NOTIFICATIONS_ENABLED, value).apply()

    var isDarkMode: Boolean
        get() = prefs.getBoolean(KEY_DARK_MODE, false)
        set(value) = prefs.edit().putBoolean(KEY_DARK_MODE, value).apply()

    fun setUserSession(userId: Long, name: String, email: String) {
        prefs.edit()
            .putBoolean(KEY_IS_LOGGED_IN, true)
            .putLong(KEY_CURRENT_USER_ID, userId)
            .putString(KEY_CURRENT_USER_NAME, name)
            .putString(KEY_CURRENT_USER_EMAIL, email)
            .apply()
    }

    fun clearSession() {
        prefs.edit()
            .putBoolean(KEY_IS_LOGGED_IN, false)
            .putLong(KEY_CURRENT_USER_ID, 0L)
            .putString(KEY_CURRENT_USER_NAME, "")
            .putString(KEY_CURRENT_USER_EMAIL, "")
            .apply()
    }
}

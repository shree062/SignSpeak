package com.signspeak.app

import android.app.Application
import com.signspeak.app.data.local.AppDatabase
import com.signspeak.app.data.pref.PreferenceManager
import com.signspeak.app.data.repository.HistoryRepository
import com.signspeak.app.data.repository.SignRepository
import com.signspeak.app.data.repository.UserRepository
import com.signspeak.app.ml.SignLanguageClassifier
import com.signspeak.app.tts.TTSManager
import com.signspeak.app.utils.NetworkMonitor
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob

class SignSpeakApplication : Application() {

    val applicationScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    val database by lazy { AppDatabase.getDatabase(this, applicationScope) }
    val preferenceManager by lazy { PreferenceManager(this) }
    val userRepository by lazy { UserRepository(database.userDao()) }
    val historyRepository by lazy { HistoryRepository(database.historyDao()) }
    val signRepository by lazy { SignRepository(database.signDao()) }
    val classifier by lazy { SignLanguageClassifier(this) }
    val networkMonitor by lazy { NetworkMonitor(this) }

    override fun onCreate() {
        super.onCreate()
        instance = this
        // Pre-warm TTS engine
        TTSManager.getInstance(this)
    }

    companion object {
        lateinit var instance: SignSpeakApplication
            private set
    }
}

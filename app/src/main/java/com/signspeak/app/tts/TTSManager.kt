package com.signspeak.app.tts

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import java.util.Locale

/**
 * TTSManager
 *
 * Manages offline Android Text-to-Speech audio output with configurable pitch, speed, and language.
 */
class TTSManager private constructor(context: Context) {

    private val TAG = "TTSManager"
    private var textToSpeech: TextToSpeech? = null
    private var isInitialized = false
    private val pendingSpeechQueue = mutableListOf<String>()

    private var currentSpeed: Float = 1.0f
    private var currentPitch: Float = 1.0f
    private var currentLocale: Locale = Locale.US

    init {
        textToSpeech = TextToSpeech(context.applicationContext) { status ->
            if (status == TextToSpeech.SUCCESS) {
                val result = textToSpeech?.setLanguage(currentLocale)
                if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                    Log.w(TAG, "Locale $currentLocale is not supported; falling back to default English.")
                    textToSpeech?.language = Locale.ENGLISH
                }
                textToSpeech?.setSpeechRate(currentSpeed)
                textToSpeech?.setPitch(currentPitch)
                isInitialized = true
                Log.d(TAG, "TextToSpeech initialized successfully.")

                // Speak any queued phrases
                synchronized(pendingSpeechQueue) {
                    for (text in pendingSpeechQueue) {
                        speak(text)
                    }
                    pendingSpeechQueue.clear()
                }
            } else {
                Log.e(TAG, "Failed to initialize TextToSpeech engine. Status: $status")
            }
        }

        textToSpeech?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
            override fun onStart(utteranceId: String?) {
                Log.d(TAG, "Started speaking utterance: $utteranceId")
            }

            override fun onDone(utteranceId: String?) {
                Log.d(TAG, "Finished speaking utterance: $utteranceId")
            }

            override fun onError(utteranceId: String?) {
                Log.e(TAG, "Error speaking utterance: $utteranceId")
            }
        })
    }

    companion object {
        @Volatile
        private var instance: TTSManager? = null

        fun getInstance(context: Context): TTSManager {
            return instance ?: synchronized(this) {
                instance ?: TTSManager(context.applicationContext).also { instance = it }
            }
        }
    }

    fun speak(text: String, flushQueue: Boolean = true) {
        if (text.isBlank()) return

        if (!isInitialized) {
            synchronized(pendingSpeechQueue) {
                pendingSpeechQueue.add(text)
            }
            return
        }

        val queueMode = if (flushQueue) TextToSpeech.QUEUE_FLUSH else TextToSpeech.QUEUE_ADD
        val utteranceId = "SignSpeak_TTS_${System.currentTimeMillis()}"
        textToSpeech?.speak(text, queueMode, null, utteranceId)
    }

    fun setSpeechRate(rate: Float) {
        currentSpeed = rate
        textToSpeech?.setSpeechRate(rate)
    }

    fun setPitch(pitch: Float) {
        currentPitch = pitch
        textToSpeech?.setPitch(pitch)
    }

    fun setLanguage(locale: Locale) {
        currentLocale = locale
        textToSpeech?.language = locale
    }

    fun stop() {
        textToSpeech?.stop()
    }

    fun shutdown() {
        textToSpeech?.stop()
        textToSpeech?.shutdown()
        textToSpeech = null
        isInitialized = false
        instance = null
    }
}

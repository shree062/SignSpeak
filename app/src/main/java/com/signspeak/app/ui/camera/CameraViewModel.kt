package com.signspeak.app.ui.camera

import android.graphics.Bitmap
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.signspeak.app.data.pref.PreferenceManager
import com.signspeak.app.data.repository.HistoryRepository
import com.signspeak.app.ml.RecognitionResult
import com.signspeak.app.ml.SignLanguageClassifier
import com.signspeak.app.utils.Constants
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class CameraViewModel(
    private val classifier: SignLanguageClassifier,
    private val historyRepository: HistoryRepository,
    private val preferenceManager: PreferenceManager
) : ViewModel() {

    private val _recognitionResult = MutableLiveData<RecognitionResult?>()
    val recognitionResult: LiveData<RecognitionResult?> = _recognitionResult

    private val _isProcessingPaused = MutableLiveData(false)
    val isProcessingPaused: LiveData<Boolean> = _isProcessingPaused

    private var lastSavedSign = ""
    private var lastSaveTime = 0L

    fun processFrame(bitmap: Bitmap) {
        if (_isProcessingPaused.value == true) return

        viewModelScope.launch(Dispatchers.Default) {
            val threshold = preferenceManager.confidenceThreshold
            val result = classifier.classifyFrame(bitmap, threshold)

            withContext(Dispatchers.Main) {
                _recognitionResult.value = result
            }

            // Auto-save distinct stable predictions to local Room history (throttle 3 seconds)
            val now = System.currentTimeMillis()
            if (result.confidence >= threshold &&
                (result.signName != lastSavedSign || (now - lastSaveTime > 4000))
            ) {
                lastSavedSign = result.signName
                lastSaveTime = now

                historyRepository.insertHistory(
                    userId = preferenceManager.currentUserId,
                    input = Constants.INPUT_TYPE_CAMERA,
                    signName = result.signName,
                    translatedText = result.translatedText,
                    confidence = result.confidence
                )
            }
        }
    }

    fun togglePause() {
        _isProcessingPaused.value = !(_isProcessingPaused.value ?: false)
    }

    fun saveCurrentTranslation(result: RecognitionResult) {
        viewModelScope.launch {
            historyRepository.insertHistory(
                userId = preferenceManager.currentUserId,
                input = Constants.INPUT_TYPE_CAMERA,
                signName = result.signName,
                translatedText = result.translatedText,
                confidence = result.confidence
            )
        }
    }

    class Factory(
        private val classifier: SignLanguageClassifier,
        private val historyRepository: HistoryRepository,
        private val preferenceManager: PreferenceManager
    ) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return CameraViewModel(classifier, historyRepository, preferenceManager) as T
        }
    }
}

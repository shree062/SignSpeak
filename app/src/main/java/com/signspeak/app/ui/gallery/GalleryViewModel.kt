package com.signspeak.app.ui.gallery

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
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class GalleryViewModel(
    private val classifier: SignLanguageClassifier,
    private val historyRepository: HistoryRepository,
    private val preferenceManager: PreferenceManager
) : ViewModel() {

    private val _pipelineStatus = MutableLiveData<String>("Ready to process gesture")
    val pipelineStatus: LiveData<String> = _pipelineStatus

    private val _isProcessing = MutableLiveData<Boolean>(false)
    val isProcessing: LiveData<Boolean> = _isProcessing

    private val _result = MutableLiveData<RecognitionResult?>()
    val result: LiveData<RecognitionResult?> = _result

    fun processGalleryBitmap(bitmap: Bitmap) {
        viewModelScope.launch {
            _isProcessing.value = true
            _pipelineStatus.value = "1. Preprocessing image (224x224 RGB normalization)…"
            delay(300)

            _pipelineStatus.value = "2. CNN extracting spatial features (hand shape, edges)…"
            delay(400)

            _pipelineStatus.value = "3. LSTM/GRU evaluating gesture temporal sequence…"
            delay(350)

            _pipelineStatus.value = "4. Computing softmax classification probabilities…"
            val recognition = classifier.classifyFrame(bitmap, preferenceManager.confidenceThreshold)
            delay(200)

            _result.value = recognition
            _pipelineStatus.value = "Recognition complete (${recognition.inferenceTimeMs}ms)"
            _isProcessing.value = false

            // Save to local Room history
            historyRepository.insertHistory(
                userId = preferenceManager.currentUserId,
                input = Constants.INPUT_TYPE_GALLERY,
                signName = recognition.signName,
                translatedText = recognition.translatedText,
                confidence = recognition.confidence
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
            return GalleryViewModel(classifier, historyRepository, preferenceManager) as T
        }
    }
}

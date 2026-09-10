package com.signspeak.app.ml

/**
 * Result data class for Machine Learning Gesture Recognition
 */
data class RecognitionResult(
    val signName: String,
    val translatedText: String,
    val confidence: Float,
    val inferenceTimeMs: Long,
    val isRealModelInference: Boolean = false,
    val pipelineBreakdown: String = "Preprocessing -> CNN Spatial -> LSTM Temporal -> Softmax Output"
)

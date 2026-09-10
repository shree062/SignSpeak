package com.signspeak.app.ui.camera

import android.Manifest
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.os.SystemClock
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.core.Camera
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.ContextCompat
import com.signspeak.app.R
import com.signspeak.app.SignSpeakApplication
import com.signspeak.app.databinding.ActivityCameraTranslationBinding
import com.signspeak.app.ml.PreprocessingUtils
import com.signspeak.app.tts.TTSManager
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class CameraTranslationActivity : AppCompatActivity() {

    private lateinit var binding: ActivityCameraTranslationBinding
    private val app by lazy { application as SignSpeakApplication }

    private val viewModel: CameraViewModel by viewModels {
        CameraViewModel.Factory(app.classifier, app.historyRepository, app.preferenceManager)
    }

    private var cameraProvider: ProcessCameraProvider? = null
    private var camera: Camera? = null
    private var cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA
    private var isTorchOn = false
    private lateinit var cameraExecutor: ExecutorService

    private var lastAnalysisTimestamp = 0L
    private val ANALYSIS_INTERVAL_MS = 200L // 5 FPS sample rate for ML efficiency

    private val requestCameraPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted ->
            if (isGranted) {
                startCamera()
            } else {
                Toast.makeText(this, R.string.permission_camera_required, Toast.LENGTH_LONG).show()
                finish()
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCameraTranslationBinding.inflate(layoutInflater)
        setContentView(binding.root)

        cameraExecutor = Executors.newSingleThreadExecutor()

        setupListeners()
        observeViewModel()
        checkCameraPermissionAndStart()
    }

    private fun checkCameraPermissionAndStart() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            startCamera()
        } else {
            requestCameraPermissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    private fun startCamera() {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(this)
        cameraProviderFuture.addListener({
            cameraProvider = cameraProviderFuture.get()
            bindCameraUseCases()
        }, ContextCompat.getMainExecutor(this))
    }

    private fun bindCameraUseCases() {
        val provider = cameraProvider ?: return

        val preview = Preview.Builder()
            .build()
            .also {
                it.setSurfaceProvider(binding.pvCameraPreview.surfaceProvider)
            }

        val isFront = cameraSelector == CameraSelector.DEFAULT_FRONT_CAMERA
        val imageAnalysis = ImageAnalysis.Builder()
            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
            .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_YUV_420_888)
            .build()
            .also { analysis ->
                analysis.setAnalyzer(cameraExecutor) { imageProxy ->
                    val currentTime = SystemClock.uptimeMillis()
                    if (currentTime - lastAnalysisTimestamp >= ANALYSIS_INTERVAL_MS) {
                        lastAnalysisTimestamp = currentTime

                        val bitmap = PreprocessingUtils.imageProxyToBitmap(imageProxy, isFront)
                        if (bitmap != null) {
                            viewModel.processFrame(bitmap)
                        }
                    }
                    imageProxy.close()
                }
            }

        try {
            provider.unbindAll()
            camera = provider.bindToLifecycle(this, cameraSelector, preview, imageAnalysis)
        } catch (e: Exception) {
            Toast.makeText(this, "Failed to initialize camera: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun setupListeners() {
        binding.btnBack.setOnClickListener { finish() }

        // Switch front/back camera
        binding.btnSwitchCamera.setOnClickListener {
            cameraSelector = if (cameraSelector == CameraSelector.DEFAULT_BACK_CAMERA) {
                CameraSelector.DEFAULT_FRONT_CAMERA
            } else {
                CameraSelector.DEFAULT_BACK_CAMERA
            }
            bindCameraUseCases()
        }

        // Flash toggle
        binding.btnFlash.setOnClickListener {
            if (camera?.cameraInfo?.hasFlashUnit() == true) {
                isTorchOn = !isTorchOn
                camera?.cameraControl?.enableTorch(isTorchOn)
                binding.btnFlash.setColorFilter(
                    if (isTorchOn) getColor(R.color.secondary) else getColor(R.color.white)
                )
            } else {
                Toast.makeText(this, "Flash not available", Toast.LENGTH_SHORT).show()
            }
        }

        // Toggle Pause/Resume
        binding.btnToggleRecognition.setOnClickListener {
            viewModel.togglePause()
        }

        // Play Speech (TTS)
        binding.btnPlaySpeech.setOnClickListener {
            val text = binding.tvTranslatedSentence.text.toString()
            if (text.isNotBlank() && text != getString(R.string.translated_placeholder)) {
                TTSManager.getInstance(this).speak(text)
            }
        }

        // Copy
        binding.btnCopyText.setOnClickListener {
            val text = binding.tvTranslatedSentence.text.toString()
            if (text.isNotBlank() && text != getString(R.string.translated_placeholder)) {
                val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                val clip = ClipData.newPlainText("Sign Translation", text)
                clipboard.setPrimaryClip(clip)
                Toast.makeText(this, R.string.text_copied, Toast.LENGTH_SHORT).show()
            }
        }

        // Share
        binding.btnShareText.setOnClickListener {
            val text = binding.tvTranslatedSentence.text.toString()
            if (text.isNotBlank() && text != getString(R.string.translated_placeholder)) {
                val shareIntent = Intent().apply {
                    action = Intent.ACTION_SEND
                    putExtra(Intent.EXTRA_TEXT, "SignSpeak Translation: $text")
                    type = "text/plain"
                }
                startActivity(Intent.createChooser(shareIntent, "Share Translation"))
            }
        }
    }

    private fun observeViewModel() {
        viewModel.recognitionResult.observe(this) { result ->
            if (result != null) {
                binding.tvRecognizedSign.text = result.signName
                binding.tvTranslatedSentence.text = result.translatedText
                binding.tvConfidence.text = String.format("%.1f%%", result.confidence * 100)
            }
        }

        viewModel.isProcessingPaused.observe(this) { isPaused ->
            if (isPaused) {
                binding.btnToggleRecognition.text = getString(R.string.start_recognition)
                binding.tvFrameHint.text = "Recognition paused"
            } else {
                binding.btnToggleRecognition.text = getString(R.string.stop_recognition)
                binding.tvFrameHint.text = getString(R.string.align_hand_in_box)
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        cameraExecutor.shutdown()
    }
}

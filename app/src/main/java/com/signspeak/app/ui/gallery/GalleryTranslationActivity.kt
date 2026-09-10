package com.signspeak.app.ui.gallery

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.signspeak.app.R
import com.signspeak.app.SignSpeakApplication
import com.signspeak.app.databinding.ActivityGalleryTranslationBinding
import com.signspeak.app.tts.TTSManager

class GalleryTranslationActivity : AppCompatActivity() {

    private lateinit var binding: ActivityGalleryTranslationBinding
    private val app by lazy { application as SignSpeakApplication }

    private val viewModel: GalleryViewModel by viewModels {
        GalleryViewModel.Factory(app.classifier, app.historyRepository, app.preferenceManager)
    }

    private val selectMediaLauncher =
        registerForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
            if (uri != null) {
                try {
                    val inputStream = contentResolver.openInputStream(uri)
                    val bitmap = BitmapFactory.decodeStream(inputStream)
                    inputStream?.close()

                    if (bitmap != null) {
                        binding.ivSelectedMedia.setImageBitmap(bitmap)
                        viewModel.processGalleryBitmap(bitmap)
                    } else {
                        Toast.makeText(this, "Unable to decode selected image", Toast.LENGTH_SHORT).show()
                    }
                } catch (e: Exception) {
                    Toast.makeText(this, "Error loading media: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityGalleryTranslationBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupListeners()
        observeViewModel()
    }

    private fun setupListeners() {
        binding.btnBack.setOnClickListener { finish() }

        binding.btnSelectMedia.setOnClickListener {
            selectMediaLauncher.launch("image/*")
        }

        binding.btnPlayResult.setOnClickListener {
            val text = binding.tvGalleryTranslatedText.text.toString()
            if (text.isNotBlank() && text != getString(R.string.translated_placeholder)) {
                TTSManager.getInstance(this).speak(text)
            }
        }

        binding.btnCopyResult.setOnClickListener {
            val text = binding.tvGalleryTranslatedText.text.toString()
            if (text.isNotBlank() && text != getString(R.string.translated_placeholder)) {
                val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                val clip = ClipData.newPlainText("Sign Translation", text)
                clipboard.setPrimaryClip(clip)
                Toast.makeText(this, R.string.text_copied, Toast.LENGTH_SHORT).show()
            }
        }

        binding.btnShareResult.setOnClickListener {
            val text = binding.tvGalleryTranslatedText.text.toString()
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
        viewModel.pipelineStatus.observe(this) { status ->
            binding.tvPipelineStatus.text = status
        }

        viewModel.isProcessing.observe(this) { isProcessing ->
            binding.pbPipelineProgress.visibility = if (isProcessing) View.VISIBLE else View.GONE
            binding.btnSelectMedia.isEnabled = !isProcessing
        }

        viewModel.result.observe(this) { result ->
            if (result != null) {
                binding.tvSignResult.text = result.signName
                binding.tvGalleryTranslatedText.text = result.translatedText
                binding.tvGalleryConfidence.text = String.format("%.1f%%", result.confidence * 100)
                binding.tvGalleryConfidence.visibility = View.VISIBLE
            }
        }
    }
}

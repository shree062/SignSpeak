package com.signspeak.app.ui.history

import android.app.Dialog
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.Window
import com.signspeak.app.R
import com.signspeak.app.data.local.entity.HistoryEntity
import com.signspeak.app.databinding.DialogHistoryDetailBinding
import com.signspeak.app.tts.TTSManager
import com.signspeak.app.utils.DateUtils

class HistoryDetailDialog(
    context: Context,
    private val item: HistoryEntity
) : Dialog(context) {

    private lateinit var binding: DialogHistoryDetailBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestWindowFeature(Window.FEATURE_NO_TITLE)
        binding = DialogHistoryDetailBinding.inflate(LayoutInflater.from(context))
        setContentView(binding.root)

        window?.setBackgroundDrawableResource(android.R.color.transparent)

        bindData()
        setupActions()
    }

    private fun bindData() {
        binding.tvDetailSignName.text = item.signName
        binding.tvDetailTranslatedText.text = item.translatedText
        binding.tvDetailConfidence.text = String.format("%.1f%%", item.confidence * 100)
        binding.tvDetailInputMode.text = "${item.input} Vision"
        binding.tvDetailTimestamp.text = "Recorded on ${DateUtils.formatHistoryDateTime(item.timestamp)}"
    }

    private fun setupActions() {
        binding.btnClose.setOnClickListener { dismiss() }

        binding.btnDetailPlay.setOnClickListener {
            TTSManager.getInstance(context).speak(item.translatedText)
        }

        binding.btnDetailShare.setOnClickListener {
            val shareIntent = Intent().apply {
                action = Intent.ACTION_SEND
                putExtra(Intent.EXTRA_TEXT, "SignSpeak Translation: \"${item.translatedText}\" (Sign: ${item.signName})")
                type = "text/plain"
            }
            context.startActivity(Intent.createChooser(shareIntent, "Share translation"))
        }
    }
}

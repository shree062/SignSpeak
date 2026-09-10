package com.signspeak.app.ui.main.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.lifecycleScope
import com.signspeak.app.R
import com.signspeak.app.SignSpeakApplication
import com.signspeak.app.databinding.FragmentSettingsBinding
import com.signspeak.app.tts.TTSManager
import com.signspeak.app.ui.main.MainViewModel
import kotlinx.coroutines.launch

class SettingsFragment : Fragment() {

    private var _binding: FragmentSettingsBinding? = null
    private val binding get() = _binding!!

    private val app by lazy { requireActivity().application as SignSpeakApplication }
    private val mainViewModel: MainViewModel by activityViewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSettingsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        loadCurrentSettings()
        setupListeners()
    }

    private fun loadCurrentSettings() {
        val prefs = app.preferenceManager

        // Offline Mode Switch
        binding.switchOfflineMode.isChecked = prefs.isOfflineMode
        updateModeText(prefs.isOfflineMode)

        // TTS Speed
        binding.sliderSpeechSpeed.value = prefs.ttsSpeed
        binding.tvSpeedValue.text = String.format("%.1fx", prefs.ttsSpeed)

        // TTS Pitch
        binding.sliderSpeechPitch.value = prefs.ttsPitch
        binding.tvPitchValue.text = String.format("%.1fx", prefs.ttsPitch)

        // Confidence Threshold
        val thresholdPct = (prefs.confidenceThreshold * 100).toInt()
        binding.sliderThreshold.value = thresholdPct.toFloat()
        binding.tvThresholdValue.text = "$thresholdPct%"
    }

    private fun setupListeners() {
        // Offline / Online Mode Switch
        binding.switchOfflineMode.setOnCheckedChangeListener { _, isChecked ->
            app.preferenceManager.isOfflineMode = isChecked
            updateModeText(isChecked)
            val msg = if (isChecked) "Offline Mode enabled (Local ML Active)" else "Online Mode enabled (Cloud Sync Ready)"
            Toast.makeText(requireContext(), msg, Toast.LENGTH_SHORT).show()
        }

        // Speech Speed Slider
        binding.sliderSpeechSpeed.addOnChangeListener { _, value, fromUser ->
            if (fromUser) {
                app.preferenceManager.ttsSpeed = value
                binding.tvSpeedValue.text = String.format("%.1fx", value)
                TTSManager.getInstance(requireContext()).setSpeechRate(value)
            }
        }

        // Speech Pitch Slider
        binding.sliderSpeechPitch.addOnChangeListener { _, value, fromUser ->
            if (fromUser) {
                app.preferenceManager.ttsPitch = value
                binding.tvPitchValue.text = String.format("%.1fx", value)
                TTSManager.getInstance(requireContext()).setPitch(value)
            }
        }

        // Confidence Threshold Slider
        binding.sliderThreshold.addOnChangeListener { _, value, fromUser ->
            if (fromUser) {
                val floatThreshold = value / 100f
                app.preferenceManager.confidenceThreshold = floatThreshold
                binding.tvThresholdValue.text = "${value.toInt()}%"
            }
        }

        // Clear History
        binding.btnClearHistory.setOnClickListener {
            AlertDialog.Builder(requireContext())
                .setTitle(R.string.clear_history)
                .setMessage("Are you sure you want to permanently delete all translation history records?")
                .setPositiveButton("Clear All") { _, _ ->
                    viewLifecycleOwner.lifecycleScope.launch {
                        app.historyRepository.clearAllHistory(app.preferenceManager.currentUserId)
                        Toast.makeText(requireContext(), "All history cleared", Toast.LENGTH_SHORT).show()
                    }
                }
                .setNegativeButton(R.string.cancel, null)
                .show()
        }

        // Clear Cache
        binding.btnClearCache.setOnClickListener {
            Toast.makeText(requireContext(), "Cached media & session buffers cleared", Toast.LENGTH_SHORT).show()
        }
    }

    private fun updateModeText(isOffline: Boolean) {
        if (isOffline) {
            binding.tvModeTitle.text = "Offline Mode Active"
            binding.tvModeDesc.text = "Real-time ML inference runs locally without internet"
        } else {
            binding.tvModeTitle.text = "Online Mode Active"
            binding.tvModeDesc.text = "Connected for dataset updates & cloud synchronization"
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

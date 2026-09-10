package com.signspeak.app.ui.main.fragments

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.signspeak.app.R
import com.signspeak.app.databinding.FragmentHomeBinding
import com.signspeak.app.tts.TTSManager
import com.signspeak.app.ui.camera.CameraTranslationActivity
import com.signspeak.app.ui.gallery.GalleryTranslationActivity
import com.signspeak.app.ui.history.HistoryAdapter
import com.signspeak.app.ui.history.HistoryDetailDialog
import com.signspeak.app.ui.main.MainActivity
import com.signspeak.app.ui.main.MainViewModel

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    private val mainViewModel: MainViewModel by activityViewModels()
    private lateinit var historyAdapter: HistoryAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecyclerView()
        setupListeners()
        observeData()
    }

    private fun setupRecyclerView() {
        historyAdapter = HistoryAdapter(
            onItemClick = { item ->
                HistoryDetailDialog(requireContext(), item).show()
            },
            onFavoriteToggle = { item ->
                mainViewModel.toggleFavorite(item)
            },
            onDeleteClick = { item ->
                mainViewModel.deleteHistory(item.historyId)
                Toast.makeText(requireContext(), "Record removed", Toast.LENGTH_SHORT).show()
            }
        )

        binding.rvRecentTranslations.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = historyAdapter
        }
    }

    private fun setupListeners() {
        // Tap camera placeholder to start camera recognition
        binding.layoutStartCameraPlaceholder.setOnClickListener {
            startActivity(Intent(requireContext(), CameraTranslationActivity::class.java))
        }

        binding.btnQuickCamera.setOnClickListener {
            startActivity(Intent(requireContext(), CameraTranslationActivity::class.java))
        }

        binding.btnQuickGallery.setOnClickListener {
            startActivity(Intent(requireContext(), GalleryTranslationActivity::class.java))
        }

        // Action Buttons on Output Box
        binding.btnCopyText.setOnClickListener {
            val text = binding.tvTranslatedText.text.toString()
            if (text.isNotBlank() && text != getString(R.string.translated_placeholder)) {
                val clipboard = requireContext().getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                val clip = ClipData.newPlainText("SignSpeak Translation", text)
                clipboard.setPrimaryClip(clip)
                Toast.makeText(requireContext(), R.string.text_copied, Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(requireContext(), "No translated text to copy", Toast.LENGTH_SHORT).show()
            }
        }

        binding.btnPlaySpeech.setOnClickListener {
            val text = binding.tvTranslatedText.text.toString()
            if (text.isNotBlank() && text != getString(R.string.translated_placeholder)) {
                TTSManager.getInstance(requireContext()).speak(text)
            } else {
                TTSManager.getInstance(requireContext()).speak("Hello! Welcome to SignSpeak.")
            }
        }

        binding.btnShareText.setOnClickListener {
            val text = binding.tvTranslatedText.text.toString()
            if (text.isNotBlank() && text != getString(R.string.translated_placeholder)) {
                val shareIntent = Intent().apply {
                    action = Intent.ACTION_SEND
                    putExtra(Intent.EXTRA_TEXT, "SignSpeak Translation: $text")
                    type = "text/plain"
                }
                startActivity(Intent.createChooser(shareIntent, "Share Translation"))
            } else {
                Toast.makeText(requireContext(), "No translated text to share", Toast.LENGTH_SHORT).show()
            }
        }

        // 4 Quick Feature Cards Navigation
        binding.cardQuickHistory.setOnClickListener {
            (activity as? MainActivity)?.navigateToTab(R.id.nav_history)
        }

        binding.cardQuickFavorites.setOnClickListener {
            (activity as? MainActivity)?.navigateToFragment(FavoritesFragment())
        }

        binding.cardQuickLearn.setOnClickListener {
            (activity as? MainActivity)?.navigateToTab(R.id.nav_learn)
        }

        binding.cardQuickSettings.setOnClickListener {
            (activity as? MainActivity)?.navigateToFragment(SettingsFragment())
        }

        binding.tvViewAllHistory.setOnClickListener {
            (activity as? MainActivity)?.navigateToTab(R.id.nav_history)
        }
    }

    private fun observeData() {
        mainViewModel.recentHistory.observe(viewLifecycleOwner) { list ->
            if (list.isNullOrEmpty()) {
                binding.tvNoRecentTranslations.visibility = View.VISIBLE
                binding.rvRecentTranslations.visibility = View.GONE
            } else {
                binding.tvNoRecentTranslations.visibility = View.GONE
                binding.rvRecentTranslations.visibility = View.VISIBLE
                historyAdapter.submitList(list)

                // Populate translation output box with latest translated record
                val latest = list.first()
                binding.tvTranslatedText.text = latest.translatedText
            }
        }

        mainViewModel.currentTranslatedText.observe(viewLifecycleOwner) { text ->
            if (text.isNotBlank()) {
                binding.tvTranslatedText.text = text
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

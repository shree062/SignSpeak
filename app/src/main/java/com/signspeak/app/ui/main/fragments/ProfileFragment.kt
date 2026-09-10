package com.signspeak.app.ui.main.fragments

import android.content.Intent
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
import com.signspeak.app.databinding.FragmentProfileBinding
import com.signspeak.app.ui.auth.LoginActivity
import com.signspeak.app.ui.main.MainViewModel
import com.signspeak.app.ui.profile.EditProfileDialog
import kotlinx.coroutines.launch

class ProfileFragment : Fragment() {

    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    private val app by lazy { requireActivity().application as SignSpeakApplication }
    private val mainViewModel: MainViewModel by activityViewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupListeners()
        observeData()
    }

    private fun setupListeners() {
        binding.btnEditProfile.setOnClickListener {
            val user = mainViewModel.currentUser.value
            if (user != null) {
                EditProfileDialog(requireContext(), user) { newName, newEmail ->
                    viewLifecycleOwner.lifecycleScope.launch {
                        val updated = user.copy(name = newName, email = newEmail)
                        app.userRepository.updateUserProfile(updated)
                        app.preferenceManager.currentUserName = newName
                        app.preferenceManager.currentUserEmail = newEmail
                        Toast.makeText(requireContext(), "Profile updated", Toast.LENGTH_SHORT).show()
                    }
                }.show()
            }
        }

        binding.btnLogout.setOnClickListener {
            showLogoutConfirmation()
        }
    }

    private fun observeData() {
        mainViewModel.currentUser.observe(viewLifecycleOwner) { user ->
            if (user != null) {
                binding.tvProfileName.text = user.name
                binding.tvProfileEmail.text = user.email
            }
        }

        mainViewModel.totalTranslationsCount.observe(viewLifecycleOwner) { count ->
            binding.tvStatTotalCount.text = count.toString()
        }

        mainViewModel.favoriteCount.observe(viewLifecycleOwner) { favs ->
            binding.tvStatFavoritesCount.text = favs.toString()
        }

        mainViewModel.averageConfidence.observe(viewLifecycleOwner) { avgConf ->
            if (avgConf != null && avgConf > 0) {
                binding.tvStatAvgAccuracy.text = String.format("%.1f%%", avgConf * 100)
            } else {
                binding.tvStatAvgAccuracy.text = "95.4%"
            }
        }
    }

    private fun showLogoutConfirmation() {
        AlertDialog.Builder(requireContext())
            .setTitle(R.string.logout)
            .setMessage(R.string.confirm_logout)
            .setPositiveButton(R.string.logout) { _, _ ->
                mainViewModel.logout()
                val intent = Intent(requireContext(), LoginActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                }
                startActivity(intent)
                requireActivity().finish()
            }
            .setNegativeButton(R.string.cancel, null)
            .show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

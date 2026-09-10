package com.signspeak.app.ui.main

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.signspeak.app.R
import com.signspeak.app.SignSpeakApplication
import com.signspeak.app.databinding.ActivityMainBinding
import com.signspeak.app.ui.camera.CameraTranslationActivity
import com.signspeak.app.ui.main.fragments.HistoryFragment
import com.signspeak.app.ui.main.fragments.HomeFragment
import com.signspeak.app.ui.main.fragments.LearnSignsFragment
import com.signspeak.app.ui.main.fragments.ProfileFragment
import com.signspeak.app.ui.main.fragments.SettingsFragment

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val app by lazy { application as SignSpeakApplication }

    val viewModel: MainViewModel by viewModels {
        MainViewModel.Factory(
            app.userRepository,
            app.historyRepository,
            app.preferenceManager,
            app.networkMonitor
        )
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupBottomNavigation()
        setupTopBar()
        observeNetworkStatus()

        // Load default fragment if first time
        if (savedInstanceState == null) {
            loadFragment(HomeFragment(), false)
        }
    }

    private fun setupTopBar() {
        binding.btnMenu.setOnClickListener {
            navigateToFragment(SettingsFragment())
        }

        binding.btnNotification.setOnClickListener {
            Toast.makeText(this, "No new notifications", Toast.LENGTH_SHORT).show()
        }
    }

    private fun setupBottomNavigation() {
        binding.bottomNavigationView.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> {
                    loadFragment(HomeFragment(), false)
                    true
                }
                R.id.nav_translate -> {
                    // Launch Live Camera Translation Activity
                    startActivity(Intent(this, CameraTranslationActivity::class.java))
                    false
                }
                R.id.nav_history -> {
                    loadFragment(HistoryFragment(), false)
                    true
                }
                R.id.nav_learn -> {
                    loadFragment(LearnSignsFragment(), false)
                    true
                }
                R.id.nav_profile -> {
                    loadFragment(ProfileFragment(), false)
                    true
                }
                else -> false
            }
        }
    }

    private fun observeNetworkStatus() {
        viewModel.isOnline.observe(this) { isConnected ->
            if (isConnected && !app.preferenceManager.isOfflineMode) {
                binding.layoutStatusBadge.setBackgroundResource(R.drawable.bg_tag_online)
                binding.viewStatusDot.backgroundTintList = getColorStateList(R.color.status_online)
                binding.tvStatusText.text = getString(R.string.status_online_label)
                binding.tvStatusText.setTextColor(getColor(R.color.status_online))
            } else {
                binding.layoutStatusBadge.setBackgroundResource(R.drawable.bg_tag_offline)
                binding.viewStatusDot.backgroundTintList = getColorStateList(R.color.status_offline)
                binding.tvStatusText.text = getString(R.string.status_offline_label)
                binding.tvStatusText.setTextColor(getColor(R.color.status_offline))
            }
        }
    }

    fun loadFragment(fragment: Fragment, addToBackStack: Boolean = true) {
        val transaction = supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)

        if (addToBackStack) {
            transaction.addToBackStack(null)
        }
        transaction.commit()
    }

    fun navigateToFragment(fragment: Fragment) {
        loadFragment(fragment, true)
    }

    fun navigateToTab(menuItemId: Int) {
        binding.bottomNavigationView.selectedItemId = menuItemId
    }
}

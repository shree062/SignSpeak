package com.signspeak.app.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.signspeak.app.SignSpeakApplication
import com.signspeak.app.databinding.ActivityLoginBinding
import com.signspeak.app.ui.main.MainActivity

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private val app by lazy { application as SignSpeakApplication }

    private val viewModel: AuthViewModel by viewModels {
        AuthViewModel.Factory(app.userRepository, app.preferenceManager)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Check if user is already logged in
        if (viewModel.checkAutoLogin()) {
            navigateToMain()
            return
        }

        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupListeners()
        observeViewModel()
    }

    private fun setupListeners() {
        binding.btnLogin.setOnClickListener {
            val emailOrUser = binding.etEmail.text?.toString()?.trim().orEmpty()
            val password = binding.etPassword.text?.toString()?.trim().orEmpty()
            viewModel.login(emailOrUser, password)
        }

        binding.btnGoogleLogin.setOnClickListener {
            viewModel.loginWithSocial("Google")
        }

        binding.btnFacebookLogin.setOnClickListener {
            viewModel.loginWithSocial("Facebook")
        }

        binding.tvForgotPassword.setOnClickListener {
            startActivity(Intent(this, ForgotPasswordActivity::class.java))
        }

        binding.tvSignUpLink.setOnClickListener {
            startActivity(Intent(this, SignUpActivity::class.java))
        }
    }

    private fun observeViewModel() {
        viewModel.authState.observe(this) { state ->
            when (state) {
                is AuthState.Loading -> {
                    binding.btnLogin.isEnabled = false
                    binding.btnLogin.text = "Logging in…"
                }
                is AuthState.Success -> {
                    binding.btnLogin.isEnabled = true
                    binding.btnLogin.text = "Login"
                    Toast.makeText(this, "Welcome back, ${state.user.name}!", Toast.LENGTH_SHORT).show()
                    navigateToMain()
                }
                is AuthState.Error -> {
                    binding.btnLogin.isEnabled = true
                    binding.btnLogin.text = "Login"
                    Toast.makeText(this, state.message, Toast.LENGTH_LONG).show()
                }
                AuthState.Idle -> {
                    binding.btnLogin.isEnabled = true
                    binding.btnLogin.text = "Login"
                }
            }
        }
    }

    private fun navigateToMain() {
        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        startActivity(intent)
        finish()
    }
}

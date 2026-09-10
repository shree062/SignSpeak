package com.signspeak.app.ui.auth

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.signspeak.app.SignSpeakApplication
import com.signspeak.app.databinding.ActivitySignupBinding
import com.signspeak.app.ui.main.MainActivity

class SignUpActivity : AppCompatActivity() {

    private lateinit var binding: ActivitySignupBinding
    private val app by lazy { application as SignSpeakApplication }

    private val viewModel: AuthViewModel by viewModels {
        AuthViewModel.Factory(app.userRepository, app.preferenceManager)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySignupBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupListeners()
        observeViewModel()
    }

    private fun setupListeners() {
        binding.btnBack.setOnClickListener { finish() }

        binding.btnSignUp.setOnClickListener {
            val name = binding.etFullName.text?.toString()?.trim().orEmpty()
            val email = binding.etEmail.text?.toString()?.trim().orEmpty()
            val pass = binding.etPassword.text?.toString()?.trim().orEmpty()
            val confirm = binding.etConfirmPassword.text?.toString()?.trim().orEmpty()

            viewModel.signUp(name, email, pass, confirm)
        }

        binding.tvLoginLink.setOnClickListener { finish() }
    }

    private fun observeViewModel() {
        viewModel.authState.observe(this) { state ->
            when (state) {
                is AuthState.Loading -> {
                    binding.btnSignUp.isEnabled = false
                    binding.btnSignUp.text = "Creating Account…"
                }
                is AuthState.Success -> {
                    binding.btnSignUp.isEnabled = true
                    binding.btnSignUp.text = "Sign Up"
                    Toast.makeText(this, "Account created successfully!", Toast.LENGTH_SHORT).show()
                    val intent = Intent(this, MainActivity::class.java).apply {
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    }
                    startActivity(intent)
                    finish()
                }
                is AuthState.Error -> {
                    binding.btnSignUp.isEnabled = true
                    binding.btnSignUp.text = "Sign Up"
                    Toast.makeText(this, state.message, Toast.LENGTH_LONG).show()
                }
                AuthState.Idle -> {
                    binding.btnSignUp.isEnabled = true
                    binding.btnSignUp.text = "Sign Up"
                }
            }
        }
    }
}

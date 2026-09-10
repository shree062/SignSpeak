package com.signspeak.app.ui.auth

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.signspeak.app.databinding.ActivityForgotPasswordBinding

class ForgotPasswordActivity : AppCompatActivity() {

    private lateinit var binding: ActivityForgotPasswordBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityForgotPasswordBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnBack.setOnClickListener { finish() }
        binding.tvBackToLogin.setOnClickListener { finish() }

        binding.btnSendReset.setOnClickListener {
            val email = binding.etEmail.text?.toString()?.trim().orEmpty()
            if (email.isBlank() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                Toast.makeText(this, "Please enter a valid email address", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            Toast.makeText(
                this,
                "Password reset link sent to $email. Please check your inbox.",
                Toast.LENGTH_LONG
            ).show()
            finish()
        }
    }
}

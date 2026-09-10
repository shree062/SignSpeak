package com.signspeak.app.ui.profile

import android.app.Dialog
import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.Window
import android.widget.Toast
import com.signspeak.app.data.local.entity.UserEntity
import com.signspeak.app.databinding.DialogEditProfileBinding

class EditProfileDialog(
    context: Context,
    private val currentUser: UserEntity,
    private val onSave: (name: String, email: String) -> Unit
) : Dialog(context) {

    private lateinit var binding: DialogEditProfileBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestWindowFeature(Window.FEATURE_NO_TITLE)
        binding = DialogEditProfileBinding.inflate(LayoutInflater.from(context))
        setContentView(binding.root)

        window?.setBackgroundDrawableResource(android.R.color.transparent)

        binding.etEditName.setText(currentUser.name)
        binding.etEditEmail.setText(currentUser.email)

        binding.btnCancelEdit.setOnClickListener { dismiss() }

        binding.btnSaveProfile.setOnClickListener {
            val name = binding.etEditName.text?.toString()?.trim().orEmpty()
            val email = binding.etEditEmail.text?.toString()?.trim().orEmpty()

            if (name.isBlank() || email.isBlank()) {
                Toast.makeText(context, "Name and Email cannot be empty", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            onSave(name, email)
            dismiss()
        }
    }
}

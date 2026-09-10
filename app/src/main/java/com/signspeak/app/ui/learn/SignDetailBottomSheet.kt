package com.signspeak.app.ui.learn

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.signspeak.app.data.local.entity.SignEntity
import com.signspeak.app.databinding.DialogSignDetailBinding
import com.signspeak.app.tts.TTSManager

class SignDetailBottomSheet(private val sign: SignEntity) : BottomSheetDialogFragment() {

    private var _binding: DialogSignDetailBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = DialogSignDetailBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.tvSignDetailName.text = sign.signName
        binding.tvSignDetailCategory.text = sign.category
        binding.tvSignDetailInstructions.text = sign.instructions
        binding.tvSignDetailExample.text = sign.exampleUsage

        binding.btnSignDetailPlayTts.setOnClickListener {
            TTSManager.getInstance(requireContext()).speak(sign.signName)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    companion object {
        const val TAG = "SignDetailBottomSheet"
        fun newInstance(sign: SignEntity) = SignDetailBottomSheet(sign)
    }
}

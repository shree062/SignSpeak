package com.signspeak.app.ui.main.fragments

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.GridLayoutManager
import com.signspeak.app.R
import com.signspeak.app.SignSpeakApplication
import com.signspeak.app.databinding.FragmentLearnSignsBinding
import com.signspeak.app.ui.learn.LearnSignsAdapter
import com.signspeak.app.ui.learn.LearnViewModel
import com.signspeak.app.ui.learn.SignDetailBottomSheet

class LearnSignsFragment : Fragment() {

    private var _binding: FragmentLearnSignsBinding? = null
    private val binding get() = _binding!!

    private val app by lazy { requireActivity().application as SignSpeakApplication }
    private val viewModel: LearnViewModel by viewModels {
        LearnViewModel.Factory(app.signRepository)
    }

    private lateinit var adapter: LearnSignsAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentLearnSignsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecyclerView()
        setupCategoryChips()
        setupSearch()
        observeData()
    }

    private fun setupRecyclerView() {
        adapter = LearnSignsAdapter { sign ->
            SignDetailBottomSheet.newInstance(sign)
                .show(childFragmentManager, SignDetailBottomSheet.TAG)
        }

        binding.rvSigns.apply {
            layoutManager = GridLayoutManager(requireContext(), 2)
            adapter = this@LearnSignsFragment.adapter
        }
    }

    private fun setupCategoryChips() {
        binding.chipGroupCategories.setOnCheckedStateChangeListener { _, checkedIds ->
            if (checkedIds.isEmpty()) return@setOnCheckedStateChangeListener

            val category = when (checkedIds.first()) {
                R.id.chipCategoryAll -> "All"
                R.id.chipCategoryGreetings -> "Greetings"
                R.id.chipCategoryPhrases -> "Common Phrases"
                R.id.chipCategoryEmergency -> "Emergency"
                R.id.chipCategoryDaily -> "Daily Life"
                else -> "All"
            }
            viewModel.setCategory(category)
        }
    }

    private fun setupSearch() {
        binding.etSearchSigns.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val query = s?.toString()?.trim().orEmpty()
                binding.btnClearSearch.visibility = if (query.isNotEmpty()) View.VISIBLE else View.GONE
                viewModel.setSearchQuery(query)
            }
            override fun afterTextChanged(s: Editable?) {}
        })

        binding.btnClearSearch.setOnClickListener {
            binding.etSearchSigns.setText("")
        }
    }

    private fun observeData() {
        viewModel.signsList.observe(viewLifecycleOwner) { list ->
            val query = viewModel.searchQuery.value.orEmpty()
            val filtered = if (query.isBlank()) {
                list
            } else {
                list.filter {
                    it.signName.contains(query, ignoreCase = true) ||
                            it.description.contains(query, ignoreCase = true)
                }
            }
            adapter.submitList(filtered)
        }

        viewModel.searchQuery.observe(viewLifecycleOwner) { query ->
            val fullList = viewModel.signsList.value.orEmpty()
            val filtered = if (query.isBlank()) {
                fullList
            } else {
                fullList.filter {
                    it.signName.contains(query, ignoreCase = true) ||
                            it.description.contains(query, ignoreCase = true)
                }
            }
            adapter.submitList(filtered)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

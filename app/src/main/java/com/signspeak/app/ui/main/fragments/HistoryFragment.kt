package com.signspeak.app.ui.main.fragments

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.signspeak.app.R
import com.signspeak.app.SignSpeakApplication
import com.signspeak.app.databinding.FragmentHistoryBinding
import com.signspeak.app.ui.history.HistoryAdapter
import com.signspeak.app.ui.history.HistoryDetailDialog
import com.signspeak.app.ui.history.HistoryFilter
import com.signspeak.app.ui.history.HistoryViewModel

class HistoryFragment : Fragment() {

    private var _binding: FragmentHistoryBinding? = null
    private val binding get() = _binding!!

    private val app by lazy { requireActivity().application as SignSpeakApplication }
    private val viewModel: HistoryViewModel by viewModels {
        HistoryViewModel.Factory(app.historyRepository, app.preferenceManager)
    }

    private lateinit var adapter: HistoryAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHistoryBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecyclerView()
        setupFilters()
        setupSearch()
        observeData()
    }

    private fun setupRecyclerView() {
        adapter = HistoryAdapter(
            onItemClick = { item ->
                HistoryDetailDialog(requireContext(), item).show()
            },
            onFavoriteToggle = { item ->
                viewModel.toggleFavorite(item)
            },
            onDeleteClick = { item ->
                viewModel.deleteHistory(item.historyId)
                Toast.makeText(requireContext(), "Translation deleted", Toast.LENGTH_SHORT).show()
            }
        )

        binding.rvHistory.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = this@HistoryFragment.adapter
        }
    }

    private fun setupFilters() {
        binding.chipGroupFilters.setOnCheckedStateChangeListener { _, checkedIds ->
            if (checkedIds.isEmpty()) return@setOnCheckedStateChangeListener

            when (checkedIds.first()) {
                R.id.chipFilterAll -> viewModel.setFilter(HistoryFilter.ALL)
                R.id.chipFilterFavorites -> viewModel.setFilter(HistoryFilter.FAVORITES)
                R.id.chipFilterToday -> viewModel.setFilter(HistoryFilter.TODAY)
                R.id.chipFilterThisWeek -> viewModel.setFilter(HistoryFilter.THIS_WEEK)
                R.id.chipFilterThisMonth -> viewModel.setFilter(HistoryFilter.THIS_MONTH)
            }
        }
    }

    private fun setupSearch() {
        binding.etSearchHistory.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val query = s?.toString()?.trim().orEmpty()
                binding.btnClearSearch.visibility = if (query.isNotEmpty()) View.VISIBLE else View.GONE
                viewModel.setSearchQuery(query)
            }
            override fun afterTextChanged(s: Editable?) {}
        })

        binding.btnClearSearch.setOnClickListener {
            binding.etSearchHistory.setText("")
        }
    }

    private fun observeData() {
        viewModel.historyList.observe(viewLifecycleOwner) { list ->
            val query = viewModel.searchQuery.value.orEmpty()
            val filtered = if (query.isBlank()) {
                list
            } else {
                list.filter {
                    it.translatedText.contains(query, ignoreCase = true) ||
                            it.signName.contains(query, ignoreCase = true)
                }
            }

            if (filtered.isNullOrEmpty()) {
                binding.layoutEmptyHistory.visibility = View.VISIBLE
                binding.rvHistory.visibility = View.GONE
            } else {
                binding.layoutEmptyHistory.visibility = View.GONE
                binding.rvHistory.visibility = View.VISIBLE
                adapter.submitList(filtered)
            }
        }

        viewModel.searchQuery.observe(viewLifecycleOwner) { query ->
            val fullList = viewModel.historyList.value.orEmpty()
            val filtered = if (query.isBlank()) {
                fullList
            } else {
                fullList.filter {
                    it.translatedText.contains(query, ignoreCase = true) ||
                            it.signName.contains(query, ignoreCase = true)
                }
            }

            if (filtered.isEmpty()) {
                binding.layoutEmptyHistory.visibility = View.VISIBLE
                binding.rvHistory.visibility = View.GONE
            } else {
                binding.layoutEmptyHistory.visibility = View.GONE
                binding.rvHistory.visibility = View.VISIBLE
                adapter.submitList(filtered)
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

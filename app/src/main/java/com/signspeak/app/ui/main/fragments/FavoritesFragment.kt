package com.signspeak.app.ui.main.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.signspeak.app.SignSpeakApplication
import com.signspeak.app.databinding.FragmentFavoritesBinding
import com.signspeak.app.ui.history.HistoryAdapter
import com.signspeak.app.ui.history.HistoryDetailDialog
import com.signspeak.app.ui.history.HistoryViewModel

class FavoritesFragment : Fragment() {

    private var _binding: FragmentFavoritesBinding? = null
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
        _binding = FragmentFavoritesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        adapter = HistoryAdapter(
            onItemClick = { item ->
                HistoryDetailDialog(requireContext(), item).show()
            },
            onFavoriteToggle = { item ->
                viewModel.toggleFavorite(item)
            },
            onDeleteClick = { item ->
                viewModel.deleteHistory(item.historyId)
                Toast.makeText(requireContext(), "Removed from favorites", Toast.LENGTH_SHORT).show()
            }
        )

        binding.rvFavorites.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = this@FavoritesFragment.adapter
        }

        viewModel.favoritesOnlyList.observe(viewLifecycleOwner) { favorites ->
            if (favorites.isNullOrEmpty()) {
                binding.layoutEmptyFavorites.visibility = View.VISIBLE
                binding.rvFavorites.visibility = View.GONE
            } else {
                binding.layoutEmptyFavorites.visibility = View.GONE
                binding.rvFavorites.visibility = View.VISIBLE
                adapter.submitList(favorites)
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

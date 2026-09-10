package com.signspeak.app.ui.history

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.PopupMenu
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.signspeak.app.R
import com.signspeak.app.data.local.entity.HistoryEntity
import com.signspeak.app.databinding.ItemHistoryBinding
import com.signspeak.app.tts.TTSManager
import com.signspeak.app.utils.DateUtils

class HistoryAdapter(
    private val onItemClick: (HistoryEntity) -> Unit,
    private val onFavoriteToggle: (HistoryEntity) -> Unit,
    private val onDeleteClick: (HistoryEntity) -> Unit
) : ListAdapter<HistoryEntity, HistoryAdapter.HistoryViewHolder>(DiffCallback) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): HistoryViewHolder {
        val binding = ItemHistoryBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return HistoryViewHolder(binding)
    }

    override fun onBindViewHolder(holder: HistoryViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class HistoryViewHolder(private val binding: ItemHistoryBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(item: HistoryEntity) {
            binding.tvTranslatedText.text = item.translatedText
            binding.tvDateTime.text = DateUtils.formatHistoryDateTime(item.timestamp)
            binding.tvInputMode.text = item.input

            // Favorite Icon state
            if (item.isFavorite) {
                binding.btnFavorite.setImageResource(R.drawable.ic_favorite_filled)
                binding.btnFavorite.setColorFilter(binding.root.context.getColor(R.color.card_favorites_accent))
            } else {
                binding.btnFavorite.setImageResource(R.drawable.ic_favorite)
                binding.btnFavorite.setColorFilter(binding.root.context.getColor(R.color.text_hint))
            }

            // Click listener for whole item card
            binding.root.setOnClickListener {
                onItemClick(item)
            }

            // Favorite Toggle Button
            binding.btnFavorite.setOnClickListener {
                onFavoriteToggle(item)
            }

            // Play TTS Speech
            binding.btnPlayTts.setOnClickListener {
                TTSManager.getInstance(binding.root.context).speak(item.translatedText)
            }

            // 3-dot overflow menu
            binding.btnMoreOptions.setOnClickListener { view ->
                showPopupMenu(view, item)
            }
        }

        private fun showPopupMenu(view: View, item: HistoryEntity) {
            val popup = PopupMenu(view.context, view)
            popup.inflate(R.menu.history_item_menu)

            // Update favorite title in menu
            val favItem = popup.menu.findItem(R.id.action_toggle_favorite)
            favItem.title = if (item.isFavorite) {
                view.context.getString(R.string.menu_unfavorite)
            } else {
                view.context.getString(R.string.menu_favorite)
            }

            popup.setOnMenuItemClickListener { menuItem ->
                when (menuItem.itemId) {
                    R.id.action_view_details -> {
                        onItemClick(item)
                        true
                    }
                    R.id.action_toggle_favorite -> {
                        onFavoriteToggle(item)
                        true
                    }
                    R.id.action_delete -> {
                        onDeleteClick(item)
                        true
                    }
                    else -> false
                }
            }
            popup.show()
        }
    }

    companion object DiffCallback : DiffUtil.ItemCallback<HistoryEntity>() {
        override fun areItemsTheSame(oldItem: HistoryEntity, newItem: HistoryEntity): Boolean {
            return oldItem.historyId == newItem.historyId
        }

        override fun areContentsTheSame(oldItem: HistoryEntity, newItem: HistoryEntity): Boolean {
            return oldItem == newItem
        }
    }
}

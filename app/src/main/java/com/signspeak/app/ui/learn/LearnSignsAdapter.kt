package com.signspeak.app.ui.learn

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.signspeak.app.data.local.entity.SignEntity
import com.signspeak.app.databinding.ItemSignBinding

class LearnSignsAdapter(
    private val onSignClick: (SignEntity) -> Unit
) : ListAdapter<SignEntity, LearnSignsAdapter.SignViewHolder>(DiffCallback) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SignViewHolder {
        val binding = ItemSignBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return SignViewHolder(binding)
    }

    override fun onBindViewHolder(holder: SignViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class SignViewHolder(private val binding: ItemSignBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(item: SignEntity) {
            binding.tvSignName.text = item.signName
            binding.tvSignDesc.text = item.description
            binding.tvSignCategoryBadge.text = item.category

            binding.root.setOnClickListener { onSignClick(item) }
            binding.btnViewSign.setOnClickListener { onSignClick(item) }
        }
    }

    companion object DiffCallback : DiffUtil.ItemCallback<SignEntity>() {
        override fun areItemsTheSame(oldItem: SignEntity, newItem: SignEntity): Boolean {
            return oldItem.signId == newItem.signId
        }

        override fun areContentsTheSame(oldItem: SignEntity, newItem: SignEntity): Boolean {
            return oldItem == newItem
        }
    }
}

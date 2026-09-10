package com.signspeak.app.ui.learn

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.asLiveData
import androidx.lifecycle.switchMap
import com.signspeak.app.data.local.entity.SignEntity
import com.signspeak.app.data.repository.SignRepository

class LearnViewModel(private val signRepository: SignRepository) : ViewModel() {

    private val _selectedCategory = MutableLiveData<String>("All")
    val selectedCategory: LiveData<String> = _selectedCategory

    private val _searchQuery = MutableLiveData<String>("")
    val searchQuery: LiveData<String> = _searchQuery

    val signsList: LiveData<List<SignEntity>> = _selectedCategory.switchMap { category ->
        if (category == "All" || category.isBlank()) {
            signRepository.getAllSigns().asLiveData()
        } else {
            signRepository.getSignsByCategory(category).asLiveData()
        }
    }

    fun setCategory(category: String) {
        _selectedCategory.value = category
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    class Factory(private val signRepository: SignRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return LearnViewModel(signRepository) as T
        }
    }
}

package com.signspeak.app.ui.history

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.asLiveData
import androidx.lifecycle.switchMap
import androidx.lifecycle.viewModelScope
import com.signspeak.app.data.local.entity.HistoryEntity
import com.signspeak.app.data.pref.PreferenceManager
import com.signspeak.app.data.repository.HistoryRepository
import com.signspeak.app.utils.DateUtils
import kotlinx.coroutines.launch

enum class HistoryFilter {
    ALL, FAVORITES, TODAY, THIS_WEEK, THIS_MONTH
}

class HistoryViewModel(
    private val historyRepository: HistoryRepository,
    private val preferenceManager: PreferenceManager
) : ViewModel() {

    val currentUserId: Long get() = preferenceManager.currentUserId

    private val _currentFilter = MutableLiveData(HistoryFilter.ALL)
    val currentFilter: LiveData<HistoryFilter> = _currentFilter

    private val _searchQuery = MutableLiveData("")
    val searchQuery: LiveData<String> = _searchQuery

    // Filtered / Searched History stream
    val historyList: LiveData<List<HistoryEntity>> = _currentFilter.switchMap { filter ->
        when (filter) {
            HistoryFilter.ALL -> historyRepository.getAllHistory(currentUserId).asLiveData()
            HistoryFilter.FAVORITES -> historyRepository.getFavoriteHistory(currentUserId).asLiveData()
            HistoryFilter.TODAY -> historyRepository.getHistorySince(currentUserId, DateUtils.getStartOfToday()).asLiveData()
            HistoryFilter.THIS_WEEK -> historyRepository.getHistorySince(currentUserId, DateUtils.getStartOfThisWeek()).asLiveData()
            HistoryFilter.THIS_MONTH -> historyRepository.getHistorySince(currentUserId, DateUtils.getStartOfThisMonth()).asLiveData()
        }
    }

    val favoritesOnlyList: LiveData<List<HistoryEntity>> =
        historyRepository.getFavoriteHistory(currentUserId).asLiveData()

    fun setFilter(filter: HistoryFilter) {
        _currentFilter.value = filter
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun toggleFavorite(history: HistoryEntity) {
        viewModelScope.launch {
            historyRepository.toggleFavorite(history)
        }
    }

    fun deleteHistory(historyId: Long) {
        viewModelScope.launch {
            historyRepository.deleteHistory(historyId)
        }
    }

    class Factory(
        private val historyRepository: HistoryRepository,
        private val preferenceManager: PreferenceManager
    ) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return HistoryViewModel(historyRepository, preferenceManager) as T
        }
    }
}

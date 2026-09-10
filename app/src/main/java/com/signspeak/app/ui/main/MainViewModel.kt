package com.signspeak.app.ui.main

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.asLiveData
import androidx.lifecycle.viewModelScope
import com.signspeak.app.data.local.entity.HistoryEntity
import com.signspeak.app.data.pref.PreferenceManager
import com.signspeak.app.data.repository.HistoryRepository
import com.signspeak.app.data.repository.UserRepository
import com.signspeak.app.utils.NetworkMonitor
import kotlinx.coroutines.launch

class MainViewModel(
    private val userRepository: UserRepository,
    private val historyRepository: HistoryRepository,
    private val preferenceManager: PreferenceManager,
    private val networkMonitor: NetworkMonitor
) : ViewModel() {

    val currentUserId: Long get() = preferenceManager.currentUserId
    val isOnline: LiveData<Boolean> = networkMonitor.isConnected.asLiveData()
    val isOfflineModeSetting: Boolean get() = preferenceManager.isOfflineMode

    val currentUser = userRepository.getUser(currentUserId).asLiveData()
    val recentHistory: LiveData<List<HistoryEntity>> =
        historyRepository.getRecentHistory(currentUserId, 5).asLiveData()

    val totalTranslationsCount: LiveData<Int> =
        historyRepository.getTotalCount(currentUserId).asLiveData()

    val favoriteCount: LiveData<Int> =
        historyRepository.getFavoriteCount(currentUserId).asLiveData()

    val averageConfidence: LiveData<Float?> =
        historyRepository.getAverageConfidence(currentUserId).asLiveData()

    private val _currentTranslatedText = MutableLiveData<String>("")
    val currentTranslatedText: LiveData<String> = _currentTranslatedText

    fun setTranslatedText(text: String) {
        _currentTranslatedText.value = text
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

    fun logout() {
        preferenceManager.clearSession()
    }

    class Factory(
        private val userRepository: UserRepository,
        private val historyRepository: HistoryRepository,
        private val preferenceManager: PreferenceManager,
        private val networkMonitor: NetworkMonitor
    ) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return MainViewModel(userRepository, historyRepository, preferenceManager, networkMonitor) as T
        }
    }
}

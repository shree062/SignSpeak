package com.signspeak.app.data.repository

import com.signspeak.app.data.local.dao.HistoryDao
import com.signspeak.app.data.local.entity.HistoryEntity
import kotlinx.coroutines.flow.Flow

class HistoryRepository(private val historyDao: HistoryDao) {

    suspend fun insertHistory(
        userId: Long,
        input: String,
        signName: String,
        translatedText: String,
        confidence: Float,
        isFavorite: Boolean = false,
        thumbnailPath: String? = null
    ): Long {
        val record = HistoryEntity(
            userId = userId,
            input = input,
            signName = signName,
            translatedText = translatedText,
            confidence = confidence,
            timestamp = System.currentTimeMillis(),
            isFavorite = isFavorite,
            thumbnailPath = thumbnailPath
        )
        return historyDao.insertHistory(record)
    }

    suspend fun updateHistory(history: HistoryEntity) {
        historyDao.updateHistory(history)
    }

    suspend fun toggleFavorite(history: HistoryEntity) {
        historyDao.updateHistory(history.copy(isFavorite = !history.isFavorite))
    }

    suspend fun deleteHistory(historyId: Long) {
        historyDao.deleteHistoryById(historyId)
    }

    suspend fun clearAllHistory(userId: Long) {
        historyDao.clearHistoryByUser(userId)
    }

    fun getAllHistory(userId: Long): Flow<List<HistoryEntity>> {
        return historyDao.getAllHistory(userId)
    }

    fun getRecentHistory(userId: Long, limit: Int = 5): Flow<List<HistoryEntity>> {
        return historyDao.getRecentHistory(userId, limit)
    }

    fun getFavoriteHistory(userId: Long): Flow<List<HistoryEntity>> {
        return historyDao.getFavoriteHistory(userId)
    }

    fun searchHistory(userId: Long, query: String): Flow<List<HistoryEntity>> {
        return historyDao.searchHistory(userId, query)
    }

    fun getHistorySince(userId: Long, startTime: Long): Flow<List<HistoryEntity>> {
        return historyDao.getHistorySince(userId, startTime)
    }

    fun getTotalCount(userId: Long): Flow<Int> = historyDao.getTotalTranslationCount(userId)

    fun getFavoriteCount(userId: Long): Flow<Int> = historyDao.getFavoriteCount(userId)

    fun getAverageConfidence(userId: Long): Flow<Float?> = historyDao.getAverageConfidence(userId)
}

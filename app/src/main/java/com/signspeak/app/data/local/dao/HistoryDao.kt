package com.signspeak.app.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.signspeak.app.data.local.entity.HistoryEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface HistoryDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHistory(history: HistoryEntity): Long

    @Update
    suspend fun updateHistory(history: HistoryEntity)

    @Delete
    suspend fun deleteHistory(history: HistoryEntity)

    @Query("DELETE FROM history WHERE history_id = :historyId")
    suspend fun deleteHistoryById(historyId: Long)

    @Query("DELETE FROM history WHERE user_id = :userId")
    suspend fun clearHistoryByUser(userId: Long)

    @Query("SELECT * FROM history WHERE user_id = :userId ORDER BY timestamp DESC")
    fun getAllHistory(userId: Long): Flow<List<HistoryEntity>>

    @Query("SELECT * FROM history WHERE user_id = :userId ORDER BY timestamp DESC LIMIT :limit")
    fun getRecentHistory(userId: Long, limit: Int): Flow<List<HistoryEntity>>

    @Query("SELECT * FROM history WHERE user_id = :userId AND is_favorite = 1 ORDER BY timestamp DESC")
    fun getFavoriteHistory(userId: Long): Flow<List<HistoryEntity>>

    @Query("SELECT * FROM history WHERE user_id = :userId AND (translated_text LIKE '%' || :query || '%' OR sign_name LIKE '%' || :query || '%') ORDER BY timestamp DESC")
    fun searchHistory(userId: Long, query: String): Flow<List<HistoryEntity>>

    @Query("SELECT * FROM history WHERE user_id = :userId AND timestamp >= :startTime ORDER BY timestamp DESC")
    fun getHistorySince(userId: Long, startTime: Long): Flow<List<HistoryEntity>>

    @Query("SELECT COUNT(*) FROM history WHERE user_id = :userId")
    fun getTotalTranslationCount(userId: Long): Flow<Int>

    @Query("SELECT COUNT(*) FROM history WHERE user_id = :userId AND is_favorite = 1")
    fun getFavoriteCount(userId: Long): Flow<Int>

    @Query("SELECT AVG(confidence) FROM history WHERE user_id = :userId")
    fun getAverageConfidence(userId: Long): Flow<Float?>
}

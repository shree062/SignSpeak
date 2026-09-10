package com.signspeak.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.signspeak.app.data.local.entity.SignEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface SignDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSigns(signs: List<SignEntity>)

    @Query("SELECT * FROM sign ORDER BY sign_name ASC")
    fun getAllSigns(): Flow<List<SignEntity>>

    @Query("SELECT * FROM sign WHERE category = :category ORDER BY sign_name ASC")
    fun getSignsByCategory(category: String): Flow<List<SignEntity>>

    @Query("SELECT * FROM sign WHERE sign_name LIKE '%' || :query || '%' OR description LIKE '%' || :query || '%' ORDER BY sign_name ASC")
    fun searchSigns(query: String): Flow<List<SignEntity>>

    @Query("SELECT * FROM sign WHERE sign_id = :signId LIMIT 1")
    suspend fun getSignById(signId: Int): SignEntity?

    @Query("SELECT * FROM sign WHERE sign_name = :name LIMIT 1")
    suspend fun getSignByName(name: String): SignEntity?

    @Query("SELECT COUNT(*) FROM sign")
    suspend fun getSignCount(): Int
}

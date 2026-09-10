package com.signspeak.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.signspeak.app.data.local.entity.UserEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface UserDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: UserEntity): Long

    @Update
    suspend fun updateUser(user: UserEntity)

    @Query("SELECT * FROM user WHERE email = :email LIMIT 1")
    suspend fun getUserByEmail(email: String): UserEntity?

    @Query("SELECT * FROM user WHERE email = :email OR name = :email LIMIT 1")
    suspend fun getUserByEmailOrUsername(email: String): UserEntity?

    @Query("SELECT * FROM user WHERE user_id = :userId LIMIT 1")
    fun getUserById(userId: Long): Flow<UserEntity?>

    @Query("SELECT * FROM user WHERE user_id = :userId LIMIT 1")
    suspend fun getUserByIdDirect(userId: Long): UserEntity?

    @Query("SELECT COUNT(*) FROM user")
    suspend fun getUserCount(): Int
}

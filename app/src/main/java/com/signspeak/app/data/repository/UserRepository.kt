package com.signspeak.app.data.repository

import com.signspeak.app.data.local.dao.UserDao
import com.signspeak.app.data.local.entity.UserEntity
import kotlinx.coroutines.flow.Flow

class UserRepository(private val userDao: UserDao) {

    suspend fun registerUser(name: String, email: String, password: String): Long {
        val existing = userDao.getUserByEmail(email)
        if (existing != null) {
            throw IllegalArgumentException("An account with this email already exists.")
        }
        val user = UserEntity(
            name = name,
            email = email,
            password = password
        )
        return userDao.insertUser(user)
    }

    suspend fun authenticate(emailOrUsername: String, password: String): UserEntity? {
        val user = userDao.getUserByEmailOrUsername(emailOrUsername)
        return if (user != null && user.password == password) {
            user
        } else {
            null
        }
    }

    suspend fun updateUserProfile(user: UserEntity) {
        userDao.updateUser(user)
    }

    fun getUser(userId: Long): Flow<UserEntity?> {
        return userDao.getUserById(userId)
    }

    suspend fun getUserDirect(userId: Long): UserEntity? {
        return userDao.getUserByIdDirect(userId)
    }
}

package com.signspeak.app.data.repository

import com.signspeak.app.data.local.dao.SignDao
import com.signspeak.app.data.local.entity.SignEntity
import kotlinx.coroutines.flow.Flow

class SignRepository(private val signDao: SignDao) {

    fun getAllSigns(): Flow<List<SignEntity>> = signDao.getAllSigns()

    fun getSignsByCategory(category: String): Flow<List<SignEntity>> = signDao.getSignsByCategory(category)

    fun searchSigns(query: String): Flow<List<SignEntity>> = signDao.searchSigns(query)

    suspend fun getSignById(id: Int): SignEntity? = signDao.getSignById(id)

    suspend fun getSignByName(name: String): SignEntity? = signDao.getSignByName(name)

    suspend fun getSignCount(): Int = signDao.getSignCount()
}

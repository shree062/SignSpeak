package com.signspeak.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.signspeak.app.data.local.dao.HistoryDao
import com.signspeak.app.data.local.dao.SignDao
import com.signspeak.app.data.local.dao.UserDao
import com.signspeak.app.data.local.entity.HistoryEntity
import com.signspeak.app.data.local.entity.SignEntity
import com.signspeak.app.data.local.entity.UserEntity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.InputStreamReader

@Database(
    entities = [UserEntity::class, HistoryEntity::class, SignEntity::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun userDao(): UserDao
    abstract fun historyDao(): HistoryDao
    abstract fun signDao(): SignDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "signspeak_database"
                )
                    .addCallback(AppDatabaseCallback(context.applicationContext, scope))
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }

        private class AppDatabaseCallback(
            private val context: Context,
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateInitialData(context, database)
                    }
                }
            }

            private suspend fun populateInitialData(context: Context, database: AppDatabase) {
                // 1. Pre-populate Default Demo User
                val userDao = database.userDao()
                if (userDao.getUserCount() == 0) {
                    val defaultUser = UserEntity(
                        userId = 1,
                        name = "Shree Nithiy",
                        email = "shree@signspeak.ai",
                        password = "password123",
                        createdAt = System.currentTimeMillis()
                    )
                    userDao.insertUser(defaultUser)
                }

                // 2. Pre-populate Signs Vocabulary from dataset_signs.json
                val signDao = database.signDao()
                try {
                    val inputStream = context.assets.open("dataset_signs.json")
                    val reader = InputStreamReader(inputStream)
                    val listType = object : TypeToken<List<SignEntity>>() {}.type
                    val signs: List<SignEntity> = Gson().fromJson(reader, listType)
                    signDao.insertSigns(signs)
                    reader.close()
                    inputStream.close()
                } catch (e: Exception) {
                    e.printStackTrace()
                }

                // 3. Pre-populate Sample Recent Translation Records
                val historyDao = database.historyDao()
                val now = System.currentTimeMillis()
                val sampleHistory = listOf(
                    HistoryEntity(
                        userId = 1,
                        input = "Camera",
                        signName = "Hello",
                        translatedText = "Hello! Welcome to SignSpeak.",
                        confidence = 0.965f,
                        timestamp = now - (1000 * 60 * 15), // 15 mins ago
                        isFavorite = true
                    ),
                    HistoryEntity(
                        userId = 1,
                        input = "Camera",
                        signName = "Thank You",
                        translatedText = "Thank you very much!",
                        confidence = 0.942f,
                        timestamp = now - (1000 * 60 * 60 * 2), // 2 hours ago
                        isFavorite = true
                    ),
                    HistoryEntity(
                        userId = 1,
                        input = "Gallery",
                        signName = "How are You",
                        translatedText = "How are you doing today?",
                        confidence = 0.918f,
                        timestamp = now - (1000 * 60 * 60 * 24), // 1 day ago
                        isFavorite = false
                    )
                )
                sampleHistory.forEach { historyDao.insertHistory(it) }
            }
        }
    }
}

package com.signspeak.app.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Translation History Entity matching Project Database Design
 * Table: history
 */
@Entity(tableName = "history")
data class HistoryEntity(
    @PrimaryKey(autoGenerate = true)
    @ColumnInfo(name = "history_id")
    val historyId: Long = 0,

    @ColumnInfo(name = "user_id")
    val userId: Long = 1,

    @ColumnInfo(name = "input")
    val input: String, // e.g., "Camera", "Gallery"

    @ColumnInfo(name = "sign_name")
    val signName: String,

    @ColumnInfo(name = "translated_text")
    val translatedText: String,

    @ColumnInfo(name = "confidence")
    val confidence: Float,

    @ColumnInfo(name = "timestamp")
    val timestamp: Long = System.currentTimeMillis(),

    @ColumnInfo(name = "is_favorite")
    val isFavorite: Boolean = false,

    @ColumnInfo(name = "thumbnail_path")
    val thumbnailPath: String? = null
)

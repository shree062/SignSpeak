package com.signspeak.app.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Sign Entity for Sign Language Dictionary and Learning Module
 * Table: sign
 */
@Entity(tableName = "sign")
data class SignEntity(
    @PrimaryKey
    @ColumnInfo(name = "sign_id")
    val signId: Int,

    @ColumnInfo(name = "sign_name")
    val signName: String,

    @ColumnInfo(name = "category")
    val category: String,

    @ColumnInfo(name = "description")
    val description: String,

    @ColumnInfo(name = "instructions")
    val instructions: String,

    @ColumnInfo(name = "example_usage")
    val exampleUsage: String,

    @ColumnInfo(name = "image_res_name")
    val imageResName: String? = null
)

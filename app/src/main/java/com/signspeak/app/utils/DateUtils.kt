package com.signspeak.app.utils

import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

object DateUtils {

    private val timeFormat = SimpleDateFormat("h:mm a", Locale.getDefault())
    private val fullDateFormat = SimpleDateFormat("dd MMM yyyy, h:mm a", Locale.getDefault())
    private val shortDateFormat = SimpleDateFormat("dd MMM", Locale.getDefault())

    fun formatHistoryDateTime(timestamp: Long): String {
        val now = Calendar.getInstance()
        val itemTime = Calendar.getInstance().apply { timeInMillis = timestamp }

        return when {
            isSameDay(now, itemTime) -> "Today, ${timeFormat.format(Date(timestamp))}"
            isYesterday(now, itemTime) -> "Yesterday, ${timeFormat.format(Date(timestamp))}"
            now.get(Calendar.YEAR) == itemTime.get(Calendar.YEAR) -> "${shortDateFormat.format(Date(timestamp))}, ${timeFormat.format(Date(timestamp))}"
            else -> fullDateFormat.format(Date(timestamp))
        }
    }

    fun getStartOfToday(): Long {
        val calendar = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }
        return calendar.timeInMillis
    }

    fun getStartOfThisWeek(): Long {
        val calendar = Calendar.getInstance().apply {
            set(Calendar.DAY_OF_WEEK, firstDayOfWeek)
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }
        return calendar.timeInMillis
    }

    fun getStartOfThisMonth(): Long {
        val calendar = Calendar.getInstance().apply {
            set(Calendar.DAY_OF_MONTH, 1)
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }
        return calendar.timeInMillis
    }

    private fun isSameDay(cal1: Calendar, cal2: Calendar): Boolean {
        return cal1.get(Calendar.YEAR) == cal2.get(Calendar.YEAR) &&
                cal1.get(Calendar.DAY_OF_YEAR) == cal2.get(Calendar.DAY_OF_YEAR)
    }

    private fun isYesterday(cal1: Calendar, cal2: Calendar): Boolean {
        val clone = cal1.clone() as Calendar
        clone.add(Calendar.DAY_OF_YEAR, -1)
        return isSameDay(clone, cal2)
    }
}

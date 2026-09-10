package com.signspeak.app.ui.auth

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.signspeak.app.data.local.entity.UserEntity
import com.signspeak.app.data.pref.PreferenceManager
import com.signspeak.app.data.repository.UserRepository
import kotlinx.coroutines.launch

sealed class AuthState {
    object Idle : AuthState()
    object Loading : AuthState()
    data class Success(val user: UserEntity) : AuthState()
    data class Error(val message: String) : AuthState()
}

class AuthViewModel(
    private val userRepository: UserRepository,
    private val preferenceManager: PreferenceManager
) : ViewModel() {

    private val _authState = MutableLiveData<AuthState>(AuthState.Idle)
    val authState: LiveData<AuthState> = _authState

    fun login(emailOrUsername: String, password: String) {
        if (emailOrUsername.isBlank() || password.isBlank()) {
            _authState.value = AuthState.Error("Please enter email/username and password")
            return
        }

        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                val user = userRepository.authenticate(emailOrUsername, password)
                if (user != null) {
                    preferenceManager.setUserSession(user.userId, user.name, user.email)
                    _authState.value = AuthState.Success(user)
                } else {
                    _authState.value = AuthState.Error("Invalid credentials. Try demo: shree@signspeak.ai / password123")
                }
            } catch (e: Exception) {
                _authState.value = AuthState.Error(e.message ?: "Authentication failed")
            }
        }
    }

    fun signUp(name: String, email: String, password: String, confirmPass: String) {
        if (name.isBlank() || email.isBlank() || password.isBlank()) {
            _authState.value = AuthState.Error("All fields are required")
            return
        }
        if (password != confirmPass) {
            _authState.value = AuthState.Error("Passwords do not match")
            return
        }
        if (password.length < 6) {
            _authState.value = AuthState.Error("Password must be at least 6 characters")
            return
        }

        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                val userId = userRepository.registerUser(name, email, password)
                val newUser = UserEntity(userId = userId, name = name, email = email, password = password)
                preferenceManager.setUserSession(userId, name, email)
                _authState.value = AuthState.Success(newUser)
            } catch (e: Exception) {
                _authState.value = AuthState.Error(e.message ?: "Sign up failed")
            }
        }
    }

    fun loginWithSocial(provider: String) {
        viewModelScope.launch {
            _authState.value = AuthState.Loading
            val demoUser = UserEntity(
                userId = 1,
                name = "Google User (Shree)",
                email = "shree.google@signspeak.ai",
                password = "oauth"
            )
            preferenceManager.setUserSession(demoUser.userId, demoUser.name, demoUser.email)
            _authState.value = AuthState.Success(demoUser)
        }
    }

    fun checkAutoLogin(): Boolean {
        return preferenceManager.isLoggedIn
    }

    class Factory(
        private val userRepository: UserRepository,
        private val preferenceManager: PreferenceManager
    ) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return AuthViewModel(userRepository, preferenceManager) as T
        }
    }
}

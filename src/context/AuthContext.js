import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state
const initialState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  hasCompletedPermissions: false,
  error: null,
};

// Storage keys
const STORAGE_KEYS = {
  USER_DATA: '@safecircle:user',
  REGISTERED_USERS: '@safecircle:registeredUsers',
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_PERMISSIONS_COMPLETE: 'SET_PERMISSIONS_COMPLETE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
        hasCompletedPermissions: false,
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    
    case AUTH_ACTIONS.SET_PERMISSIONS_COMPLETE:
      return {
        ...state,
        hasCompletedPermissions: true,
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // In-memory storage for registered users (simulates a database)
  const registeredUsers = useRef({});

  // Load persisted data on mount
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        // Load registered users
        const storedUsers = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
        if (storedUsers) {
          registeredUsers.current = JSON.parse(storedUsers);
        }

        // Load current user session
        const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
        if (storedUser) {
          const user = JSON.parse(storedUser);
          dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Error loading persisted data:', error);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadPersistedData();
  }, []);

  // Save registered users to storage
  const saveRegisteredUsers = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.REGISTERED_USERS,
        JSON.stringify(registeredUsers.current)
      );
    } catch (error) {
      console.error('Error saving registered users:', error);
    }
  };

  // Save current user to storage
  const saveCurrentUser = async (user) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Login function
  const login = async (emailOrUsername, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (emailOrUsername && password) {
        // Check if user exists in registered users (by email or username)
        const users = Object.values(registeredUsers.current).filter(
          u => u.id && !u.id.startsWith('email_') && !u.id.startsWith('username_')
        );
        const existingUser = users.find(
          u => u.email?.toLowerCase() === emailOrUsername.toLowerCase() || 
               u.username?.toLowerCase() === emailOrUsername.toLowerCase()
        );
        
        if (existingUser) {
          // User found - use their actual data
          await saveCurrentUser(existingUser);
          dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: existingUser });
        } else {
          // New user logging in - create user from input
          // Extract username from email if it's an email, otherwise use as username
          const isEmail = emailOrUsername.includes('@');
          const username = isEmail ? emailOrUsername.split('@')[0] : emailOrUsername;
          
          const user = {
            id: 'user_' + Date.now(),
            username: username,
            firstName: username,
            lastName: '',
            email: isEmail ? emailOrUsername : `${emailOrUsername}@demo.com`,
            phone: '',
            avatar: null,
            verified: false,
            language: 'en',
            createdAt: new Date().toISOString(),
          };
          
          // Store the user
          registeredUsers.current[user.id] = user;
          await saveRegisteredUsers();
          await saveCurrentUser(user);
          dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
        }
        return { success: true };
      } else {
        throw new Error('Please enter email/username and password');
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Sign up function
  const signUp = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser = {
        id: 'user_' + Date.now(),
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        username: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        age: userData.age || null,
        avatar: userData.avatar || null,
        verified: userData.verified || false,
        language: 'en',
        createdAt: new Date().toISOString(),
      };
      
      // Store the user for future logins
      registeredUsers.current[newUser.id] = newUser;
      
      // Also index by email and username for easy lookup
      if (newUser.email) {
        registeredUsers.current[`email_${newUser.email.toLowerCase()}`] = newUser;
      }
      if (newUser.username) {
        registeredUsers.current[`username_${newUser.username.toLowerCase()}`] = newUser;
      }
      
      await saveRegisteredUsers();
      await saveCurrentUser(newUser);
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: newUser });
      return { success: true };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...state.user, ...updates };
      dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: updates });
      
      // Update in storage
      if (state.user?.id) {
        registeredUsers.current[state.user.id] = {
          ...registeredUsers.current[state.user.id],
          ...updates,
        };
        
        // Update indexes if email or username changed
        if (updates.email && updates.email !== state.user.email) {
          delete registeredUsers.current[`email_${state.user.email?.toLowerCase()}`];
          registeredUsers.current[`email_${updates.email.toLowerCase()}`] = updatedUser;
        }
        if (updates.username && updates.username !== state.user.username) {
          delete registeredUsers.current[`username_${state.user.username?.toLowerCase()}`];
          registeredUsers.current[`username_${updates.username.toLowerCase()}`] = updatedUser;
        }
        
        await saveRegisteredUsers();
        await saveCurrentUser(updatedUser);
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Verify with MitID (mock)
  const verifyMitID = async () => {
    try {
      // Simulate MitID verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      const updatedUser = { ...state.user, verified: true };
      dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: { verified: true } });
      await saveCurrentUser(updatedUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Set permissions complete
  const setPermissionsComplete = () => {
    dispatch({ type: AUTH_ACTIONS.SET_PERMISSIONS_COMPLETE });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    signUp,
    logout,
    updateProfile,
    verifyMitID,
    setPermissionsComplete,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';

// Initial state
const initialState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  hasCompletedPermissions: false,
  error: null,
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

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthState = async () => {
      // Simulate checking for stored auth
      setTimeout(() => {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }, 1000);
    };

    checkAuthState();
  }, []);

  // Login function
  const login = async (emailOrUsername, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (emailOrUsername && password) {
        // Check if user exists in registered users (by email or username)
        const users = Object.values(registeredUsers.current);
        const existingUser = users.find(
          u => u.email?.toLowerCase() === emailOrUsername.toLowerCase() || 
               u.username?.toLowerCase() === emailOrUsername.toLowerCase()
        );
        
        if (existingUser) {
          // User found - use their actual data
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
      
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: newUser });
      return { success: true };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: updates });
      
      // Update in storage
      if (state.user?.id) {
        registeredUsers.current[state.user.id] = {
          ...registeredUsers.current[state.user.id],
          ...updates,
        };
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
      dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: { verified: true } });
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

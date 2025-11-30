import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { mockUser } from '../services/mockData';

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
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, accept any credentials
      if (email && password) {
        const user = {
          ...mockUser,
          email: email,
        };
        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
        return { success: true };
      } else {
        throw new Error('Please enter email and password');
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
        ...userData,
        verified: false,
        createdAt: new Date().toISOString(),
      };
      
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


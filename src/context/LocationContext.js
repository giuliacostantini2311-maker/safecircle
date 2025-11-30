import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { DEFAULT_LOCATION } from '../utils/constants';
import { generateSafePlacesNearLocation, getNearbyGuardiansCount } from '../services/mockData';

// Initial state
const initialState = {
  location: null,
  address: null,
  errorMsg: null,
  isLoading: true,
  hasPermission: false,
  safePlaces: [],
  nearbyGuardiansCount: 0,
  isTracking: false,
};

// Action types
const LOCATION_ACTIONS = {
  SET_LOCATION: 'SET_LOCATION',
  SET_ADDRESS: 'SET_ADDRESS',
  SET_ERROR: 'SET_ERROR',
  SET_LOADING: 'SET_LOADING',
  SET_PERMISSION: 'SET_PERMISSION',
  SET_SAFE_PLACES: 'SET_SAFE_PLACES',
  SET_GUARDIANS_COUNT: 'SET_GUARDIANS_COUNT',
  SET_TRACKING: 'SET_TRACKING',
};

// Reducer
const locationReducer = (state, action) => {
  switch (action.type) {
    case LOCATION_ACTIONS.SET_LOCATION:
      return { ...state, location: action.payload, isLoading: false };
    
    case LOCATION_ACTIONS.SET_ADDRESS:
      return { ...state, address: action.payload };
    
    case LOCATION_ACTIONS.SET_ERROR:
      return { ...state, errorMsg: action.payload, isLoading: false };
    
    case LOCATION_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case LOCATION_ACTIONS.SET_PERMISSION:
      return { ...state, hasPermission: action.payload };
    
    case LOCATION_ACTIONS.SET_SAFE_PLACES:
      return { ...state, safePlaces: action.payload };
    
    case LOCATION_ACTIONS.SET_GUARDIANS_COUNT:
      return { ...state, nearbyGuardiansCount: action.payload };
    
    case LOCATION_ACTIONS.SET_TRACKING:
      return { ...state, isTracking: action.payload };
    
    default:
      return state;
  }
};

// Create context
const LocationContext = createContext();

// Provider component
export const LocationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(locationReducer, initialState);
  const locationSubscription = useRef(null);

  // Request location permission
  const requestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const hasPermission = status === 'granted';
      dispatch({ type: LOCATION_ACTIONS.SET_PERMISSION, payload: hasPermission });
      return hasPermission;
    } catch (error) {
      console.log('Permission error:', error);
      dispatch({ type: LOCATION_ACTIONS.SET_ERROR, payload: 'Failed to request permission' });
      return false;
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    dispatch({ type: LOCATION_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        // Use default location for demo
        const defaultLocation = {
          coords: {
            latitude: DEFAULT_LOCATION.latitude,
            longitude: DEFAULT_LOCATION.longitude,
            accuracy: 100,
          },
        };
        dispatch({ type: LOCATION_ACTIONS.SET_LOCATION, payload: defaultLocation });
        updateSafePlaces(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
        updateGuardiansCount();
        return defaultLocation;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      dispatch({ type: LOCATION_ACTIONS.SET_LOCATION, payload: location });
      
      // Update safe places based on new location
      updateSafePlaces(location.coords.latitude, location.coords.longitude);
      updateGuardiansCount();
      
      // Get address
      getAddressFromCoords(location.coords.latitude, location.coords.longitude);
      
      return location;
    } catch (error) {
      console.log('Location error:', error);
      dispatch({ type: LOCATION_ACTIONS.SET_ERROR, payload: 'Failed to get location' });
      
      // Use default location on error
      const defaultLocation = {
        coords: {
          latitude: DEFAULT_LOCATION.latitude,
          longitude: DEFAULT_LOCATION.longitude,
          accuracy: 100,
        },
      };
      dispatch({ type: LOCATION_ACTIONS.SET_LOCATION, payload: defaultLocation });
      updateSafePlaces(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
      updateGuardiansCount();
      return defaultLocation;
    }
  };

  // Get address from coordinates
  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const [result] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      if (result) {
        const address = `${result.street || ''} ${result.streetNumber || ''}, ${result.postalCode || ''} ${result.city || ''}`.trim();
        dispatch({ type: LOCATION_ACTIONS.SET_ADDRESS, payload: address });
        return address;
      }
    } catch (error) {
      console.log('Geocoding error:', error);
      // Use mock address as fallback
      dispatch({ type: LOCATION_ACTIONS.SET_ADDRESS, payload: 'Vesterbrogade 42, 1620 København V' });
    }
  };

  // Update safe places based on location
  const updateSafePlaces = (latitude, longitude) => {
    const places = generateSafePlacesNearLocation(latitude, longitude);
    dispatch({ type: LOCATION_ACTIONS.SET_SAFE_PLACES, payload: places });
  };

  // Update nearby guardians count
  const updateGuardiansCount = () => {
    const count = getNearbyGuardiansCount();
    dispatch({ type: LOCATION_ACTIONS.SET_GUARDIANS_COUNT, payload: count });
  };

  // Start tracking location
  const startTracking = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Location permission not granted');
        return;
      }

      dispatch({ type: LOCATION_ACTIONS.SET_TRACKING, payload: true });
      
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          dispatch({ type: LOCATION_ACTIONS.SET_LOCATION, payload: location });
          getAddressFromCoords(location.coords.latitude, location.coords.longitude);
        }
      );
    } catch (error) {
      console.log('Tracking error:', error);
    }
  };

  // Stop tracking location
  const stopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    dispatch({ type: LOCATION_ACTIONS.SET_TRACKING, payload: false });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  const value = {
    ...state,
    requestPermission,
    getCurrentLocation,
    getAddressFromCoords,
    startTracking,
    stopTracking,
    updateGuardiansCount,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use location context
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export default LocationContext;


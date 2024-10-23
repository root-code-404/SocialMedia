// AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAdmin: false,
  isAuthenticated: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        isAdmin: action.payload.isAdmin,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Fetch user authentication status from the server
    const checkAuthenticationStatus = async () => {
      try {
        const response = await fetch('/api/check-auth'); // Adjust the endpoint
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          if (data.isAuthenticated) {
            dispatch({ type: 'LOGIN', payload: { user: data.user, isAdmin: data.isAdmin } });
          }
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
      }
    };

    checkAuthenticationStatus();
  }, []);

  const login = (user, isAdmin) => {
    dispatch({ type: 'LOGIN', payload: { user, isAdmin } });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };

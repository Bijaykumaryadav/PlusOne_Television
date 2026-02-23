import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  clearError,
  authSelector,
} from "../store/slices/authSlice";

/**
 * useAuth
 * Central hook for all authentication actions and state.
 * Components never touch the store or axios directly.
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, isSessionRestoring, error } =
    useSelector(authSelector);

  const login = useCallback(
    (credentials) => dispatch(loginUser(credentials)),
    [dispatch]
  );

  const register = useCallback(
    (userData) => dispatch(registerUser(userData)),
    [dispatch]
  );

  const logout = useCallback(
    () => dispatch(logoutUser()),
    [dispatch]
  );

  const dismissError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    isSessionRestoring,
    error,
    login,
    register,
    logout,
    dismissError,
  };
};

export default useAuth;
import { useSelector, useDispatch } from 'react-redux';
import { useAdminLoginMutation } from '../store/api/apiSlice';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, admin, isAuthenticated, loading, error } = useSelector(state => state.auth);
  const [adminLogin] = useAdminLoginMutation();

  const login = async (credentials) => {
    dispatch(loginStart());
    try {
      const result = await adminLogin(credentials).unwrap();
      dispatch(loginSuccess(result));
      return result;
    } catch (error) {
      dispatch(loginFailure(error?.data?.message || error.message));
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    token,
    admin,
    isAuthenticated,
    loading,
    error,
    login,
    logout: handleLogout,
  };
};

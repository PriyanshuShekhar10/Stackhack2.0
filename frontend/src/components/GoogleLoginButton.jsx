

import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/user/userSlice';

const GoogleLoginButton = () => {
  const dispatch = useDispatch();

  const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    // Send this token to your backend for verification
    // Here assuming decoded data is directly set (mock)
    dispatch(setUser({ name: "User Name", email: "user@example.com" })); // Mock data
  };

  return (
    <GoogleLogin
      clientId='926200292216-4ne1l3s05tkkcmg491tnvbdeg3t6vtj4.apps.googleusercontent.com'
      onSuccess={handleCredentialResponse}
      onError={() => console.log('Login Failed')}
    />
  );
};

export default GoogleLoginButton;

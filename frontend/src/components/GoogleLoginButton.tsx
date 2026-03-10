import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = () => {
  const handleSuccess = async (cred: any) => {
    const token = cred.credential;

    const res = await fetch("http://localhost:8000/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });

    const data = await res.json();
    console.log("Logged in user:", data);
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
};

export default GoogleLoginButton;
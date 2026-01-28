// src/pages/VerifyEmail.tsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';


export default function VerifyEmail() {
  const [status, setStatus] = useState('Verifying...');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('No token provided.');
      return;
    }

    axios
      .get(`${import.meta.env.REACT_APP_API_URL}/email/verify`, { params: { token } })
      .then(() => setStatus('Email verified successfully!'))
      .catch(() => setStatus('Invalid or expired token.'));
  }, [token]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{status}</h1>
    </div>
  );
}

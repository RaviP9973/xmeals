import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = ({ code = 404, message = "Page Not Found" }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-7xl font-bold text-danger mb-4">{code}</h1>
      <h2 className="text-2xl font-semibold mb-2">{message}</h2>
      <p className="mb-6 text-gray-600">Sorry, the page you're looking for doesn't exist or an error occurred.</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition duration-200"
      >
        Go Home
      </button>
    </div>
  );
};

export default ErrorPage;

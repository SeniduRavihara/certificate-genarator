import React from "react";
import { useAuth } from "../hooks/useAuth";

interface GoogleAuthButtonProps {
  className?: string;
  size?: number;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  className = "",
  size = 40,
}) => {
  const { user, loading, signInWithGoogleDrive, signOutGoogle } = useAuth();

  if (loading) {
    return (
      <div
        className={`rounded-full bg-slate-800 animate-pulse ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (user) {
    return (
      <div
        className={`relative group ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={user.photoURL || undefined}
          alt={user.displayName || "Google User"}
          className="rounded-full border-2 border-blue-500 shadow-lg w-full h-full object-cover cursor-pointer"
          title={user.displayName || undefined}
          onClick={signOutGoogle}
        />
        <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col bg-slate-900 border border-slate-700 rounded-lg shadow-lg p-2 z-50 min-w-[120px]">
          <span className="text-xs text-slate-300 px-2 py-1">
            {user.displayName}
          </span>
          <button
            onClick={signOutGoogle}
            className="text-red-400 hover:text-red-300 text-xs px-2 py-1 text-left"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGoogleDrive}
      className={`flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-full shadow hover:bg-blue-100 font-semibold transition ${className}`}
      style={{ height: size }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 48 48"
        className="inline-block mr-2"
      >
        <g>
          <path
            fill="#4285F4"
            d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.09 30.18 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.2C12.13 13.7 17.56 9.5 24 9.5z"
          />
          <path
            fill="#34A853"
            d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.98 37.09 46.1 31.3 46.1 24.55z"
          />
          <path
            fill="#FBBC05"
            d="M9.67 28.29c-1.13-3.36-1.13-6.93 0-10.29l-7.98-6.2C-1.13 17.09-1.13 30.91 1.69 37.91l7.98-6.2z"
          />
          <path
            fill="#EA4335"
            d="M24 44c6.18 0 11.64-2.09 15.85-5.7l-7.19-5.59c-2.01 1.35-4.6 2.14-8.66 2.14-6.44 0-11.87-4.2-13.33-10.29l-7.98 6.2C6.71 42.18 14.82 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </g>
      </svg>
      Sign in with Google
    </button>
  );
};

export default GoogleAuthButton;

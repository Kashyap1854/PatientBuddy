import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-9xl font-bold text-primary-300 mb-4">404</div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>

        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button
              leftIcon={<Home size={18} />}
              onClick={() => (window.location.href = "/dashboard")}
            >
              Go to Dashboard
            </Button>
          </Link>

          <Button
            variant="outline"
            leftIcon={<ArrowLeft size={18} />}
            onClick={() => (window.location.href = "/landing")}
            className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}

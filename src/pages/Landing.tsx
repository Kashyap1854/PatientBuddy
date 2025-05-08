import { useNavigate } from "react-router-dom";
import { Stethoscope, FileText, Lock, Users } from "lucide-react";
import Button from "../components/ui/Button";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm fixed w-full z-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                PatientBuddy
              </span>
            </div>
            <div>
              <Button
                size="sm"
                className="bg-blue-900 text-white hover:bg-blue-950 px-4 py-2 rounded-md shadow"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Take Charge of Your Health with
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-800 mb-6">
              <span className="text-blue-800"> Patient Buddy</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Seamlessly store, organize, and retrieve your medical records in
              one place. Your health companion for secure and smart record
              management.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="bg-blue-900 text-white hover:bg-blue-950 px-4 py-2 rounded-md shadow"
            >
              Explore Now
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Lock className="h-8 w-8 text-blue-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
              <p className="text-gray-600">
                Bank-level encryption keeps your medical records safe and
                private
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Access</h3>
              <p className="text-gray-600">
                Access your records anytime, anywhere with our user-friendly
                interface
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Securely</h3>
              <p className="text-gray-600">
                Share records with healthcare providers safely and efficiently
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to take control of your medical records?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of users who trust PatientBuddy with their medical
            information
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/signup")}
            className="bg-white text-blue-800 hover:bg-blue-50"
          >
            Create Free Account
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} PatientBuddy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

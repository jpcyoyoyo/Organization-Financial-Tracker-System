import BackgroundSection from "../../components/ui/background";
import { Helmet } from "react-helmet-async";
import { LoginForm } from "./LoginForm";
import Logo from "../../components/ui/logo";
import useAuth from "../../hooks/useAuth";
import { motion } from "framer-motion"; // Import framer-motion

export default function LoginPage() {
  useAuth(); // Check if the user is authenticated

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <Helmet>
        <title>Login - Organization Financial Tracker</title>
        <meta
          name="description"
          content="Login to access the Organization Financial Tracker System."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      </Helmet>
      <BackgroundSection>
        <div className="flex flex-col md:flex-row w-full h-full items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
          {/* Left Section: Logo */}
          <div className="w-full md:w-full xl:pl-24 lg:w-1/2 flex flex-col items-center space-y-6">
            <Logo size="250" />
            <h1 className="mt-4 text-4xl font-bold text-black">COMSOC</h1>
            <p className="text-2xl font-bold text-black text-center px-4 sm:px-24 md:px-12 lg:px-24">
              ORGANIZATION FINANCIAL TRACKER SYSTEM
            </p>
          </div>

          {/* Right Section: Form */}
          <div className="w-full md:w-1/2 xl:pr-24 flex items-center justify-center">
            <LoginForm />
          </div>
        </div>
      </BackgroundSection>
    </motion.div>
  );
}

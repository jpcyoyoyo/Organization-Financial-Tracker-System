import BackgroundSection from "../../components/ui/background";
import { Helmet } from "react-helmet-async";
import { LoginForm } from "./LoginForm";
import Logo from "../../components/ui/logo";
import { motion } from "framer-motion"; // Import framer-motion
import PropTypes from "prop-types";

export default function LoginPage({ setIsAuthenticated }) {
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
      <BackgroundSection className="justify-center items-center p-12 sm:p-4">
        <motion.div
          initial={{ opacity: 0.5, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 2 }}
        >
          <div className="flex flex-col md:flex-row w-full h-full items-center justify-items-center space-y-8 md:space-y-0 md:space-x-8">
            {/* Left Section: Logo and Text */}
            <div className="flex flex-col-reverse md:flex-col w-full xl:pl-24 md:w-9/20 sm:w-4/5 lg:w-1/2 items-center md:items-start space-y-6 md:space-y-0">
              <div className="flex flex-row items-center sm:space-x-4 md:flex-col md:space-x-0">
                <Logo size="250" bg={`w-35 sm:w-44 md:w-63`} />
                <div className="text-left md:text-center">
                  <h1 className="md:mt-4 text-3xl sm:text-4xl font-bold text-black px-4">
                    COMSOC
                  </h1>
                  <p className="mt-1.5 sm:mt-4 text-sm sm:text-2xl font-bold text-black pl-4 sm:px-4">
                    ORGANIZATION FINANCIAL TRACKER SYSTEM
                  </p>
                </div>
              </div>
            </div>
            {/* Right Section: Form */}
            <div className="w-full sm:w-4/5 md:w-11/20 lg:w-1/2 xl:pr-24 items-center justify-center">
              <LoginForm setIsAuthenticated={setIsAuthenticated} />
            </div>
          </div>
        </motion.div>
      </BackgroundSection>
    </motion.div>
  );
}

LoginForm.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

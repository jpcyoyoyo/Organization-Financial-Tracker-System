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
          content="Login to access the Organization Management System."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      </Helmet>
      <BackgroundSection className="transition-all duration-300 justify-center items-center p-12 sm:p-4">
        <motion.div
          initial={{ opacity: 0.5, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 2 }}
        >
          <div className="transition-all duration-300 flex w-full items-center justify-center justify-items-center">
            <div className="transition-all duration-300 shadow-xl flex bg-[url('/src/assets/it_bldg.png')] bg-[-0px_-40px] sm:bg-[-0px_-70px] md:bg-[-300px_-0px] bg-contain md:bg-[length:130%_130%] rounded-3xl">
              <div className="transition-all duration-300 flex flex-col md:flex-row bg-[#ffb72855] rounded-3xl backdrop-blur-[1px] sm:backdrop-blur-[2px] md:backdrop-blur-[3px] space-y-4 md:space-y-0">
                {/* Left Section: Logo and Text */}
                <div className="transition-all duration-300 pt-4 md:pt-0 px-4 flex flex-col-reverse md:flex-col w-full items-center md:items-start space-y-6 md:space-y-0 self-center">
                  <div className="transition-all duration-300 flex flex-row items-center md:h-full sm:space-x-4 md:space-x-0 md:flex-col md:pl-4 lg:w-sm">
                    <Logo size="250" bg={`w-18 sm:w-32 md:w-63`} />
                    <div className="transition-all duration-300 -mt-3 sm:-mt-6 md:-mt-0 h-auto sm:space-y-1 text-left md:text-center pl-3 md:pl-0">
                      <h1
                        className="transition-all duration-300 md:mt-4 text-[44px] sm:text-[80px] md:text-6xl font-bold text-black"
                        style={{
                          textShadow:
                            "0px 1px 2px rgb(0 0 0 / 0.1), 0px 3px 2px rgb(0 0 0 / 0.1), 0px 4px 8px rgb(0 0 0 / 0.1)",
                        }}
                      >
                        COMSOC
                      </h1>

                      <p
                        className="transition-all duration-300 -mt-3 sm:-mt-6 md:-mt-0 text-[10px] sm:text-lg md:text-sm md:h-8 text-black text-center"
                        style={{
                          textShadow:
                            "0px 1px 2px rgb(0 0 0 / 0.1), 0px 3px 2px rgb(0 0 0 / 0.1), 0px 4px 8px rgb(0 0 0 / 0.1)",
                        }}
                      >
                        ORGANIZATION MANAGEMENT SYSTEM
                      </p>
                    </div>
                  </div>
                </div>
                {/* Right Section: Form */}
                <div className="transition-all duration-300 w-full md:h-125 items-center justify-center md:pl-4">
                  <LoginForm setIsAuthenticated={setIsAuthenticated} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </BackgroundSection>
    </motion.div>
  );
}

LoginPage.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

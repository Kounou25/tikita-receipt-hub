import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Receipt, Download, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

const Landing = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 400], [0.5, 0.2]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.94]);

  return (
    <div className="min-h-screen bg-white overflow-hidden flex flex-col">
      {/* Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-green-100 shadow-sm"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="w-16 h-16 rounded-xl flex items-center justify-center">
              <img
                src="/lovable-uploads/tikiita.png"
                alt="Tikiita Logo"
                className="h-14 w-14 object-contain"
                style={{ filter: 'drop-shadow(0 3px 6px rgba(20,184,166,0.3))' }}
              />
            </div>
            {/* <span className="text-2xl font-extrabold text-green-700">Tikiita</span> */}
          </motion.div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/login">
              <motion.button
                className="border-2 border-green-300 text-green-700 px-5 py-2 rounded-full font-medium hover:bg-green-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Connexion
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                className="bg-orange-500 text-white px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Inscription
                <ArrowRight className="w-4 h-4 ml-2" />
              </motion.button>
            </Link>
          </div>
          <div className="md:hidden flex items-center space-x-3">
            <Link to="/login">
              <motion.button
                className="border-2 border-green-300 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Connexion
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Inscription
              </motion.button>
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ scale: heroScale }}
        className="relative min-h-screen flex items-center pt-24 flex-grow"
      >
        {/* Background Layers */}
        <motion.div
          className="absolute inset-0 bg-green-50/50"
          style={{ opacity: backgroundOpacity }}
        />
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 100 100"
        >
          <motion.path
            d="M0,10 C20,20 40,5 60,15 S80,25 100,15 V100 H0 Z"
            fill="#14b8a6"
            fillOpacity="0.15"
            animate={{
              d: [
                "M0,10 C20,20 40,5 60,15 S80,25 100,15 V100 H0 Z",
                "M0,15 C25,30 45,10 65,25 S85,35 100,20 V100 H0 Z",
                "M0,10 C20,20 40,5 60,15 S80,25 100,15 V100 H0 Z",
              ],
            }}
            transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
          />
          <motion.path
            d="M0,30 C30,45 50,25 70,40 S90,50 100,35 V100 H0 Z"
            fill="#f97316"
            fillOpacity="0.1"
            animate={{
              d: [
                "M0,30 C30,45 50,25 70,40 S90,50 100,35 V100 H0 Z",
                "M0,35 C25,50 45,30 65,45 S85,55 100,40 V100 H0 Z",
                "M0,30 C30,45 50,25 70,40 S90,50 100,35 V100 H0 Z",
              ],
            }}
            transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut', delay: 1 }}
          />
        </svg>
        {/* Animated Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-green-400' : 'bg-orange-400'}`}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 4 + i * 0.4,
              delay: i * 0.3,
            }}
          />
        ))}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="space-y-8"
          >
            <motion.div
              className="inline-flex items-center bg-green-100 text-green-800 px-6 py-2 rounded-full font-medium shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              🇳🇪 Fièrement Nigérien
            </motion.div>
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Reçus professionnels
              <motion.span
                className="block text-orange-500"
                animate={{ y: [0, -5, 0], opacity: [1, 0.8, 1] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              >
                en quelques clics
              </motion.span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Tikiita : la solution nigérienne pour des reçus modernes, conformes et adaptés à votre business.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
                <Link to="/register">
                  <motion.button
                    className="relative bg-orange-500 text-white px-5 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-xl flex items-center mx-auto hover:bg-orange-600 overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Glowing Halo Effect */}
                    <motion.div
                      className="absolute inset-0 bg-orange-400 opacity-0 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0, 0.3, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: 'easeOut',
                      }}
                    />
                    <motion.div
                      className="relative flex items-center"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: 'easeInOut',
                      }}
                    >
                      <motion.span
                        className="inline-block mr-2"
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          delay: 0.2,
                          ease: 'easeInOut',
                        }}
                      >
                        <Receipt className="w-5 h-5 sm:w-6 sm:h-6" />
                      </motion.span>
                      Créer un reçu
                      <ArrowRight className="w-5 h-5 ml-2 sm:w-6 sm:h-6" />
                    </motion.div>
                  </motion.button>
                </Link>
                <Link to="/demo">
                  <motion.button
                    className="border-2 border-green-300 text-green-700 px-5 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-green-50 flex items-center mx-auto"
                    whileHover={{ scale: 1.05, boxShadow: '0 12px 24px rgba(20,184,166,0.2)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-5 h-5 mr-2 sm:w-6 sm:h-6" />
                    Voir la démo
                  </motion.button>
                </Link>
            </motion.div>
            </motion.div>
          </div>
        </motion.section>

      {/* Footer */}
      <motion.footer
        className="w-full py-4 text-center bg-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <span className="text-sm text-gray-600">
          Powered by{' '}
          <span className="font-semibold text-green-600">Urban</span>
        </span>
      </motion.footer>
    </div>
  );
};

export default Landing;
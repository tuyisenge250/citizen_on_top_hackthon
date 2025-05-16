"use client";

import { useState } from "react";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { CarFront, Clock, Trophy, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 💖 Heart popup animation
function HeartBurst() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 0 }}
      animate={{ scale: 1.5, opacity: 1, y: -20 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute top-0 right-0 text-pink-400"
    >
      <Heart className="w-6 h-6 animate-bounce" />
    </motion.div>
  );
}

export default function AchievementSection() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [heartsVisible, setHeartsVisible] = useState({
    students: false,
    hours: false,
    exams: false,
  });

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
    onChange: (inView) => {
      if (inView) setHasAnimated(true);
    },
  });

  const handleEnd = (key) => {
    setHeartsVisible((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setHeartsVisible((prev) => ({ ...prev, [key]: false }));
    }, 1500);
  };

  const cardStyle =
    "relative flex flex-col items-center space-y-2 rounded-2xl shadow-md p-6 group transition hover:scale-105 duration-300";

  return (
    <section ref={ref} className="bg-white py-8 px-6 md:px-20 lg:px-32">
      <div className="w-full md:w-3/5 mx-auto flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0 justify-center">

        {/* Students */}
        <motion.div
          className={`${cardStyle} text-white bg-blue-800 flex-1`}
          whileInView={{ opacity: [0, 1], y: [40, 0] }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CarFront className="text-white text-4xl" />
          <h3 className="text-2xl font-bold">
            {hasAnimated ? (
              <CountUp
                end={30000}
                duration={3}
                separator=","
                onEnd={() => handleEnd("students")}
              />
            ) : (
              "0"
            )}
            +
          </h3>
          <p>complaint solved</p>
          <AnimatePresence>
            {heartsVisible.students && <HeartBurst />}
          </AnimatePresence>
        </motion.div>

        {/* Hours */}
        <motion.div
          className={`${cardStyle} text-white bg-blue-800 flex-1`}
          whileInView={{ opacity: [0, 1], y: [40, 0] }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Clock className="text-white text-4xl" />
          <h3 className="text-2xl font-bold">
            {hasAnimated ? (
              <CountUp
                end={24}
                duration={2}
                onEnd={() => handleEnd("hours")}
              />
            ) : (
              "0"
            )}
            /7
          </h3>
          <p>hours</p>
          <AnimatePresence>
            {heartsVisible.hours && <HeartBurst />}
          </AnimatePresence>
        </motion.div>

        {/* Exams */}
        <motion.div
          className={`${cardStyle} text-white bg-blue-800 flex-1`}
          whileInView={{ opacity: [0, 1], y: [40, 0] }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Trophy className="text-white text-4xl" />
          <h3 className="text-2xl font-bold">
            {hasAnimated ? (
              <CountUp
                end={300}
                duration={3}
                onEnd={() => handleEnd("exams")}
              />
            ) : (
              "0"
            )}
            +
          </h3>
          <p>feedback</p>
          <AnimatePresence>
            {heartsVisible.exams && <HeartBurst />}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

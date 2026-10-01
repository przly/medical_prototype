import { useEffect, useState } from "react";
import { motion, MotionConfig } from "motion/react";
import Intro from "./intro/Intro.jsx";
import LoopPrototype from "./prototype/LoopPrototype.jsx";

// Story arc: the world today → what prevention changes → the product loop.
export default function App() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stage]);

  return (
    <MotionConfig reducedMotion="user">
      <main className={`page page-proto ${stage === 2 ? "page-wide" : ""}`}>
        {stage < 2 ? (
          <Intro stage={stage} go={setStage} />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <LoopPrototype onBack={() => setStage(1)} />
          </motion.div>
        )}
      </main>
    </MotionConfig>
  );
}

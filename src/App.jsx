import { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import Intro from "./intro/Intro.jsx";
import LoopPrototype from "./prototype/LoopPrototype.jsx";
import qrCode from "./assets/qr.svg";

// Where the prototype is hosted; the QR code in the corner opens it on a phone.
const LIVE_URL = "https://medical-prototype-lyart.vercel.app/";

const crossfade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Story arc: the world today → what prevention changes → the product loop.
export default function App() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stage]);

  return (
    <MotionConfig reducedMotion="user">
      <a className="page-qr" href={LIVE_URL} target="_blank" rel="noreferrer">
        <span>
          Want to look at this later? <b>Scan here!</b>
        </span>
        <img src={qrCode} alt="QR code that opens this prototype" width={112} height={112} />
      </a>
      <main className={`page page-proto ${stage === 2 ? "page-wide" : ""}`}>
        {/* The context pages and the prototype cross over: one fades out, then
            the other comes in. Only opacity here, since a transform would
            unpin the fixed step bar and back button inside. */}
        <AnimatePresence mode="wait" initial={false}>
          {stage < 2 ? (
            <motion.div key="intro" {...crossfade}>
              <Intro stage={stage} go={setStage} />
            </motion.div>
          ) : (
            <motion.div key="proto" {...crossfade}>
              <LoopPrototype onBack={() => setStage(1)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}

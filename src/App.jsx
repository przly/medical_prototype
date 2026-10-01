import { useEffect, useState } from "react";
import { motion, MotionConfig } from "motion/react";
import Intro from "./intro/Intro.jsx";
import LoopPrototype from "./prototype/LoopPrototype.jsx";
import qrCode from "./assets/qr.svg";

// Where the prototype is hosted; the QR code in the corner opens it on a phone.
const LIVE_URL = "https://medical-prototype-lyart.vercel.app/";

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

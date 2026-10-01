import { MotionConfig } from "motion/react";
import LoopPrototype from "./prototype/LoopPrototype.jsx";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="page page-proto">
        <LoopPrototype />
      </main>
    </MotionConfig>
  );
}

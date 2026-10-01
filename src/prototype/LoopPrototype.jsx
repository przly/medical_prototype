import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Icon from "../Icon.jsx";
import { steps } from "../content.js";
import { screens, spring } from "./screens.jsx";
import "./prototype.css";

const ease = [0.22, 1, 0.36, 1];

// App tabs from the information architecture, and which step each one opens.
const tabs = [
  { label: "Today", icon: "pulse", step: 0, owns: [0] },
  { label: "Reflect", icon: "mic", step: 1, owns: [1, 2] },
  { label: "Insights", icon: "map", step: 4, owns: [3, 4, 5] },
  { label: "Care", icon: "shield", step: 6, owns: [6] },
];

// Where a flick would come to rest, using Apple's scroll deceleration.
const project = (velocity, rate = 0.998) => ((velocity / 1000) * rate) / (1 - rate);

// iOS navigation-stack motion: pushed screens slide in over the current one,
// which drifts left and dims; popping reverses along the same path.
const push = {
  enter: (d) => ({ x: d > 0 ? "100%" : "-30%", opacity: d > 0 ? 1 : 0.6, zIndex: d > 0 ? 2 : 1 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d > 0 ? "-30%" : "100%", opacity: d > 0 ? 0.6 : 1, zIndex: d > 0 ? 1 : 2 }),
};

// The device clock, shown the way iOS does: hours and minutes, no AM/PM.
function useClock() {
  const read = () =>
    new Date()
      .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      .replace(/\s?[AP]\.?M\.?/i, "");
  const [time, setTime] = useState(read);
  useEffect(() => {
    const id = setInterval(() => setTime(read()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// Wi-Fi fan: a dot and two arcs as filled annular wedges, like the iOS glyph.
function wedge(cx, cy, r0, r1, a0 = -135, a1 = -45) {
  const pt = (r, a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = pt(r1, a0);
  const [x1, y1] = pt(r1, a1);
  const [x2, y2] = pt(r0, a1);
  const [x3, y3] = pt(r0, a0);
  return `M${x0} ${y0}A${r1} ${r1} 0 0 1 ${x1} ${y1}L${x2} ${y2}${r0 ? `A${r0} ${r0} 0 0 0 ${x3} ${y3}` : ""}Z`;
}

function StatusBar() {
  const time = useClock();
  return (
    <div className="status" aria-hidden="true">
      <span className="status-time">{time}</span>
      <span className="island" />
      <span className="status-icons">
        <svg width="19" height="12" viewBox="0 0 19 12">
          {[4, 6.5, 9, 12].map((h, i) => (
            <rect key={i} x={i * 5} y={12 - h} width="3.4" height={h} rx="1" />
          ))}
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12">
          <path d={wedge(8.5, 11.4, 0, 3.2)} />
          <path d={wedge(8.5, 11.4, 4.8, 7.4)} />
          <path d={wedge(8.5, 11.4, 9, 11.6)} />
        </svg>
        <svg width="28" height="13" viewBox="0 0 28 13">
          <rect x="0.5" y="0.5" width="24" height="12" rx="3.8" fill="none" stroke="currentColor" opacity="0.35" />
          <rect x="2" y="2" width="17" height="9" rx="2.5" />
          <path d="M26 4.3v4.4a2.2 2.2 0 0 0 0-4.4Z" opacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

// One accent per layer, shared by the in-app wash and the glow behind the phone.
// iOS system colours: green, orange, indigo, purple.
const tints = { body: "#34c759", context: "#ff9500", ai: "#5856d6", care: "#af52de" };

function Phone({ active, dir, go }) {
  const ScreenComponent = screens[active];
  const first = active === 0;
  const last = active === screens.length - 1;

  const onDragEnd = (_, { offset, velocity }) => {
    const width = 393;
    const landing = offset.x + project(velocity.x);
    if (landing < -width / 3 && !last) go(active + 1);
    else if (landing > width / 3 && !first) go(active - 1);
  };

  return (
    <div className="phone">
      <div className="phone-screen" style={{ "--tint": tints[steps[active].layer] }}>
        <StatusBar />
        <div className="viewport">
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={active}
              className="screen"
              custom={dir}
              variants={push}
              initial="enter"
              animate="center"
              exit="exit"
              transition={spring}
              drag="x"
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              // Follows the finger toward a neighbour; resists hard at the ends.
              dragElastic={{ left: last ? 0.12 : 0.5, right: first ? 0.12 : 0.5 }}
              dragTransition={{ bounceStiffness: 400, bounceDamping: 40 }}
              onDragEnd={onDragEnd}
            >
              <ScreenComponent next={() => go(active + 1)} restart={() => go(0)} />
            </motion.div>
          </AnimatePresence>
        </div>
        <nav className="tabbar" aria-label="App sections">
          {tabs.map((t) => {
            const on = t.owns.includes(active);
            return (
              <button
                key={t.label}
                className={on ? "on" : ""}
                onClick={() => go(t.step)}
                aria-current={on ? "page" : undefined}
              >
                {/* The selection lens glides between tabs, as in iOS 26/27. */}
                {on && <motion.span layoutId="tab-lens" className="tab-lens" transition={spring} />}
                <Icon name={t.icon} size={24} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>
        <span className="home-indicator" aria-hidden="true" />
      </div>
    </div>
  );
}

// The phone is designed at real point sizes and scaled as a whole to fill the window.
// iPhone 16 Pro: a 393×852pt screen inside a 12pt bezel.
const PHONE_W = 417;
const PHONE_H = 876;

function useFitScale() {
  // Leaves the page's vertical padding (2 × 48px) and side gutters free.
  const measure = () => {
    const { clientWidth, clientHeight } = document.documentElement;
    const byHeight = (clientHeight - 96) / PHONE_H;
    const byWidth = (clientWidth - 32) / PHONE_W;
    return Math.min(byHeight, byWidth, 1.5);
  };
  const [scale, setScale] = useState(measure);
  useEffect(() => {
    const onResize = () => setScale(measure());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return scale;
}

export default function LoopPrototype() {
  const scale = useFitScale();
  const [[active, dir], setState] = useState([0, 1]);
  const go = (i) => {
    const next = Math.max(0, Math.min(steps.length - 1, i));
    if (next !== active) setState([next, next > active ? 1 : -1]);
  };
  const step = steps[active];

  // Keep the active step visible when the list scrolls sideways on mobile.
  const listRef = useRef(null);
  useEffect(() => {
    const list = listRef.current;
    const el = list?.children[active];
    if (!list || !el || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({
      left: el.offsetLeft - (list.clientWidth - el.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [active]);

  const tint = tints[step.layer];

  return (
    <div className="proto">
      <div className="ambient" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.div
            key={tint}
            className="ambient-glow"
            style={{ "--glow": tint }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </AnimatePresence>
      </div>
      <ol ref={listRef} className="proto-steps" role="tablist" aria-label="Core loop steps">
        {steps.map((s, i) => {
          const on = i === active;
          return (
            <li key={s.verb}>
              <button
                role="tab"
                aria-selected={on}
                className={`proto-step layer-${s.layer} ${on ? "on" : ""}`}
                onClick={() => go(i)}
              >
                {on && (
                  <motion.span
                    layoutId="proto-active"
                    className="proto-step-bg"
                    transition={spring}
                  />
                )}
                <span className="proto-node">
                  <Icon name={s.icon} size={18} />
                </span>
                <span className="proto-copy">
                  <span className="proto-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="proto-verb">{s.verb}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div
        className="proto-stage"
        style={{ width: PHONE_W * scale, height: PHONE_H * scale, "--scale": scale }}
      >
        {/* Map pointer positions into the phone's unscaled space so drags stay 1:1. */}
        <MotionConfig transformPagePoint={(p) => ({ x: p.x / scale, y: p.y / scale })}>
          <Phone active={active} dir={dir} go={go} />
        </MotionConfig>
      </div>

      <div className={`proto-explain layer-${step.layer}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease }}
          >
            <span className="proto-num">
              Step {active + 1} of {steps.length}
            </span>
            <h3>{step.verb}</h3>
            <p>{step.text}</p>
            <span className="step-detail">{step.detail}</span>
          </motion.div>
        </AnimatePresence>
        <div className="proto-nav">
          <button onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous step">
            <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
          </button>
          <div className="proto-dots" aria-hidden="true">
            {steps.map((s, i) => (
              <span key={s.verb} className={i === active ? "on" : ""} />
            ))}
          </div>
          <button
            onClick={() => go(active + 1)}
            disabled={active === steps.length - 1}
            aria-label="Next step"
          >
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
        <p className="proto-hint">Tap the buttons inside the phone to move through the flow.</p>
      </div>
    </div>
  );
}

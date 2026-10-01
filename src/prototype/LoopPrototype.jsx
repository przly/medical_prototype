import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { Button, Tabs } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import Icon from "../Icon.jsx";
import { steps } from "../content.js";
import { DOCTOR_FROM, doctorScreens, initialCare, screens, spring } from "./screens.jsx";
import phoneFrame from "../assets/device/iphone-frame.png";
import patientImage from "../assets/avatars/annie.jpg";
import doctorImage from "../assets/avatars/doctor.jpg";
import "./prototype.css";

const ease = [0.22, 1, 0.36, 1];

// App tabs from the information architecture, and which step each one opens.
const tabs = [
  { label: "Today", icon: "pulse", step: 1, owns: [1] },
  { label: "Logs", icon: "mic", step: 2, owns: [2, 3] },
  { label: "Insights", icon: "map", step: 5, owns: [4, 5, 6] },
  { label: "Care", icon: "shield", step: 7, owns: [7, 8, 9] },
];

// The doctor's app has one tab per shared step.
const doctorTabs = [
  { label: "Overview", icon: "map", step: 7, owns: [7] },
  { label: "Session", icon: "chat", step: 8, owns: [8] },
  { label: "Access", icon: "key", step: 9, owns: [9] },
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

// One device. The patient's and the doctor's phones differ only in what they're given.
function Phone({ name, screens, offset = 0, tabs, hideTabs, active, dir, go, min, max, screenProps }) {
  const ScreenComponent = screens[active - offset];
  const first = active === min;
  const last = active === max;

  const onDragEnd = (_, { offset: drag, velocity }) => {
    const width = 393;
    const landing = drag.x + project(velocity.x);
    if (landing < -width / 3 && !last) go(active + 1);
    else if (landing > width / 3 && !first) go(active - 1);
  };

  return (
    // The app inside the phone stays light whatever the page theme.
    <div className="phone" data-theme="light">
      <img className="phone-shadow" src={phoneFrame} alt="" aria-hidden="true" draggable={false} />
      <div className="phone-screen">
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
              <ScreenComponent next={() => go(active + 1)} {...screenProps} />
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Onboarding runs full screen; the tab bar arrives with the app itself. */}
        <AnimatePresence initial={false}>
          {!hideTabs && (
            <motion.nav
              className="tabbar"
              aria-label="App sections"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={spring}
            >
              {tabs.map((t) => {
                const on = t.owns.includes(active);
                return (
                  <button
                    key={t.label}
                    className={on ? "on" : ""}
                    onClick={() => go(t.step)}
                    aria-current={on ? "page" : undefined}
                  >
                    {/* The selection lens glides between tabs; one per phone. */}
                    {on && <motion.span layoutId={`tab-lens-${name}`} className="tab-lens" transition={spring} />}
                    <Icon name={t.icon} size={24} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </motion.nav>
          )}
        </AnimatePresence>
        <span className="home-indicator" aria-hidden="true" />
      </div>
      <img className="phone-frame" src={phoneFrame} alt="" draggable={false} />
    </div>
  );
}

// The phone is designed at real point sizes and scaled as a whole to fill the window.
// The device frame image, sized so its screen opening is 393pt wide.
const PHONE_W = 441;
const PHONE_H = 901;
const PHONE_GAP = 56;
// Below this width the layout stacks and shows one phone at a time.
const WIDE = 960;

function useViewport() {
  const read = () => {
    const { clientWidth, clientHeight } = document.documentElement;
    return { w: clientWidth, h: clientHeight };
  };
  const [size, setSize] = useState(read);
  useEffect(() => {
    const onResize = () => setSize(read());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

// Leaves the page's vertical padding (2 × 48px) and the step bar free and, on
// wide screens, room for the explanation beside the phones.
function fitScale({ w, h }, phones) {
  const labels = phones > 1 ? 52 : 0;
  const byHeight = (h - 96 - 72 - labels) / PHONE_H;
  const room = w >= WIDE ? Math.min(w, 1440) - 32 - 80 - 280 : w - 32;
  const byWidth = (room - PHONE_GAP * (phones - 1)) / (PHONE_W * phones);
  return Math.max(0.3, Math.min(byHeight, byWidth, 1.5));
}

export default function LoopPrototype({ onBack }) {
  const viewport = useViewport();
  const [[active, dir], setState] = useState([0, 1]);
  const go = (i) => {
    const next = Math.max(0, Math.min(steps.length - 1, i));
    if (next !== active) setState([next, next > active ? 1 : -1]);
  };
  const step = steps[active];

  // What the patient and the doctor do to the same record.
  const [care, setCare] = useState(initialCare);
  const update = (patch) => setCare((c) => ({ ...c, ...patch }));
  const restart = () => {
    setCare(initialCare);
    go(1);
  };
  const screenProps = { care, update, restart };

  // From the Share step on there are two perspectives: side by side when there
  // is room, otherwise one at a time behind a switch.
  const dual = active >= DOCTOR_FROM;
  const both = dual && viewport.w >= WIDE;
  const [view, setView] = useState("patient");
  const showDoctor = dual && (both || view === "doctor");
  const showPatient = !dual || both || view === "patient";
  const scale = fitScale(viewport, both ? 2 : 1);
  const slot = {
    in: { opacity: 1, width: PHONE_W * scale, height: PHONE_H * scale },
    out: { opacity: 0, width: 0, height: PHONE_H * scale },
  };

  // Steps are as wide as their labels, so the active one is measured: the row
  // shifts until it is centred and the highlight takes its width.
  const trackRef = useRef(null);
  const [pill, setPill] = useState(null);
  useLayoutEffect(() => {
    const measure = () => {
      const el = trackRef.current?.children[active];
      if (el) setPill({ x: -(el.offsetLeft + el.offsetWidth / 2), width: el.offsetWidth });
    };
    measure();
    // Label widths change once the web font arrives.
    document.fonts?.ready.then(measure);
  }, [active]);
  const slide = pill ? spring : { duration: 0 };

  return (
    <div className="proto">
      <Button className="proto-back" size="sm" variant="outline" onPress={onBack}>
        <ArrowLeft size={16} strokeWidth={2.25} aria-hidden="true" />
        Context
      </Button>
      {/* Step carousel: every step is shown, the active one stays in the middle
          and the row slides under a highlight that hugs it. */}
      <div className="proto-steps">
        <motion.span
          className="proto-step-bg"
          initial={false}
          animate={{ width: pill?.width ?? 0 }}
          transition={slide}
        />
        <motion.ol
          ref={trackRef}
          className="proto-track"
          role="tablist"
          aria-label="Core loop steps"
          initial={false}
          animate={{ x: pill?.x ?? 0 }}
          transition={slide}
        >
        {steps.map((s, i) => {
          const on = i === active;
          return (
            <li key={s.verb}>
              <button
                role="tab"
                aria-selected={on}
                className={`proto-step ${on ? "on" : ""}`}
                onClick={() => go(i)}
              >
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
        </motion.ol>
      </div>

      {dual && !both && (
        <Tabs className="view-toggle" selectedKey={view} onSelectionChange={setView}>
          <Tabs.ListContainer>
            <Tabs.List aria-label="Perspective">
              <Tabs.Tab id="patient">
                Patient
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="doctor">
                Doctor
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      )}

      <div className={`proto-stage ${both ? "dual" : ""}`} style={{ "--scale": scale }}>
        {/* Map pointer positions into the phone's unscaled space so drags stay 1:1. */}
        <MotionConfig transformPagePoint={(p) => ({ x: p.x / scale, y: p.y / scale })}>
          <AnimatePresence initial={false}>
            {showPatient && (
              <motion.div
                key="patient"
                className="phone-slot"
                initial={slot.out}
                animate={slot.in}
                exit={slot.out}
                transition={spring}
              >
                {both && (
                  <span className="phone-role role-patient">
                    <img src={patientImage} alt="" width={36} height={36} />
                    Patient
                  </span>
                )}
                <Phone
                  name="patient"
                  screens={screens}
                  tabs={tabs}
                  hideTabs={active === 0}
                  active={active}
                  dir={dir}
                  go={go}
                  min={0}
                  max={steps.length - 1}
                  screenProps={screenProps}
                />
              </motion.div>
            )}
            {showDoctor && (
              <motion.div
                key="doctor"
                className="phone-slot"
                initial={slot.out}
                animate={slot.in}
                exit={slot.out}
                transition={spring}
              >
                {both && (
                  <span className="phone-role role-doctor">
                    <img src={doctorImage} alt="" width={36} height={36} />
                    Doctor
                  </span>
                )}
                <Phone
                  name="doctor"
                  screens={doctorScreens}
                  offset={DOCTOR_FROM}
                  tabs={doctorTabs}
                  // Stays on its first screen while it slides away.
                  active={Math.max(active, DOCTOR_FROM)}
                  dir={dir}
                  go={go}
                  min={DOCTOR_FROM}
                  max={steps.length - 1}
                  screenProps={screenProps}
                />
              </motion.div>
            )}
          </AnimatePresence>
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
            <span className="proto-when">{step.when}</span>
            <h3>{step.title}</h3>
            {step.story.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </motion.div>
        </AnimatePresence>
        {dual && (
          <p className="proto-hint">
            Both phones are live: what the patient does shows up on the doctor’s
            side, and the other way round.
          </p>
        )}
      </div>
    </div>
  );
}

import { motion, AnimatePresence } from "motion/react";
import { Button, Card, Chip } from "@heroui/react";
import {
  Ambulance,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BedDouble,
  Brain,
  Briefcase,
  Coins,
  Eye,
  Hospital,
  ScanSearch,
  Scale,
  Stethoscope,
} from "lucide-react";
import { spring } from "../prototype/screens.jsx";
import "./intro.css";

const ease = [0.22, 1, 0.36, 1];

// Same staggered entrance as the cards inside the phone.
const list = {
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

const MotionCard = motion.create(Card);

const draw = (delay = 0.4) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { duration: 1, ease, delay },
});

/* ---------- Scene 1 · the world today ---------- */

// A wearable reading that dips, with nothing to say what was going on.
function NoContext() {
  return (
    <div className="viz-spark">
      <svg viewBox="0 0 240 70" aria-hidden="true">
        <motion.polyline
          points="6,22 44,26 82,20 120,54 158,30 196,24 234,22"
          className="viz-line"
          {...draw()}
        />
        <circle cx="120" cy="54" r="5" className="viz-dot" />
      </svg>
      <motion.span
        className="viz-bubble"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...spring, delay: 1.1 }}
      >
        Why?
      </motion.span>
    </div>
  );
}

// The pattern map with only this week filled in.
function NoTrends() {
  return (
    <div className="viz-weeks">
      {[0, 1, 2].map((row) => (
        <div key={row}>
          {Array.from({ length: 10 }).map((_, i) => (
            <i key={i} className={i === 9 ? "now" : ""} />
          ))}
        </div>
      ))}
      <span>Today</span>
    </div>
  );
}

// A timeline that gets vaguer the further back you try to remember.
function Memory() {
  return (
    <div className="viz-memory">
      <span className="viz-quote">“About three weeks ago… I think?”</span>
      <div className="viz-fade" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <i key={i} style={{ opacity: 0.08 + (i / 8) ** 2 * 0.92 }} />
        ))}
      </div>
    </div>
  );
}

// Three places that each hold part of your record, with nothing between them.
function Fragmented() {
  const places = [
    [Stethoscope, "GP"],
    [Brain, "Therapist"],
    [Hospital, "Hospital"],
  ];
  return (
    <div className="viz-places">
      {places.map(([PlaceIcon, label], i) => (
        <div key={label} className="viz-place">
          {i > 0 && <span className="viz-gap" aria-hidden="true" />}
          <span className="viz-node">
            <PlaceIcon size={32} strokeWidth={2} aria-hidden="true" />
          </span>
          <em>{label}</em>
        </div>
      ))}
    </div>
  );
}

const problems = [
  {
    viz: NoContext,
    color: "#698edb",
    title: "Data without context",
    text: "Your wearable shows that something changed. It can’t tell what was going on in your life at the time.",
  },
  {
    viz: NoTrends,
    color: "#528fed",
    title: "No trends over time",
    text: "Nothing shows how your mental and physical health change from month to month.",
  },
  {
    viz: Memory,
    color: "#f47d4d",
    title: "Your timeline comes from memory",
    text: "When your GP asks how the past weeks went, you can only report what you remember.",
  },
  {
    viz: Fragmented,
    color: "#6842c7",
    title: "Your file doesn’t travel",
    text: "Your records sit in separate systems, so not every doctor can see them.",
  },
];

/* ---------- Scene 2 · what prevention changes ---------- */

const system = [
  [Coins, "#28c886", "Treatment costs", "down", "Lower"],
  [BedDouble, "#528fed", "Hospital admissions", "down", "Fewer"],
  [Ambulance, "#698edb", "Emergency visits", "down", "Fewer"],
  [Scale, "#4167ad", "How resources are used", "up", "Better"],
];

const you = [
  [ScanSearch, "#28c886", "Treatment results", "up", "Better"],
  [Briefcase, "#f47d4d", "Sick days", "down", "Fewer"],
  [Eye, "#6842c7", "Health awareness", "up", "Better"],
];

function Benefits({ title, rows }) {
  return (
    <MotionCard className="intro-card" variants={item}>
      <span className="intro-label">{title}</span>
      <ul className="benefits">
        {rows.map(([RowIcon, color, label, dir, word]) => (
          <li key={label}>
            <span className="tile" style={{ background: color }}>
              <RowIcon size={24} strokeWidth={2.25} color="#fff" aria-hidden="true" />
            </span>
            <span className="benefit-label">{label}</span>
            <Chip color="success" variant="soft">
              {dir === "down" ? (
                <ArrowDown size={12} strokeWidth={3} aria-hidden="true" />
              ) : (
                <ArrowUp size={12} strokeWidth={3} aria-hidden="true" />
              )}
              <Chip.Label>{word}</Chip.Label>
            </Chip>
          </li>
        ))}
      </ul>
    </MotionCard>
  );
}

// Illustration, not data: the same problem, caught at two different moments.
function Curve() {
  return (
    <MotionCard className="intro-card curve" variants={item}>
      <div className="curve-plot">
        <svg viewBox="0 0 640 240" role="img" aria-label="Illustration: a problem noticed late grows large, the same problem noticed early stays small.">
          <line x1="1" y1="0" x2="1" y2="228" className="curve-axis" />
          <line x1="0" y1="228" x2="640" y2="228" className="curve-axis" />
          {/* Both lines share one path until the problem is noticed (the dot):
              the early line is the first half of the late curve, then turns
              back down. The early line is drawn on top, so the late one
              branches off it. */}
          {/* The lines keep a fixed on-screen thickness, so they are revealed
              by a growing clip rather than by a dash-based draw. */}
          <clipPath id="curve-reveal">
            <motion.rect
              y="0"
              height="240"
              initial={{ width: 0 }}
              animate={{ width: 648 }}
              transition={{ duration: 1.2, ease, delay: 0.3 }}
            />
          </clipPath>
          <g clipPath="url(#curve-reveal)">
            <path d="M0 212 C160 209 260 198 360 130 S520 31 640 23" className="curve-late" />
            <path
              d="M0 212 C80 210.5 145 207 202.5 195.4 C237 188.4 400 200 640 206"
              className="curve-early"
            />
          </g>
          <circle cx="202.5" cy="195.4" r="8" className="curve-dot" />
        </svg>
        {/* Sits above the dot; positioned in the chart's own coordinates. */}
        <motion.span
          className="curve-mark"
          style={{ left: `${(202.5 / 640) * 100}%`, top: `${(195.4 / 240) * 100}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1 }}
        >
          Noticed
        </motion.span>
        <span className="curve-y">Severity</span>
      </div>
      <span className="curve-x">Time</span>
      <div className="curve-legend">
        {/* Each key is a short sample of its line: same colour, same stroke. */}
        <span>
          <svg viewBox="0 0 30 6" aria-hidden="true">
            <line x1="3" y1="3" x2="27" y2="3" className="curve-late" />
          </svg>
          Noticed late, it takes treatment and time off
        </span>
        <span>
          <svg viewBox="0 0 30 6" aria-hidden="true">
            <line x1="3" y1="3" x2="27" y2="3" className="curve-early" />
          </svg>
          Noticed early, a small change can be enough
        </span>
      </div>
    </MotionCard>
  );
}

/* ---------- Shell ---------- */

const scenes = [
  {
    tint: "#f47d4d",
    eyebrow: "The world today",
    title: "No one sees your whole health picture.",
    lede: "Your watch has the numbers and each doctor has part of your file. Nobody has the overview, including you.",
    next: "What could change",
  },
  {
    tint: "#28c886",
    eyebrow: "What prevention changes",
    title: "Problems caught early are easier to treat.",
    lede: "Prevention helps you, and it takes pressure off the care system.",
    next: "See how it works",
  },
];

export default function Intro({ stage, go }) {
  const scene = scenes[stage];

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={stage}
          className="intro"
          style={{ "--tint": scene.tint }}
          variants={list}
          initial="initial"
          animate="animate"
          exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
        >
          <motion.header className="intro-head" variants={item}>
            <span className="intro-eyebrow">{scene.eyebrow}</span>
            <h1>{scene.title}</h1>
            <p>{scene.lede}</p>
          </motion.header>

          {stage === 0 ? (
            <div className="intro-grid">
              {problems.map(({ viz: Viz, color, title, text }) => (
                <MotionCard
                  key={title}
                  className="intro-card problem-card"
                  style={{ "--k": color }}
                  variants={item}
                >
                  <div className="viz">
                    <Viz />
                  </div>
                  <div className="intro-card-text">
                    <h2>{title}</h2>
                    <p>{text}</p>
                  </div>
                </MotionCard>
              ))}
            </div>
          ) : (
            <>
              <Curve />
              <div className="intro-grid">
                <Benefits title="For the care system" rows={system} />
                <Benefits title="For you" rows={you} />
              </div>
            </>
          )}

          <motion.footer className="intro-nav" variants={item}>
            <Button
              isIconOnly
              size="lg"
              variant="outline"
              className={stage === 0 ? "invisible" : ""}
              onPress={() => go(stage - 1)}
              isDisabled={stage === 0}
              aria-label="Back"
            >
              <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
            </Button>
            <div className="intro-dots" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span key={i} className={i === stage ? "on" : ""} />
              ))}
            </div>
            <Button size="lg" onPress={() => go(stage + 1)}>
              {scene.next}
              <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
            </Button>
          </motion.footer>
        </motion.section>
      </AnimatePresence>
    </>
  );
}

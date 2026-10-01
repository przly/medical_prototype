import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  ArrowDownRight,
  ArrowUpRight,
  AudioLines,
  Briefcase,
  CalendarDays,
  ChartLine,
  Check,
  CircleCheck,
  ClipboardList,
  Dumbbell,
  Heart,
  HeartPulse,
  Info,
  Lock,
  Mic,
  Minus,
  Moon,
  Presentation,
  Repeat,
  RotateCcw,
  ShieldCheck,
  ShieldOff,
  Smile,
  Sprout,
  Target,
  TrendingUp,
  User,
  Watch,
  Waypoints,
  Zap,
} from "lucide-react";

const iconProps = { size: 18, strokeWidth: 2.25, "aria-hidden": true };

// One icon and colour per metric, used the same way on every screen.
const metrics = {
  sleep: { icon: Moon, color: "var(--app-sleep)" },
  hrv: { icon: HeartPulse, color: "var(--app-heart)" },
  heart: { icon: Heart, color: "var(--app-heart)" },
  stress: { icon: Zap, color: "var(--app-stress)" },
  mood: { icon: Smile, color: "var(--app-mood)" },
  activity: { icon: Dumbbell, color: "var(--app-activity)" },
};

// The companion's mark: a small version of the voice orb. It appears wherever
// the app is noticing something on your behalf.
export function Orb({ size = 28 }) {
  return (
    <motion.span
      className="orb-mini"
      style={{ width: size, height: size }}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.35, duration: 0.6, delay: 0.25 }}
      aria-hidden="true"
    />
  );
}

function MetricIcon({ metric, size = 14 }) {
  const { icon: M, color } = metrics[metric];
  return <M size={size} strokeWidth={2.25} color={color} aria-hidden="true" />;
}

// Card heading in the Health app style: icon and name in the metric's colour.
function Label({ metric, icon: I, children }) {
  return (
    <span
      className="card-label with-icon"
      style={metric ? { color: metrics[metric].color } : undefined}
    >
      {metric ? <MetricIcon metric={metric} size={16} /> : I && <I size={16} strokeWidth={2.25} aria-hidden="true" />}
      {children}
    </span>
  );
}

const ease = [0.22, 1, 0.36, 1];

// Critically damped spring: settles without overshoot.
export const spring = { type: "spring", bounce: 0, duration: 0.4 };

// A light tick on meaningful commits (Android; ignored where unsupported).
const haptic = () => navigator.vibrate?.(8);

// Staggered entrance for the cards on each screen.
const list = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const item = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

// iOS navigation: a large title that hands over to a compact inline title,
// with a soft scroll-edge blur (no hard bar) once content moves under it.
function Screen({ eyebrow, title, trailing, action, children }) {
  const scrollRef = useRef(null);
  const { scrollY } = useScroll({ container: scrollRef });
  const barOpacity = useTransform(scrollY, [24, 48], [0, 1]);
  const titleScale = useTransform(scrollY, [-80, 0], [1.08, 1]);
  // The large title fades as it slides under the bar, handing over to the inline one.
  const titleOpacity = useTransform(scrollY, [8, 40], [1, 0]);

  return (
    <div className="screen-inner">
      <motion.div className="scroll-edge" style={{ opacity: barOpacity }} aria-hidden="true" />
      <div className="navbar">
        <motion.span className="navbar-title" style={{ opacity: barOpacity }}>
          {title}
        </motion.span>
        {trailing && <div className="navbar-trailing">{trailing}</div>}
      </div>
      <motion.div
        ref={scrollRef}
        className="app-scroll"
        variants={list}
        initial="initial"
        animate="animate"
      >
        <motion.header className="app-head" variants={item}>
          <span className="app-eyebrow">{eyebrow}</span>
          <motion.h4 className="app-title" style={{ scale: titleScale, opacity: titleOpacity }}>
            {title}
          </motion.h4>
        </motion.header>
        {children}
      </motion.div>
      {/* The main action stays pinned above the tab bar; content scrolls beneath it. */}
      <AnimatePresence initial={false}>
        {action && (
          <motion.div
            key="action"
            className="screen-action"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { ...spring, delay: 0.15 } }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
          >
            {action}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Card({ children, className = "", ...rest }) {
  return (
    <motion.div className={`app-card ${className}`} variants={item} {...rest}>
      {children}
    </motion.div>
  );
}

function Primary({ children, icon: ButtonIcon, onClick, disabled }) {
  return (
    <motion.button
      className="app-primary"
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
    >
      {ButtonIcon && <ButtonIcon {...iconProps} />}
      {children}
    </motion.button>
  );
}

function Ring({ value, metric, label, sub }) {
  const r = 30;
  const { color } = metrics[metric];
  return (
    <div className="ring">
      <span className="ring-icon">
        <MetricIcon metric={metric} size={20} />
      </span>
      <svg viewBox="0 0 72 72" width="72" height="72">
        <circle cx="36" cy="36" r={r} stroke={color} className="ring-track" />
        <motion.circle
          cx="36"
          cy="36"
          r={r}
          stroke={color}
          className="ring-value"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: value }}
          transition={{ duration: 1.1, ease, delay: 0.2 }}
        />
      </svg>
      <strong>{label}</strong>
      <span>{sub}</span>
    </div>
  );
}

// Tags say where a piece of information came from.
const tagIcons = { sensor: Watch, you: User, pos: Sprout, neutral: Repeat };

function Tag({ kind, children }) {
  const TagIcon = tagIcons[kind];
  return (
    <span className={`tag tag-${kind}`}>
      {TagIcon && <TagIcon size={11} strokeWidth={2.5} aria-hidden="true" />}
      {children}
    </span>
  );
}

/* 01 · Sense — Today */
function Today({ next }) {
  const hr = [58, 57, 59, 56, 58, 61, 57];
  return (
    <Screen
      eyebrow="Wednesday 16 October"
      title="Good afternoon"
      action={<Primary icon={Mic} onClick={next}>Log a thought</Primary>}
      trailing={
        <button className="glass-circle avatar-btn" aria-label="Profile and privacy">
          SK
        </button>
      }
    >
      <Card className="rings">
        <Ring value={0.86} metric="sleep" label="7h 31m" sub="Sleep" />
        <Ring value={0.72} metric="hrv" label="48 ms" sub="HRV" />
        <Ring value={0.35} metric="stress" label="Low" sub="Stress" />
      </Card>
      <Card>
        <div className="row-between">
          <Label metric="heart">Resting heart rate</Label>
          <Tag kind="sensor">Sensor</Tag>
        </div>
        <div className="big-num">
          57 <small>bpm</small>
        </div>
        <svg viewBox="0 0 260 60" className="spark">
          <rect x="0" y="18" width="260" height="22" rx="6" className="baseline-band" />
          <motion.polyline
            points={hr.map((v, i) => `${10 + i * 40},${60 - (v - 50) * 4}`).join(" ")}
            className="spark-line"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease, delay: 0.3 }}
          />
        </svg>
        <p className="card-foot">Within your usual range this week.</p>
      </Card>
      <Card className="nudge">
        <Orb size={36} />
        <div>
          <p>Anything on your mind?</p>
          <span>Say it in a few seconds. We'll keep it for your weekly reflection.</span>
        </div>
      </Card>
    </Screen>
  );
}

/* 02 · Capture — Quick reflection */
const transcript =
  "Really stressful day today. I had a big presentation at work and barely slept last night.";

function Capture({ next }) {
  const words = transcript.split(" ");
  const [shown, setShown] = useState(0);
  const [saved, setSaved] = useState(false);
  const done = shown >= words.length;

  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setShown((n) => n + 1), 140);
    return () => clearTimeout(t);
  }, [shown, done]);

  const seconds = Math.round((shown / words.length) * 18);

  // Move on after the confirmation, unless the user has already left this screen.
  const advance = useRef(null);
  useEffect(() => () => clearTimeout(advance.current), []);

  const save = () => {
    haptic();
    setSaved(true);
    advance.current = setTimeout(next, 1400);
  };

  return (
    <Screen
      eyebrow="AirPods · Listening"
      title="Log a thought"
      action={
        <Primary icon={saved || done ? Check : Mic} onClick={save} disabled={!done || saved}>
          {saved ? "Saved" : done ? "Save reflection" : "Listening…"}
        </Primary>
      }
    >
      <Card className="recorder">
        <div className="orb-wrap">
          <motion.div
            className="orb"
            animate={done ? { scale: 1 } : { scale: [1, 1.12, 1] }}
            transition={done ? {} : { duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="timer">0:{String(seconds).padStart(2, "0")}</span>
        </div>
        <div className="wave" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.span
              key={i}
              animate={done ? { scaleY: 0.2 } : { scaleY: [0.2, 0.4 + ((i * 37) % 60) / 100, 0.2] }}
              transition={{ duration: 0.8, repeat: done ? 0 : Infinity, delay: (i % 6) * 0.08 }}
            />
          ))}
        </div>
      </Card>
      <Card>
        <Label icon={AudioLines}>Transcript</Label>
        <p className="transcript">
          {words.slice(0, shown).join(" ")}
          {!done && <span className="caret" />}
        </p>
      </Card>
      <p className="hint">
        <ShieldCheck size={13} strokeWidth={2.25} aria-hidden="true" />
        Only records when you ask it to.
      </p>
      <AnimatePresence>
        {saved && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 16, scale: 0.94, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 16, scale: 0.94, filter: "blur(6px)" }}
            transition={spring}
          >
            <Check {...iconProps} />
            Reflection saved · 18 sec · Today, 16:42
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  );
}

/* 03 · Structure — Reflection detail */
function Structure({ next }) {
  return (
    <Screen
      eyebrow="Today, 16:42 · 18 sec"
      title="Reflection"
      action={<Primary icon={Waypoints} onClick={next}>See connections</Primary>}
    >
      <Card>
        <p className="quote-sm">“{transcript}”</p>
      </Card>
      <Card>
        <span className="card-label">Context</span>
        <div className="chips">
          <span><Briefcase size={13} strokeWidth={2.25} aria-hidden="true" />Work</span>
          <span><Presentation size={13} strokeWidth={2.25} aria-hidden="true" />Presentation</span>
          <span><Moon size={13} strokeWidth={2.25} aria-hidden="true" />Poor sleep</span>
        </div>
      </Card>
      <Card>
        <div className="row-between">
          <span className="card-label">You said you felt</span>
          <Tag kind="you">You reported</Tag>
        </div>
        <div className="chips chips-warm">
          <span>Stressed</span>
          <span>Tired</span>
        </div>
      </Card>
      <Card>
        <div className="row-between">
          <span className="card-label">Around the same time</span>
          <Tag kind="sensor">Sensor</Tag>
        </div>
        <ul className="facts">
          <li><MetricIcon metric="stress" size={16} />Higher stress than usual</li>
          <li><MetricIcon metric="sleep" size={16} />Poor sleep last night · 5h 12m</li>
        </ul>
      </Card>
    </Screen>
  );
}

/* 04 · Connect — associations */
const links = [
  { a: "Work deadlines", b: "Higher stress", n: "4 of 5 days", strength: 0.8 },
  { a: "Short sleep", b: "Feeling tired", n: "6 of 8 days", strength: 0.75 },
  { a: "Exercise", b: "Better mood", n: "3 of 4 days", strength: 0.6, positive: true },
];

function Connect({ next }) {
  return (
    <Screen
      eyebrow="What we noticed"
      title="Connections"
      action={<Primary icon={CalendarDays} onClick={next}>Open weekly overview</Primary>}
    >
      {links.map((l, i) => (
        <Card key={l.a} className="link-card">
          <div className="link-row">
            <span className="node">{l.a}</span>
            <svg viewBox="0 0 60 12" className="link-line" aria-hidden="true">
              <motion.path
                d="M2 6 H58"
                className={l.positive ? "positive" : ""}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.15, ease }}
              />
            </svg>
            <span className={`node ${l.positive ? "node-pos" : ""}`}>{l.b}</span>
          </div>
          <div className="evidence">
            <div className="meter">
              <motion.span
                className={l.positive ? "positive" : ""}
                initial={{ width: 0 }}
                animate={{ width: `${l.strength * 100}%` }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.15, ease }}
              />
            </div>
            <span>{l.n}</span>
          </div>
        </Card>
      ))}
      <Card className="note">
        <Info size={16} strokeWidth={2.25} aria-hidden="true" />
        <p>
          These things <b>happened together</b>. That doesn't mean one caused
          the other.
        </p>
      </Card>
    </Screen>
  );
}

/* 05 · Reflect — Weekly overview */
const stressWeek = [0.35, 0.8, 0.9, 0.85, 0.5, 0.3, 0.25];
const days = ["M", "T", "W", "T", "F", "S", "S"];

function Weekly({ next }) {
  return (
    <Screen
      eyebrow="7 – 13 October"
      title="Your week"
      action={<Primary icon={TrendingUp} onClick={next}>See the long-term view</Primary>}
    >
      <Card className="summary">
        <span className="ai-label">
          <Orb size={18} />
          We noticed
        </span>
        <p>
          A more stressful week than usual, with lower sleep and energy. Your
          reflections often mentioned <b>work deadlines</b>.
        </p>
      </Card>
      <Card>
        <div className="row-between">
          <Label metric="stress">Stress</Label>
          <span className="delta up">
            <ArrowUpRight size={14} strokeWidth={2.5} aria-hidden="true" />
            Higher than usual
          </span>
        </div>
        <div className="bars">
          {stressWeek.map((v, i) => (
            <div key={i} className="bar-col">
              <motion.span
                className={v > 0.7 ? "hot" : ""}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: v }}
                transition={{ duration: 0.6, delay: 0.25 + i * 0.05, ease }}
              />
              <em>{days[i]}</em>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid-2">
        <Card>
          <Label metric="sleep">Sleep</Label>
          <div className="big-num sm">6h 42m</div>
          <span className="delta down">
            <ArrowDownRight size={14} strokeWidth={2.5} aria-hidden="true" />
            48m below baseline
          </span>
        </Card>
        <Card>
          <Label metric="activity">Activity</Label>
          <div className="big-num sm">3</div>
          <span className="delta">
            <Minus size={14} strokeWidth={2.5} aria-hidden="true" />
            workouts, as usual
          </span>
        </Card>
      </div>
      <Card>
        <Label metric="mood">Mood</Label>
        <div className="mood">
          {[0.7, 0.7, 0.45, 0.4, 0.65, 0.75, 0.8].map((v, i) => (
            <span key={i} style={{ "--m": v }} title={days[i]} />
          ))}
        </div>
        <p className="card-foot">Mostly steady, lower on Wednesday and Thursday.</p>
      </Card>
    </Screen>
  );
}

/* 06 · Learn — Pattern map */
const rows = [
  { label: "Sleep", metric: "sleep", v: [5, 6, 4, 3, 5, 6, 6, 3, 2, 4, 5, 6] },
  { label: "Stress", metric: "stress", v: [3, 2, 4, 6, 3, 2, 2, 5, 6, 4, 3, 2] },
  { label: "Mood", metric: "mood", v: [5, 6, 4, 3, 5, 6, 6, 4, 3, 4, 5, 6] },
  { label: "Exercise", metric: "activity", v: [5, 6, 2, 1, 5, 6, 5, 2, 1, 3, 5, 6] },
];

function Patterns({ next }) {
  return (
    <Screen
      eyebrow="Last 12 weeks"
      title="Pattern map"
      action={<Primary icon={ClipboardList} onClick={next}>Prepare for my session</Primary>}
    >
      <Card>
        <div className="heat">
          {rows.map((r, ri) => (
            <div key={r.label} className="heat-row">
              <span>
                <MetricIcon metric={r.metric} size={13} />
                {r.label}
              </span>
              <div className="heat-cells">
                {r.v.map((v, i) => (
                  <motion.i
                    key={i}
                    style={{ background: metrics[r.metric].color, opacity: 0.15 + v * 0.14 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.03 + ri * 0.05, type: "spring", stiffness: 500, damping: 30 }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="pattern pos">
        <Tag kind="pos">Positive pattern</Tag>
        <p>Weeks with regular exercise coincided with better mood in <b>7 of 9 weeks</b>.</p>
      </Card>
      <Card className="pattern">
        <Tag kind="neutral">Recurring</Tag>
        <p>Shorter sleep often came alongside higher stress and reflections mentioning tiredness.</p>
      </Card>
    </Screen>
  );
}

/* 07 · Share — Prepare & share */
// Settings-style rows: a coloured tile makes each category quick to find.
const categories = [
  ["Sleep & stress trends", true, ChartLine, "var(--app-sleep)"],
  ["Mood & energy", true, Smile, "var(--app-mood)"],
  ["Session goals", true, Target, "var(--app-activity)"],
  ["Voice transcripts", false, AudioLines, "var(--app-stress)"],
];

function Share({ restart }) {
  const [on, setOn] = useState(() => categories.map(([, v]) => v));
  const [shared, setShared] = useState(false);

  return (
    <Screen
      eyebrow="Care · Prepare & share"
      title="Share overview"
      action={
        !shared && (
          <Primary
            icon={Lock}
            onClick={() => {
              haptic();
              setShared(true);
            }}
          >
            Share securely
          </Primary>
        )
      }
    >
      <Card className="pro">
        <div className="avatar">LV</div>
        <div>
          <strong>L. Visser</strong>
          <span>Therapist · next session Thu</span>
        </div>
      </Card>
      <Card>
        <span className="card-label">What they'll see</span>
        <ul className="toggles">
          {categories.map(([label, , RowIcon, color], i) => (
            <li key={label}>
              <span className="toggle-label">
                <span className="tile" style={{ background: color }}>
                  <RowIcon size={16} strokeWidth={2.25} color="#fff" aria-hidden="true" />
                </span>
                {label}
              </span>
              <button
                role="switch"
                aria-checked={on[i]}
                aria-label={label}
                className={`switch ${on[i] ? "on" : ""}`}
                disabled={shared}
                onClick={() => {
                  haptic();
                  setOn((s) => s.map((x, j) => (j === i ? !x : x)));
                }}
              >
                <motion.span layout transition={spring} />
              </button>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="lock">
        <Lock size={16} strokeWidth={2} aria-hidden="true" />
        <p>End-to-end encrypted. They get a summary, never raw sensor data.</p>
      </Card>
      <AnimatePresence initial={false}>
        {shared && (
          <motion.div
            key="shared"
            ref={(el) => {
              const scroller = el?.closest(".app-scroll");
              scroller?.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
            }}
            className="shared-state"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="shared-msg">
              <CircleCheck size={18} strokeWidth={2.25} aria-hidden="true" />
              <span>
                <b>Shared with L. Visser.</b> You can end access at any time.
              </span>
            </p>
            <button className="app-danger" onClick={() => setShared(false)}>
              <ShieldOff {...iconProps} />
              Revoke access
            </button>
            <button className="app-link" onClick={restart}>
              <RotateCcw {...iconProps} />
              Start the loop again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  );
}

export const screens = [Today, Capture, Structure, Connect, Weekly, Patterns, Share];

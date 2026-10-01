import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Alert, Avatar, Button, Card as HeroCard, Chip, Meter, ProgressBar, Switch } from "@heroui/react";
import {
  Accessibility,
  Activity,
  Apple,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Baby,
  Brain,
  Briefcase,
  CalendarDays,
  ChartLine,
  Check,
  ChevronLeft,
  CircleCheck,
  ClipboardList,
  Dumbbell,
  FileText,
  FlaskConical,
  Headphones,
  Heart,
  HeartPulse,
  Hospital,
  Info,
  Lock,
  Mic,
  Minus,
  Moon,
  Presentation,
  Repeat,
  RotateCcw,
  Salad,
  Send,
  ShieldCheck,
  ShieldOff,
  Smile,
  Sprout,
  Stethoscope,
  Syringe,
  Target,
  TrendingUp,
  User,
  Users,
  Utensils,
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
function Screen({ eyebrow, title, trailing, action, full, children }) {
  const scrollRef = useRef(null);
  const { scrollY } = useScroll({ container: scrollRef });
  const barOpacity = useTransform(scrollY, [24, 48], [0, 1]);
  const titleScale = useTransform(scrollY, [-80, 0], [1.08, 1]);
  // The large title fades as it slides under the bar, handing over to the inline one.
  const titleOpacity = useTransform(scrollY, [8, 40], [1, 0]);

  return (
    <div className={`screen-inner ${full ? "screen-full" : ""}`}>
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

// HeroUI components in their default styling; these wrappers only add the
// staggered entrance and the icon slot the screens share.
const MotionCard = motion.create(HeroCard);

function Card({ children, className = "", ...rest }) {
  return (
    <MotionCard className={className} variants={item} {...rest}>
      {children}
    </MotionCard>
  );
}

function Primary({ children, icon: ButtonIcon, onClick, disabled }) {
  return (
    <Button fullWidth size="lg" onPress={onClick} isDisabled={disabled}>
      {ButtonIcon && <ButtonIcon {...iconProps} />}
      {children}
    </Button>
  );
}

function Danger({ children, icon: ButtonIcon, onClick }) {
  return (
    <Button fullWidth size="lg" variant="danger-soft" onPress={onClick}>
      {ButtonIcon && <ButtonIcon {...iconProps} />}
      {children}
    </Button>
  );
}

// Low-emphasis action under the main one.
function Quiet({ children, onClick, danger }) {
  return (
    <Button fullWidth variant="ghost" className={danger ? "text-danger" : ""} onPress={onClick}>
      {children}
    </Button>
  );
}

function Toggle({ label, on, onChange, disabled }) {
  return (
    <Switch aria-label={label} isSelected={on} isDisabled={disabled} onChange={onChange}>
      <Switch.Content>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Content>
    </Switch>
  );
}

// Inline message with an icon: privacy notes, caveats, confirmations.
function Note({ icon: NoteIcon, status, title, children }) {
  return (
    <motion.div variants={item}>
      <Alert status={status}>
        <Alert.Indicator>{NoteIcon && <NoteIcon size={16} strokeWidth={2.25} aria-hidden="true" />}</Alert.Indicator>
        <Alert.Content>
          {title && <Alert.Title>{title}</Alert.Title>}
          <Alert.Description>{children}</Alert.Description>
        </Alert.Content>
      </Alert>
    </motion.div>
  );
}

function Ring({ value, metric, label, sub }) {
  const r = 30;
  const { color } = metrics[metric];
  return (
    <div className="vital">
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
const tagColors = { sensor: "accent", you: "warning", pos: "success", neutral: "default" };

function Tag({ kind, children }) {
  const TagIcon = tagIcons[kind];
  return (
    <Chip size="sm" variant="soft" color={tagColors[kind]}>
      {TagIcon && <TagIcon size={11} strokeWidth={2.5} aria-hidden="true" />}
      <Chip.Label>{children}</Chip.Label>
    </Chip>
  );
}

/* 01 · Set up — Onboarding */
// Five short pages. Each row is [label, icon, colour, detail]; the page's
// `control` decides what sits at the end of the row.
const setup = [
  {
    title: "About you",
    lede: "A few basics, so your signals are read in the right context.",
    cards: [
      {
        label: "Personal data",
        control: "value",
        rows: [
          ["Name", User, "var(--accent)", "Sanne Koster"],
          ["Age", CalendarDays, "var(--app-sleep)", "34"],
          ["Gender", Users, "var(--app-mood)", "Woman"],
          ["Chronic condition", Activity, "var(--app-heart)", "None"],
        ],
      },
      {
        label: "Right now",
        control: "switch",
        rows: [
          ["Pregnant", Baby, "var(--app-stress)"],
          ["Physical disability", Accessibility, "var(--app-activity)"],
        ],
      },
    ],
  },
  {
    title: "Your sensors",
    lede: "Sensors track your body in the background. You don’t have to do anything.",
    cards: [
      {
        label: "Wearables",
        control: "connect",
        rows: [
          ["Apple Watch", Watch, "var(--app-heart)", "Sleep, heart rate, HRV"],
          ["AirPods", Headphones, "var(--app-sleep)", "Voice reflections"],
        ],
      },
      {
        label: "Brain wave sensors",
        control: "connect",
        rows: [["EEG headband", Brain, "var(--app-mood)", "Focus and relaxation"]],
      },
    ],
  },
  {
    title: "Food logging",
    lede: "Already logging meals? Connect the app, so food shows up next to sleep, mood and energy.",
    cards: [
      {
        label: "Food apps",
        control: "connect",
        rows: [
          ["MyFitnessPal", Utensils, "var(--app-sleep)", "Meals and calories"],
          ["Lifesum", Salad, "var(--app-activity)", "Meals and water"],
          ["Yazio", Apple, "var(--app-stress)", "Meals and fasting"],
        ],
      },
    ],
  },
  {
    title: "Medical data",
    optional: true,
    lede: "Bring in your records for a fuller picture. You can add them later.",
    cards: [
      {
        label: "Import",
        control: "switch",
        rows: [
          ["GP medical records", Stethoscope, "var(--accent)"],
          ["Vaccine history", Syringe, "var(--app-sleep)"],
          ["Operations history", Hospital, "var(--app-heart)"],
          ["Dental records", Smile, "var(--app-activity)"],
        ],
      },
    ],
    note: [Lock, "Private by default. Nothing is shared unless you choose to."],
  },
  {
    title: "Family",
    optional: true,
    lede: "Linking relatives helps spot conditions that run in your family.",
    cards: [
      {
        label: "Invite relatives",
        control: "invite",
        rows: [
          ["Mother", User, "var(--app-mood)"],
          ["Father", User, "var(--app-sleep)"],
          ["Sibling", Users, "var(--app-stress)"],
        ],
      },
    ],
    note: [Info, "You’ll see a risk index for hereditary conditions. It is an estimate, not a diagnosis."],
  },
];

const pillWords = { connect: ["Connect", "Connected"], invite: ["Invite", "Invited"] };

function Onboarding({ next }) {
  const [page, setPage] = useState(0);
  const [on, setOn] = useState({});
  const p = setup[page];
  const last = page === setup.length - 1;

  const toggle = (key) => {
    haptic();
    setOn((s) => ({ ...s, [key]: !s[key] }));
  };
  const forward = () => (last ? next() : setPage(page + 1));

  return (
    <Screen
      full
      eyebrow={`Step ${page + 1} of ${setup.length}${p.optional ? " · Optional" : ""}`}
      title={p.title}
      action={
        <>
          <Primary icon={last ? Check : ArrowRight} onClick={forward}>
            {last ? "Finish setup" : "Continue"}
          </Primary>
          {p.optional && <Quiet onClick={forward}>Skip for now</Quiet>}
        </>
      }
    >
      <motion.div className="setup-top" variants={item}>
        {page > 0 && (
          <Button
            isIconOnly
            size="sm"
            variant="tertiary"
            aria-label="Previous setup step"
            onPress={() => setPage(page - 1)}
          >
            <ChevronLeft size={18} strokeWidth={2.5} aria-hidden="true" />
          </Button>
        )}
        <ProgressBar
          aria-label="Setup progress"
          size="sm"
          className="flex-1"
          value={((page + 1) / setup.length) * 100}
        >
          <ProgressBar.Track>
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </ProgressBar>
      </motion.div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={page}
          className="setup-page"
          variants={list}
          initial="initial"
          animate="animate"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          <motion.p className="setup-lede" variants={item}>
            {p.lede}
          </motion.p>
          {p.cards.map((card) => (
            <Card key={card.label}>
              <span className="card-label">{card.label}</span>
              <ul className="toggles setup-rows">
                {card.rows.map(([label, RowIcon, color, detail]) => (
                  <li key={label}>
                    <span className="toggle-label">
                      <span className="tile" style={{ background: color }}>
                        <RowIcon size={16} strokeWidth={2.25} color="#fff" aria-hidden="true" />
                      </span>
                      <span className="row-text">
                        {label}
                        {detail && card.control !== "value" && <small>{detail}</small>}
                      </span>
                    </span>
                    {card.control === "value" && <span className="row-value">{detail}</span>}
                    {card.control === "switch" && (
                      <Toggle label={label} on={!!on[label]} onChange={() => toggle(label)} />
                    )}
                    {pillWords[card.control] && (
                      <Button
                        size="sm"
                        variant={on[label] ? "tertiary" : "secondary"}
                        aria-label={`${pillWords[card.control][0]} ${label}`}
                        onPress={() => toggle(label)}
                      >
                        {on[label] && <Check size={14} strokeWidth={2.75} aria-hidden="true" />}
                        {pillWords[card.control][on[label] ? 1 : 0]}
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
          {p.note && <Note icon={p.note[0]}>{p.note[1]}</Note>}
        </motion.div>
      </AnimatePresence>
    </Screen>
  );
}

/* 02 · Sense — Today */
function Today({ next }) {
  const hr = [58, 57, 59, 56, 58, 61, 57];
  return (
    <Screen
      eyebrow="Wednesday 16 October"
      title="Good afternoon"
      action={<Primary icon={Mic} onClick={next}>Log a thought</Primary>}
      trailing={
        <Avatar color="accent" aria-label="Sanne Koster">
          <Avatar.Fallback>SK</Avatar.Fallback>
        </Avatar>
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

/* 03 · Capture — Quick reflection */
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
            className="saved-toast"
            initial={{ opacity: 0, y: 16, scale: 0.94, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 16, scale: 0.94, filter: "blur(6px)" }}
            transition={spring}
          >
            <Alert status="success">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Reflection saved</Alert.Title>
                <Alert.Description>18 sec · Today, 16:42</Alert.Description>
              </Alert.Content>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  );
}

/* 04 · Structure — Reflection detail */
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
          <Chip><Briefcase size={13} strokeWidth={2.25} aria-hidden="true" /><Chip.Label>Work</Chip.Label></Chip>
          <Chip><Presentation size={13} strokeWidth={2.25} aria-hidden="true" /><Chip.Label>Presentation</Chip.Label></Chip>
          <Chip><Moon size={13} strokeWidth={2.25} aria-hidden="true" /><Chip.Label>Poor sleep</Chip.Label></Chip>
        </div>
      </Card>
      <Card>
        <div className="row-between">
          <span className="card-label">You said you felt</span>
          <Tag kind="you">You reported</Tag>
        </div>
        <div className="chips">
          <Chip color="warning" variant="soft">Stressed</Chip>
          <Chip color="warning" variant="soft">Tired</Chip>
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

/* 05 · Connect — associations */
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
            <Chip className="justify-center">{l.a}</Chip>
            <svg viewBox="0 0 60 12" className="link-line" aria-hidden="true">
              <motion.path
                d="M2 6 H58"
                className={l.positive ? "positive" : ""}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.15, ease }}
              />
            </svg>
            <Chip className="justify-center" variant="soft" color={l.positive ? "success" : "warning"}>
              {l.b}
            </Chip>
          </div>
          <div className="evidence">
            <Meter
              aria-label={`${l.a} and ${l.b}`}
              size="sm"
              className="flex-1"
              color={l.positive ? "success" : "warning"}
              value={l.strength * 100}
            >
              <Meter.Track>
                <Meter.Fill />
              </Meter.Track>
            </Meter>
            <span>{l.n}</span>
          </div>
        </Card>
      ))}
      <Note icon={Info}>
        These things <b>happened together</b>. That doesn’t mean one caused the other.
      </Note>
    </Screen>
  );
}

/* 06 · Reflect — Weekly overview */
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

/* 07 · Learn — Pattern map */
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

/* ---------- Care: the patient's and the doctor's side of the same moment ---------- */

// Settings-style rows: a coloured tile makes each category quick to find.
const categories = [
  ["Sleep & stress trends", true, ChartLine, "var(--app-sleep)"],
  ["Mood & energy", true, Smile, "var(--app-mood)"],
  ["Session goals", true, Target, "var(--app-activity)"],
  ["Voice transcripts", false, AudioLines, "var(--app-stress)"],
];

// State both phones read and write, so an action on one side shows on the other.
// access: none → shared → revoked. recording: idle → asked → on | declined → done.
export const initialCare = {
  on: categories.map(([, v]) => v),
  access: "none",
  kept: false,
  recording: "idle",
  notes: false,
  results: false,
};

const visit = {
  forDoctor:
    "Sanne described three weeks of short sleep and evening work. Agreed to protect sleep and restart lunchtime runs.",
  forPatient:
    "You described three weeks of short sleep and evening work. You agreed to protect your sleep and restart lunchtime runs.",
  goals: ["In bed by 23:00 on work nights", "Two lunchtime runs a week", "Check in again in 3 weeks"],
};

function Person({ initials, name, sub }) {
  return (
    <Card className="pro">
      <Avatar>
        <Avatar.Fallback>{initials}</Avatar.Fallback>
      </Avatar>
      <div>
        <strong>{name}</strong>
        <span>{sub}</span>
      </div>
    </Card>
  );
}

// The shared categories, with a word at the end of each row for its status.
function Scope({ on, words }) {
  return (
    <ul className="toggles setup-rows">
      {categories.map(([label, , RowIcon, color], i) => (
        <li key={label}>
          <span className="toggle-label">
            <span className="tile" style={{ background: color }}>
              <RowIcon size={16} strokeWidth={2.25} color="#fff" aria-hidden="true" />
            </span>
            {label}
          </span>
          <span className="row-value">{words[on[i] ? 0 : 1]}</span>
        </li>
      ))}
    </ul>
  );
}

// Live recording, shown on both phones while the session is recorded.
function Recorder({ caption }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <Card className="recorder">
      <div className="orb-wrap">
        <motion.div
          className="orb"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="timer">
          {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
        </span>
      </div>
      <div className="wave" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.span
            key={i}
            animate={{ scaleY: [0.2, 0.4 + ((i * 37) % 60) / 100, 0.2] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: (i % 6) * 0.08 }}
          />
        ))}
      </div>
      <span className="rec-caption">
        <i aria-hidden="true" />
        {caption}
      </span>
    </Card>
  );
}

function SessionNotes({ title, text }) {
  return (
    <>
      <Card className="summary">
        <span className="ai-label">
          <Orb size={18} />
          {title}
        </span>
        <p>{text}</p>
      </Card>
      <Card>
        <Label icon={Target}>Goals</Label>
        <ul className="facts">
          {visit.goals.map((g) => (
            <li key={g}>
              <Check size={16} strokeWidth={2.5} color="var(--app-activity)" aria-hidden="true" />
              {g}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

function Notice({ icon: NoticeIcon, title, children }) {
  return (
    <Card className="notice">
      <span className="notice-icon">
        <NoticeIcon size={24} strokeWidth={2} aria-hidden="true" />
      </span>
      <strong>{title}</strong>
      <p>{children}</p>
    </Card>
  );
}

/* 08 · Share — patient: prepare & share */
function Share({ next, care, update }) {
  const shared = care.access === "shared";

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
              update({ access: "shared", kept: false });
            }}
          >
            Share securely
          </Primary>
        )
      }
    >
      <Person initials="LV" name="L. Visser" sub="GP · appointment today, 10:30" />
      <Card>
        <span className="card-label">What they’ll see</span>
        <ul className="toggles">
          {categories.map(([label, , RowIcon, color], i) => (
            <li key={label}>
              <span className="toggle-label">
                <span className="tile" style={{ background: color }}>
                  <RowIcon size={16} strokeWidth={2.25} color="#fff" aria-hidden="true" />
                </span>
                {label}
              </span>
              <Toggle
                label={label}
                on={care.on[i]}
                disabled={shared}
                onChange={() => {
                  haptic();
                  update({ on: care.on.map((x, j) => (j === i ? !x : x)) });
                }}
              />
            </li>
          ))}
        </ul>
      </Card>
      <Note icon={Lock} status="success">
        End-to-end encrypted, in both directions. They get a summary, never raw sensor data.
      </Note>
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
            <Note icon={CircleCheck} status="success" title="Shared with L. Visser">
              You can end access at any time.
            </Note>
            <Danger icon={ShieldOff} onClick={() => update({ access: "none" })}>
              Revoke access
            </Danger>
            <Quiet onClick={next}>
              Go to the appointment
              <ArrowRight {...iconProps} />
            </Quiet>
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  );
}

/* 08 · Share — doctor: the shared overview */
function NoAccess({ revoked }) {
  return revoked ? (
    <Notice icon={ShieldOff} title="Access withdrawn">
      The patient ended sharing. Their data is no longer visible to you.
    </Notice>
  ) : (
    <Notice icon={Lock} title="Nothing shared yet">
      The overview appears here once the patient shares it with you.
    </Notice>
  );
}

function Trend({ metric, name, dir, children }) {
  const DirIcon = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus }[dir];
  return (
    <li>
      <span className="trend-name">
        <MetricIcon metric={metric} size={16} />
        {name}
      </span>
      <span className={`delta ${dir}`}>
        <DirIcon size={14} strokeWidth={2.5} aria-hidden="true" />
        {children}
      </span>
    </li>
  );
}

function DoctorOverview({ next, care }) {
  const shared = care.access === "shared";
  const [trends, mood, goals] = care.on;
  const hidden = categories.filter((_, i) => !care.on[i]).map(([label]) => label);

  return (
    <Screen
      eyebrow={shared ? "Shared overview · last 12 weeks" : "Patient"}
      title="Sanne Koster"
      action={shared && <Primary icon={ArrowRight} onClick={next}>Start the session</Primary>}
    >
      {!shared && <NoAccess revoked={care.access === "revoked"} />}
      {shared && (
        <>
          {trends && (
            <Card>
              <div className="row-between">
                <span className="card-label">Body</span>
                <Tag kind="sensor">Sensor</Tag>
              </div>
              <ul className="facts trends">
                <Trend metric="sleep" name="Sleep" dir="down">Lower</Trend>
                <Trend metric="stress" name="Stress" dir="up">Higher</Trend>
                <Trend metric="activity" name="Activity" dir="flat">Stable</Trend>
              </ul>
            </Card>
          )}
          {mood && (
            <Card>
              <div className="row-between">
                <span className="card-label">Wellbeing</span>
                <Tag kind="you">Patient reported</Tag>
              </div>
              <ul className="facts trends">
                <Trend metric="mood" name="Mood" dir="flat">Stable</Trend>
                <Trend metric="hrv" name="Energy" dir="down">Lower</Trend>
              </ul>
              <p className="card-foot">Work stress was mentioned more often.</p>
            </Card>
          )}
          {(trends || mood) && (
            <>
              <Card className="pattern">
                <Tag kind="neutral">Observed pattern</Tag>
                <p>Shorter sleep frequently coincided with higher stress.</p>
              </Card>
              <Card className="pattern pos">
                <Tag kind="pos">Positive pattern</Tag>
                <p>Regular exercise frequently coincided with better reported mood.</p>
              </Card>
            </>
          )}
          {goals && (
            <Card>
              <Label icon={Target}>Goals</Label>
              <div className="big-num sm">
                2 <small>of 3 maintained</small>
              </div>
            </Card>
          )}
          <Card>
            <span className="card-label">May want to discuss</span>
            <div className="chips">
              <Chip>Workload</Chip>
              <Chip>Sleep consistency</Chip>
              <Chip>Evening stress</Chip>
            </div>
          </Card>
          {hidden.length > 0 && (
            <Note icon={Lock}>Not shared by the patient: {hidden.join(", ")}.</Note>
          )}
        </>
      )}
    </Screen>
  );
}

/* 09 · Talk — patient: the appointment */
function PatientSession({ next, care, update }) {
  const state = care.recording;
  const actions = {
    asked: (
      <>
        <Primary
          icon={Mic}
          onClick={() => {
            haptic();
            update({ recording: "on" });
          }}
        >
          Allow recording
        </Primary>
        <Quiet onClick={() => update({ recording: "declined" })}>Not now</Quiet>
      </>
    ),
    on: (
      <Danger onClick={() => update({ recording: "done" })}>Stop recording</Danger>
    ),
    declined: <Primary icon={ArrowRight} onClick={next}>Manage sharing</Primary>,
    done: care.notes && <Primary icon={ArrowRight} onClick={next}>Manage sharing</Primary>,
  };

  return (
    <Screen eyebrow="Today, 10:30" title="Appointment" action={actions[state]}>
      <Person initials="LV" name="L. Visser" sub="GP · in session now" />
      {state === "idle" && (
        <Note icon={ShieldCheck} status="success">
          {care.access === "shared"
            ? "L. Visser can see the overview you shared. Nothing is being recorded."
            : "You haven’t shared an overview. Nothing is being recorded."}
        </Note>
      )}
      {state === "asked" && (
        <Card>
          <Label icon={Mic}>Recording request</Label>
          <p className="ask">L. Visser asks to record this session.</p>
          <p className="card-foot">
            The recording is for the doctor’s notes. You get the summary and AI notes afterwards.
          </p>
        </Card>
      )}
      {state === "on" && (
        <>
          <Recorder caption="Recording" />
          <p className="hint">
            <ShieldCheck size={13} strokeWidth={2.25} aria-hidden="true" />
            Recording because you agreed. You can stop it.
          </p>
        </>
      )}
      {state === "declined" && (
        <Note icon={ShieldCheck} status="success">
          You chose not to record. Nothing is being recorded.
        </Note>
      )}
      {state === "done" &&
        (care.notes ? (
          <SessionNotes title="Session summary" text={visit.forPatient} />
        ) : (
          <Card className="nudge">
            <Orb size={36} />
            <div>
              <p>Recording ended</p>
              <span>L. Visser can send you the summary and AI notes.</span>
            </div>
          </Card>
        ))}
    </Screen>
  );
}

/* 09 · Talk — doctor: ask to record, then notes */
function DoctorSession({ next, care, update }) {
  const state = care.recording;
  const actions = {
    idle: (
      <Primary icon={Mic} onClick={() => update({ recording: "asked" })}>
        Ask to record
      </Primary>
    ),
    asked: <Primary disabled>Waiting for consent…</Primary>,
    on: (
      <Primary icon={Check} onClick={() => update({ recording: "done" })}>
        End session
      </Primary>
    ),
    declined: <Primary icon={ArrowRight} onClick={next}>Continue</Primary>,
    done: care.notes ? (
      <Primary icon={ArrowRight} onClick={next}>Continue</Primary>
    ) : (
      <Primary
        icon={Send}
        onClick={() => {
          haptic();
          update({ notes: true });
        }}
      >
        Send summary to Sanne
      </Primary>
    ),
  };

  return (
    <Screen eyebrow="Today, 10:30" title="Session" action={actions[state]}>
      <Person initials="SK" name="Sanne Koster" sub="34 · in session now" />
      {state === "idle" && (
        <Card>
          <Label icon={Mic}>Record this session?</Label>
          <p className="ask">Ask Sanne before you record.</p>
          <p className="card-foot">
            The recording is for your notes. The summary and AI notes can be shared with the patient.
          </p>
        </Card>
      )}
      {state === "asked" && (
        <Card className="nudge">
          <Orb size={36} />
          <div>
            <p>Request sent</p>
            <span>Sanne sees it on their phone and decides.</span>
          </div>
        </Card>
      )}
      {state === "on" && (
        <>
          <Recorder caption="Recording with consent" />
          <p className="hint">
            <ShieldCheck size={13} strokeWidth={2.25} aria-hidden="true" />
            The patient can stop the recording at any time.
          </p>
        </>
      )}
      {state === "declined" && (
        <Note icon={ShieldCheck}>Sanne chose not to record. Take notes as usual.</Note>
      )}
      {state === "done" && (
        <>
          <SessionNotes title="AI notes" text={visit.forDoctor} />
          {care.notes && (
            <p className="hint">
              <Lock size={13} strokeWidth={2.25} aria-hidden="true" />
              Sent to Sanne, encrypted.
            </p>
          )}
        </>
      )}
    </Screen>
  );
}

/* 10 · Control — patient: keep sharing or revoke */
function PatientAccess({ care, update, restart }) {
  const shared = care.access === "shared";
  const share = () => {
    haptic();
    update({ access: "shared", kept: false });
  };
  const revoke = () => {
    haptic();
    update({ access: "revoked", kept: false });
  };

  return (
    <Screen
      eyebrow="Care · Sharing & privacy"
      title="Your sharing"
      action={
        shared && !care.kept ? (
          <>
            <Primary icon={ShieldCheck} onClick={() => update({ kept: true })}>
              Keep sharing
            </Primary>
            <Quiet danger onClick={revoke}>
              Revoke access
            </Quiet>
          </>
        ) : (
          !shared && <Primary icon={Lock} onClick={share}>Share again</Primary>
        )
      }
    >
      <Person
        initials="LV"
        name="L. Visser"
        sub={shared ? "GP · has access since today" : "GP · no access"}
      />
      {shared ? (
        <Card>
          <span className="card-label">What they can see</span>
          <Scope on={care.on} words={["Shared", "Hidden"]} />
        </Card>
      ) : (
        <Notice icon={ShieldOff} title={care.access === "revoked" ? "Access ended" : "Not sharing"}>
          L. Visser can’t see your data. Summaries and results they sent stay with you.
        </Notice>
      )}
      {(care.notes || care.results) && (
        <Card>
          <span className="card-label">From L. Visser</span>
          <ul className="facts">
            {care.notes && (
              <li>
                <FileText size={16} strokeWidth={2.25} color="var(--accent)" aria-hidden="true" />
                Session summary · today
              </li>
            )}
            {care.results && (
              <li>
                <FlaskConical size={16} strokeWidth={2.25} color="var(--app-heart)" aria-hidden="true" />
                Blood test results · today
              </li>
            )}
          </ul>
        </Card>
      )}
      {shared && care.kept && (
        <div className="shared-state">
          <Note icon={CircleCheck} status="success" title="Still sharing with L. Visser">
            You can change this at any time.
          </Note>
          <Danger icon={ShieldOff} onClick={revoke}>
            Revoke access
          </Danger>
        </div>
      )}
      {(care.kept || !shared) && (
        <Quiet onClick={restart}>
          <RotateCcw {...iconProps} />
          Start the loop again
        </Quiet>
      )}
    </Screen>
  );
}

/* 10 · Control — doctor: access lasts until the patient withdraws it */
function DoctorAccess({ care, update }) {
  const shared = care.access === "shared";
  const outbox = [
    ["Session summary", FileText, "var(--accent)", "notes"],
    ["Blood test results", FlaskConical, "var(--app-heart)", "results"],
  ];

  return (
    <Screen eyebrow="Patient record" title="Sanne Koster">
      {shared ? (
        <>
          <Note icon={ShieldCheck} status="success">
            Access granted by the patient. It lasts until they withdraw consent.
          </Note>
          <Card>
            <span className="card-label">Visible to you</span>
            <Scope on={care.on} words={["Visible", "Not shared"]} />
          </Card>
          <Card>
            <span className="card-label">Send to the patient</span>
            <ul className="toggles setup-rows">
              {outbox.map(([label, RowIcon, color, key]) => (
                <li key={key}>
                  <span className="toggle-label">
                    <span className="tile" style={{ background: color }}>
                      <RowIcon size={16} strokeWidth={2.25} color="#fff" aria-hidden="true" />
                    </span>
                    {label}
                  </span>
                  <Button
                    size="sm"
                    variant={care[key] ? "tertiary" : "secondary"}
                    isDisabled={care[key]}
                    aria-label={`Send ${label}`}
                    onPress={() => {
                      haptic();
                      update({ [key]: true });
                    }}
                  >
                    {care[key] && <Check size={14} strokeWidth={2.75} aria-hidden="true" />}
                    {care[key] ? "Sent" : "Send"}
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        </>
      ) : (
        <>
          <NoAccess revoked={care.access === "revoked"} />
          <Note icon={Info}>
            You can’t send or view data without access. Your own session notes stay in your records.
          </Note>
        </>
      )}
    </Screen>
  );
}

export const screens = [
  Onboarding,
  Today,
  Capture,
  Structure,
  Connect,
  Weekly,
  Patterns,
  Share,
  PatientSession,
  PatientAccess,
];

// The doctor's phone joins at the Share step and mirrors each step after it.
export const DOCTOR_FROM = screens.indexOf(Share);
export const doctorScreens = [DoctorOverview, DoctorSession, DoctorAccess];

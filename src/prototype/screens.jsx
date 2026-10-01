import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "motion/react";
import { Avatar, Button, Card as HeroCard, ProgressBar } from "@heroui/react";
import {
  Accessibility,
  Activity,
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
  Frown,
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
  Send,
  ShieldCheck,
  ShieldOff,
  Smile,
  Sprout,
  Stethoscope,
  Syringe,
  Target,
  User,
  Users,
  Watch,
  Waypoints,
  Zap,
} from "lucide-react";
import { BaselineSpark, DotSpark, RhythmPath, SleepBars } from "./AppVisuals.jsx";
import appleHealthIcon from "../assets/apps/apple-health.jpg";
import profileImage from "../assets/avatars/annie.jpg";
import doctorImage from "../assets/avatars/doctor.jpg";
import lifesumIcon from "../assets/apps/lifesum.jpg";
import myFitnessPalIcon from "../assets/apps/myfitnesspal.jpg";
import yazioIcon from "../assets/apps/yazio.jpg";

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

// The companion's face: a soft square held by four corner brackets, with two
// dot eyes and a small smile. The eyes and mouth lean toward the cursor, and
// the eyes blink now and then. Drawn as an SVG so the same face scales from the
// small mark to the large recorder.
const LOOK_MAX = 9; // how far the features travel, in viewBox units
const LOOK_REACH = 240; // cursor distance in px at which they reach that limit

function Eyes({ talking = false }) {
  const ref = useRef(null);
  const lookX = useSpring(0, { bounce: 0, duration: 0.4 });
  const lookY = useSpring(0, { bounce: 0, duration: 0.4 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const follow = (e) => {
      const box = ref.current?.getBoundingClientRect();
      if (!box) return;
      const dx = e.clientX - (box.left + box.width / 2);
      const dy = e.clientY - (box.top + box.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const reach = (Math.min(dist, LOOK_REACH) / LOOK_REACH) * LOOK_MAX;
      lookX.set((dx / dist) * reach);
      lookY.set((dy / dist) * reach);
    };
    window.addEventListener("pointermove", follow);
    return () => window.removeEventListener("pointermove", follow);
  }, [lookX, lookY]);

  return (
    <svg ref={ref} className="face" viewBox="0 0 100 100" aria-hidden="true">
      <rect className="face-fill" x="6" y="6" width="88" height="88" rx="22" />
      <path
        className="face-frame"
        d="M6 38 V28 A22 22 0 0 1 28 6 H38 M62 6 H72 A22 22 0 0 1 94 28 V38 M94 62 V72 A22 22 0 0 1 72 94 H62 M38 94 H28 A22 22 0 0 1 6 72 V62"
      />
      <motion.g style={{ x: lookX, y: lookY }}>
        <motion.g
          animate={{ scaleY: [1, 1, 0.1, 1] }}
          transition={{ duration: 4, times: [0, 0.93, 0.965, 1], repeat: Infinity, ease: "easeInOut" }}
        >
          <circle className="face-eye" cx="33" cy="44" r="4.5" />
          <circle className="face-eye" cx="67" cy="44" r="4.5" />
        </motion.g>
        {talking ? (
          <motion.ellipse
            className="face-mouth-open"
            cx="50"
            cy="62"
            rx="7"
            initial={{ ry: 2 }}
            animate={{ ry: [2, 7, 3, 8, 2.5, 6, 2] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <path className="face-mouth" d="M39 59 Q50 67 61 59" />
        )}
      </motion.g>
    </svg>
  );
}

// The large companion on the recorder. While it is speaking it bobs and tilts
// a little and its mouth opens and closes; otherwise it rests with a smile.
function Speaker({ talking }) {
  return (
    <motion.div
      className="orb"
      animate={talking ? { y: [0, -4, 0, -2, 0], rotate: [0, -3, 2, -2, 0] } : { y: 0, rotate: 0 }}
      transition={
        talking
          ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
          : { type: "spring", bounce: 0, duration: 0.4 }
      }
    >
      <Eyes talking={talking} />
    </motion.div>
  );
}

// The companion's mark: a small version of the recorder dot. It appears
// wherever the app is noticing something on your behalf.
export function Orb({ size = 28 }) {
  return (
    <motion.span
      className="orb-mini"
      style={{ width: size, height: size }}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.35, duration: 0.6, delay: 0.25 }}
      aria-hidden="true"
    >
      <Eyes />
    </motion.span>
  );
}

// A metric's icon, solid and in the metric's colour wherever it appears.
function MetricIcon({ metric, size = 14 }) {
  const { icon: M } = metrics[metric];
  return <M className={`metric-icon metric-${metric}`} size={size} strokeWidth={2.25} aria-hidden="true" />;
}

// Card heading with an icon. A metric heading takes its metric's colour.
function Label({ metric, icon: I, children }) {
  return (
    <span className={`card-label with-icon ${metric ? `metric-${metric}` : ""}`}>
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
function Screen({ eyebrow, title, leading, trailing, action, full, hero, heroHeight = 136, className = "", children }) {
  const scrollRef = useRef(null);
  const { scrollY } = useScroll({ container: scrollRef });
  // With a hero above it, the title reaches the bar that much later.
  const titleOffset = hero ? heroHeight : 0;
  const barOpacity = useTransform(scrollY, [titleOffset + 24, titleOffset + 48], [0, 1]);
  const titleScale = useTransform(scrollY, [-80, 0], [1.08, 1]);
  // The large title fades as it slides under the bar, handing over to the inline one.
  const titleOpacity = useTransform(scrollY, [titleOffset + 8, titleOffset + 40], [1, 0]);

  return (
    <div className={`screen-inner ${full ? "screen-full" : ""} ${className}`}>
      <motion.div className="scroll-edge" style={{ opacity: barOpacity }} aria-hidden="true" />
      <div className="navbar">
        {/* The bar is laid over the content, so a button here never moves it. */}
        <AnimatePresence initial={false}>
          {leading && (
            <motion.div
              key="leading"
              className="navbar-leading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={spring}
            >
              {leading}
            </motion.div>
          )}
        </AnimatePresence>
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
        {hero}
        <motion.header className="app-head" variants={item}>
          {eyebrow && <span className="app-eyebrow">{eyebrow}</span>}
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

// HeroUI components, restyled in prototype.css; these wrappers add the
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
  // A forward arrow follows the label; every other icon leads it.
  const trailing = ButtonIcon === ArrowRight;
  return (
    <Button fullWidth size="lg" className="app-primary" onPress={onClick} isDisabled={disabled}>
      {ButtonIcon && !trailing && <ButtonIcon {...iconProps} />}
      {children}
      {trailing && <ButtonIcon {...iconProps} />}
    </Button>
  );
}

function Danger({ children, icon: ButtonIcon, onClick }) {
  return (
    <Button fullWidth size="lg" variant="danger-soft" className="app-danger" onPress={onClick}>
      {ButtonIcon && <ButtonIcon {...iconProps} />}
      {children}
    </Button>
  );
}

// Neutral glass button, for a pair of equal choices.
function Secondary({ children, icon: ButtonIcon, onClick, disabled }) {
  return (
    <Button fullWidth size="lg" variant="secondary" className="app-secondary" onPress={onClick} isDisabled={disabled}>
      {ButtonIcon && <ButtonIcon {...iconProps} />}
      {children}
    </Button>
  );
}

// Low-emphasis action under the main one.
function Quiet({ children, onClick, danger }) {
  return (
    <Button fullWidth variant="ghost" className={`app-link ${danger ? "danger" : ""}`} onPress={onClick}>
      {children}
    </Button>
  );
}

// iOS-style switch: a wide capsule track with a pill-shaped knob.
// Track 64 wide, 2 padding each side, knob 38: the knob travels 22.
const KNOB_TRAVEL = 22;

function Toggle({ label, on, onChange, disabled }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`app-switch ${on ? "on" : ""}`}
      disabled={disabled}
      onClick={onChange}
    >
      {/* Slides by a fixed distance. A layout animation would measure the knob
          inside the scaled phone and jump. */}
      <motion.span initial={false} animate={{ x: on ? KNOB_TRAVEL : 0 }} transition={spring} />
    </button>
  );
}

// Inline message with an icon: privacy notes, caveats, confirmations.
function Note({ icon: NoteIcon, status, title, children }) {
  return (
    // Animates on its own mount: some notes appear after the screen's stagger has run.
    <motion.div className={`note ${status ?? ""}`} variants={item} initial="initial" animate="animate">
      {NoteIcon && <NoteIcon size={16} strokeWidth={2.25} aria-hidden="true" />}
      <p>
        {title && <b>{title}. </b>}
        {children}
      </p>
    </motion.div>
  );
}

// Profile button for the top right corner of a screen. HeroUI's custom image
// composition: Avatar.Image tracks loading and shows the initials until the
// image is ready.
function ProfileButton({ image, initials, name }) {
  return (
    <button className="avatar-btn" aria-label={`${name}: profile and privacy`}>
      <Avatar className="size-11">
        <Avatar.Image asChild src={image}>
          <img alt="" src={image} width={44} height={44} />
        </Avatar.Image>
        <Avatar.Fallback>{initials}</Avatar.Fallback>
      </Avatar>
    </button>
  );
}

// Whose phone it is: Annie's on the patient side, the GP's on the doctor side.
const patientProfile = <ProfileButton image={profileImage} initials="AK" name="Annie Koster" />;
const doctorProfile = <ProfileButton image={doctorImage} initials="LV" name="L. Visser" />;

function MetricTile({ metric, value, unit, values, status }) {
  return (
    <Card className="metric-tile">
      <Label metric={metric}>{unit}</Label>
      <strong className="metric-value">{value}</strong>
      <DotSpark values={values} label={`${unit} trend`} />
      <span className="metric-status">{status}</span>
    </Card>
  );
}

// Tags say where a piece of information came from.
const tagIcons = { sensor: Watch, you: User, pos: Sprout, neutral: Repeat, airpods: Headphones };

function Tag({ kind, children }) {
  const TagIcon = tagIcons[kind];
  return (
    <span className={`src-tag ${kind}`}>
      {TagIcon && <TagIcon size={11} strokeWidth={2.5} aria-hidden="true" />}
      {children}
    </span>
  );
}

/* 01 · Set up — Onboarding */
// Five short pages. Each row is [label, icon, detail], where the icon is a
// Lucide component or, for a real app, the path to its icon image. A page's
// `all` adds one button under the cards that turns every row on; the page's
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
          ["Name", User, "Annie Koster"],
          ["Age", CalendarDays, "34"],
          ["Gender", Users, "Woman"],
          ["Chronic condition", Activity, "None"],
        ],
      },
      {
        label: "Right now",
        control: "switch",
        rows: [
          ["Pregnant", Baby],
          ["Physical disability", Accessibility],
        ],
      },
    ],
  },
  {
    title: "Your sensors",
    all: ["Connect all", "All connected"],
    lede: "Sensors track your body in the background. You don’t have to do anything.",
    cards: [
      {
        label: "Wearables",
        control: "connect",
        rows: [
          ["Apple Watch", Watch, "Sleep, heart rate, HRV"],
          ["AirPods", Headphones, "Voice reflections"],
        ],
      },
      {
        label: "Brain wave sensors",
        control: "connect",
        rows: [["EEG headband", Brain, "Focus and relaxation"]],
      },
    ],
  },
  {
    title: "Food logging",
    all: ["Connect all", "All connected"],
    lede: "Already logging meals? Connect the app, so food shows up next to sleep, mood and energy.",
    cards: [
      {
        label: "Food apps",
        control: "connect",
        rows: [
          ["MyFitnessPal", myFitnessPalIcon, "Meals and calories"],
          ["Lifesum", lifesumIcon, "Meals and water"],
          ["Yazio", yazioIcon, "Meals and fasting"],
        ],
      },
    ],
  },
  {
    title: "Medical data",
    all: ["Allow all", "All allowed"],
    optional: true,
    lede: "Bring in your records for a fuller picture. You can add them later.",
    cards: [
      {
        label: "Import",
        control: "switch",
        rows: [
          ["Apple Health", appleHealthIcon],
          ["GP medical records", Stethoscope],
          ["Vaccine history", Syringe],
          ["Operations history", Hospital],
          ["Dental records", Smile],
        ],
      },
    ],
    note: [Lock, "Your data is private and encrypted. Nothing is shared unless you choose to."],
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
          ["Mother", User],
          ["Father", User],
          ["Sibling", Users],
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

  // One button for every row on the page, where the page asks for it.
  const rowLabels = p.cards.flatMap((card) => card.rows.map(([label]) => label));
  const allOn = rowLabels.every((label) => on[label]);
  const turnAllOn = () => {
    haptic();
    setOn((s) => ({ ...s, ...Object.fromEntries(rowLabels.map((label) => [label, true])) }));
  };

  return (
    <Screen
      full
      title={p.title}
      // Back lives in the navigation bar, so showing it moves nothing below.
      leading={
        page > 0 && (
          <Button
            isIconOnly
            size="sm"
            variant="tertiary"
            aria-label="Previous setup step"
            onPress={() => setPage(page - 1)}
          >
            <ChevronLeft size={18} strokeWidth={2.5} aria-hidden="true" />
          </Button>
        )
      }
      // Progress sits above the title, where the Today screen has its companion.
      heroHeight={48}
      hero={
        <motion.div className="setup-top" variants={item}>
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
      }
      action={
        <>
          <Primary icon={last ? Check : ArrowRight} onClick={forward}>
            {last ? "Finish setup" : "Continue"}
          </Primary>
          {p.optional && <Quiet onClick={forward}>Skip for now</Quiet>}
        </>
      }
    >
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
                {card.rows.map(([label, RowIcon, detail]) => (
                  <li key={label}>
                    <span className="toggle-label">
                      {typeof RowIcon === "string" ? (
                        <img className="tile app-icon" src={RowIcon} alt="" />
                      ) : (
                        <span className="tile">
                          <RowIcon size={16} strokeWidth={2.25} aria-hidden="true" />
                        </span>
                      )}
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
                        className={on[label] ? "pill-done" : ""}
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
          {p.all && (
            <motion.div variants={item}>
              <Button
                fullWidth
                variant="secondary"
                className={`connect-all ${allOn ? "pill-done" : ""}`}
                isDisabled={allOn}
                onPress={turnAllOn}
              >
                {allOn && <Check {...iconProps} />}
                {p.all[allOn ? 1 : 0]}
              </Button>
            </motion.div>
          )}
          {p.note && <Note icon={p.note[0]}>{p.note[1]}</Note>}
        </motion.div>
      </AnimatePresence>
    </Screen>
  );
}

// The week's stress, sleep and activity cards, shown on Today and on Your week.
const stressWeek = [0.35, 0.8, 0.9, 0.85, 0.5, 0.3, 0.25];
const days = ["M", "T", "W", "T", "F", "S", "S"];

function SignalCards() {
  return (
    <>
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
        <Card className="sleep-summary">
          <Label metric="sleep">Sleep</Label>
          <div className="big-num sm">6h 42m</div>
          <span className="delta down">
            <ArrowDownRight size={14} strokeWidth={2.5} aria-hidden="true" />
            48m below baseline
          </span>
          <SleepBars />
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
    </>
  );
}

/* 02 · Sense — Today */
function Today({ next }) {
  const hr = [58, 57, 59, 56, 58, 61, 57];
  return (
    <Screen
      eyebrow="Wednesday 16 October"
      title="Good afternoon"
      className="screen-today"
      hero={
        <div className="today-hero">
          <Orb size={104} />
        </div>
      }
      action={<Primary icon={Mic} onClick={next}>Log a thought</Primary>}
      trailing={patientProfile}
    >
      <motion.div className="today-path" variants={item}>
        <div className="path-heading">
          <div>
            <Label metric="heart">Your heart rhythm this week</Label>
            <p className="card-foot">Within your usual range.</p>
          </div>
          <span>57 bpm</span>
        </div>
        <RhythmPath values={hr} labels={["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"]} />
      </motion.div>
      <div className="section-heading">
        <h5>Body & mind</h5>
        <Tag kind="sensor">Sensor</Tag>
      </div>
      <div className="metric-tiles">
        <MetricTile metric="sleep" value="7h 31m" unit="Sleep" status="Near baseline" values={[7.4, 6.6, 7.2, 6.5, 7.1, 7.4, 7.5]} />
        <MetricTile metric="hrv" value="48" unit="HRV · ms" status="Within range" values={[49, 45, 46, 43, 47, 49, 48]} />
        <MetricTile metric="stress" value="Low" unit="Stress" status="Steady" values={[5, 3, 4, 6, 5, 4, 3]} />
      </div>
      <SignalCards />
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

  const seconds = Math.round((shown / words.length) * 20);

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
      title="Log a thought"
      trailing={<Tag kind="airpods">AirPods</Tag>}
      action={
        <Primary icon={saved || done ? Check : Mic} onClick={save} disabled={!done || saved}>
          {saved ? "Saved" : done ? "Save thought" : "Listening…"}
        </Primary>
      }
    >
      <Card className="recorder">
        <div className="orb-wrap">
          <Speaker talking={!done} />
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
      <Card className="transcript-card">
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
            className="app-toast"
            // Drops in from under the status bar and leaves the same way.
            initial={{ opacity: 0, y: -24, scale: 0.94, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -24, scale: 0.94, filter: "blur(6px)" }}
            transition={spring}
          >
            <Check {...iconProps} />
            Log saved · 20 sec · Today, 16:42
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  );
}

// One sensor reading: how it sits against the baseline, a small chart of the
// recent readings drifting from it, and the value now. `trend` says whether the
// change is for the worse or the better, whichever way the number moved.
const trendColors = { worse: "var(--app-heart)", better: "var(--app-positive)" };

function Reading({ metric, name, value, dir, trend, amount, values, baseline, band, children }) {
  const DirIcon = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus }[dir];
  return (
    <li>
      <span className="reading-name">
        <span className="trend-name">
          <MetricIcon metric={metric} size={16} />
          {name}
        </span>
        <span className="reading-change">
          <span className={`change-tag ${trend ?? ""}`}>
            <DirIcon size={13} strokeWidth={2.75} aria-hidden="true" />
            {amount}
          </span>
          {children}
        </span>
      </span>
      <BaselineSpark
        values={values}
        baseline={baseline}
        band={band}
        color={trendColors[trend]}
        label={`${name}: recent readings against your baseline`}
      />
      <strong className="reading-value">{value}</strong>
    </li>
  );
}

/* 04 · Structure — Log detail */
function Structure({ next }) {
  return (
    <Screen
      eyebrow="Today, 16:42 · 20 sec"
      title="Log"
      action={<Primary icon={Waypoints} onClick={next}>See insights</Primary>}
    >
      <Card className="log-card">
        <div className="row-between">
          <span className="card-label">You said</span>
          <Tag kind="you">You reported</Tag>
        </div>
        <p className="quote-sm">“{transcript}”</p>
        <div className="log-section">
          <span className="card-label">Context</span>
          <div className="chips">
            <span><Briefcase size={13} strokeWidth={2.25} aria-hidden="true" />Work</span>
            <span><Presentation size={13} strokeWidth={2.25} aria-hidden="true" />Presentation</span>
            <span><Moon size={13} strokeWidth={2.25} aria-hidden="true" />Poor sleep</span>
          </div>
        </div>
        <div className="log-section">
          <span className="card-label">You said you felt</span>
          <div className="chips chips-warm">
            <span>Stressed</span>
            <span>Tired</span>
          </div>
        </div>
      </Card>
      <Card>
        <div className="row-between">
          <span className="card-label">Around the same time</span>
          <Tag kind="sensor">Sensor</Tag>
        </div>
        <ul className="readings">
          <Reading metric="stress" trend="worse" name="Stress" value="High" dir="up" baseline={35} band={10} values={[33, 38, 34, 40, 52, 68]} amount="Higher">
            than usual
          </Reading>
          <Reading metric="heart" trend="worse" name="Heart rate" value="74 bpm" dir="up" baseline={57} band={4} values={[58, 60, 57, 62, 68, 74]} amount="17">
            above resting
          </Reading>
          <Reading metric="hrv" trend="worse" name="HRV" value="36 ms" dir="down" baseline={48} band={4} values={[47, 49, 46, 44, 40, 36]} amount="12">
            below baseline
          </Reading>
          <Reading metric="sleep" trend="worse" name="Sleep" value="5h 12m" dir="down" baseline={7} band={0.5} values={[7.1, 6.8, 7.2, 6.9, 6.6, 5.2]} amount="1h 48m">
            below baseline
          </Reading>
          <Reading metric="activity" name="Steps" value="3,240" dir="flat" baseline={3200} band={400} values={[3100, 3350, 3000, 3300, 3150, 3240]} amount="As usual" />
        </ul>
        <p className="card-foot">The band is your usual range, the dot is now.</p>
      </Card>
    </Screen>
  );
}

/* 05 · Connect — associations */
// Each insight is one plain sentence and how often it held: `n` of `of` days.
// Under it sit its two sources: what the sensors measured and what she said.
const insights = [
  {
    metric: "stress",
    lead: "Higher stress",
    rest: "on days with work deadlines",
    n: 4,
    of: 5,
    sensor: "Stress high on 4 days, HRV 12 ms below baseline",
    you: "Mentioned work deadlines in 5 logs",
  },
  {
    metric: "sleep",
    lead: "Feeling tired",
    rest: "after a short night’s sleep",
    n: 6,
    of: 8,
    sensor: "Under 6 hours of sleep on 8 nights",
    you: "Said you felt tired after 6 of them",
  },
  {
    metric: "activity",
    lead: "Better mood",
    rest: "on days you exercised",
    n: 3,
    of: 4,
    positive: true,
    sensor: "4 workouts, 35 minutes on average",
    you: "Logged a good mood on 3 of those days",
  },
];

function Connect({ next }) {
  return (
    <Screen
      eyebrow="Last 2 weeks"
      title="Insights"
      action={<Primary icon={CalendarDays} onClick={next}>Open weekly overview</Primary>}
    >
      {/* The companion says what it found, in its own speech bubble. */}
      <motion.div className="ai-says" variants={item}>
        <Orb size={44} />
        <p>
          I noticed <b>3 patterns</b> in your logs and sensor data.
        </p>
      </motion.div>
      {insights.map((it, i) => (
        <Card key={it.lead} className="insight">
          <div className="insight-head">
            <span className={`insight-icon metric-${it.metric}`}>
              <MetricIcon metric={it.metric} size={20} />
            </span>
            <div>
              <p className="insight-text">
                <b>{it.lead}</b> {it.rest}
              </p>
              <div className="insight-days">
                <span className="day-dots" aria-hidden="true">
                  {Array.from({ length: it.of }).map((_, d) => (
                    <motion.i
                      key={d}
                      className={d < it.n ? `on metric-${it.metric}` : ""}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ ...spring, delay: 0.35 + i * 0.12 + d * 0.04 }}
                    />
                  ))}
                </span>
                <span>
                  {it.n} of {it.of} days
                </span>
                {it.positive && <Tag kind="pos">Helps</Tag>}
              </div>
            </div>
          </div>
          <ul className="insight-sources">
            <li>
              <Tag kind="sensor">Sensor</Tag>
              <span>{it.sensor}</span>
            </li>
            <li>
              <Tag kind="you">You reported</Tag>
              <span>{it.you}</span>
            </li>
          </ul>
        </Card>
      ))}
      <Note icon={Info}>
        These things <b>happened together</b>. That doesn’t mean one caused the other.
      </Note>
    </Screen>
  );
}

/* 06 · Reflect — Weekly overview */
function Weekly({ next }) {
  // Feeling good is noted here; not feeling good leads on to the longer view.
  const [good, setGood] = useState(false);
  const feelGood = () => {
    haptic();
    setGood(true);
  };

  return (
    <Screen
      eyebrow="7 – 13 October"
      title="Your week"
      action={
        <div className="action-pair">
          <Secondary icon={good ? Check : Smile} onClick={feelGood} disabled={good}>
            {good ? "Noted" : "I feel good"}
          </Secondary>
          <Secondary icon={Frown} onClick={next}>I don’t feel good</Secondary>
        </div>
      }
    >
      <motion.div className="ai-says" variants={item}>
        <Orb size={44} />
        <p>
          I noticed a more stressful week than usual, with lower sleep and energy. Your
          reflections often mentioned <b>work deadlines</b>.
        </p>
      </motion.div>
      <div className="section-heading"><h5>Weekly signals</h5><span>7 days</span></div>
      <SignalCards />
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
// Twelve weekly values per signal, against its baseline and usual range. The
// first weeks sit inside the range; the last five drift away from it.
const rows = [
  { label: "Sleep", metric: "sleep", dir: "down", trend: "worse", change: "Lower", baseline: 7.5, band: 0.25, v: [7.5, 7.4, 7.6, 7.5, 7.3, 7.5, 7.4, 7.2, 7.1, 6.9, 6.8, 6.7] },
  { label: "Stress", metric: "stress", dir: "up", trend: "worse", change: "Higher", baseline: 35, band: 6, v: [34, 36, 33, 35, 37, 34, 38, 41, 45, 48, 53, 58] },
  { label: "Mood", metric: "mood", dir: "down", trend: "worse", change: "Lower", baseline: 4, band: 0.25, v: [4.1, 4, 4.2, 3.9, 4, 4.1, 3.9, 3.7, 3.6, 3.4, 3.3, 3.1] },
  { label: "Exercise", metric: "activity", dir: "flat", change: "Stable", baseline: 3, band: 1, v: [3, 3, 4, 3, 2, 3, 3, 4, 3, 3, 2, 3] },
];

function Patterns({ next }) {
  return (
    <Screen
      eyebrow="Last 12 weeks"
      title="Pattern map"
      action={<Primary icon={ClipboardList} onClick={next}>Set up meeting with a doctor</Primary>}
    >
      <Card>
        <h5 className="card-section-title">Your signals over time</h5>
        <ul className="readings signals">
          {rows.map((r) => {
            const DirIcon = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus }[r.dir];
            return (
              <li key={r.label}>
                <span className="reading-name">
                  <span className="trend-name">
                    <MetricIcon metric={r.metric} size={16} />
                    {r.label}
                  </span>
                  <span className="reading-change">
                    <span className={`change-tag ${r.trend ?? ""}`}>
                      <DirIcon size={13} strokeWidth={2.75} aria-hidden="true" />
                      {r.change}
                    </span>
                  </span>
                </span>
                <BaselineSpark
                  values={r.v}
                  baseline={r.baseline}
                  band={r.band}
                  color={trendColors[r.trend]}
                  width={190}
                  label={`${r.label} over the last 12 weeks against your baseline: ${r.change.toLowerCase()} in recent weeks`}
                />
              </li>
            );
          })}
        </ul>
        <p className="card-foot">Showing deviation from your baseline</p>
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

// Settings-style rows, each with a monochrome icon tile.
const categories = [
  ["Sleep & stress trends", true, ChartLine],
  ["Mood & energy", true, Smile],
  ["Session goals", true, Target],
  ["Voice transcripts", false, AudioLines],
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
    "Annie described three weeks of short sleep and evening work. Agreed to protect sleep and restart lunchtime runs.",
  forPatient:
    "You described three weeks of short sleep and evening work. You agreed to protect your sleep and restart lunchtime runs.",
  goals: ["In bed by 23:00 on work nights", "Two lunchtime runs a week", "Check in again in 3 weeks"],
};

function Person({ initials, name, sub, image }) {
  return (
    <Card className="pro">
      <Avatar className="size-11">
        {image && (
          <Avatar.Image asChild src={image}>
            <img alt="" src={image} width={44} height={44} />
          </Avatar.Image>
        )}
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
      {categories.map(([label, , RowIcon], i) => (
        <li key={label}>
          <span className="toggle-label">
            <span className="tile">
              <RowIcon size={16} strokeWidth={2.25} aria-hidden="true" />
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
        <Speaker talking />
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
      trailing={patientProfile}
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
      <Person initials="LV" name="L. Visser" sub="GP · appointment today, 10:30" image={doctorImage} />
      <Card>
        <span className="card-label">What they’ll see</span>
        <ul className="toggles">
          {categories.map(([label, , RowIcon], i) => (
            <li key={label}>
              <span className="toggle-label">
                <span className="tile">
                  <RowIcon size={16} strokeWidth={2.25} aria-hidden="true" />
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
      title="Annie Koster"
      trailing={doctorProfile}
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
              <span>Workload</span>
              <span>Sleep consistency</span>
              <span>Evening stress</span>
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
    <Screen eyebrow="Today, 10:30" title="Appointment" trailing={patientProfile} action={actions[state]}>
      <Person initials="LV" name="L. Visser" sub="GP · in session now" image={doctorImage} />
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
        Send summary to Annie
      </Primary>
    ),
  };

  return (
    <Screen eyebrow="Today, 10:30" title="Session" trailing={doctorProfile} action={actions[state]}>
      <Person initials="AK" name="Annie Koster" sub="34 · in session now" image={profileImage} />
      {state === "idle" && (
        <Card>
          <Label icon={Mic}>Record this session?</Label>
          <p className="ask">Ask Annie before you record.</p>
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
            <span>Annie sees it on their phone and decides.</span>
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
        <Note icon={ShieldCheck}>Annie chose not to record. Take notes as usual.</Note>
      )}
      {state === "done" && (
        <>
          <SessionNotes title="AI notes" text={visit.forDoctor} />
          {care.notes && (
            <p className="hint">
              <Lock size={13} strokeWidth={2.25} aria-hidden="true" />
              Sent to Annie, encrypted.
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
      trailing={patientProfile}
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
        image={doctorImage}
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
                <FileText size={16} strokeWidth={2.25} aria-hidden="true" />
                Session summary · today
              </li>
            )}
            {care.results && (
              <li>
                <FlaskConical size={16} strokeWidth={2.25} aria-hidden="true" />
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
    ["Session summary", FileText, "notes"],
    ["Blood test results", FlaskConical, "results"],
  ];

  return (
    <Screen eyebrow="Patient record" title="Annie Koster" trailing={doctorProfile}>
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
              {outbox.map(([label, RowIcon, key]) => (
                <li key={key}>
                  <span className="toggle-label">
                    <span className="tile">
                      <RowIcon size={16} strokeWidth={2.25} aria-hidden="true" />
                    </span>
                    {label}
                  </span>
                  <Button
                    size="sm"
                    variant={care[key] ? "tertiary" : "secondary"}
                    className={care[key] ? "pill-done" : ""}
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

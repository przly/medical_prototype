import {
  Activity,
  CalendarDays,
  Grid3x3,
  KeyRound,
  MessagesSquare,
  Mic,
  ShieldCheck,
  Tags,
  User,
  Waypoints,
} from "lucide-react";

// Named icons used by the step list and tab bar (lucide.dev).
const icons = {
  user: User,
  chat: MessagesSquare,
  key: KeyRound,
  pulse: Activity,
  mic: Mic,
  tags: Tags,
  link: Waypoints,
  calendar: CalendarDays,
  map: Grid3x3,
  shield: ShieldCheck,
};

export default function Icon({ name, size = 22 }) {
  const LucideIcon = icons[name];
  return <LucideIcon size={size} strokeWidth={1.75} aria-hidden="true" />;
}

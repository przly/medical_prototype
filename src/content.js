// Onboarding first, then the core product loop (section 8), with the matching
// prototype screens (section 15). The story beside the phone is the real-case
// scenario (section 24) of ../mental_wellbeing_concept_documentation.md, told
// one step at a time so it matches what the screen shows.
// `verb` is the step's name in the step bar: what its screen is called in the app.
export const steps = [
  {
    verb: "Onboarding",
    layer: "ai",
    icon: "user",
    when: "Day 1",
    title: "Felix sets up the app",
    story: [
      "Felix is 34 and works as a project manager in Amsterdam. He installs the app after a colleague’s burnout.",
      "He fills in the basics and connects his Apple Watch and AirPods. Medical records and family links are optional, so he can skip them for now.",
    ],
  },
  {
    verb: "Overview",
    layer: "body",
    icon: "pulse",
    when: "Weeks 1–4",
    title: "The watch learns what is normal for him",
    story: [
      "Felix does nothing special. His watch tracks sleep, heart rate and HRV in the background.",
      "After a few weeks the app knows his personal baseline: about seven hours of sleep and a resting heart rate of 57. Today everything is within his usual range.",
    ],
  },
  {
    verb: "Log a thought",
    layer: "context",
    icon: "mic",
    when: "Week 7 · Wednesday, 16:42",
    title: "He says what the day was like",
    story: [
      "A reorganisation has started at work. After a big presentation on very little sleep, Felix says “Log a thought” and talks for 20 seconds.",
      "The app saves it and says nothing more. It records only because he asked it to.",
    ],
  },
  {
    verb: "Log details",
    layer: "ai",
    icon: "mic",
    when: "Moments later",
    title: "His words become context",
    story: [
      "The app pulls the topics out of what he said: work, the presentation, poor sleep.",
      "What Felix reported (stressed, tired) is kept apart from what the watch measured (higher stress, 5h 12m of sleep), so he can see which is which.",
    ],
  },
  {
    verb: "Insights",
    layer: "ai",
    icon: "link",
    when: "Weeks 5–10",
    title: "The two kinds of data start to line up",
    story: [
      "As the weeks add up, the app notices things that keep happening together: higher stress on 4 of the 5 days he mentioned deadlines, and a better mood on days he exercised.",
      "Below, his signals over twelve weeks show the longer pattern: sleep and mood drifting down and stress up, while exercise holds steady.",
      "It tells him they happened together. It does not claim one caused the other.",
      "The drift has lasted more than two weeks and is well outside his usual range, so the app suggests discussing it with his GP. He taps “Set up meeting with a doctor”.",
    ],
  },
  {
    verb: "Care",
    layer: "care",
    icon: "shield",
    when: "Before the appointment",
    title: "He decides what his GP sees",
    story: [
      "Felix shares his trends, mood and goals with Dr. Kikker, his GP, and keeps his voice transcripts private.",
      "The moment he shares, the overview appears on the doctor’s phone. The GP reads twelve weeks in a minute instead of relying on what Felix remembers.",
    ],
  },
  {
    verb: "Appointment",
    layer: "care",
    icon: "chat",
    when: "At the appointment · 10:30",
    title: "The GP asks before recording",
    story: [
      "Dr. Kikker would like to record the session for note-taking. The request appears on Felix’s phone and he decides.",
      "Afterwards the GP sends him the summary and AI notes: protect his sleep, restart the lunchtime runs, check in again in three weeks. The GP, not the app, decides what the data means.",
    ],
  },
  {
    verb: "Access",
    layer: "care",
    icon: "key",
    when: "After the appointment",
    title: "Keep sharing, or take it back",
    story: [
      "Felix chooses. If he keeps sharing, the GP can follow his progress and send results such as a blood test.",
      "If he revokes access, the doctor’s view locks straight away. What the GP already sent stays with him.",
    ],
  },
];

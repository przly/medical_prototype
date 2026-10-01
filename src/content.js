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
      "He fills in the basics and connects his Apple Watch and AirPods. Medical data and family are optional, so he can add them later.",
    ],
  },
  {
    verb: "Overview",
    layer: "body",
    icon: "pulse",
    when: "Weeks 1–4",
    title: "The watch learns what is normal for him",
    story: [
      "His watch tracks sleep, heart rate and HRV in the background. After a few weeks the app knows his baseline.",
      "The overview compares today with it: sleep and exercise are normal, stress is low and mood is high.",
    ],
  },
  {
    verb: "Log a thought",
    layer: "context",
    icon: "mic",
    when: "Week 7 · Wednesday, 16:42",
    title: "He says what the day was like",
    story: [
      "After a big presentation on very little sleep, Felix talks to his AirPods for 20 seconds.",
      "The app saves the log. It only records when he asks it to.",
    ],
  },
  {
    verb: "Log details",
    layer: "ai",
    icon: "mic",
    when: "Moments later",
    title: "His words become context",
    story: [
      "The app pulls the context out of what he said: work, the presentation, poor sleep.",
      "What he reported (stressed, tired) is kept apart from what the sensors measured (high stress, 5h 12m of sleep).",
    ],
  },
  {
    verb: "Insights",
    layer: "ai",
    icon: "link",
    when: "Over 12 weeks",
    title: "The two kinds of data start to line up",
    story: [
      "Over the weeks, the app notices what keeps happening together: more stress on deadline days, tiredness after short nights, a better mood on days he exercised.",
      "It shows the sources for each and does not claim one caused the other.",
      "Over 12 weeks his sleep and mood have dropped and his stress has risen, so he sets up a doctor’s appointment.",
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
      "The overview appears on the doctor’s phone straight away. The GP reads twelve weeks in a minute instead of relying on what Felix remembers.",
    ],
  },
  {
    verb: "Appointment",
    layer: "care",
    icon: "chat",
    when: "At the appointment · 10:30",
    title: "The GP asks before recording",
    story: [
      "Dr. Kikker asks to record the session for his notes. The request appears on Felix’s phone and he decides.",
      "Afterwards the GP sends him the summary: protect his sleep, restart the lunchtime runs, check in again in three weeks.",
    ],
  },
  {
    verb: "Access",
    layer: "care",
    icon: "key",
    when: "After the appointment",
    title: "Keep sharing, or stop",
    story: [
      "Felix chooses. If he keeps sharing, the GP can follow his progress and send results such as a blood test.",
      "If he stops sharing, the doctor’s view locks straight away. What the GP already sent stays with him.",
    ],
  },
];

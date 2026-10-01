// Onboarding first, then the core product loop (section 8), with the matching
// prototype screens (section 15). The story beside the phone is the real-case
// scenario (section 24) of ../mental_wellbeing_concept_documentation.md, told
// one step at a time so it matches what the screen shows.
export const steps = [
  {
    verb: "Set up",
    layer: "ai",
    icon: "user",
    when: "Day 1",
    title: "Sanne sets up the app",
    story: [
      "Sanne is 34 and works as a project manager in Amsterdam. She installs the app after a colleague’s burnout.",
      "She fills in the basics and connects her Apple Watch and AirPods. Medical records and family links are optional, so she can skip them for now.",
    ],
  },
  {
    verb: "Sense",
    layer: "body",
    icon: "pulse",
    when: "Weeks 1–4",
    title: "The watch learns what is normal for her",
    story: [
      "Sanne does nothing special. Her watch tracks sleep, heart rate and HRV in the background.",
      "After a few weeks the app knows her personal baseline: about seven hours of sleep and a resting heart rate of 57. Today everything is within her usual range.",
    ],
  },
  {
    verb: "Capture",
    layer: "context",
    icon: "mic",
    when: "Week 7 · Wednesday, 16:42",
    title: "She says what the day was like",
    story: [
      "A reorganisation has started at work. After a big presentation on very little sleep, Sanne says “Log a thought” and talks for 18 seconds.",
      "The app saves it and says nothing more. It records only because she asked it to.",
    ],
  },
  {
    verb: "Structure",
    layer: "ai",
    icon: "tags",
    when: "Moments later",
    title: "Her words become context",
    story: [
      "The app pulls the topics out of what she said: work, the presentation, poor sleep.",
      "What Sanne reported (stressed, tired) is kept apart from what the watch measured (higher stress, 5h 12m of sleep), so she can see which is which.",
    ],
  },
  {
    verb: "Connect",
    layer: "ai",
    icon: "link",
    when: "Weeks 5–10",
    title: "The two kinds of data start to line up",
    story: [
      "As the weeks add up, the app notices things that keep happening together: higher stress on 4 of the 5 days she mentioned deadlines, and a better mood on days she exercised.",
      "It tells her they happened together. It does not claim one caused the other.",
    ],
  },
  {
    verb: "Reflect",
    layer: "context",
    icon: "calendar",
    when: "Week 10 · Sunday evening",
    title: "Her week in under a minute",
    story: [
      "No alerts arrive during the week. On Sunday the weekly overview tells Sanne what changed: more stress than usual, 48 minutes less sleep than her baseline, and work deadlines in most of her reflections.",
    ],
  },
  {
    verb: "Learn",
    layer: "body",
    icon: "map",
    when: "Week 11 · Thursday",
    title: "“I feel really bad”",
    story: [
      "Sanne logs that she is exhausted and her heart is racing, for the third day in a row. The pattern map shows what this feeling relates to in her data: short sleep has often come with higher stress and tiredness, and weeks with exercise with a better mood.",
      "It has lasted more than two weeks and is well outside her usual range, so the app suggests discussing it with her GP. She taps “Prepare for my session”.",
    ],
  },
  {
    verb: "Share",
    layer: "care",
    icon: "shield",
    when: "Before the appointment",
    title: "She decides what her GP sees",
    story: [
      "Sanne shares her trends, mood and goals with L. Visser, her GP, and keeps her voice transcripts private.",
      "The moment she shares, the overview appears on the doctor’s phone. The GP reads twelve weeks in a minute instead of relying on what Sanne remembers.",
    ],
  },
  {
    verb: "Talk",
    layer: "care",
    icon: "chat",
    when: "At the appointment · 10:30",
    title: "The GP asks before recording",
    story: [
      "L. Visser would like to record the session for note-taking. The request appears on Sanne’s phone and she decides.",
      "Afterwards the GP sends her the summary and AI notes: protect her sleep, restart the lunchtime runs, check in again in three weeks. The GP, not the app, decides what the data means.",
    ],
  },
  {
    verb: "Control",
    layer: "care",
    icon: "key",
    when: "After the appointment",
    title: "Keep sharing, or take it back",
    story: [
      "Sanne chooses. If she keeps sharing, the GP can follow her progress and send results such as a blood test.",
      "If she revokes access, the doctor’s view locks straight away. What the GP already sent stays with her.",
    ],
  },
];

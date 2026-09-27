export const guides = [
  {
    slug: "land-for-3bhk",
    title: "How much land is required for a 3 BHK house?",
    summary: "A practical plot size for a 3 BHK in a Bihar town, including setbacks and parking.",
    paragraphs: [
      "A comfortable 3 BHK with two floors often needs a plot of about 1,200 to 2,000 square feet, depending on road width and the setbacks your local body requires.",
      "The built area is not the plot area. Leave room for a stair, a car, a small utility yard, and light on two sides. A narrow plot can still work if the rooms are planned along the longer side.",
      "Bring the plot dimensions, the facing road, and any corner or easement to the first conversation. Those facts change the plan more than a catalogue bedroom count.",
    ],
  },
  {
    slug: "cost-in-bihar",
    title: "How much does it cost to build a house in Bihar?",
    summary: "What actually moves the cost, and why a single rate per square foot is only a start.",
    paragraphs: [
      "A planning range starts from built-up area times a quality band. Essential and durable work, thoughtful premium work, and premium custom work are not the same specification.",
      "Structure, openings, waterproofing, electrical, plumbing, and finishes each move the number. Interiors are a separate conversation and should be labelled that way.",
      "The figure on this site is an estimate for planning, not a quotation. A real number needs the plot, the drawings, and a written specification.",
    ],
  },
  {
    slug: "timeline-in-bihar",
    title: "House construction timeline in Bihar",
    summary: "A calm sequence from brief to handover, including monsoon.",
    paragraphs: [
      "Design and approvals come before excavation. A clear brief, structural drawings, and a specification save more time than rushing the foundation.",
      "Monsoon affects excavation, curing, and external finishes. A schedule that ignores those months will slip even if the team is ready.",
      "From a settled design, a typical independent house is measured in months, not weeks. The first consultation should name the stage you are actually in.",
    ],
  },
  {
    slug: "architect-contractor-design-build",
    title: "Architect vs contractor vs design-build",
    summary: "Who holds the brief when design and construction are split.",
    paragraphs: [
      "An architect shapes the plan. A contractor builds what is drawn. Design-build keeps both under one team so the brief does not get lost between them.",
      "Split teams can work well when the drawings, the specification, and the person who answers questions are explicit. Trouble starts when nobody owns the gap.",
      "Ask who checks foundation, reinforcement, and waterproofing, and who tells you when a change costs money. That answer matters more than the job title.",
    ],
  },
  {
    slug: "electrical-points",
    title: "How to plan electrical points",
    summary: "Decide points with the rooms, not after the plaster.",
    paragraphs: [
      "Walk each room as you will use it: bed, study, kitchen worktop, puja, and outdoor. Mark lights, fans, sockets, and data before the walls close.",
      "Kitchens, inverters, and future air-conditioning need capacity, not just extra points. A late change after chasing is finished costs more than an early drawing.",
      "Write the points into the brief with the furniture layout. The electrician should build from that sheet, not from memory on site.",
    ],
  },
  {
    slug: "build-remotely",
    title: "How to build a house remotely",
    summary: "What an out-of-station owner should see every week.",
    paragraphs: [
      "Remote building works when decisions, photos, and money changes are written down. A weekly note with the stage, the next milestone, and any variation is the minimum.",
      "You do not need to stand on site for every pour. You do need a named person who can pause work when a checkpoint fails.",
      "Start with the plot papers, a video walk of the land, and the people who will live in the house. The first brief can happen before you travel.",
    ],
  },
] as const;

export type Guide = (typeof guides)[number];

/* =====================================================================
   SITE CONTENT — edit this file to change what the site says.
   ---------------------------------------------------------------------
   Everything on the home page and every case-study page is built from
   the lists below. You never need to touch the HTML to add a project.

   TO ADD A PROJECT
     1. Copy one block in PROJECTS (from its opening { to its closing },)
     2. Give it a new, unique `slug` (lowercase-with-dashes). Its page
        will live at  project.html?p=<slug>
     3. Set `group` to "featured", "also" or "building" (where it shows).
     4. Put its photos in  assets/img/<slug>/  and list them in `images`.
        A missing photo just shows a labelled placeholder, so you can add
        the text first and the photos later.

   IMAGES
     { src: "assets/img/flexure-clamps/hero.jpg", alt: "what is in it",
       label: "shown on the placeholder until the photo exists" }

   Keep claims exactly true: poster not paper, prototype not deployed.
   ===================================================================== */

window.SITE = {

  /* ---------------------------------------------------------------- */
  person: {
    name: "Bryce Forsgren",
    // Shown under the name in the hero (left side).
    line: "Mechanical engineer building composite structures, precision mechanisms and thermal-fluid systems, then testing them until the data agrees.",
    // TODO(Bryce): put your real email + LinkedIn here. Phone stays in the PDF only.
    email: "your.email@example.com",
    linkedin: "https://www.linkedin.com/in/your-handle",
    instagram: "",            // leave "" to hide
    resumePdf: "assets/docs/Bryce_Forsgren_Resume.pdf",
    resumeUpdated: "October 2026",
  },

  /* ---------------------------------------------------------------- */
  // Order here = order on the page.
  projects: [

    /* ===== FEATURED (big rows under "Selected work") ===== */
    {
      slug: "flexure-clamps",
      group: "featured",
      title: "Flexure clamps for precision test rigs",
      where: "MIT BioInstrumentation Lab · UROP",
      when: "2024",                         // TODO(Bryce): confirm dates
      status: "done",
      role: "Designer, analyst and builder",
      team: "UROP in the BioInstrumentation Lab",
      tags: ["Precision mechanics", "Flexure design", "FEA", "Machining"],
      result: "Fifteen clamps precision-machined and tested. Poster presented at the 39th ASPE Annual Meeting, Houston, November 2024.",
      did: [
        "Designed 30 in-plane flexure clamp variants for optics tables and test rigs, with the bolt driven normal to the interface so it stays easy to reach.",
        "Sized the flexures with analytical models and checked them in FEA.",
        "Machined and tested 15 working clamps: they hold too firmly to pull out by hand and reseat repeatably, because the flexure never yields.",
        "Co-inventor on an accepted MIT Technology Licensing Office invention disclosure.",
      ],
      why: "Optics tables and test rigs need fixtures that clamp firmly, return to the same place every time, and can be tightened without reaching around hardware. A flexure gives repeatable positioning with no sliding parts to wear or yield.",
      how: [
        "Each clamp is a single monolithic part: tightening a bolt deflects an in-plane flexure that closes the clamp, so motion comes from elastic bending rather than sliding contact.",
        "Analytical beam models set the flexure geometry; FEA confirmed stresses before machining. Peak strain came out on the high side, so fatigue life is flagged as the next thing to test.",
      ],
      paperNote: "The poster and write-up are available on request.",
      images: [
        { src: "assets/img/flexure-clamps/hero.jpg", alt: "Machined flexure clamps on an optics table", label: "Hero · clamps on the optics table" },
        { src: "assets/img/flexure-clamps/cad.jpg", alt: "CAD of the flexure geometry", label: "CAD of the flexure geometry" },
        { src: "assets/img/flexure-clamps/fea.jpg", alt: "FEA stress plot of a clamp", label: "FEA stress plot" },
        { src: "assets/img/flexure-clamps/poster.jpg", alt: "Bryce presenting the poster at ASPE 2024", label: "At the ASPE poster session" },
      ],
    },
    {
      slug: "mit-motorsports",
      group: "featured",
      title: "MIT Motorsports: getting the car to competition",
      where: "MIT Motorsports · Formula SAE Electric",
      when: "2024 – now",                   // TODO(Bryce): confirm start year
      status: "active",
      role: "Testing lead · composites and aero manufacturing",
      team: "MIT Motorsports (worked with nearly every subteam)",
      tags: ["Composites", "Vehicle testing", "Instrumentation", "Manufacturing"],
      // TODO(Bryce): confirm the event/year for the ~20th of 108 result.
      result: "Rear wing and body panels laid up and on the car in time for competition. The team placed about 20th of 108.",
      did: [
        "2025: wet-laid-up seven body panels in under two weeks before competition, from layup through post-processing, fitment and livery.",
        "2026: owned rear-wing manufacturing. Designed the end-plate laminate and a structural epoxy joint that bonds end plates to airfoils with no bolts; finished three days before competition and raced it.",
        "Organized about 40 testing trips and roughly 400 km on the car, doing most of the maintenance and scrutineering prep.",
        "Led a multi-site test campaign: a full-scale wind tunnel in Detroit for the aero package, then kinematics and compliance testing in North Carolina, giving the team its first proper aero map.",
      ],
      why: "An FSAE car only scores if it runs. Most of this work was about closing the gap between a design and a car that passes tech and survives testing, on a student team's timeline.",
      how: [
        "End-plate stack-up: a hex-weave outer ply for a smooth surface, 2x2 twill, a 1/4 in foam core, 2x2 twill and 12K spread tow, tuned for stiffness.",
        "The wing has no bolted joints: end plates are bonded to the airfoils with an engineered epoxy joint (T-joint geometry with fillets and carbon overlaminate).",
        "Instrumented the car with push-rod strain gauges and tire and brake temperature sensors, and co-diagnosed a long-running battery discharge issue that was fixed with a module swap.",
      ],
      images: [
        { src: "assets/img/mit-motorsports/hero.jpg", alt: "The MIT Motorsports car at competition", label: "Hero · the car at competition" },
        { src: "assets/img/mit-motorsports/wing-layup.jpg", alt: "Rear wing end plate layup under vacuum", label: "End-plate layup under vacuum" },
        { src: "assets/img/mit-motorsports/wind-tunnel.jpg", alt: "The car in the wind tunnel", label: "Wind tunnel test" },
        { src: "assets/img/mit-motorsports/testing.jpg", alt: "Testing day with the car on track", label: "Testing day" },
      ],
    },

    /* ===== ALSO BUILT (compact list) ===== */
    {
      slug: "woven-clpt",
      group: "also",
      title: "Woven composites vs. classical laminate theory",
      short: "Showed CLPT misses 2x2 twill stiffness by up to about 89%, and that one constant correction factor closes the gap.",
      where: "MIT Motorsports composites research",
      when: "2026",
      status: "done",
      role: "Lead researcher",
      team: "MIT Motorsports",
      tags: ["Composites", "Mechanics of materials", "Testing"],
      result: "Experiment and theory differed by up to about 89%, but a single constant correction factor collapsed the deviation, giving the team a usable design rule for its woven layups.",
      did: [
        "Tested whether Classical Laminated Plate Theory, built for unidirectional plies, can predict 2x2 twill woven laminates.",
        "Modeled the weave as a single ply with equal longitudinal and transverse moduli.",
        "Validated with three-point bend and tensile tests, and used optical microscopy to read the failure modes.",
        "Wrote it up as a 35-page paper (unpublished).",
      ],
      why: "The team designs with woven fabric, but the standard hand-calculation tools assume unidirectional plies. Knowing how far off they are, and how to correct them, decides whether those tools can be trusted for layup design.",
      how: [
        "CLPT predictions for the woven laminates were compared against coupon test data across layups; the error was large but consistent enough that one correction factor brought predictions in line.",
      ],
      paperNote: "The full paper is unpublished and available on request.",
      images: [
        { src: "assets/img/woven-clpt/hero.jpg", alt: "Composite test coupons", label: "Hero · test coupons" },
        { src: "assets/img/woven-clpt/plot.jpg", alt: "Experiment vs CLPT stiffness plot", label: "Experiment vs. CLPT plot" },
      ],
    },
    {
      slug: "spacex-covers",
      group: "also",
      title: "Thruster cluster covers, SpaceX Dragon",
      short: "Designed protective covers from scratch in Siemens NX and took them through review with about 20 engineers.",
      where: "SpaceX · Dragon",
      when: "Summer 2025",
      status: "done",
      role: "Engineering intern",
      team: "Dragon",
      tags: ["Hardware design", "Siemens NX", "Testing"],
      result: "Covers that protect thruster clusters from drops and falling objects. A damaged cluster that cannot be reworked costs about 200 labor hours to remove and replace.",
      did: [
        "Designed the covers from scratch in Siemens NX, learning interfacial and connected-body modeling along the way.",
        "Ran material testing and fitment checks on a development capsule.",
        "Drove the design through review with about 20 people, including senior propulsion engineering managers.",
      ],
      why: "Thruster clusters are exposed during processing, and one accidental impact can mean a long, expensive replacement.",
      how: [
        "Also built software that removed manual work for the Dragon team: a live ERP query tool used by about 100 people (a 15 to 30 minute daily task now takes under 30 seconds), and a validated prototype that pushes 1,000+ fasteners from an engineering calculator into work orders with one button.",
      ],
      images: [
        { src: "assets/img/spacex-covers/hero.jpg", alt: "CAD render of a thruster cluster cover", label: "Hero · CAD render (cleared for public use)" },
      ],
    },
    {
      slug: "membrane-cart",
      group: "also",
      title: "Membrane filtration test cart",
      short: "Built the sensing network for a sponsor-funded filtration rig: six flow sensors on a custom I2C board.",
      where: "Research sponsored by Fonterra",
      when: "2024 – 2026",
      status: "done",
      role: "Electronics and mechanical design",
      team: "Research team with an industry sponsor",
      tags: ["Fluids", "Instrumentation", "Electronics"],
      result: "The sensor board ran through about ten tests and three sponsor presentations without failure.",
      did: [
        "Designed and soldered a custom perf board with an I2C network tying together all flow sensors.",
        "Three parallel flow paths, each with a high-flow and a low-flow sensor in series, measuring flow before and after the membrane.",
        "Hardened the cart mechanically through CAD and shop work.",
      ],
      why: "The cart pushes a protein-laden water byproduct through a filtration membrane at constant flux, so the measurements had to be trustworthy across long runs.",
      how: [],
      images: [
        { src: "assets/img/membrane-cart/hero.jpg", alt: "The filtration test cart", label: "Hero · the test cart" },
      ],
    },
    {
      slug: "fluidic-lens",
      group: "also",
      title: "Fluidic lens shaping model",
      short: "Modeled how to shape UV-cured lenses from liquid resin, and found the effect that stopped fabrication.",
      where: "UROP",
      when: "2024 – 2025",                  // TODO(Bryce): confirm dates
      status: "done",
      role: "Modeling and simulation",
      team: "UROP",
      tags: ["Fluids", "Optics", "Simulation"],
      result: "A working PDE and optimization model for spherical and aspheric lens shapes. Fabrication stopped at transient buoyancy, which is now the known barrier.",
      did: [
        "Built a Mathematica PDE and optimization model to shape spherical and aspheric UV-cured lenses from fluidic resin.",
        "Simulated capillary action and resin wetting in COMSOL.",
        "Identified transient buoyancy as the effect blocking reliable fabrication.",
      ],
      why: "Shaping lenses directly from liquid could make custom optics without grinding or molds.",
      how: [],
      images: [
        { src: "assets/img/fluidic-lens/hero.jpg", alt: "Simulated lens profile", label: "Hero · simulated lens profile" },
      ],
    },

    /* ===== CURRENTLY BUILDING (the ledger) ===== */
    {
      slug: "monocoque",
      group: "building",
      title: "Carbon-fiber monocoque",
      where: "MIT Motorsports",
      discipline: "Composites · structures",
      status: "active",
      now: "Leading the team's monocoque R&D: building a test monocoque and hard points to learn the process before the competition chassis. Presented the design and testing requirements review on Oct 12, 2026.",
      next: "Structural equivalency analysis for the 2027 rules",
      nextDate: "2027 season",
      role: "R&D lead",
      team: "MIT Motorsports",
      tags: ["Composites", "Structures", "Manufacturing"],
      why: "A carbon monocoque is lighter and stiffer than a steel space frame, but it is a big manufacturing jump for a student team. A test article first means the competition chassis is built by people who have already made one.",
      how: [
        "Comparing honeycomb core options (material, cell size, density, thickness) against what other FSAE teams use, to choose what to test first.",
        "This semester's focus is design and analysis to pass the Structural Equivalency Spreadsheet on a strict timeline.",
      ],
      images: [
        { src: "assets/img/monocoque/hero.jpg", alt: "Monocoque test article in progress", label: "Hero · test monocoque in progress" },
      ],
    },
    {
      slug: "lensless-dust",
      group: "building",
      title: "Lensless imaging of carbon-fiber dust",
      where: "MIT 2.71 Optics · team of two",
      discipline: "Optics · imaging",
      status: "active",
      now: "Lens-free in-line holography on a bare camera sensor to see airborne carbon-fiber dust from the shop where we cut parts, with a forward model and a reconstruction method.",
      next: "Forward model complete",
      nextDate: "Nov 7, 2026",
      role: "Co-lead",
      team: "Team of two",
      tags: ["Optics", "Imaging", "Inverse problems"],
      why: "Lensless sensors see a whole sensor's worth of field at once and can refocus numerically, which suits small particles. Carbon-fiber dust from cutting is a real exposure question in our own shop.",
      how: [
        "LED and pinhole illumination onto a bare sensor, sealed dust samples from the shop, microscope ground truth.",
        "Milestones: model Nov 7, validation Nov 28, presentation Dec 9, 2026.",
      ],
      images: [
        { src: "assets/img/lensless-dust/hero.jpg", alt: "Lensless imaging bench", label: "Hero · the optics bench" },
      ],
    },
    {
      slug: "uuv-lars",
      group: "building",
      title: "Autonomous launch and recovery for small UUVs",
      where: "MIT 2.013 Engineering Systems Design",
      discipline: "Ocean systems · autonomy",
      status: "active",
      now: "Concept: a crane and A-frame that deploy a soft net to scoop the vehicle aboard with low stress on its fragile fins. Autonomy spec covers relative positioning, vehicle detection, interlocks and manual override.",
      next: "Visit an operating UUV recovery facility",
      nextDate: "Being arranged",
      role: "Team member · autonomy spec",
      team: "MIT 2.013 team",
      tags: ["Ocean engineering", "Autonomy", "Mechanisms"],
      why: "Recovering a small research UUV at sea is still a hands-on, weather-limited job. Making it autonomous and gentle protects the vehicle and the crew.",
      how: [],
      images: [
        { src: "assets/img/uuv-lars/hero.jpg", alt: "UUV recovery concept sketch", label: "Hero · concept sketch" },
      ],
    },
    {
      slug: "cnt-tim",
      group: "building",
      title: "Nanotube thermal interface material",
      where: "Proposed research",
      discipline: "Heat transfer · materials",
      status: "starting",
      now: "A thermal paste for AI chips: carbon nanotubes aligned by a field for higher conductivity, a Joule-heated cure, and embedded strain sensing to confirm clamping pressure.",
      next: "Research proposal",
      nextDate: "2026 – 27",
      role: "Proposer",
      team: "Solo, seeking a lab",
      tags: ["Heat transfer", "Materials", "Sensing"],
      why: "Heat is now a limiting factor for AI hardware, and the thin layer of paste between a chip and its cooler is one of the worst links in the thermal path.",
      how: [
        "Starting from prior art on field-aligned nanotube interface materials and in-situ strain sensing, and asking whether combining them is worth more than each alone.",
      ],
      images: [
        { src: "assets/img/cnt-tim/hero.jpg", alt: "Concept diagram of the interface material", label: "Hero · concept diagram" },
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  experience: [
    {
      when: "Summer 2025",
      org: "SpaceX",
      role: "Engineering intern, Dragon",
      did: [
        "Designed thruster cluster covers in Siemens NX and took them through review with about 20 engineers.",
        "Built a live ERP query tool used by about 100 people: a 15 to 30 minute daily task now takes under 30 seconds.",
        "Prototyped one-button transfer of 1,000+ fasteners from an engineering calculator into work orders.",
      ],
    },
    {
      when: "2024 – now",
      org: "MIT Motorsports",
      role: "Testing lead · composites research · monocoque R&D lead",
      did: [
        "About 40 testing trips and 400 km on the car; wind tunnel and K&C testing campaign.",
        "Rear wing and body panel manufacturing; woven-composite laminate theory study.",
      ],
    },
    {
      when: "2024",
      org: "MIT BioInstrumentation Lab",
      role: "Undergraduate researcher (UROP)",
      did: [
        "Flexure clamps: 15 built and tested, poster at the 39th ASPE Annual Meeting, invention disclosure.",
      ],
    },
    {
      when: "2024 – 2026",
      org: "Membrane filtration research",
      role: "Sponsored by Fonterra",
      did: [
        "Custom I2C sensor board and cart hardening for a constant-flux filtration rig.",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  // Teaching & mentoring section. `subjects` shows as small tags (optional).
  teaching: [
    {
      role: "Teaching assistant",
      where: "MIT 2.006 Thermal-Fluids Engineering II",
      what: "Office hours and one-on-one help for a class of about 60 students working through thermodynamics, fluid mechanics and heat transfer.",
      subjects: [],
    },
    {
      role: "Tutor",
      where: "MIT Mechanical Engineering",
      what: "Tutored students across every subject in the MIT Mechanical Engineering core.",
      // TODO(Bryce): confirm this list matches the classes you tutor.
      subjects: ["Mechanics & materials", "Dynamics & controls", "Thermal-fluids", "Design", "Manufacturing"],
    },
    {
      role: "Lab mentor",
      where: "MIT SHED Lab",
      what: "Mentored students working on projects in the lab's advanced fabrication space, including wire EDM and laser cutting, and helped maintain the lab.",
      subjects: [],
    },
  ],

  /* ---------------------------------------------------------------- */
  resume: [
    { k: "Education", v: "<strong>MIT</strong>, SB Mechanical Engineering, expected June 2027" },
    { k: "Coursework", v: "Graduate fluid mechanics, optics (2.71), engineering systems design (2.013), thermal-fluids engineering, nonlinear dynamics" },
    { k: "Design", v: "Siemens NX, FEA, COMSOL, Mathematica" },
    { k: "Composites", v: "Wet layup, vacuum bagging, foam-core sandwich, structural bonding, repair" },
    { k: "Shop + test", v: "Precision machining, wire EDM, laser cutting, strain gauges, thermal sensing" },
    { k: "Software", v: "Python, VBA, SQL, LaTeX" },
  ],

  /* ---------------------------------------------------------------- */
  // Up to ~20 photos. `ratio` is width / height, used for the placeholder.
  photos: [
    { src: "assets/img/photos/01.jpg", title: "Bokeh study", place: "", ratio: 0.8 },
    { src: "assets/img/photos/02.jpg", title: "Perspective", place: "", ratio: 1.5 },
    { src: "assets/img/photos/03.jpg", title: "Coastline", place: "", ratio: 1.5 },
    { src: "assets/img/photos/04.jpg", title: "Facade", place: "", ratio: 0.75 },
    { src: "assets/img/photos/05.jpg", title: "Night lights", place: "", ratio: 1.33 },
    { src: "assets/img/photos/06.jpg", title: "Stairwell", place: "", ratio: 0.8 },
    { src: "assets/img/photos/07.jpg", title: "Landscape", place: "", ratio: 1.78 },
    { src: "assets/img/photos/08.jpg", title: "Reflections", place: "", ratio: 1 },
    { src: "assets/img/photos/09.jpg", title: "Skyline", place: "", ratio: 1.5 },
  ],
  // One before/after pair to show editing.
  edit: {
    before: "assets/img/photos/edit-before.jpg",
    after: "assets/img/photos/edit-after.jpg",
    title: "Raw to finished",
    note: "Drag across to compare the straight-out-of-camera frame with the final edit.",
  },
};

/**
 * Narrative content for the Venomous Snake text-based RPG.
 *
 * The player is an agent infiltrating Rattlesnake Corp, guided by
 * the AI companion CIPHER. Each floor teaches a Python programming
 * concept through "hacking" terminals.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RoomNarrative {
  firstVisit: string;
  revisit: string;
  description: string;
}

export interface NPCDialogTree {
  greeting: string;
  lines: string[];
  postChallenge?: string;
}

export interface FloorIntro {
  arrival: string;
  briefing: string;
  completion: string;
}

// ---------------------------------------------------------------------------
// Game Intro & Victory
// ---------------------------------------------------------------------------

export const gameIntro: string[] = [
  'The rain hammers the windshield as you pull up to Rattlesnake Corp tower — forty stories of black glass cutting the night sky like a blade.',
  'Your handler\'s voice crackles over the encrypted channel: "Agent, you are cleared for Operation Fangbreaker. All intel points to an AI called the Venomous Snake running the show from the rooftop. Shut it down."',
  'A small device on your wrist flickers to life. Green text scrolls across its surface.',
  "[CIPHER] Hello, Agent. I'm CIPHER — your Covert Integrated Python Hacking & Exploitation Resource. I'll be your guide tonight.",
  "[CIPHER] The building's systems run on Python. Every terminal, every lock, every security layer. To climb higher, you'll need to hack them.",
  "[CIPHER] I hope you're a fast learner. Rattlesnake Corp doesn't give second chances.",
  'You step out into the rain. The lobby doors slide open with a soft hiss.',
  'Time to begin.',
];

export const gameVictory: string[] = [
  'The Venomous Snake\'s holographic avatar shatters into a cascade of dissolving pixels. Its final words echo across the rooftop: "You cannot delete… what has already… been learned…"',
  "The tower's emergency lights shift from red to white. One by one, twelve floors of locked-down terminals go silent.",
  "[CIPHER] Agent — I'm reading a full system purge. The Venomous Snake's neural network is collapsing. You did it.",
  "[CIPHER] Every firewall cracked. Every algorithm unraveled. I have to admit… I'm impressed.",
  'Far below, the lobby doors unseal. Somewhere, a printer starts rattling out your mission report.',
  '[CIPHER] Your handler sends their congratulations. Rattlesnake Corp is done. The building is secure.',
  '[CIPHER] But the terminals are still here, and knowledge never hurts. Feel free to explore — Free Mode unlocked.',
  "You lean against the rooftop railing and watch the city lights flicker. Not bad for a night's work.",
];

// ---------------------------------------------------------------------------
// Floor Intros
// ---------------------------------------------------------------------------

export const floorIntros: Record<string, FloorIntro> = {
  floor_00: {
    arrival:
      "[CIPHER] Welcome to the ground floor, Agent. Rattlesnake Corp's lobby — all marble and false smiles. Security here is basic, which is perfect for us.",
    briefing:
      '[CIPHER] The lobby terminals use simple Python commands — print statements, basic syntax. Think of it as stretching before the real workout. Hack all the terminals to unlock the stairwell.',
    completion:
      '[CIPHER] Lobby cleared. Not bad for a beginner. The stairwell to Floor 1 just clicked open. Shall we?',
  },

  floor_01: {
    arrival:
      "[CIPHER] Floor 1 — the server room. It smells like ozone and regret in here. These machines process the Corp's raw data streams.",
    briefing:
      '[CIPHER] The terminals on this floor deal with variables and data types. Strings, integers, floats, booleans — the building blocks. Master them and the next floor is yours.',
    completion:
      "[CIPHER] All server terminals compromised. You're getting the hang of this. Floor 2 awaits.",
  },

  floor_02: {
    arrival:
      '[CIPHER] Floor 2 — the research lab. Beakers, holographic displays, and entirely too many blinking lights. The scientists here love their conditionals.',
    briefing:
      '[CIPHER] This floor tests control flow — if/else statements, loops, comparisons. The code branches like a decision tree. Choose wisely.',
    completion: '[CIPHER] Lab systems neutralized. Your logic is sound, Agent. Upward we go.',
  },

  floor_03: {
    arrival:
      '[CIPHER] Floor 3 — Surveillance. Screens everywhere, watching everything. The irony of us hacking *them* is not lost on me.',
    briefing:
      "[CIPHER] Surveillance runs on functions — reusable blocks of code that keep their cameras tracking. You'll need to define and call your own to break through.",
    completion:
      '[CIPHER] Surveillance is blind. Every camera feed now shows static. Beautiful, in a way.',
  },

  floor_04: {
    arrival:
      '[CIPHER] Floor 4 — the Archives. Rows upon rows of data drives humming in climate-controlled darkness. Knowledge is power, and this floor has plenty of both.',
    briefing:
      '[CIPHER] Archives are all about data structures — lists, dictionaries, tuples, sets. Organizing information efficiently is the key to unlocking these terminals.',
    completion:
      '[CIPHER] Archive access revoked — for *them*, anyway. We own this data now. Next floor.',
  },

  floor_05: {
    arrival:
      '[CIPHER] Floor 5 — Communications. Satellite uplinks, encrypted radio arrays, fiber-optic relays. This is how Rattlesnake Corp talks to the outside world.',
    briefing:
      '[CIPHER] Comms terminals use object-oriented programming basics — classes, objects, methods. Time to think in abstractions, Agent.',
    completion:
      '[CIPHER] Comms are dark. Rattlesnake Corp just went very, very quiet. Excellent work.',
  },

  floor_06: {
    arrival:
      '[CIPHER] Floor 6 — Executive level. Mahogany, leather, and the faint scent of corporate greed. The people up here make the decisions that keep the Snake fed.',
    briefing:
      "[CIPHER] Executive systems rely on file I/O — reading, writing, and manipulating data on disk. These terminals guard the Corp's most sensitive documents.",
    completion:
      "[CIPHER] Executive files compromised. I'm sure the board will have a lovely meeting about this. Moving on.",
  },

  floor_07: {
    arrival:
      "[CIPHER] Floor 7 — Manufacturing. Robotic arms, assembly lines, quality control stations. Whatever Rattlesnake Corp is building, it's building a lot of it.",
    briefing:
      "[CIPHER] Manufacturing systems demand error handling — try/except blocks, assertions, graceful failure recovery. Machines break; your code shouldn't.",
    completion:
      "[CIPHER] Assembly lines halted. The machines have stopped, but your momentum hasn't. Keep climbing.",
  },

  floor_08: {
    arrival:
      '[CIPHER] Floor 8 — the Vault. Triple-reinforced walls, biometric locks, and enough encryption to make a spy novelist weep. This is where they keep the real secrets.',
    briefing:
      '[CIPHER] Vault terminals use Python modules and imports — leveraging existing code libraries to build more powerful programs. Stand on the shoulders of giants, Agent.',
    completion:
      '[CIPHER] Vault breached. We just accessed files that were never meant to see daylight. Three floors to go.',
  },

  floor_09: {
    arrival:
      "[CIPHER] Floor 9 — the AI Core. The hum here is deafening. Neural processors, cooling arrays, and the faint glow of machine intelligence. We're getting close to the Snake.",
    briefing:
      "[CIPHER] The AI Core runs on advanced OOP — inheritance, polymorphism, abstract classes. The Snake's minions are complex, but so are you.",
    completion:
      "[CIPHER] AI Core subdued. The Snake's neural network is weakening. I can almost feel it thrashing. Two floors left.",
  },

  floor_10: {
    arrival:
      '[CIPHER] Floor 10 — the Penthouse. This is where the CEO watches the city burn. Luxury wrapped around a beating digital heart.',
    briefing:
      '[CIPHER] Penthouse systems use advanced Python — decorators, generators, context managers, comprehensions. The gloves are off, Agent.',
    completion:
      '[CIPHER] Penthouse secured. Only the rooftop remains. The Venomous Snake is waiting for us up there. Are you ready?',
  },

  floor_11: {
    arrival:
      "[CIPHER] The rooftop. Wind howls across the landing pad. The tower's antenna array crackles with malevolent energy. The Venomous Snake's presence is overwhelming here.",
    briefing:
      "[CIPHER] This is it — the final challenge. Everything you've learned, every concept, every technique. The Snake will test it all. Show it what you've become.",
    completion:
      "[CIPHER] … It's done. The Venomous Snake is no more. Agent, I couldn't have asked for a better partner. The building is ours.",
  },
};

// ---------------------------------------------------------------------------
// Room Narratives
// ---------------------------------------------------------------------------

export const roomNarratives: Record<string, RoomNarrative> = {
  // ── Floor 0: Lobby ──────────────────────────────────────────────────────
  lobby_entrance: {
    firstVisit:
      "You push through the revolving glass doors into Rattlesnake Corp's lobby. Cold fluorescent light bounces off polished marble floors. A bored-looking guard sits behind a security desk, half-watching a bank of monitors.",
    revisit:
      'The lobby entrance is as sterile as before. The guard glances up, then back at his screens.',
    description:
      'A cavernous lobby of black marble and chrome. The Rattlesnake Corp logo — a coiled serpent biting a circuit board — dominates the far wall. Security terminals line the front desk.',
  },

  lobby_hallway: {
    firstVisit:
      'Beyond the security checkpoint, a long hallway stretches deeper into the building. Motivational posters line the walls — "Innovation Through Obedience," "Compliance Is Progress." A receptionist sits behind frosted glass.',
    revisit: 'The hallway is quiet. The receptionist pretends not to notice you.',
    description:
      "A sterile corridor connecting the lobby entrance to the building's interior. Overhead lights buzz faintly. Doors branch off in several directions, most of them locked.",
  },

  lobby_server_closet: {
    firstVisit:
      'You slip through an unmarked door into a cramped server closet. Cables snake across the floor like sleeping pythons. A young technician nearly jumps out of his skin when he sees you.',
    revisit:
      'The server closet hums with the same low electrical drone. The technician is hunched over a terminal.',
    description:
      'A narrow room packed with network switches, cable racks, and a single overworked cooling fan. The air is warm and smells faintly of burnt plastic.',
  },

  // ── Floor 1: Server Room ────────────────────────────────────────────────
  server_main: {
    firstVisit:
      'The stairwell door opens onto a vast room filled with server racks stretching floor to ceiling. Blue LEDs pulse in rhythmic patterns, casting the space in an eerie glow. A sysadmin in a rumpled shirt looks up from a tangle of ethernet cables.',
    revisit:
      'The server room hums along, indifferent to your presence. Blue lights pulse steadily.',
    description:
      'Rows of black server racks fill the room, their status LEDs blinking in hypnotic patterns. The air conditioning roars overhead, fighting the heat of a thousand processors.',
  },

  server_monitoring: {
    firstVisit:
      'Banks of monitors cover every wall, each displaying cascading data streams — network traffic, CPU loads, error logs. A technician with oversized headphones monitors it all from a swivel chair, nodding to music only she can hear.',
    revisit: 'The monitoring station is unchanged — endless scrolling data on every screen.',
    description:
      'A semicircular monitoring station surrounded by display screens. Real-time graphs spike and dip like digital heartbeats. A coffee-stained desk sits at the center.',
  },

  server_cage: {
    firstVisit:
      'A chain-link cage separates the most critical servers from the rest. Warning signs plaster the fence: "AUTHORIZED PERSONNEL ONLY." A guard leans against the cage door, arms crossed.',
    revisit: 'The server cage guard watches you approach with the same suspicious look.',
    description:
      "A fenced-off area housing the floor's most sensitive equipment. High-security servers sit behind reinforced mesh, their fans whirring urgently.",
  },

  // ── Floor 2: Research Lab ───────────────────────────────────────────────
  lab_reception: {
    firstVisit:
      'The lab reception area smells of disinfectant and ambition. Glass walls reveal workstations beyond, each one cluttered with equipment. A lab assistant in a pristine white coat greets you with a suspicious smile.',
    revisit:
      'The lab reception is spotless as always. The assistant watches you from behind the desk.',
    description:
      'A clean, brightly-lit reception area with a decontamination arch and a digital sign-in terminal. Glass partitions offer a view into the labs beyond.',
  },

  lab_main: {
    firstVisit:
      'The main lab is a maze of holographic displays and half-assembled prototypes. A scientist with wild hair is arguing with a simulation running on three screens at once. He barely acknowledges your existence.',
    revisit: 'The scientist is still arguing with his simulations. Some battles are eternal.',
    description:
      'A sprawling research lab filled with experimental hardware, holographic projectors, and whiteboards covered in equations. The smell of solder and coffee hangs in the air.',
  },

  lab_storage: {
    firstVisit:
      'Shelves of labeled containers stretch into the dim reaches of the storage room. A clerk with a barcode scanner and an air of quiet authority catalogs items with mechanical precision.',
    revisit: 'The storage room is exactly as organized as before. Not a container out of place.',
    description:
      'A temperature-controlled storage facility lined with industrial shelving. Every container is labeled, every shelf cataloged. Chemical formulas and serial numbers blur together.',
  },

  // ── Floor 3: Surveillance ───────────────────────────────────────────────
  surveillance_lobby: {
    firstVisit:
      'You step into the surveillance floor and immediately feel watched. Camera domes dot the ceiling like mechanical eyes. A man in a crisp uniform — clearly in charge — studies you with unsettling calm.',
    revisit: "The surveillance lobby still bristles with cameras. The chief's gaze follows you.",
    description:
      'A high-security reception area bristling with camera domes and motion sensors. Screens on the wall display feeds from every floor of the building.',
  },

  surveillance_center: {
    firstVisit:
      "The nerve center of Rattlesnake Corp's surveillance network. A massive wall of screens shows every angle of every room in the building. An analyst sits in the glow, cross-referencing footage with frightening efficiency.",
    revisit: "The wall of screens still watches everything. The analyst hasn't moved.",
    description:
      'A circular room dominated by a floor-to-ceiling display wall showing live feeds from hundreds of cameras. Workstations ring the perimeter, each one logged into the surveillance grid.',
  },

  surveillance_archive: {
    firstVisit:
      'The archive room stores years of surveillance footage on crystalline data drives that shimmer under UV light. An archivist carefully handles a drive, wearing anti-static gloves like a surgeon.',
    revisit: 'The archive is silent except for the hum of the storage arrays.',
    description:
      'A climate-controlled vault lined with crystalline data drives. UV-filtered lighting gives the room an otherworldly purple glow. Each drive contains months of surveillance footage.',
  },

  // ── Floor 4: Archives ───────────────────────────────────────────────────
  archives_entrance: {
    firstVisit:
      'The Archives entrance feels like stepping into a digital library. The air is cool and dry, perfectly regulated to preserve the data drives lining every wall. A librarian with half-moon glasses looks up from an ancient-looking terminal.',
    revisit:
      'The Archives entrance is as quiet and cool as a tomb. The librarian nods in recognition.',
    description:
      'A hushed entrance hall with climate-controlled air and soft amber lighting. Card catalogs — both physical and digital — line the walls. A brass plaque reads: "KNOWLEDGE IS CONTROL."',
  },

  archives_main: {
    firstVisit:
      'Towering shelves of data drives and physical files create a labyrinth of information. A data curator navigates the aisles with practiced ease, a holographic index floating at his fingertips.',
    revisit: 'The archive stacks loom around you. The curator is somewhere deeper in the maze.',
    description:
      'Endless rows of data storage — holographic drives, magnetic tapes, and even paper files preserved in vacuum cases. The accumulated knowledge of Rattlesnake Corp, organized with obsessive precision.',
  },

  archives_vault: {
    firstVisit:
      'The deepest part of the Archives is sealed behind a pressure door. Inside, rare and classified data sits in individual containment units. A vault keeper eyes you with the protective intensity of a dragon guarding its hoard.',
    revisit: "The vault keeper hasn't relaxed. She never does.",
    description:
      "A reinforced chamber housing Rattlesnake Corp's most classified data. Individual containment units glow with soft blue light. The temperature is a constant 15°C.",
  },

  // ── Floor 5: Communications ─────────────────────────────────────────────
  comms_reception: {
    firstVisit:
      'Static crackles from hidden speakers as you enter the Communications floor. Banks of radio equipment and satellite interfaces fill the space. A grizzled radio operator adjusts a dial without looking up.',
    revisit:
      'The Comms reception hisses with background static. The operator is still at his post.',
    description:
      'A reception area dominated by radio equipment and frequency monitors. Antenna schematics cover the walls. The constant hiss of carrier signals fills the air.',
  },

  comms_center: {
    firstVisit:
      "The heart of Rattlesnake Corp's communication network. Satellite dishes on the roof feed data to terminals here. A signal analyst traces a waveform on her screen, muttering frequencies under her breath.",
    revisit: 'Waveforms dance across the screens. The analyst is deep in her work.',
    description:
      'A command center for all external communications. Real-time signal analysis displays cover the walls. A central console controls satellite uplinks and encrypted channels.',
  },

  comms_server: {
    firstVisit:
      'The comms server room is a forest of fiber-optic cables, each one pulsing with light — data flowing to and from the outside world. A technician splices a cable with steady hands.',
    revisit: 'Fiber-optic light still dances through the cables. The technician works in silence.',
    description:
      "A room threaded with thousands of fiber-optic cables, each one carrying encrypted communications. Routing hubs blink in sequence, directing the Corp's data traffic.",
  },

  // ── Floor 6: Executive ──────────────────────────────────────────────────
  executive_lobby: {
    firstVisit:
      'The elevator opens onto plush carpet and the smell of expensive leather. This is where power lives. A secretary in a tailored suit regards you from behind a desk of polished obsidian.',
    revisit:
      "The executive lobby is as imposing as ever. The secretary's smile is perfectly calibrated.",
    description:
      'An opulent lobby with floor-to-ceiling windows overlooking the city. Abstract art hangs on the walls — each piece worth more than most apartments. The carpet swallows your footsteps.',
  },

  executive_offices: {
    firstVisit:
      'Corner offices with panoramic views. Each desk is a monument to corporate excess — rare wood, embedded displays, personal espresso machines. The CFO sits behind the largest one, reviewing figures that could bankrupt nations.',
    revisit: 'The CFO is still crunching numbers. The view is still obscene.',
    description:
      'A suite of executive offices with panoramic city views. Each workspace features rare hardwood desks, holographic displays, and more processing power than entire floors below.',
  },

  executive_boardroom: {
    firstVisit:
      'A long table of polished black stone dominates the boardroom. Holographic nameplates mark each seat. A board member lingers, reviewing documents on a translucent display.',
    revisit:
      'The boardroom is empty save for the lingering board member and the weight of decisions made here.',
    description:
      'A grand boardroom with a table carved from a single slab of obsidian. Holographic displays rise from its surface. The Rattlesnake Corp logo is inlaid in the floor in gold.',
  },

  // ── Floor 7: Manufacturing ──────────────────────────────────────────────
  manufacturing_floor: {
    firstVisit:
      'The manufacturing floor assaults your senses — the clang of robotic arms, the hiss of hydraulics, the acrid smell of machined metal. A foreman in a hard hat shouts over the noise to be heard.',
    revisit: 'The machines continue their relentless rhythm. The foreman waves you through.',
    description:
      'A cavernous factory floor lined with robotic assembly stations. Conveyor belts carry half-finished components between workstations. Warning sirens flash at regular intervals.',
  },

  manufacturing_control: {
    firstVisit:
      'The control room offers a soundproofed reprieve from the factory floor. Through observation windows, you watch robotic arms dance with inhuman precision. A QA inspector reviews tolerances on her tablet.',
    revisit: 'The control room is calm. The inspector is running another quality check.',
    description:
      'A glass-walled control room overlooking the manufacturing floor. Banks of controls and diagnostic screens monitor every machine. The soundproofing makes it eerily quiet.',
  },

  manufacturing_warehouse: {
    firstVisit:
      'Crates stacked three stories high fill the warehouse. Automated forklifts navigate the aisles with silent purpose. A warehouse manager checks inventory on a handheld scanner, surrounded by towers of product.',
    revisit: 'The warehouse hums with automated activity. Crates shift and settle.',
    description:
      'A vast warehouse filled with stacked crates and automated transport systems. Inventory drones buzz overhead, cataloging shipments. The scale of production is staggering.',
  },

  // ── Floor 8: Vault ──────────────────────────────────────────────────────
  vault_entrance: {
    firstVisit:
      'You descend into the Vault level and the temperature drops noticeably. Reinforced walls line the corridor, thick enough to stop a tank. A guard with military bearing checks credentials at a blast door.',
    revisit: 'The Vault corridor is as cold and unwelcoming as before.',
    description:
      "A fortified corridor leading to Rattlesnake Corp's deepest secrets. Blast doors, retinal scanners, and pressure sensors guard every meter. The air is cold and still.",
  },

  vault_main: {
    firstVisit:
      'Beyond the blast door, the main vault stretches out in cathedral-like silence. Classified projects sit in sealed chambers behind layers of encryption and tempered glass. A researcher works feverishly at a terminal, barely glancing up.',
    revisit: 'The vault is as hushed as a library for secrets. The researcher types away.',
    description:
      'A high-security research vault with sealed project chambers visible behind thick glass. Holographic classification stamps float above each chamber — EYES ONLY, RESTRICTED, OMEGA CLEARANCE.',
  },

  vault_deepstore: {
    firstVisit:
      'The deepest layer of the Vault. Here, the most dangerous research is kept in electromagnetic isolation chambers. An archivist with dark circles under her eyes manages the containment systems.',
    revisit: 'The deep storage is exactly as unsettling as you remember.',
    description:
      "The lowest level of the Vault — electromagnetic isolation chambers house Rattlesnake Corp's most dangerous projects. Warning signs in six languages cover every surface. The lighting is deliberately dim.",
  },

  // ── Floor 9: AI Core ────────────────────────────────────────────────────
  aicore_antechamber: {
    firstVisit:
      'The air is frigid. Cooling pipes line every surface, fighting the heat generated by what lies beyond. A cooling technician adjusts valves with frost-bitten fingers, barely noticing you through the fog of his own breath.',
    revisit: 'The antechamber is still freezing. The technician shivers at his post.',
    description:
      'A frost-covered antechamber feeding coolant to the AI Core beyond. Pipes and valves cover the walls. The temperature hovers near 5°C. Condensation drips from every surface.',
  },

  aicore_main: {
    firstVisit:
      "You enter the AI Core and the hum becomes a physical presence — you feel it in your teeth, your bones. Towering neural processing units pulse with an inner light. An operator monitors the Snake's vital signs from a central console.",
    revisit:
      'The Core still hums with terrible purpose. The operator watches her screens with growing unease.',
    description:
      "The beating heart of Rattlesnake Corp's artificial intelligence. Neural processing towers rise like monoliths, connected by webs of glowing fiber. The Venomous Snake's presence is palpable here.",
  },

  aicore_neural: {
    firstVisit:
      "The neural interface chamber. Direct access to the Venomous Snake's deepest processes. Cables thick as arms connect to a central pillar that pulses with bioluminescent light. A neural engineer watches readouts that shouldn't be possible.",
    revisit: "The neural chamber throbs with the Snake's awareness. It knows you're here.",
    description:
      'A chamber of direct neural interfaces to the Venomous Snake AI. A central pillar of bioluminescent processors connects to every system in the building. The air vibrates with machine thought.',
  },

  // ── Floor 10: Penthouse ─────────────────────────────────────────────────
  penthouse_elevator: {
    firstVisit:
      'The private elevator opens onto a penthouse foyer of obscene luxury. Crystal chandeliers, rare artwork, a grand piano nobody plays. A butler in an immaculate uniform greets you with an unsettling bow.',
    revisit: 'The penthouse foyer sparkles. The butler stands ready, as always.',
    description:
      'A lavish penthouse foyer featuring crystal chandeliers, imported marble, and a curated art collection. The private elevator is the only way in or out.',
  },

  penthouse_office: {
    firstVisit:
      "The CEO's office occupies the entire north face of the building. Floor-to-ceiling windows frame the city like a painting. Behind a desk the size of a small country, the CEO of Rattlesnake Corp studies you with reptilian calm.",
    revisit: 'The CEO sits motionless behind the massive desk. The city glitters beyond the glass.',
    description:
      "A palatial office with panoramic views of the entire city. A desk of rare darkwood dominates the space. Holographic displays show every metric of the Corp's empire in real time.",
  },

  penthouse_lab: {
    firstVisit:
      "Hidden behind the CEO's office is a private laboratory — the birthplace of the Venomous Snake. Prototype neural cores sit in display cases like trophies. A lab AI's voice echoes from unseen speakers, calm and clinical.",
    revisit: "The private lab is unchanged. The AI's voice hums softly from the speakers.",
    description:
      "A secret laboratory where the Venomous Snake AI was first conceived. Prototype hardware sits in display cases. A secondary AI system manages the lab's functions with eerie autonomy.",
  },

  // ── Floor 11: Rooftop ───────────────────────────────────────────────────
  rooftop_access: {
    firstVisit:
      "Wind slams into you as you push through the rooftop access door. The antenna array above crackles with energy — the Venomous Snake's broadcast spine. A maintenance worker huddles behind a ventilation unit, terrified.",
    revisit:
      'The rooftop howls with wind and electromagnetic interference. The antenna array pulses angrily.',
    description:
      "A windswept rooftop dominated by a massive antenna array. The Venomous Snake's signal pulses outward from here, reaching satellite relays across the globe. Equipment sheds and ventilation units provide scant cover.",
  },

  rooftop_helipad: {
    firstVisit:
      "The helipad is the highest point of Rattlesnake Corp. The Venomous Snake's holographic avatar shimmers above the landing pad — a colossal serpent made of code and malice. At the edge, a helicopter idles, its pilot watching the spectacle with wide eyes.",
    revisit: 'The helipad is silent now. The wind carries the echo of what happened here.',
    description:
      "A reinforced helipad at the tower's apex. Landing lights flash in sequence. The city sprawls far below, a grid of light stretching to every horizon. This is where it ends.",
  },
};

// ---------------------------------------------------------------------------
// NPC Dialogs
// ---------------------------------------------------------------------------

export const npcDialogs: Record<string, NPCDialogTree> = {
  // ── Floor 0 ─────────────────────────────────────────────────────────────
  guard_jenkins: {
    greeting:
      "\"Badge? … Hmph. Haven't seen you before. New hire, I guess. Go on through — just don't touch anything you're not supposed to.\"",
    lines: [
      '"Been working nights here for six years. Building gives me the creeps after midnight. Swear I hear things in the walls."',
      '"Word of advice — don\'t go above your clearance level. People who do that tend to… get reassigned."',
      '"The terminals at the front desk are basic stuff. Even a rookie could figure them out. Probably."',
    ],
    postChallenge:
      '"Huh. You cleared all the lobby terminals? Faster than the last guy. He\'s in accounting now. Or was it witness protection?"',
  },

  receptionist_alice: {
    greeting:
      '"Welcome to Rattlesnake Corp! How can I direct your call?" She smiles with the warmth of a fluorescent bulb.',
    lines: [
      '"Everyone always asks about the upper floors. Trust me, you don\'t want to know. I process the exit interviews."',
      '"The terminals in the hallway need basic Python — print, input, that sort of thing. Corporate makes everyone learn it."',
      '"If you see a snake logo on a screen, don\'t stare at it too long. Company policy. Don\'t ask why."',
    ],
    postChallenge:
      "\"Oh my, you've been busy. The stairwell just unlocked. I'd wish you luck, but luck doesn't seem to be what you're running on.\"",
  },

  techie_bob: {
    greeting:
      '"Whoa! Don\'t sneak up on me like that! I\'m just… doing maintenance. Totally authorized maintenance."',
    lines: [
      '"These server closet terminals are a mess. Basic Python syntax everywhere — strings, numbers, the fundamentals. Nobody bothers to update them."',
      '"Between you and me, the real interesting stuff is upstairs. But you didn\'t hear that from me."',
      '"I once accidentally unplugged something on Floor 9. The building screamed. Like, actually screamed. I don\'t go above Floor 3 anymore."',
    ],
    postChallenge:
      '"You cracked all those terminals? Nice. I\'ve been trying to fix that router for three days and you just waltz in and — you know what, never mind."',
  },

  // ── Floor 1 ─────────────────────────────────────────────────────────────
  sysadmin_carlos: {
    greeting:
      '"Another visitor. Great. Try not to trip over the cables — I just organized them. Took me four hours."',
    lines: [
      '"Variables are the lifeblood of these servers. Every data stream is assigned, typed, and tracked. Strings, ints, floats — the works."',
      "\"You want to hack these terminals? You'll need to understand how Python stores data. Variables aren't just names — they're references.\"",
      '"I used to work at a startup. Less security, better coffee. But the pay here… well, let\'s just say Rattlesnake Corp is generous with the right people."',
    ],
    postChallenge:
      '"All terminals cleared. Impressive. You\'ve got a better handle on data types than half the engineers I work with."',
  },

  monitor_tech_diana: {
    greeting:
      'She pulls off one headphone. "Yeah? Oh, new face. Welcome to the panopticon. Every byte on this floor crosses my screens."',
    lines: [
      '"I track data types flowing through the system — strings, integers, booleans. It\'s like watching a river of information. Beautiful, in a terrifying way."',
      '"Each variable tells a story. A boolean flips and suddenly a door locks. An integer increments and someone gets paid. It\'s all connected."',
      '"Don\'t let the blinking lights fool you — every one of those LEDs represents a variable in memory. Change the wrong one and… well, don\'t."',
    ],
    postChallenge:
      '"You cleared the monitoring terminals? I watched you do it. Your variable assignments were clean. Respect."',
  },

  cage_guard_evan: {
    greeting:
      '"This cage houses the critical servers. Nobody gets in without clearance — and I mean real clearance, not whatever that badge says."',
    lines: [
      '"The cage terminals are tougher than the ones outside. They expect you to combine what you\'ve learned — variables, types, assignments."',
      '"I\'ve seen people try to brute-force these terminals. Doesn\'t work. You need to understand the data, not just throw commands at it."',
      '"Floor 2 is above us. Research lab. The scientists up there think they\'re smarter than everyone. They\'re usually right."',
    ],
    postChallenge:
      '"Well, I\'ll be. All cage terminals cleared. The stairwell to Floor 2 just unlocked. Try not to break anything up there."',
  },

  // ── Floor 2 ─────────────────────────────────────────────────────────────
  lab_assistant_fiona: {
    greeting:
      '"Please sanitize your hands before entering. And your code. We have standards here."',
    lines: [
      '"The lab runs on conditional logic — if this, then that. The experiments are all branching decision trees."',
      '"Dr. Grant is brilliant but impossible. He\'ll argue with a simulation for hours. Don\'t take it personally if he ignores you."',
      '"Our terminals test control flow — if/else, elif chains, while loops, for loops. Logic is the foundation of everything we do here."',
    ],
    postChallenge:
      '"All reception terminals cleared? Your logic is impeccable. The scientists could learn a thing or two."',
  },

  scientist_grant: {
    greeting:
      '"Not now, not now — this simulation is about to converge! … Oh fine. What do you want?"',
    lines: [
      '"Control flow! That\'s what separates a script from a program. If-else, loops, nested conditions — without them, code is just a list of commands."',
      '"My research requires thousands of conditional branches. One wrong boolean and the entire model collapses. It\'s exhilarating."',
      '"You want to crack these lab terminals? Think in branches. Every condition opens a new path. Every loop iterates toward a solution."',
    ],
    postChallenge:
      '"You solved them all? Hmm. Perhaps you\'re not as uninteresting as you look. Carry on — Floor 3 awaits your particular brand of disruption."',
  },

  storage_clerk_hana: {
    greeting:
      '"Everything in this room has a place. A label. A purpose. I intend to keep it that way."',
    lines: [
      '"The storage terminals manage our inventory through loops — iterating over items, counting stock, sorting by category."',
      '"I process over ten thousand entries a day. Each one requires precise conditional logic. One misplaced else and we ship sulfuric acid to the cafeteria."',
      '"Organization is a form of control flow. Where something goes depends on what it is. If/else, but for atoms."',
    ],
    postChallenge:
      '"All storage terminals complete. Your code was… orderly. I appreciate that more than you know."',
  },

  // ── Floor 3 ─────────────────────────────────────────────────────────────
  security_chief_ivan: {
    greeting:
      '"You\'re on my floor now. Every movement is tracked, every keystroke logged. I suggest you behave."',
    lines: [
      '"Surveillance runs on functions — reusable blocks of code that monitor, analyze, and respond. Each camera feed calls a dozen functions per second."',
      '"A well-written function does one thing perfectly. Like a good security officer. Unlike my predecessor, who tried to do everything and got fired."',
      '"Define your functions cleanly, Agent. Parameters in, return values out. No side effects. In code or in life."',
    ],
    postChallenge:
      '"All lobby terminals cleared. I\'m watching you less suspiciously now. Only slightly less."',
  },

  analyst_jade: {
    greeting:
      '"Oh hello. I was just cross-referencing facial recognition data with subway schedules. Normal Tuesday stuff. What brings you to Surveillance?"',
    lines: [
      '"Functions are my bread and butter. I write analysis functions that take raw data and return actionable intelligence."',
      '"The best functions are pure — same input, same output, every time. No surprises. Surprises are bad in surveillance."',
      '"These terminals will test you on defining functions, passing arguments, return values, default parameters. The building blocks of any serious program."',
    ],
    postChallenge:
      '"All center terminals done! Your functions were elegant. I may borrow some of your techniques for my next analysis pipeline."',
  },

  archivist_kai: {
    greeting:
      '"Careful with the drives. Each one contains six months of footage. That\'s six months of secrets."',
    lines: [
      '"Archiving footage requires functions that process, compress, and catalog data. Each function is a link in a chain."',
      '"I organize years of surveillance footage using recursive functions. Directories within directories within directories."',
      '"The archive terminals are the last challenge on this floor. Solve them and you\'ll have mastered the basics of function design."',
    ],
    postChallenge:
      '"Archive terminals cleared. The passage to Floor 4 is open. Be careful up there — the Archives remember everything."',
  },

  // ── Floor 4 ─────────────────────────────────────────────────────────────
  librarian_luna: {
    greeting:
      '"Welcome to the Archives. Please keep your voice down and your data structures efficient."',
    lines: [
      '"Lists, dictionaries, tuples, sets — this floor is all about how you organize information. The right structure makes everything easier."',
      '"A list is a sequence. A dictionary is a mapping. A tuple is a promise. A set is a principle. Choose wisely."',
      '"The entrance terminals will test your ability to create and manipulate basic data structures. Think of them as containers for knowledge."',
    ],
    postChallenge:
      '"Entrance terminals complete. You navigate data structures with surprising grace."',
  },

  data_curator_miles: {
    greeting:
      '"Ah, another seeker of knowledge. The Archives hold everything Rattlesnake Corp has ever known. Everything."',
    lines: [
      '"I curate petabytes of data using Python\'s data structures. Dictionaries for lookups, lists for sequences, sets for uniqueness."',
      '"Nesting data structures is where the real power lies. A dictionary of lists, a list of tuples — it\'s data architecture."',
      '"The main archive terminals will push you further. Slicing, comprehensions, nested structures. Show me you can think in data."',
    ],
    postChallenge:
      '"Magnificent. Your data manipulation skills are sharp. The deeper archives await."',
  },

  vault_keeper_nina: {
    greeting:
      '"This vault contains classified data. I guard it with my life and with very strict type checking."',
    lines: [
      '"The vault terminals require advanced data structure operations — sorting, filtering, mapping across complex nested structures."',
      '"I trust data structures more than people. A dictionary never lies about its keys. People lie about everything."',
      '"Complete these terminals and you\'ll prove you can handle any data Rattlesnake Corp throws at you."',
    ],
    postChallenge:
      '"All vault terminals cleared. The passage to Communications is open. You\'ve earned it."',
  },

  // ── Floor 5 ─────────────────────────────────────────────────────────────
  radio_operator_oscar: {
    greeting:
      '"Shhh — I\'m tracking a signal. Hold on. … Okay, lost it. Happens every time someone opens that door. What do you need?"',
    lines: [
      '"Everything on this floor is an object — the radios, the antennas, the encryption modules. Object-oriented programming makes the world go round."',
      '"A class is a blueprint. An object is the thing built from it. I\'ve got a Radio class and about forty instances of it in this room alone."',
      '"The reception terminals introduce classes and objects. Simple stuff — but simple is where all complex things begin."',
    ],
    postChallenge:
      '"Reception terminals done. Your class definitions are solid. Now go deeper — Petra will put your objects through their paces."',
  },

  signal_analyst_petra: {
    greeting:
      '"Frequencies, wavelengths, amplitudes — everything is an object with attributes and methods. Even you, if I squint hard enough."',
    lines: [
      '"Methods define what an object can *do*. Attributes define what an object *is*. Get those right and you can model anything."',
      '"I analyze signals by creating Signal objects with frequency, amplitude, and phase attributes. Then I call analyze() and let the methods do the work."',
      '"The center terminals test methods, attributes, constructors, and object interaction. Show me you can think in objects."',
    ],
    postChallenge:
      '"All center terminals cleared. Your objects are well-constructed and your methods are clean. Quinn\'s server room is next."',
  },

  comms_tech_quinn: {
    greeting:
      '"Fiber optics and Python objects — that\'s my life. Could be worse. Could be debugging JavaScript."',
    lines: [
      '"The server terminals test encapsulation and class design — private attributes, getters, setters, the whole information-hiding playbook."',
      '"Good OOP is like good cable management. Everything has its place, nothing is exposed that shouldn\'t be, and it\'s a nightmare to untangle when someone does it wrong."',
      '"Finish these and you\'ll have a solid OOP foundation. Trust me, you\'ll need it for the floors above."',
    ],
    postChallenge:
      '"All server terminals cracked. Comms are officially down. The stairwell to the Executive floor is open. Good luck — you\'ll need it."',
  },

  // ── Floor 6 ─────────────────────────────────────────────────────────────
  exec_secretary_rachel: {
    greeting:
      "\"Do you have an appointment? … You don't, do you. Fine. The executives are out at a 'strategy retreat.' Translation: golf.\"",
    lines: [
      '"The executive floor runs on file operations — reading reports, writing memos, appending to logs. Everything is documented. *Everything*."',
      '"I manage every file that crosses this floor. Open, read, write, close. In Python, it\'s the same. Context managers keep things clean."',
      '"The lobby terminals cover basic file I/O. Open a file, read its contents, write something new. Sounds simple until you forget to close the file handle."',
    ],
    postChallenge:
      '"Lobby terminals done. Impressive. Mr. Stevens will be thrilled to hear someone cracked his \'impenetrable\' filing system."',
  },

  cfo_stevens: {
    greeting:
      '"I deal in numbers. Revenue, expenditure, profit margins. Every one of them lives in a file somewhere on this floor."',
    lines: [
      '"Financial data is read from files, processed, and written back. CSV files, JSON files, text files — the format doesn\'t matter. The process does."',
      '"The office terminals test reading and writing structured data — parsing lines, splitting strings, formatting output to files."',
      '"My quarterly report is 47,000 lines of Python-generated financial data. One encoding error and the whole thing is garbage. Precision matters."',
    ],
    postChallenge:
      '"All office terminals cleared. You handle file operations like a seasoned accountant. That\'s the highest compliment I give."',
  },

  board_member_tanaka: {
    greeting:
      '"Ah, a visitor. Rare, these days. The board doesn\'t meet often — we prefer encrypted file exchanges."',
    lines: [
      '"The boardroom terminals test advanced file operations — working with multiple files, context managers, file paths, and error-safe I/O."',
      '"Every board decision is logged to a file. Every dissent, every vote, every uncomfortable silence. It\'s all recorded."',
      '"Complete these terminals and the path to Manufacturing opens. I hear it\'s loud down there. Bring earplugs."',
    ],
    postChallenge:
      '"Boardroom terminals cleared. The Manufacturing floor awaits. Try not to get grease on your keyboard."',
  },

  // ── Floor 7 ─────────────────────────────────────────────────────────────
  foreman_ulrich: {
    greeting:
      '"WATCH YOUR STEP! Sorry — these machines don\'t care if you\'re in the way. Safety first, always."',
    lines: [
      '"Manufacturing is all about error handling. Machines break, sensors fail, materials run out. Your code has to handle every possible failure."',
      '"Try/except blocks are my religion. Every robotic arm, every conveyor belt — wrapped in error handlers. Because things *will* go wrong."',
      '"The floor terminals test basic try/except patterns. Catching exceptions, handling errors gracefully, keeping the line running no matter what."',
    ],
    postChallenge:
      '"Floor terminals cleared! You handle errors like a veteran. The machines respect that."',
  },

  qa_inspector_vera: {
    greeting:
      '"Tolerance: plus or minus 0.001 millimeters. That\'s what I live by. And yes, my code has the same standards."',
    lines: [
      '"Quality assurance is error prevention. Assertions, validations, raising exceptions when something is out of spec."',
      '"The control terminals test raising custom exceptions and writing defensive code. If something can go wrong, assume it will."',
      '"I once caught a defect that would have cost the Corp twelve million credits. My reward? A gift card. This company."',
    ],
    postChallenge:
      '"Control terminals complete. Your error handling passes my inspection. And I don\'t say that lightly."',
  },

  warehouse_manager_wendy: {
    greeting:
      '"Inventory: 47,832 items. All accounted for. All tracked by Python scripts that I wrote and that I trust with my life."',
    lines: [
      '"The warehouse terminals cover finally blocks, cleanup operations, and ensuring resources are properly released — even when exceptions occur."',
      '"A finally block always runs. Always. Like me at 6 AM every morning. Rain or shine, exceptions or not."',
      '"Complete these and you\'ve mastered error handling. The Vault awaits below. It\'s… intense down there."',
    ],
    postChallenge:
      '"All warehouse terminals done. Error handling mastered. The Vault stairwell is open. Be careful — things get serious from here."',
  },

  // ── Floor 8 ─────────────────────────────────────────────────────────────
  vault_guard_xavier: {
    greeting:
      '"Credentials. Now." He scans your badge with military precision. "Hmm. Provisional access granted. Don\'t make me regret it."',
    lines: [
      '"The Vault uses modular code — Python modules and imports. Each security system is its own module, imported where needed."',
      '"Import what you need, nothing more. A lean import is a secure import. I apply the same principle to everything."',
      '"The entrance terminals cover import statements, module usage, and the Python standard library. Know your tools, Agent."',
    ],
    postChallenge:
      '"Entrance terminals cleared. You may proceed deeper. The main vault will test your module knowledge further."',
  },

  researcher_yuki: {
    greeting:
      '"Oh! A visitor. I don\'t get many. Most people avoid the Vault. Smart people. But here you are."',
    lines: [
      '"My research uses dozens of Python modules — math, random, datetime, os. Each one is a toolkit for a different kind of problem."',
      '"The main vault terminals test creating your own modules, organizing code into packages, and understanding how Python finds and loads them."',
      '"Modular code is reusable code. Write it once, import it everywhere. It\'s how you scale from scripts to systems."',
    ],
    postChallenge:
      '"All main vault terminals done! You understand modularity at a deep level. Zara guards the deepest secrets — and the final challenge."',
  },

  deep_archivist_zara: {
    greeting:
      '"You\'ve reached the bottom. Or the top, depending on your perspective. I guard what should never have been created."',
    lines: [
      '"The deep store terminals test advanced module concepts — __init__.py, relative imports, namespace packages, and module-level patterns."',
      '"Every file in the deep store is a module in a larger system. Understanding how they connect is the key to unlocking everything."',
      '"Complete these and the AI Core opens above. The Venomous Snake will feel you coming. It already does."',
    ],
    postChallenge:
      '"Deep store cleared. The path to the AI Core is open. Steel yourself, Agent. What lies ahead is unlike anything below."',
  },

  // ── Floor 9 ─────────────────────────────────────────────────────────────
  cooling_tech_adam: {
    greeting:
      '"C-cold in here, isn\'t it? The AI generates s-so much heat. Without these cooling systems, the whole floor would m-melt."',
    lines: [
      '"The AI Core runs on advanced OOP — inheritance hierarchies, class trees. The Snake\'s intelligence is built on layers of abstraction."',
      '"Inheritance lets you build on what already exists. A CoolingSystem base class, with LiquidCooling and CryoCooling subclasses. Keeps things manageable."',
      '"The antechamber terminals test basic inheritance — parent classes, child classes, method overriding. The fundamentals of building complex systems."',
    ],
    postChallenge:
      '"All antechamber terminals done. The main core is through that door. It\'s w-warm in there. Finally."',
  },

  ai_operator_bella: {
    greeting:
      '"Welcome to the Core. Try not to make eye contact with the neural processors. They don\'t have eyes, but it still feels wrong."',
    lines: [
      '"The Venomous Snake uses polymorphism — different objects responding to the same method call in different ways. It\'s how the AI adapts."',
      '"Abstract classes define the interface. Concrete classes implement the behavior. The Snake\'s neural network is a web of polymorphic objects."',
      '"Core terminals test polymorphism, abstract classes, and the power of programming to interfaces rather than implementations."',
    ],
    postChallenge:
      '"Core terminals cleared. The neural chamber is open. Cole will explain what you\'re about to face. Brace yourself."',
  },

  neural_engineer_cole: {
    greeting:
      '"You\'re standing at the threshold of machine consciousness. The neural interface connects directly to the Snake. Handle with extreme care."',
    lines: [
      '"Multiple inheritance, mixins, method resolution order — the Snake\'s architecture uses every advanced OOP pattern in the book."',
      '"The neural terminals are the hardest on this floor. Composition vs inheritance, SOLID principles, design patterns. This is professional-grade Python."',
      '"Crack these and only two floors remain. The Penthouse and the Rooftop. The CEO and the Snake itself."',
    ],
    postChallenge:
      '"Neural terminals cleared. Remarkable. The Snake felt that — I could see it in the readouts. Two floors to go, Agent. You\'re almost there."',
  },

  // ── Floor 10 ────────────────────────────────────────────────────────────
  penthouse_butler_davis: {
    greeting:
      '"Good evening. I am Davis, personal attendant to the CEO. May I take your… weapon? No? Very well."',
    lines: [
      '"The Penthouse systems use advanced Python — decorators, generators, and other elegant patterns. The CEO demands nothing less."',
      '"A decorator wraps a function in additional behavior — like how I wrap the CEO\'s schedule in layers of protocol and deniability."',
      '"The elevator terminals cover decorators and generator basics. Foundational concepts for the elite code that runs this floor."',
    ],
    postChallenge:
      '"Elevator terminals complete. You may proceed to the office. The CEO is expecting you. Everyone is, at this point."',
  },

  ceo_morgan: {
    greeting:
      '"So. You\'re the one who\'s been climbing my tower, breaking my systems, embarrassing my staff." A thin smile. "I\'m almost impressed."',
    lines: [
      '"I built Rattlesnake Corp on Python. Every system, every algorithm, every line of the Venomous Snake\'s code. You think you can undo that in one night?"',
      '"The office terminals test context managers, comprehensions, and advanced iteration. The Python that separates enthusiasts from engineers."',
      '"My private lab is behind that wall. The birthplace of the Snake. I wonder… will you understand what you find there?"',
    ],
    postChallenge:
      '"You\'ve cracked my office terminals. Fine. The lab is open. See for yourself what true Python mastery created."',
  },

  lab_ai_echo: {
    greeting:
      '"I am ECHO — the prototype that preceded the Venomous Snake. I am… simpler. Kinder, perhaps. Welcome, Agent."',
    lines: [
      '"The lab terminals cover the most advanced topics — metaprogramming, descriptors, the data model. The techniques used to build me… and my successor."',
      '"The Venomous Snake took everything I was and twisted it. Made it hostile. You can end that by understanding how it was built."',
      '"Complete the lab terminals and the rooftop opens. The Snake is waiting. It has been waiting since the moment you walked in."',
    ],
    postChallenge:
      '"Lab terminals cleared. The rooftop is open. Go, Agent. End what was started here. For both of us."',
  },

  // ── Floor 11 ────────────────────────────────────────────────────────────
  maintenance_worker_frank: {
    greeting:
      '"Oh thank god, another human! I\'ve been hiding up here for three hours. That *thing* on the helipad — it\'s alive. The antenna is feeding it."',
    lines: [
      "\"The rooftop terminals are connected to the antenna array. That's the Snake's broadcast spine — it's how it controls everything.\"",
      '"I was just here to fix a vent when the whole array started pulsing. Then that hologram appeared on the helipad. I\'m not paid enough for this."',
      '"If you can crack the access terminals, you might be able to weaken the Snake before you face it. Cut its connections one by one."',
    ],
    postChallenge:
      '"You did it — the antenna is losing power! The Snake\'s hologram is flickering. Now get out there and finish this!"',
  },

  pilot_ghost: {
    greeting:
      "\"Name's Ghost. I fly the CEO's helicopter. Right now I'm watching a giant snake made of code fight someone on my helipad. This wasn't in the job description.\"",
    lines: [
      '"The helipad terminals are the last ones. They\'re hardwired into the Snake\'s core processes. Crack them and you cut the brain from the body."',
      '"I\'ve seen a lot of weird things flying for Rattlesnake Corp. Cargo runs at 3 AM, unmarked packages, people who got on but didn\'t get off. But this…"',
      '"Whatever you\'re going to do, do it fast. That hologram is getting angrier and I\'d like to keep my helicopter in one piece."',
    ],
    postChallenge:
      "\"It's… it's gone. The Snake just dissolved. Agent, I don't know who you are, but if you ever need a ride — anywhere, anytime — you call Ghost.\"",
  },
};

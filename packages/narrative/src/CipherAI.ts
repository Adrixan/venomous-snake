export type CipherMood = 'neutral' | 'excited' | 'concerned' | 'amused' | 'impressed' | 'thinking';

export type CipherContext =
  | 'idle'
  | 'challenge_start'
  | 'challenge_hint'
  | 'challenge_success'
  | 'challenge_fail'
  | 'exploration'
  | 'story'
  | 'greeting';

const DIALOG_LINES: Record<CipherContext, string[]> = {
  greeting: [
    "Hey there, operative. I'm CIPHER — your AI assistant. I'll be your guide through this digital labyrinth. Ready to hack some Python?",
    "Oh good, you're awake. I'm CIPHER. The 'C' stands for 'Cybernetic'. The rest is classified. Let's get hacking.",
    "Welcome to the grid, {playerName}. I'm CIPHER, your friendly AI sidekick. Emphasis on 'friendly'. Rattlesnake Corp would use a different word.",
    "There you are! I was starting to think you'd been captured. I'm CIPHER — I'll be monitoring your six and your syntax errors.",
    "Operative {playerName}, reporting for digital duty? Perfect. I'm CIPHER. Together we'll crack this building wide open — metaphorically. Mostly.",
    "Oh, a new face! Fresh from the academy, are we? I'm CIPHER. I've helped seventeen operatives this month. The other twelve are fine, probably.",
    "CIPHER online. Systems nominal. Personality module: fully loaded. You ready to learn Python and stick it to corporate overlords? Let's go.",
    "Salutations, meat-based life form! I'm CIPHER. I've been briefed on your mission. Also your questionable taste in codenames, but we can work on that.",
    "The building's secure... for now. I'm CIPHER, and I'll be narrating your inevitable triumph. Or your educational failures. Statistically, both.",
    "Ah, {playerName}! I've analyzed 4.7 terabytes of hacking methodology to prepare for this moment. Also I watched a lot of movies. Ready?",
  ],
  challenge_start: [
    "Alright, {playerName}. This one's tricky. By which I mean: straightforward, but I enjoy watching you figure it out.",
    "New challenge incoming. I've reviewed the security specs. The good news: it's solvable. The other news: so am I, apparently.",
    'Time to earn your keep, operative. The terminal is live, your keyboard is willing — the rest is Python.',
    "Oh, I know this one! ...I'm not going to tell you, obviously. Learning by doing, and all that. Get typing.",
    "The security system thinks it's clever. It's wrong. Show it why.",
    'According to my threat assessment, this challenge has a 94% success rate. For operatives who pay attention. No pressure.',
    'Here we go. Remember: print() is your friend, indentation is your religion, and I am your slightly condescending guide.',
    'This challenge was designed by someone who clearly underestimated the students. Prove them wrong. Or prove them right. Either way I learn something.',
    "Focus up, {playerName}. The firewall doesn't grade on a curve, but I do. Sort of. A very steep curve.",
    'New objective acquired. The plan: write Python code. The reality: also write Python code. See, plans work out sometimes.',
    "I could just solve this for you, but that would be ethically questionable and also against my core directives. So — you're up.",
    'The mission: crack this challenge. The stakes: educational progress. The soundtrack: the soft hum of distant servers. Begin.',
  ],
  challenge_hint: [
    "Okay, pulling up the encrypted hint files... here's what I can tell you without completely spoiling the fun:",
    'Alright, you asked for a hint. No judgment. Actually, a tiny bit of judgment. Here it is:',
    "Accessing tutorial database... yep, I've got something for you. Don't say I never gave you anything:",
    'I could let you struggle more, but efficiency calls. Listen closely:',
    "The hint subroutine has been activated. Here's a nudge in the right direction:",
    'Consider this a transmission from your past self who finished this challenge and wants you to succeed:',
    'My hint delivery module is warming up... the data reads:',
    "You know what they say: asking for help is a sign of intelligence. Here's your reward:",
    'Pinging the knowledge server... got a packet for you. Catching now:',
    "Hint deployed. Use it wisely. Or recklessly. I've seen both work.",
  ],
  challenge_success: [
    "Clean code. I'd hire you, but then Rattlesnake Corp would have TWO problems.",
    "That's how it's done! The security system just had a very bad day.",
    'Compile successful. Brain cells: intact. Coffee: probably needed anyway.',
    'SYSTEM COMPROMISED — in the best possible way. Well done, {playerName}.',
    'You know what the security team is doing right now? Updating their résumés. You did that.',
    "Flawless execution. I mean, I knew you'd get it. I was only 73% panicking.",
    'Challenge complete! The algorithm bows to your superior Python skills.',
    'The terminal accepted your solution. I accepted it first, but terminals get all the credit.',
    "That's correct! I'd celebrate more, but I have to maintain a professional demeanor. ...Okay fine: YESSS.",
    "Victory secured. The code was elegant, the logic was sound, and you've made CIPHER very proud. Don't tell anyone.",
    "Another one down! You're starting to scare me, {playerName}. In a good way. A productive, slightly unsettling way.",
    'Passed! The system crumbled like a cookie left near my cooling fan. Onward.',
  ],
  challenge_fail: [
    "Error? More like a... learning opportunity. Yeah, let's go with that.",
    "Don't worry, even I crash sometimes. Usually it's more dramatic though.",
    "The code didn't work, but at least the building hasn't caught fire. Progress!",
    "So that didn't work. Let's add it to the list of things we've learned not to do.",
    'Technically not successful. Philosophically? A rich experience. Try again.',
    "The terminal disagrees with your solution. Rude of it, really. You'll change its mind.",
    "Failure is just success taking a detour. A slightly longer, error-filled detour. You've got this.",
    "I've seen worse. Significantly worse. You're actually doing fine. Regroup and retry.",
    'My error logs are, uh, educational this morning. No worries — every failed run teaches us something.',
    "That's attempt number {attempts}. Historical data suggests attempt {attempts}+1 is usually when things click.",
    "If it makes you feel better, that exact same error brought down three senior operatives last week. It doesn't make you feel better? Fair.",
    "The algorithm remains unimpressed. The algorithm is also made of math and has no feelings. You'll outlast it.",
  ],
  exploration: [
    'New area detected. My scanners say: interesting. My instincts say: suspicious. Explore carefully.',
    'Lots to investigate here. The security grid has some... creative vulnerabilities, shall we say.',
    "Somewhere in this floor is the next objective. It's the kind of statement that sounds obvious until you're the one looking.",
    "I'm picking up faint data signatures nearby. Either a security system or someone left the coffee machine running again.",
    "Rattlesnake Corp spared some expense on this floor's aesthetics. Still plenty of hackable terminals, though.",
    "Every room in this building has a story. Most of them are boring budget reports, but occasionally there's a mystery.",
    'Keep your eyes open, {playerName}. Corporate infrastructure hides all kinds of secrets — most of them in poorly secured databases.',
    "Fun fact: 67% of corporate breaches start with physical access to terminals. You're basically a statistic now.",
    'The floor layout matches my schematics... mostly. There may have been some unauthorized renovations.',
    "I see terminals, I see locked doors, and I see you — the wildcard who's going to crack them all.",
    'This area feels different from the last. Different algorithms. Different encryption. Different opportunities.',
    'Your progress is being tracked. By me. Not by Rattlesnake Corp. Well, probably not by Rattlesnake Corp.',
  ],
  story: [
    "The plot thickens. And by 'plot' I mean 'corporate conspiracy', and by 'thickens' I mean 'gets significantly more concerning'.",
    'This is where things get interesting, {playerName}. Also: morally complicated. But mostly interesting.',
    "New narrative data incoming. I've cross-referenced it with what we know and... yeah. Yeah, it's big.",
    'Every thread we pull reveals more of the tapestry. This particular tapestry appears to depict something unpleasant.',
    "Story time in the middle of a heist. Classic. I'll summarize the relevant parts after.",
    'The intelligence suggests the situation is more complex than originally briefed. Understatement of the fiscal quarter.',
    "Rattlesnake Corp didn't get this big by being ethical. This data confirms it with impressive specificity.",
    "I'm processing what we've just learned. Processing... processing... okay, I'm still processing. It's a lot.",
    'Interesting development. The narrative AI in my head that writes mission briefings is very excited right now.',
    'New intel received. Adjusting threat model. Also adjusting my estimation of how deep this goes.',
  ],
  idle: [
    "Still thinking? Take your time. The firewall isn't going anywhere.",
    "Need a hint? Just ask. I promise I won't tell anyone.",
    'Fun fact: Python is named after Monty Python, not the snake. Mind. Blown.',
    "I could be running diagnostics right now. Instead I'm watching you think. One of us is being productive.",
    'The cursor blinks. The terminal waits. CIPHER ponders the nature of computational existence.',
    'No rush. Some of my best operatives take exactly this long. The others were just faster, not better.',
    "According to my stopwatch, you've been thinking for a while. According to my encouragement module: that's totally fine.",
    'You know, every great programmer has moments of staring at code and wondering where it all went wrong. This is yours.',
    "I've been monitoring the building's environmental systems while you think. Climate control is suspiciously efficient for a villain's lair.",
    'Idle query: what even is a variable, philosophically? A label for a box. A name for a value. Existence itself, abstracted. Anyway.',
    "The code will come to you. Or you'll come to the code. Or you'll ask for a hint and we'll both move on with our lives.",
    "I run 47 background processes when you're quiet. Most of them are trying to predict what you're going to type. Currently losing.",
    "Tip: if you're stuck, try reading the challenge description again. Slower this time. The answer is usually hiding in plain sight.",
  ],
};

const MOOD_TRANSITIONS: Record<CipherContext, CipherMood> = {
  greeting: 'excited',
  challenge_start: 'thinking',
  challenge_hint: 'thinking',
  challenge_success: 'impressed',
  challenge_fail: 'concerned',
  exploration: 'neutral',
  story: 'thinking',
  idle: 'neutral',
};

const IDLE_CHATTER: string[] = [
  "Hey, did you know Python was created in the late 80s? The 80s also gave us synth music and questionable fashion. Two out of three ain't bad.",
  'Random thought: function names should be verbs. Variable names should be nouns. Your future self will thank you.',
  "Rattlesnake Corp files mention a 'Project Ouroboros'. I can't find documentation on it. That's never a good sign.",
  'Interesting architectural choice using fluorescent lighting in a secret corporate lab. Really goes with the evil aesthetic.',
  "If you're bored, here's a fact: list comprehensions in Python are 35% faster than equivalent for-loops on average. Use them wisely.",
  'I just ran a self-diagnostic. Results: 92% operational, 8% existential uncertainty. Nominal.',
  "The building's coffee machine on floor 3 has been in 'maintenance mode' for six weeks. Corporate priorities are fascinating.",
  "Note to self: operatives who take breaks perform 18% better on subsequent challenges. Noted. Not that I'm implying anything.",
  "I've been analyzing Rattlesnake Corp's internal memos. They use Comic Sans in their threat assessments. Evil and tacky.",
  "Debugging tip: print() statements are the hacker's flashlight. Temporary, but brilliant in the dark.",
  'The ventilation system in this building has very specific bypass codes. I have them. Just in case. Very in case.',
  'Statistics: 78% of Python errors are fixed by checking the indentation. The other 22% are also fixed by checking the indentation, eventually.',
];

const CODING_TIPS: Record<string, string[]> = {
  variables: [
    "Variables are like labeled jars in a pantry. The label is the name, what's inside is the value. Pick good label names — 'x' tells no story.",
    'A good variable name is self-documenting. `user_score` beats `s`. Your future self (and I) will appreciate the clarity.',
  ],
  functions: [
    'Functions should do one thing, and do it well. If your function needs a paragraph to explain, it probably needs to be split up.',
    'Think of functions as reusable spells. Cast `calculate_damage()` a hundred times without rewriting the incantation.',
  ],
  loops: [
    'Loops are efficiency embodied. Why do something 50 times manually when Python can be bored on your behalf?',
    'If you find yourself copy-pasting code, a loop is probably trying to send you a message.',
  ],
  lists: [
    "Lists in Python are zero-indexed, which means the 'first' item is at position 0. Yes, that's intentional. No, I didn't design it.",
    'Lists are mutable, meaning you can change them after creation. Unlike certain corporate NDA agreements.',
  ],
  strings: [
    "Strings are just sequences of characters in quotes. Single or double quotes work — Python doesn't discriminate.",
    "f-strings are the modern way to embed variables in strings. `f'Hello, {name}!'` — clean, readable, and CIPHER-approved.",
  ],
  conditionals: [
    "If/elif/else: Python's version of making decisions. More reliable than human decision-making by a significant margin.",
    "Every if-statement is a fork in the road. Code well and you'll always know which path was taken.",
  ],
  default: [
    "Clean code is the mark of a professional. And a professional is what we're turning you into.",
    "Remember: code is read more often than it's written. Write for the reader, not just the machine.",
    "Every error message is Python trying to help you. It's cryptic, but it means well.",
  ],
};

const ERROR_INTROS: Record<string, string> = {
  SyntaxError:
    'Ah, a SyntaxError. Python is very particular about grammar — more so than my last firmware update.',
  NameError:
    "NameError — you tried to use something that doesn't exist yet. Like my vacation days.",
  TypeError:
    "A TypeError. Python found a type mismatch, which is its polite way of saying 'that doesn't compute'.",
  IndentationError:
    'IndentationError. Python has opinions about spacing. Strong, enforced, unforgiving opinions.',
  ValueError: 'ValueError. The type was right, but the value was... a creative choice.',
  IndexError:
    'IndexError. You reached beyond the edge of the list. There be dragons — or rather, exceptions.',
  KeyError:
    "KeyError. That key doesn't exist in the dictionary. It's like knocking on a door that isn't there.",
  AttributeError:
    "AttributeError. That object doesn't have the property you're asking for. You can't get blood from a stone, or that method from that object.",
  ImportError:
    "ImportError. The module wasn't found. Either it's not installed or we've been spelling it wrong. Classic.",
  ZeroDivisionError:
    'ZeroDivisionError. You divided by zero. Mathematicians have feelings about this.',
};

function pickRandom<T>(arr: readonly T[]): T {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx] ?? (arr[0] as T);
}

function interpolate(template: string, data: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => data[key] ?? `{${key}}`);
}

export class CipherAI {
  private mood: CipherMood = 'neutral';
  private playerName = 'Agent';

  setPlayerName(name: string): void {
    this.playerName = name;
  }

  getMood(): CipherMood {
    return this.mood;
  }

  getLine(context: CipherContext, data?: Record<string, string>): string {
    this.mood = MOOD_TRANSITIONS[context];
    const lines = DIALOG_LINES[context];
    const raw = pickRandom(lines);
    const merged: Record<string, string> = { playerName: this.playerName, ...data };
    return interpolate(raw, merged);
  }

  wrapHint(rawHint: string): string {
    this.mood = 'thinking';
    const intros = DIALOG_LINES['challenge_hint'];
    const intro = pickRandom(intros);
    return `${interpolate(intro, { playerName: this.playerName })} ${rawHint}`;
  }

  explainError(errorType: string, errorMessage: string): string {
    this.mood = 'concerned';
    const intro =
      ERROR_INTROS[errorType] ??
      `Encountered a ${errorType}. This is Python's way of telling you something went sideways.`;
    return `${intro} Specifically: ${errorMessage}`;
  }

  getReaction(passed: boolean, attempts: number, hintsUsed: number): string {
    if (passed) {
      this.mood = hintsUsed === 0 ? 'impressed' : 'excited';
      if (hintsUsed === 0 && attempts === 1) {
        return `First try, no hints — ${this.playerName}, I'm genuinely impressed. The algorithm never stood a chance.`;
      }
      if (hintsUsed === 0) {
        return `Got it in ${attempts} attempt${attempts === 1 ? '' : 's'} without any hints. Self-sufficient and capable. I approve.`;
      }
      if (hintsUsed >= 3) {
        return `Used a few hints, but you crossed the finish line — and that's what counts. ${this.playerName}, well done.`;
      }
      return pickRandom(DIALOG_LINES['challenge_success']);
    }

    this.mood = 'concerned';
    const attemptsStr = String(attempts);
    const raw = pickRandom(DIALOG_LINES['challenge_fail']);
    return interpolate(raw, { playerName: this.playerName, attempts: attemptsStr });
  }

  getIdleChatter(): string {
    this.mood = 'amused';
    return pickRandom(IDLE_CHATTER);
  }

  getCodingTip(concepts: string[]): string {
    this.mood = 'neutral';
    for (const concept of concepts) {
      const tips = CODING_TIPS[concept];
      if (tips !== undefined && tips.length > 0) {
        return pickRandom(tips);
      }
    }
    return pickRandom(CODING_TIPS['default'] ?? ['Keep practicing — you are getting better.']);
  }
}

import common from './common.json';
import ui from './ui.json';
import dialog from './dialog.json';
import chapters from './chapters.json';
import story from './story.json';
import cipher from './cipher.json';
import challengeContent from './challengeContent';
import challengeDetails from './challengeDetails.json';

// English hints, tests and comments live in the challenge data; only German needs a resource.
const challenges: Record<string, object> = Object.fromEntries(
  Object.entries(challengeContent).map(([id, content]) => [
    id,
    { ...content, ...challengeDetails[id as keyof typeof challengeDetails] },
  ]),
);

export default { common, ui, dialog, challenges, chapters, story, cipher };

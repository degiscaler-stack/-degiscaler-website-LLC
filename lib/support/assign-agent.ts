/** Deterministic “assigned agent” for visitor UI (session-scoped). Not persisted server-side. */

export type AssignedSupportAgent = {
  name: string;
  imageSrc: string;
};

const FEMALE_AGENTS: AssignedSupportAgent[] = [
  { name: 'Sara Bennett', imageSrc: '/support/agent-female.webp' },
  { name: 'Lina Haddad', imageSrc: '/support/agent-female.webp' },
  { name: 'Nora Williams', imageSrc: '/support/agent-female.webp' },
  { name: 'Amira Collins', imageSrc: '/support/agent-female.webp' },
];

const MALE_AGENTS: AssignedSupportAgent[] = [
  { name: 'Adam Carter', imageSrc: '/support/agent-male.webp' },
  { name: 'Youssef Amrani', imageSrc: '/support/agent-male.webp' },
  { name: 'Karim Lewis', imageSrc: '/support/agent-male.webp' },
  { name: 'Sami Bennett', imageSrc: '/support/agent-male.webp' },
];

export function assignSupportAgent(sessionId: string): AssignedSupportAgent {
  let h = 0;
  for (let i = 0; i < sessionId.length; i += 1) {
    h = (h * 31 + sessionId.charCodeAt(i)) >>> 0;
  }
  const female = h % 2 === 0;
  const pool = female ? FEMALE_AGENTS : MALE_AGENTS;
  const idx = Math.floor(h / 2) % pool.length;
  return pool[idx];
}

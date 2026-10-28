export type TimelineItem = {
  id: string;
  year: string;
  title: string;
  desc: string;
};

export type CampusItem = {
  id: string;
  title: string;
  desc: string;
};

export type Profile = {
  name: string;
  title: string;
  school: string;
  major: string;
  grade: string;
  location: string;
  status: string;
  tagline: string;
  bio: string[];
  email: string;
  github: string;
  githubLabel: string;
  avatarInitial: string;
  timeline: TimelineItem[];
  campus: CampusItem[];
};

export type Skill = {
  id: string;
  name: string;
  level: number;
};

export type SkillGroup = {
  id: string;
  group: string;
  items: Skill[];
};

export type Project = {
  id: string;
  title: string;
  summary: string;
  desc: string[];
  tags: string[];
  year: string;
  status: string;
  kind: string;
  demo?: string;
  repo?: string;
};

export type Post = {
  id: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  content: string;
};

export type SiteData = {
  profile: Profile;
  skillGroups: SkillGroup[];
  projects: Project[];
  posts: Post[];
};

export function newId(prefix = 'id'): string {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${random}`;
}

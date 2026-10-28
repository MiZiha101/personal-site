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
  /** 头像照片：可以是 public 下的相对路径（如 './avatar.jpg'），也可以是上传后的 data URL；为空则显示 avatarInitial */
  avatarImage: string;
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
  /** 项目配图（压缩后的 data URL，可选） */
  cover?: string;
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

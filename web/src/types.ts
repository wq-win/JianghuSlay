export type CardDTO = {
  hidden?: boolean;
  name: string;
  type?: string;
  suit?: string;
  color?: string;
  rank_label?: string;
  label?: string;
  description?: string;
  power?: number;
  range?: number;
  trait?: string;
};

export type PlayerDTO = {
  seat: string;
  name: string;
  is_ai: boolean;
  alive: boolean;
  hp: number;
  max_hp: number;
  hero: { name: string; skill_name: string; skill_desc: string };
  hand_count: number;
  hand: CardDTO[];
  equipment: {
    weapon: CardDTO | null;
    armor: CardDTO | null;
    offensive_horse: CardDTO | null;
    defensive_horse: CardDTO | null;
  };
  marks: Record<string, number | boolean>;
  skills_used: string[];
};

export type MatchState = {
  phase: string;
  viewer_seat: string;
  winner: string | null;
  round: number;
  players: {
    self: PlayerDTO;
    opponent: PlayerDTO;
    p1?: PlayerDTO;
    p2?: PlayerDTO;
  };
  deck_count: number;
  discard_count: number;
  active_skills: { hotkey: string; help: string }[];
};

export type PromptOption = { id: string; label: string };

export type PendingPrompt = {
  prompt_id: string;
  kind: string;
  message: string;
  options: PromptOption[];
  min_count: number;
  max_count: number;
  player_id: string;
  meta: Record<string, unknown>;
};

export type HeroInfo = {
  name: string;
  max_hp: number;
  skill_name: string;
  skill_desc: string;
};

export type SessionInfo = {
  match_id: string;
  token: string;
  seat: string;
  mode: "ai" | "pvp";
  code?: string;
};

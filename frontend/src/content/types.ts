export interface ComponentHowToTest {
  tool: string;
  steps: string[];
  normal_values: string;
}

export interface ComponentFailureSigns {
  symptoms: string[];
  common_causes: string[];
}

export interface ComponentContent {
  id: string;
  system_id: string;
  name: string;
  order_index: number;
  scene_key: string;
  short_role: string;
  full_description: string;
  how_to_test: ComponentHowToTest;
  failure_signs: ComponentFailureSigns;
}

export type LessonStepType = 'intro' | 'focus' | 'measure' | 'toggle' | 'order' | 'quiz' | 'oscilloscope' | 'summary';

export interface LessonStep {
  type: LessonStepType;
  text?: string;
  image?: string;
  target?: string;
  tool?: 'multimeter';
  mode?: 'V' | 'Ω';
  probeA?: string;
  probeB?: string;
  expect?: { min?: number; max?: number; ignition?: string; engineRunning?: boolean };
  instruction?: string;
  hint?: string;
  wrongFeedback?: Record<string, string>;
  question?: string;
  options?: string[];
  answer?: number | number[];
  explanation?: string;
  items?: string[];
  badge?: string;
  // Oscilloscope
  scopeNode?: string;
  expectVpp?: { min?: number; max?: number };
  expectVdc?: { min?: number; max?: number };
  expectRipple?: boolean;
}

export interface LessonContent {
  id: string;
  system_id: string;
  component_id: string | null;
  title: string;
  estimated_minutes: number;
  order_index: number;
  prerequisite_lesson_id: string | null;
  badge_key: string;
  steps: LessonStep[];
}

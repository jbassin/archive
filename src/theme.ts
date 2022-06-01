import produce from 'immer';
import { WritableDraft } from 'immer/dist/internal';

export type Text = {
  primary: string;
  secondary: string;
  main: string;
  bg: string;
  soft: string;
};

export type Background = {
  primary: string;
  soft: string;
  hard: string;
  bg: string;
};

export type Font = {
  title: string;
  subtitle: string;
  main: string;
  alt: string;
};

export type Theme = {
  text: Text;
  bg: Background;
  font: Font;
  header: string;
};

const default_ = {
  text: {
    primary: 'text-crimson-500',
    secondary: 'text-slate-500',
    main: 'text-slate-900',
    soft: 'text-slate-700',
    bg: 'text-background-400',
  },
  bg: {
    primary: 'bg-crimson-500',
    soft: 'bg-crimson-700',
    hard: 'bg-crimson-800',
    bg: 'bg-background-400',
  },
  font: {
    title: 'font-eczar',
    subtitle: 'font-tauri',
    main: 'font-gelasio',
    alt: 'font-roboto',
  },
  header: '/header1.png',
};

function theme(f: (_: WritableDraft<Theme>) => void) {
  return produce(default_, f);
}

const astra = theme((t) => {
  t.text.primary = 'text-cyan-700';
  t.bg.primary = 'bg-cyan-700';
  t.bg.soft = 'bg-cyan-800';
  t.bg.hard = 'bg-cyan-900';
  t.header = '/header2.jpeg';
});

export function getTheme(theme: string | null): Theme {
  switch (theme) {
    case 'astra':
      return astra;
    default:
      return default_;
  }
}

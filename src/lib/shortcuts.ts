export type ShortcutAction =
  | { type: 'new-record'; page: 'patients' | 'appointments' }
  | { type: 'navigate'; page: string }
  | { type: 'focus-search' }
  | { type: 'toggle-help' };

export interface KeyEventLike {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
}

export interface EditableTargetLike {
  tagName?: string;
  isContentEditable?: boolean;
}

const ALT_NAV_PAGES: Record<string, string> = {
  '1': 'overview',
  '2': 'patients',
  '3': 'appointments',
  '4': 'consultations',
  '5': 'dispensing',
  '6': 'inventory',
  '7': 'accounting',
};

export interface ShortcutDoc {
  keys: string[];
  description: string;
}

export const SHORTCUT_GROUPS: Array<{ title: string; items: ShortcutDoc[] }> = [
  {
    title: 'Quick actions',
    items: [
      { keys: ['Ctrl', 'N'], description: 'Open new patient modal (or Alt+N)' },
      { keys: ['Alt', 'A'], description: 'Open new appointment modal (or Ctrl+Shift+A)' },
      { keys: ['Ctrl', 'K'], description: 'Focus search input (or / outside inputs)' },
      { keys: ['?'], description: 'Show or hide keyboard shortcuts (or Ctrl+/)' },
      { keys: ['Esc'], description: 'Close active modal or clear focused search' },
    ],
  },
  {
    title: 'Fast navigation',
    items: [
      { keys: ['Alt', '1'], description: 'Overview dashboard' },
      { keys: ['Alt', '2'], description: 'Patients' },
      { keys: ['Alt', '3'], description: 'Appointments' },
      { keys: ['Alt', '4'], description: 'Consultations' },
      { keys: ['Alt', '5'], description: 'Dispensing' },
      { keys: ['Alt', '6'], description: 'Inventory' },
      { keys: ['Alt', '7'], description: 'Income & expenses' },
    ],
  },
];

/** Returns true when keyboard focus is inside a text-entry control. */
export function isEditableElement(target: EditableTargetLike | null | undefined): boolean {
  if (!target) return false;
  if (target.isContentEditable) return true;
  const tag = String(target.tagName ?? '').toUpperCase();
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

/** Resolves a keyboard event into a global clinic navigation or workflow action. */
export function matchGlobalShortcut(event: KeyEventLike, isEditable: boolean): ShortcutAction | null {
  const key = String(event.key ?? '');
  const lower = key.toLowerCase();
  const primary = Boolean(event.ctrlKey || event.metaKey);
  const alt = Boolean(event.altKey);
  const shift = Boolean(event.shiftKey);

  // Ctrl+N / Cmd+N / Alt+N -> Open new patient modal
  if ((primary && !alt && !shift && lower === 'n') || (alt && !primary && !shift && lower === 'n')) {
    return { type: 'new-record', page: 'patients' };
  }

  // Ctrl+Shift+A / Cmd+Shift+A / Alt+A -> Open new appointment modal
  if ((primary && shift && !alt && lower === 'a') || (alt && !primary && !shift && lower === 'a')) {
    return { type: 'new-record', page: 'appointments' };
  }

  // Ctrl+K / Cmd+K (anywhere) or '/' (outside inputs) -> Focus search
  if ((primary && !alt && !shift && lower === 'k') || (!isEditable && !primary && !alt && !shift && key === '/')) {
    return { type: 'focus-search' };
  }

  // Ctrl+/ (anywhere) or '?' (outside inputs) -> Toggle shortcuts help modal
  if ((primary && !alt && key === '/') || (!isEditable && !primary && !alt && key === '?')) {
    return { type: 'toggle-help' };
  }

  // Alt+1..7 -> Jump directly to main clinic modules
  if (alt && !primary && !shift && key in ALT_NAV_PAGES) {
    return { type: 'navigate', page: ALT_NAV_PAGES[key] };
  }

  return null;
}

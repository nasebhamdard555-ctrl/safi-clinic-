import { Fragment } from 'react';
import { SHORTCUT_GROUPS } from '../lib/shortcuts';
import { Button, Modal } from './ui';

export function ShortcutsModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Keyboard shortcuts" onClose={onClose}>
      <div className="space-y-5">
        {SHORTCUT_GROUPS.map((group) => (
          <section key={group.title}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{group.title}</h3>
            <ul className="divide-y divide-line/60 rounded-lg border border-line bg-ink/40">
              {group.items.map((item) => (
                <li key={item.description} className="flex items-center justify-between gap-4 px-3 py-2 text-sm">
                  <span className="text-cream/90">{item.description}</span>
                  <span className="flex shrink-0 items-center gap-1">
                    {item.keys.map((key, idx) => (
                      <Fragment key={`${key}-${idx}`}>
                        {idx > 0 && <span className="text-xs text-muted">+</span>}
                        <kbd className="rounded border border-gold/40 bg-forest px-1.5 py-0.5 font-mono text-xs font-medium text-gold">
                          {key}
                        </kbd>
                      </Fragment>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { isEditableElement, matchGlobalShortcut } from '../src/lib/shortcuts.ts';

test('isEditableElement detects inputs, textareas, selects, and contentEditable elements', () => {
  assert.equal(isEditableElement({ tagName: 'INPUT' }), true);
  assert.equal(isEditableElement({ tagName: 'textarea' }), true);
  assert.equal(isEditableElement({ tagName: 'SELECT' }), true);
  assert.equal(isEditableElement({ tagName: 'DIV', isContentEditable: true }), true);
  assert.equal(isEditableElement({ tagName: 'BUTTON' }), false);
  assert.equal(isEditableElement({ tagName: 'BODY' }), false);
  assert.equal(isEditableElement(null), false);
});

test('matchGlobalShortcut maps Ctrl+N, Cmd+N, and Alt+N to new patient modal', () => {
  assert.deepEqual(matchGlobalShortcut({ key: 'n', ctrlKey: true }, false), { type: 'new-record', page: 'patients' });
  assert.deepEqual(matchGlobalShortcut({ key: 'N', metaKey: true }, false), { type: 'new-record', page: 'patients' });
  assert.deepEqual(matchGlobalShortcut({ key: 'n', altKey: true }, true), { type: 'new-record', page: 'patients' });
});

test('matchGlobalShortcut maps Alt+A and Ctrl+Shift+A to new appointment modal without hijacking Ctrl+A', () => {
  assert.deepEqual(matchGlobalShortcut({ key: 'a', altKey: true }, false), { type: 'new-record', page: 'appointments' });
  assert.deepEqual(matchGlobalShortcut({ key: 'A', ctrlKey: true, shiftKey: true }, false), {
    type: 'new-record',
    page: 'appointments',
  });
  assert.equal(matchGlobalShortcut({ key: 'a', ctrlKey: true }, true), null);
});

test('matchGlobalShortcut handles focus-search and help shortcuts safely around editable controls', () => {
  assert.deepEqual(matchGlobalShortcut({ key: 'k', ctrlKey: true }, true), { type: 'focus-search' });
  assert.deepEqual(matchGlobalShortcut({ key: '/' }, false), { type: 'focus-search' });
  assert.equal(matchGlobalShortcut({ key: '/' }, true), null);

  assert.deepEqual(matchGlobalShortcut({ key: '?' }, false), { type: 'toggle-help' });
  assert.equal(matchGlobalShortcut({ key: '?' }, true), null);
  assert.deepEqual(matchGlobalShortcut({ key: '/', ctrlKey: true }, true), { type: 'toggle-help' });
});

test('matchGlobalShortcut maps Alt+1 through Alt+7 to core clinic modules', () => {
  assert.deepEqual(matchGlobalShortcut({ key: '1', altKey: true }, false), { type: 'navigate', page: 'overview' });
  assert.deepEqual(matchGlobalShortcut({ key: '2', altKey: true }, false), { type: 'navigate', page: 'patients' });
  assert.deepEqual(matchGlobalShortcut({ key: '3', altKey: true }, false), { type: 'navigate', page: 'appointments' });
  assert.deepEqual(matchGlobalShortcut({ key: '4', altKey: true }, false), { type: 'navigate', page: 'consultations' });
  assert.deepEqual(matchGlobalShortcut({ key: '5', altKey: true }, false), { type: 'navigate', page: 'dispensing' });
  assert.deepEqual(matchGlobalShortcut({ key: '6', altKey: true }, false), { type: 'navigate', page: 'inventory' });
  assert.deepEqual(matchGlobalShortcut({ key: '7', altKey: true }, false), { type: 'navigate', page: 'accounting' });
  assert.equal(matchGlobalShortcut({ key: '8', altKey: true }, false), null);
});

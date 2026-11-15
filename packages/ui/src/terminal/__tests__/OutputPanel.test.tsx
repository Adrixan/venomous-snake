// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OutputPanel } from '../OutputPanel';

vi.mock('../terminal.css', () => ({}));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function render(props: Partial<React.ComponentProps<typeof OutputPanel>> = {}): void {
  act(() => {
    root.render(<OutputPanel outputs={[]} onClear={() => undefined} {...props} />);
  });
}

function field(): HTMLInputElement {
  const input = container.querySelector<HTMLInputElement>('input.terminal-input-field');
  if (input === null) throw new Error('stdin field missing');
  return input;
}

function type(value: string): void {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  act(() => {
    setter?.call(field(), value);
    field().dispatchEvent(new Event('input', { bubbles: true }));
  });
}

function pressEnter(init: KeyboardEventInit = {}): void {
  act(() => {
    field().dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true, ...init }),
    );
  });
}

describe('OutputPanel stdin form', () => {
  it('stays hidden while no input() is pending', () => {
    render();
    expect(container.querySelector('form')).toBeNull();
  });

  it('has a visible label tied to the field, the prompt and a submit button', () => {
    render({ inputPrompt: 'Name: ', onInputSubmit: () => undefined });
    const label = container.querySelector('label');
    expect(label?.htmlFor).toBe(field().id);
    expect(label?.textContent).not.toBe('');
    const promptId = field().getAttribute('aria-describedby');
    expect(promptId).not.toBeNull();
    expect(document.getElementById(promptId ?? '')?.textContent).toBe('Name:');
    expect(container.querySelector('button[type="submit"]')).not.toBeNull();
    expect(document.activeElement).toBe(field());
  });

  it('submits through the button and clears the field', () => {
    const onInputSubmit = vi.fn();
    render({ inputPrompt: '', onInputSubmit });
    expect(field().hasAttribute('aria-describedby')).toBe(false);
    type('Ada');
    act(() => container.querySelector<HTMLButtonElement>('button[type="submit"]')?.click());
    expect(onInputSubmit).toHaveBeenCalledWith('Ada');
    expect(field().value).toBe('');
  });

  it('submits on Enter but not on an Enter that confirms an IME composition', () => {
    const onInputSubmit = vi.fn();
    render({ inputPrompt: 'Wort: ', onInputSubmit });
    type('日本');
    pressEnter({ isComposing: true });
    pressEnter({ keyCode: 229 });
    expect(onInputSubmit).not.toHaveBeenCalled();
    pressEnter();
    expect(onInputSubmit).toHaveBeenCalledOnce();
    expect(onInputSubmit).toHaveBeenCalledWith('日本');
  });
});

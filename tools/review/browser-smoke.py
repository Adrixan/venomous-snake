# /// script
# dependencies = ["playwright"]
# ///
"""Smoke test of the running dev server.

Title screen renders, a new game passes the intro and tutorial to an NPC dialog, the Python worker runs code and survives a runaway loop,
and there are no page errors.
"""
from pathlib import Path

from playwright.sync_api import expect, sync_playwright

REPO = Path(__file__).resolve().parents[2]
INTERPRETER = f'/@fs{REPO}/packages/python-runtime/src/interpreterSingleton.ts'
PYTHON_CHECK = r"""async (module) => {
  const { getSharedInterpreter, initializeSharedInterpreter } = await import(module);
  await initializeSharedInterpreter();
  const py = getSharedInterpreter();
  const text = (result) => result.output.map((o) => o.text).join('');
  const first = await py.execute('print(6 * 7)');
  const loop = await py.execute('while True:\n    pass', { timeoutMs: 1500 });
  const after = await py.execute('print("alive")');
  return { first: text(first), timedOut: loop.timedOut === true, after: text(after) };
}"""

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(locale='en-US')
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto('http://localhost:4200')
    expect(page.get_by_text('VENOMOUS SNAKE')).to_be_visible()
    new_game = page.get_by_role('menuitem', name='New Game')
    expect(new_game).to_be_visible()
    new_game.click()
    expect(page.get_by_role('heading', name='Choose Your Identity')).to_be_visible()
    page.get_by_role('button', name='Non-Binary').click()
    page.get_by_role('button', name='Next').click()
    page.get_by_placeholder('Enter codename...').fill('Tester')
    page.get_by_role('button', name='Next').click()
    page.get_by_role('button', name='Start Mission').click()
    page.locator('button', has_text='SKIP').click()
    page.get_by_role('button', name='Got it').click()
    page.get_by_role('button', name='Got it').click()
    page.get_by_role('button', name='Talk to Guard').click()
    expect(page.get_by_role('dialog')).to_be_visible()
    result = page.evaluate(PYTHON_CHECK, INTERPRETER)
    assert result == {'first': '42\n', 'timedOut': True, 'after': 'alive\n'}, result
    assert not errors, errors
    browser.close()

# /// script
# dependencies = ["playwright"]
# ///
"""Smoke test of the running dev server: title screen renders, New Game opens, no page errors."""
from playwright.sync_api import expect, sync_playwright

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
    assert not errors, errors
    browser.close()

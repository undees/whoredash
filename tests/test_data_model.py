from playwright.sync_api import Page, expect
import json


def test_migrates_old_flat_array(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.setItem('whoredash-list', JSON.stringify(['Milk', 'Bread']))")
    page.reload()

    items = page.locator("grocery-list").locator(".item-name").all()
    names = [item.inner_text() for item in items]
    assert "Milk" in names
    assert "Bread" in names


def test_persists_new_schema(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    input_el = page.locator("add-item").locator("input")
    input_el.fill("Eggs")
    input_el.press("Enter")

    stored = page.evaluate("JSON.parse(localStorage.getItem('whoredash-list'))")
    assert "floatingItems" in stored
    assert "aisles" in stored
    assert stored["floatingItems"][0]["name"] == "Eggs"
    assert "id" in stored["floatingItems"][0]


def test_forget_everything_clears_list(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    input_el = page.locator("add-item").locator("input")
    input_el.fill("Milk")
    input_el.press("Enter")

    page.locator("whore-dash").locator(".forget-btn").click()

    empty = page.locator("whore-dash").locator(".empty")
    expect(empty).to_be_visible()

    stored = page.evaluate("JSON.parse(localStorage.getItem('whoredash-list'))")
    assert stored["floatingItems"] == []
    assert stored["aisles"] == []


def test_garbage_data_starts_fresh(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.setItem('whoredash-list', 'this is not json')")
    page.reload()

    empty = page.locator("whore-dash").locator(".empty")
    expect(empty).to_be_visible()

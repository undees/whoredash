from playwright.sync_api import Page, expect


def _add_item(page: Page, name: str):
    input_el = page.locator("add-item").locator("input")
    input_el.fill(name)
    input_el.press("Enter")


def test_tap_to_edit_shows_input(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    _add_item(page, "Milk")

    page.locator("grocery-list").locator(".item-name").click()
    edit_input = page.locator("grocery-list").locator(".edit-input")
    expect(edit_input).to_be_visible()
    expect(edit_input).to_have_value("Milk")


def test_enter_saves_edit(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    _add_item(page, "Milk")
    page.locator("grocery-list").locator(".item-name").click()

    edit_input = page.locator("grocery-list").locator(".edit-input")
    edit_input.fill("Oat Milk")
    edit_input.press("Enter")

    item = page.locator("grocery-list").locator(".item-name")
    expect(item).to_have_text("Oat Milk")


def test_blur_saves_edit(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    _add_item(page, "Bread")
    page.locator("grocery-list").locator(".item-name").click()

    edit_input = page.locator("grocery-list").locator(".edit-input")
    edit_input.fill("Sourdough")
    # Tab away to trigger blur
    edit_input.press("Tab")

    item = page.locator("grocery-list").locator(".item-name")
    expect(item).to_have_text("Sourdough")


def test_cancel_button_cancels_edit(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    _add_item(page, "Eggs")
    page.locator("grocery-list").locator(".item-name").click()

    edit_input = page.locator("grocery-list").locator(".edit-input")
    edit_input.fill("Definitely not eggs")

    page.locator("grocery-list").locator(".cancel-edit-btn").click()

    item = page.locator("grocery-list").locator(".item-name")
    expect(item).to_have_text("Eggs")


def test_escape_cancels_edit(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    _add_item(page, "Eggs")
    page.locator("grocery-list").locator(".item-name").click()

    edit_input = page.locator("grocery-list").locator(".edit-input")
    edit_input.fill("Definitely not eggs")
    edit_input.press("Escape")

    item = page.locator("grocery-list").locator(".item-name")
    expect(item).to_have_text("Eggs")


def test_remove_while_editing_cancels_edit_and_removes(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    _add_item(page, "Milk")
    page.locator("grocery-list").locator(".item-name").click()

    edit_input = page.locator("grocery-list").locator(".edit-input")
    edit_input.fill("Oat Milk")

    page.locator("grocery-list").locator(".remove-btn").click()

    empty = page.locator("whore-dash").locator(".empty")
    expect(empty).to_be_visible()


def test_edit_persists_to_localstorage(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    _add_item(page, "Milk")
    page.locator("grocery-list").locator(".item-name").click()

    edit_input = page.locator("grocery-list").locator(".edit-input")
    edit_input.fill("Oat Milk")
    edit_input.press("Enter")

    stored = page.evaluate("JSON.parse(localStorage.getItem('whoredash-list'))")
    assert stored["floatingItems"][0]["name"] == "Oat Milk"

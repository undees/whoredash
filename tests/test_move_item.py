from playwright.sync_api import Page, expect


def _add_item(page: Page, name: str):
    input_el = page.locator("add-item").locator("input")
    input_el.fill(name)
    input_el.press("Enter")


def _add_aisle(page: Page, name: str):
    input_el = page.locator("add-item").locator("input")
    input_el.fill(name)
    page.locator("add-item").locator(".btn-aisle").click()


def test_move_button_absent_with_no_aisles(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    _add_item(page, "Milk")

    expect(page.locator("grocery-list").locator(".move-btn")).to_have_count(0)


def test_move_button_present_when_aisles_exist(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    _add_item(page, "Milk")
    _add_aisle(page, "Dairy")

    expect(page.locator("grocery-list").locator(".move-btn")).to_have_count(1)


def test_picker_opens_on_tap(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    _add_item(page, "Milk")
    _add_aisle(page, "Dairy")

    expect(page.locator("grocery-list").locator(".aisle-picker")).to_have_count(0)
    page.locator("grocery-list").locator(".move-btn").click()
    expect(page.locator("grocery-list").locator(".aisle-picker")).to_have_count(1)


def test_picker_shows_aisle_and_no_aisle_options(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    _add_item(page, "Milk")
    _add_aisle(page, "Dairy")
    _add_aisle(page, "Produce")

    page.locator("grocery-list").locator(".move-btn").click()
    options = page.locator("grocery-list").locator(".aisle-option")
    expect(options).to_have_count(3)  # Dairy, Produce, No aisle
    expect(options.nth(0)).to_have_text("Dairy")
    expect(options.nth(1)).to_have_text("Produce")
    expect(options.nth(2)).to_have_text("No aisle")


def test_picker_closes_on_second_tap(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    _add_item(page, "Milk")
    _add_aisle(page, "Dairy")

    page.locator("grocery-list").locator(".move-btn").click()
    expect(page.locator("grocery-list").locator(".aisle-picker")).to_have_count(1)

    page.locator("grocery-list").locator(".move-btn").click()
    expect(page.locator("grocery-list").locator(".aisle-picker")).to_have_count(0)


def test_move_floating_item_into_aisle(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    _add_item(page, "Milk")
    _add_aisle(page, "Dairy")

    page.locator("grocery-list").locator(".move-btn").click()
    page.locator("grocery-list").locator(".aisle-option", has_text="Dairy").click()

    stored = page.evaluate("JSON.parse(localStorage.getItem('whoredash-list'))")
    assert stored["floatingItems"] == []
    assert stored["aisles"][0]["items"][0]["name"] == "Milk"


def test_move_aisle_item_to_different_aisle(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    _add_item(page, "Milk")
    _add_aisle(page, "Dairy")
    _add_aisle(page, "Produce")

    # Move Milk into Dairy first
    page.locator("grocery-list").locator(".move-btn").click()
    page.locator("grocery-list").locator(".aisle-option", has_text="Dairy").click()

    # Now move it to Produce
    page.locator("grocery-list").locator(".move-btn").click()
    page.locator("grocery-list").locator(".aisle-option", has_text="Produce").click()

    stored = page.evaluate("JSON.parse(localStorage.getItem('whoredash-list'))")
    assert stored["aisles"][0]["items"] == []  # Dairy empty
    assert stored["aisles"][1]["items"][0]["name"] == "Milk"  # Produce has Milk


def test_move_aisle_item_back_to_floating(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    _add_item(page, "Butter")
    _add_aisle(page, "Dairy")

    # Move into Dairy
    page.locator("grocery-list").locator(".move-btn").click()
    page.locator("grocery-list").locator(".aisle-option", has_text="Dairy").click()

    # Move back to floating
    page.locator("grocery-list").locator(".move-btn").click()
    page.locator("grocery-list").locator(".aisle-option--none").click()

    stored = page.evaluate("JSON.parse(localStorage.getItem('whoredash-list'))")
    assert stored["floatingItems"][0]["name"] == "Butter"
    assert stored["aisles"][0]["items"] == []

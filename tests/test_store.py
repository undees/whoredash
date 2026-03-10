from playwright.sync_api import Page, expect


def test_tagline_shows_grocery_by_default(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    tagline = page.locator("whore-dash").locator(".tagline")
    expect(tagline).to_contain_text("grocery")


def test_set_store_via_tagline(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    trigger = page.locator("whore-dash").locator(".store-trigger")
    trigger.click()

    store_input = page.locator("whore-dash").locator(".store-edit")
    expect(store_input).to_be_visible()
    store_input.fill("Farm Boy")
    store_input.press("Enter")

    tagline = page.locator("whore-dash").locator(".tagline")
    expect(tagline).to_contain_text("Farm Boy")
    expect(tagline).to_contain_text("run")

    stored = page.evaluate("localStorage.getItem('whoredash-store')")
    assert stored == "Farm Boy"


def test_store_persists_across_reload(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.evaluate("localStorage.setItem('whoredash-store', 'Costco')")
    page.reload()

    tagline = page.locator("whore-dash").locator(".tagline")
    expect(tagline).to_contain_text("Costco")


def test_clear_store(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.evaluate("localStorage.setItem('whoredash-store', 'Costco')")
    page.reload()

    clear_btn = page.locator("whore-dash").locator(".store-clear")
    clear_btn.click()

    tagline = page.locator("whore-dash").locator(".tagline")
    expect(tagline).to_contain_text("grocery")

    stored = page.evaluate("localStorage.getItem('whoredash-store')")
    assert stored is None


def test_cancel_store_edit_with_escape(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.reload()

    trigger = page.locator("whore-dash").locator(".store-trigger")
    trigger.click()

    store_input = page.locator("whore-dash").locator(".store-edit")
    store_input.fill("Loblaws")
    store_input.press("Escape")

    tagline = page.locator("whore-dash").locator(".tagline")
    expect(tagline).to_contain_text("grocery")

    stored = page.evaluate("localStorage.getItem('whoredash-store')")
    assert stored is None


def test_edit_existing_store(page: Page, base_url: str):
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    page.evaluate("localStorage.setItem('whoredash-store', 'Farm Boy')")
    page.reload()

    trigger = page.locator("whore-dash").locator(".store-trigger")
    trigger.click()

    store_input = page.locator("whore-dash").locator(".store-edit")
    store_input.fill("Costco")
    store_input.press("Enter")

    tagline = page.locator("whore-dash").locator(".tagline")
    expect(tagline).to_contain_text("Costco")

    stored = page.evaluate("localStorage.getItem('whoredash-store')")
    assert stored == "Costco"

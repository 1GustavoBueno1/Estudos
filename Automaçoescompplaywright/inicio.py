from playwright.sync_api import sync_playwright
import time

with sync_playwright() as play:
    browser = play.chromium.launch(headless = False)
    pagina = browser.new_page()
    pagina.goto("https://conecte.celesc.com.br/autenticacao/login")
    time.sleep(5)
    #browser.close()
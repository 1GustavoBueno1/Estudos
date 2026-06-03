from playwright.sync_api import sync_playwright
import time

with sync_playwright() as play:
    browser = play.chromium.launch(headless = False)
    pagina = browser.new_page()
    pagina.goto("https://conecte.celesc.com.br/autenticacao/login")
    pagina.get_by_text('Já tenho o novo cadastro').click()
    pagina.get_by_role('button', name='Entrar com e-mail').click()
    pagina.locator('input[type=\"email\"]').fill("deu boa")
    pagina.locator('input[name=\"undefined\"]').fill("deu boa")
    pagina.get_by_role('button', name='Entrar').click()
    time.sleep(20)
    #browser.close()
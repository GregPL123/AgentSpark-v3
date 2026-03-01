import { expect, test } from '@playwright/test'

test.describe('AgentSpark Core E2E Tests (Real IDB)', () => {
  test('Render the Dashboard correctly', async ({ page }) => {
    await page.goto('/')

    // Sprawdzamy czy poprawnie pojawia się Header i główny tagline
    await expect(page.locator('header').getByText('AgentSpark')).toBeVisible()
    await expect(page.getByText('Build Your AI Team')).toBeVisible()

    // Upewniamy się, że Dexie wczytało się bez błędów konsoli i wyrenderowało przycisk
    const createBtn = page.getByRole('button', { name: /stwórz projekt/i })
    await expect(createBtn).toBeVisible()
  })

  test('Creates a project and saves it across reloads', async ({ page }) => {
    await page.goto('/')

    // Klikamy "Stwórz projekt"
    await page.getByRole('button', { name: /stwórz projekt/i }).click()

    // Sprawdzamy czy UI przechodzi na chat (widoczny tryb rozmowy i przycisk powrotów)
    await expect(page.getByText('Nowy Projekt')).toBeVisible()
    await expect(page.locator('textarea')).toBeVisible()

    // Wpisz i wyśli
    const chatInput = page.locator('textarea')
    await chatInput.fill('To jest testowy projekt E2E stworzony automatycznie')
    await chatInput.press('Enter')

    // Oczekujemy wiadomości usera
    await expect(page.getByText('To jest testowy projekt E2E')).toBeVisible()

    // Odświeżamy stronę aby upewnić się, że Zustand zsynchronizował się wstecznie z Dexie IDB
    await page.reload()

    // Sprawdzamy czy projekt nadal jest w "Twoje Projekty"
    await expect(page.getByText('Nowy Projekt').first()).toBeVisible()
  })

  test('AI API is mocked using page.route and responds in chat', async ({ page }) => {
    // Instalujemy mock dla wywołania sieciowego do /api/ai/chat
    await page.route('/api/ai/chat', async (route) => {
      // Symulacja Vercel AI SDK text/event-stream ze sztucznymi chunkami (0:{"content":"..."}) - w uproszczeniu po stronie klienta mock
      // Jeśli nasz Custom SW to bypassuje to front po prostu odczyta JSON z body
      const jsonResponse = { role: 'ai', content: 'Cześć! Jestem wygenerowanym z PWA Agentem' }

      const encoder = new TextEncoder()
      const streamBody = encoder.encode(JSON.stringify(jsonResponse) + '\n')

      await route.fulfill({
        status: 200,
        contentType: 'text/plain; charset=utf-8',
        body: streamBody,
      })
    })

    await page.goto('/')
    await page.getByRole('button', { name: /stwórz projekt/i }).click()

    const chatInput = page.locator('textarea')
    await chatInput.fill('Kim jesteś?')
    await chatInput.press('Enter')

    // Czekamy na odebraną i updatowaną wiadomość
    await expect(page.getByText('Cześć! Jestem wygenerowanym z PWA Agentem')).toBeVisible()
  })
})

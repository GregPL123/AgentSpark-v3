# missions.md – AgentSpark v2 refaktoring + produkcja (Next.js 15 + Antigravity vibe)

Data startu projektu: 28 lutego 2026  
Cel: 10/10 produkcyjna wersja – offline-first, zero kluczy na froncie, zachowanie wszystkich animacji i detali UX z oryginalnego index.html

## Zespół agentów
1. SparkArchitect     → architektura, struktura, decyzje, typy
2. CodeCore           → logika, stores, crypto, versioning, import/export
3. UIVisionary        → UI, Tailwind, framer-motion, accessibility, polish
4. ProdForge          → backend proxy, PWA, testy, CI/CD, security, release

## Faza 0 – Setup repo i szkielet (1–14)

1. Stwórz nowe repo na GitHub: agentspark-v2 (public lub private – decyzja)
2. Lokalnie: npx create-next-app@latest . --typescript --tailwind --eslint --app --yes --src-dir
3. Przełącz projekt na pnpm: corepack enable && corepack prepare pnpm@latest --activate
4. Zainstaluj główne zależności: pnpm add zustand dexie jszip framer-motion lucide-react sonner zod @tanstack/react-query next-themes
5. Zainstaluj narzędzia deweloperskie: pnpm add -D vitest @vitest/ui playwright @playwright/test @types/node @biomejs/biome husky lint-staged
6. Skonfiguruj biome.json (formatter + linter) – prettier-like + no-semicolon + single quotes
7. Skonfiguruj next.config.mjs: output: 'standalone', images: { remotePatterns: [...] }, headers: CSP
8. Skopiuj cały blok :root + [data-theme="light"] + [data-theme="dark"] z oryginalnego index.html → src/app/globals.css
9. Utwórz strukturę folderów:
   src/
   ├── app/
   │   ├── api/
   │   ├── (auth)/
   │   ├── (marketing)/
   │   └── (app)/
   ├── components/
   │   ├── layout/
   │   ├── ui/
   │   └── features/
   ├── features/
   ├── lib/
   ├── stores/
   ├── types/
   ├── server/
   └── pwa/
10. Dodaj .env.example z przykładowymi zmiennymi (NEXT_PUBLIC_APP_URL, GEMINI_API_KEY tylko serwer)
11. Skonfiguruj Husky + lint-staged (pre-commit: biome format + check)
12. Pierwszy commit: "chore: initial Next.js 15 skeleton"
13. Utwórz branch develop i ustaw go jako default
14. Wrzuć pusty initial commit na main i develop

## Faza 1 – Typy, schematy, kontrakty (15–26)

15. Stwórz src/types/index.ts – typy bazowe: Lang, Level, AgentRole, AgentType
16. Dodaj typ Agent (id, name, role, description, emoji, color, files, dependencies)
17. Dodaj typ GeneratedFile (path, content, language, purpose)
18. Dodaj typ VersionEntry + VersionDiff
19. Dodaj typ TraceSpan + TraceEvent
20. Dodaj typ SharePayloadV1, V2, V3
21. Stwórz src/lib/schemas.ts – Zod schema dla SharePayloadV3
22. Zod schema dla importowanego JSON / ZIP manifest
23. Zod schema dla pojedynczego agenta (do walidacji po imporcie)
24. Zod schema dla InterviewQuestion + Choice
25. Ujednolić enum Level: 'iskra' | 'plomien' | 'pozar' | 'inferno'
26. Ujednolić typ Lang: 'en' | 'pl' + stworzyć type Translations = Record<string, string>

## Faza 2 – State + Persistence (27–40)

27. Stwórz src/stores/useAppStore.ts – główny store Zustand (screen, theme, sharedMode)
28. Stwórz useProjectsStore.ts – lista projektów, activeProjectId, CRUD
29. useVersionStore.ts – versionHistory, currentVersionId, diff, restore
30. useTraceStore.ts – spans, liveSpanId, addSpan, updateSpan
31. useChatStore.ts – messages, isTyping, currentQuestionIndex
32. useGenerationStore.ts – generatedAgents, generatedFiles, status
33. useUIStore.ts – sidebarCollapsed, toastQueue, modalStack
34. Stwórz src/lib/db.ts – Dexie instance, tabela projects, versions, files
35. Zaimplementuj migracje Dexie (v1 → v2 → v3 → v4)
36. Dodaj auto-save middleware do useProjectsStore (co 6–10 sekund)
37. Zaimplementuj loadProject(id) + saveProjectSnapshot()
38. Dodaj read-only flag dla załadowanych share-linków
39. Dodaj conflict detection przy imporcie / sync
40. Dodaj clearAllData() + confirm dialog (dev only)

## Faza 3 – Crypto + Share + Import/Export (41–54)

41. Przenieś aesGcmEncrypt / aesGcmDecrypt → src/lib/crypto.ts
42. Przenieś _compressBytes / _decompressBytes
43. Stwórz src/lib/share.ts – generateShareUrl (v3 z hasłem)
44. loadFromHash() + backward compat v1/v2/v3
45. Dodaj promptPassword modal (React + framer-motion)
46. Stwórz src/features/export/crewai.ts – generator kodu CrewAI
47. langgraph.ts, autogen.ts, swarm.ts – analogicznie
48. Stwórz ZIP exporter (JSZip) – agents + README + manifest.json
49. Stwórz import ZIP parser – odczyt manifest + pliki .md
50. Dodaj _reconstructFromMdFiles logic
51. Dodaj walidację Zod po imporcie
52. Dodaj preview przed zaimportowaniem („Znaleziono X agentów”)
53. Dodaj error handling przy uszkodzonym ZIP/JSON
54. Dodaj telemetry event po udanym imporcie/eksporcie

## Faza 4 – UI + Komponenty (55–74)

55. Stwórz Sheet.tsx – iOS-like bottom sheet + swipe-to-dismiss + handle
56. Stwórz TopicCard.tsx – hover, time-badge, agents-preview
57. AgentCard.tsx – avatar shimmer, file chips, just-updated animation
58. ProjectCard.tsx – swipe left to delete (mobile)
59. VersionTimeline.tsx – horizontal scroll + diff popover
60. TracePanel.tsx – Gantt-style bars + live updates
61. MarkdownViewer.tsx – remark + rehype-sanitize + code highlighting
62. ChatMessage.tsx – ai/user bubble + typing indicator
63. QuestionPanel.tsx – choices buttons + badge
64. Header.tsx – logo, theme toggle, lang switch, drawer btn
65. IOSBottomBar.tsx – tab bar z hide-on-scroll
66. ContextBar.tsx – sticky mobile bar
67. BackToTop.tsx – spring-in po scroll > 320px
68. Toast system – sonner + queue + aria-live
69. SkeletonCard.tsx – loading placeholder
70. FocusTrap.tsx – dla sheetów i modali
71. ThemeProvider.tsx – next-themes + long-press reset
72. Accessibility: aria-labels, roles, focus-visible
73. Mobile: safe-area-inset, 100svh → 100dvh fallback
74. Zachowaj wszystkie spring / msgIn / shimmer animacje (framer-motion)

## Faza 5 – AI Proxy + Backend (75–84)

75. Stwórz src/app/api/ai/chat/route.ts – Gemini 3 Flash stream
76. /api/ai/scoring/route.ts – structured JSON + Zod parse
77. /api/ai/refine/route.ts – refine + diff proposal
78. Dodaj rate-limiter (upstash lub simple in-memory na start)
79. Dodaj token counting + metering log (console + opcjonalnie DB)
80. Zaimplementuj fallback chain (Gemini → inny model jeśli rate limit)
81. Dodaj CSP headers w middleware
82. Zero kluczy API w bundle klienta (env server-only)
83. Dodaj error boundary + Sentry wrapper (opcjonalnie)
84. Dodaj abuse detection – zbyt wiele requestów z jednego IP

## Faza 6 – PWA + Testy + Release (85–92)

85. Skonfiguruj next-pwa lub custom SW (cache-first dla statycznych, network-first dla /api/ai)
86. Napisz 8 Playwright testów kluczowych flow
87. Skonfiguruj GitHub Actions: lint, test, build, deploy-preview, Lighthouse
88. Dodaj bundle analyzer (webpack-bundle-analyzer) – cel <65 kB gzipped
89. Dodaj Lighthouse CI gate – minimum 95 mobile
90. Dodaj release drafter + conventional commits
91. Finalny audit: zero console errors, zero a11y violations
92. Tag v1.0.0 + deploy na Vercel + custom domain (opcjonalnie)

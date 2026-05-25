Read AGENTS.md first and follow it strictly.

We are ONLY implementing the complete functionality and architecture for the Learn tab.

====================================================
LEARN TAB CORE CONCEPT
======================

The Learn tab is the educational core of Vexora.

The Learn tab contains 2 primary learning systems:

1. Vertical-Scrolling Flashcards
2. Quizzes

These 2 systems must work together cohesively as a complete language-learning experience.

The app teaches:

* French
* Spanish
* Japanese

====================================================
IMPORTANT PRODUCT PHILOSOPHY
============================

This app IS:

* an interactive language-learning platform
* focused on speaking confidence
* focused on pronunciation improvement
* focused on guided progression

====================================================
LEARN TAB ARCHITECTURE
======================

Implement the Learn tab using modular scalable architecture.

The Learn tab must remain:

* data-driven
* modular
* scalable
* reusable

====================================================
TOP-LEVEL LEARN TAB FLOW
========================

The Learn tab home screen should display 3 main learning cards:

1. Flashcards
2. Quizzes

Each card should:

* display progress
* display XP opportunity
* display completion stats
* support navigation into its dedicated flow

The Learn tab should feel:

* alive
* motivating
* progression-driven
* educational

====================================================
SECTION 1 — VERTICAL-SCROLLING FLASHCARDS
=========================================

Build a modern vertical-scrolling flashcard learning system.

IMPORTANT:
This should feel like:

* immersive guided learning
  NOT:
* static vocabulary lists

====================================================
FLASHCARD FLOW
==============

1. User selects language
2. User selects lesson/module
3. Flashcards render vertically
4. User scrolls naturally through cards
5. Each card contains:

   * word/phrase
   * translation
   * pronunciation audio button
   * pronunciation practice CTA
   * example usage
6. User progresses through lesson
7. XP rewards granted on completion

====================================================
FLASHCARD CARD TYPES
====================

Support:

* vocabulary cards
* phrase cards
* listening/pronunciation cards

====================================================
FLASHCARD FUNCTIONALITY
=======================

Implement:

* vertical snapping scroll
* animated transitions
* progress tracking
* current card detection
* lesson completion detection
* pronunciation practice triggers
* XP reward integration

====================================================
FLASHCARD DATA STRUCTURE
========================

Use structured local mock data initially.

Each lesson contains:

* id
* title
* language
* difficulty
* xpReward
* cards

Each card contains:

* type
* text
* translation
* pronunciation
* example
* audioPlaceholder
* pronunciationPrompt

====================================================
SECTION 2 — QUIZ ENGINE
=======================

Build a reusable dynamic quiz engine.

====================================================
QUIZ FLOW
=========

1. User selects quiz category
2. Quiz session begins
3. Questions render dynamically
4. User answers questions
5. System calculates score
6. XP granted
7. Performance summary shown

====================================================
SUPPORTED QUIZ TYPES
====================

Implement:

* multiple choice
* fill in blank
* matching

====================================================
QUIZ FUNCTIONALITY
==================

Implement:

* dynamic question rendering
* answer validation
* score tracking
* XP rewards
* completion states
* progress persistence
* animated feedback
* retry system

====================================================
QUIZ DATA STRUCTURE
===================

Each quiz contains:

* id
* type
* question
* options
* correctAnswer
* explanation
* xpReward


====================================================
STATE MANAGEMENT
================

Use Zustand.

Create:

* lesson-store
* quiz-store
* progress-store

Responsibilities:

lesson-store:

* active lesson
* current flashcard
* progress

quiz-store:

* active quiz
* answers
* score

progress-store:

* XP
* streaks
* completed lessons

====================================================
IMPORTANT ARCHITECTURE RULES
============================

DO NOT:

* hardcode lessons into screens
* place business logic in UI components
* create giant components
* tightly couple data fetching to screens
* overengineer AI systems

DO:

* build reusable educational architecture
* separate UI from logic
* keep systems modular
* keep flows scalable

====================================================
UI/UX REQUIREMENTS
==================

Maintain SAME:

* design language
* spacing
* color palette
* animations
* typography
* rounded card system
* visual hierarchy

as the already implemented in:

* Home tab
* Chat tab
* Profile tab

The Learn tab must blend seamlessly with the existing application.

DO NOT redesign the app.

The Learn tab should feel:

* native to the existing app
* polished
* cohesive
* production-quality

====================================================
EXPECTED OUTPUT
===============

Generate:

* Learn tab architecture
* reusable components
* vertical flashcard engine
* quiz engine
* Zustand stores
* mock lesson data
* progression system
* XP logic
* navigation flow
* scalable educational architecture

The final result should feel like:

* a real AI-assisted language-learning platform
* not just beautiful static screens.

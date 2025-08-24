# ♟️ Chess Flashcards

> Train chess patterns inside Obsidian with interactive flashcards and spaced repetition, inspired by the Chessable method.

---

## ✨ Features

- Chess flashcards written directly in Markdown (`chess-card` blocks);
- Move sequences with **`BestLine`** (player moves at even indices, opponent moves at odd indices);
- **Inline comments** per move `{…}` and a **general note** with `Note`;
- Spaced Repetition System (SRS) with progress tracked by **Id**;
- Statistics panel and dedicated training sessions.

---

## 📦 Installation

1. Download the latest release from **Releases**;
2. Copy the folder `obsidian-chess-trainer` into `.obsidian/plugins/` in your vault;
3. Enable it in **Settings → Community → Plugins**.

---

## 📝 Usage

### Creating a card

Use the `chess-card` block inside a note:

```chess-card
Name: Attack on f7 with Ng5
FEN: r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4
BestLine:
  - Ng5 {Targets f7}
  - d5 {Black counters in the center}
  - exd5 {Opens lines}
  - Na5 {Attacks the bishop on c4}
Note: Typical pattern exploiting the f7 weakness.
```

#### Fields

- **Name** _(required)_: human-readable name for the card.
    - **Does not need to be unique**; useful for organization (search, filters, themes);
- **FEN** _(required)_: starting position;
- **BestLine** _(required)_: ordered list of moves;
    - Even indices → your moves;
    - Odd indices → opponent moves;
    - Optional inline comments with `{…}` after each move;
- **Note** _(optional)_: general comment about the problem.

#### Identity and progress

- **Id** _(optional for you; required internally)_: unique identifier for the card;
    - If **not** provided, the plugin **generates a UUID** on first load and persists it;
    - You **may** declare one manually to preserve progress across vaults/devices.

Example with explicit Id:

```chess-card
Id: 8a7f4f5e-5c4d-4e1a-9a6c-1e2b3c4d5e6f
Name: Basic opposition endgame
FEN: 8/8/8/2k5/2P5/8/2K5/8 w - - 0 1
BestLine:
  - c4 {Push the pawn}
  - Kd4 {Centralize the king}
  - Kb3 {Support the pawn}
  - Kd3 {Maintain opposition}
Note: Opposition technique in K+P vs K.
```

## 🎯 Training

1. Open the **Chess Training Panel**;
2. Click **Start Training**;
3. Solve the scheduled cards (SRS);
    - ✅ Correct move: progresses to the next move in `BestLine`;
    - ❌ Wrong move: shows the correct response and logs the mistake.
## ⏱️ Spaced Repetition (SRS)

- Automatic scheduling per card, based on your performance;
- “More mistakes → sooner review”, “more success → later review”;
- The panel shows:
    - Total cards;
    - Correct vs wrong;
    - Reviews due today;
    - Streak/interval per card.

## 📊 Roadmap

- [ ] Variant support (alternative lines to the main one);
- [ ] Bulk import PGN/FEN problems;
- [ ] Statistics: score, most missed plays, evolution history;
- [ ] Export/import decks (as in Anki);
- [ ] Integration with **Obsidian Canvas**: place boards as “cards” on the canvas.

## 🤝 Contributing

Pull requests and suggestions are welcome!

Follow these steps:

1. Fork the repo
2. Create a branch `feature/<your-nickname>/<your-feature-name>`
3. Open a PR with a clear explanation

## 📜 License

MIT License
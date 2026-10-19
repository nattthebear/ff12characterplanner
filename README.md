## Final Fantasy 12 Character Planner

https://nattthebear.github.io/ff12characterplanner

### Run locally

Use Node.js 24 or newer (the tests execute TypeScript directly):

```powershell
npm.cmd ci
npm.cmd start
```

Open http://localhost:3000. `npm.cmd test` runs the regression checks; `npm.cmd run build` creates the production site in `build/`.

### Original PS2 board

Choose **Original PS2** alongside the twelve Zodiac jobs. This is the original 2006 board, not the PS2 International Zodiac Job System board. A character using it has one board and cannot combine it with a Zodiac job. Other characters can use either edition for comparison.

The PS2 board has its original 24 by 24 layout and 300 squares. Its licenses, spell and equipment contents, LP costs, and starting licenses live separately in `src/data/PS2Licenses.ts`, `PS2Board.ts`, and `PS2Characters.ts`. Matching names do not share license objects with Zodiac. The sidebar and tooltips use the selected character's edition. US English spellings are used consistently: Ardor/Ardour and Water/Aqua refer to the same spells, not additional unlocks.

The original board's 18 Quickening squares each cost 50 LP. Each square can belong to only one character, and each character can learn three. PS2 Espers also have their original costs and a single owner. The Mist Planner supports both editions. Existing Zodiac share URLs keep their original encoding; PS2 plans also survive copying the URL and reloading.

Initial PS2 licenses are taken from the character tables, before spending LP. Vaan starts with Steal, Light Armor 1, and Smallswords; Penelo starts with White Magick 1, Daggers 1, and Light Armor 1. Fran has White Magick 1 and Black Magick 1, not levels 1 and 2 of each. The complete six-character lists are in `PS2Characters.ts`. Vaan's later tutorial grant of Accessories 1 is treated as a story acquisition; it can be selected normally.

The DPS Simulator's **Edition** selector switches all six characters between Original PS2 and The Zodiac Age. Switching back restores that edition's boards, purchased licenses and Mist assignments during the current session. Share URLs contain the currently displayed party; the alternate plan is not saved across reloads. On the first switch to Zodiac from a PS2-only plan, choose Zodiac jobs normally.

PS2 DPS data lives separately in `src/dps/ps2/`: weapons, ammunition, armor, accessories, spells, technicks and character growth. The optimizer selects the matching catalog and license objects for each character. PS2 calculations apply the original Focus/Serenity damage bonus (20%), charge times, combo rates and 9,999 cap to individual damage rolls before criticals, combos and multiple targets. The Mist Planner labels PS2 cells with their assignment status and LP cost, and supports keyboard activation.

Results remain estimates: both editions use the existing simulator's animation timings, approximate speed curve and continuous damage rolls. PS2 spell queue contention, MP exhaustion and on-hit status effects are not simulated. A PS2 combo or multi-target action may exceed 9,999 total damage because each hit/target is capped separately. Only the offensive abilities already modeled by the simulator are included.

### Data verification

The supplied comparisons were checked: the Black Magick assignments and numbered family ranges, Guns 1/5/6 contents and costs, Ardor's move to Arcane Magick, Heavy Armor 8, Accessories 2, and the unchanged White/Time Magick 1 contents all agree with the edition-specific references.

Sources:

- Piggyback, *Final Fantasy XII: The Complete Guide*, printed pages 42-47 (board, contents and LP) and 62-67 (initial licenses). The supplied local PDF was inspected; it is not included in the repository. The publisher also provides [official sample pages](https://www.piggyback.com/en/wp-content/uploads/sites/7/2020/04/FFXII_E_SamplePages.pdf), including the original board's augment chart and LP totals.
- The same original guide's printed pages 78-87 provide the independent PS2 equipment values. Original mechanics were checked against [maltzsan's Game Mechanics FAQ](https://gamefaqs.gamespot.com/ps2/459841-final-fantasy-xii/faqs/45900), especially sections 1a (charge time), 2a/2b (damage and combos), 3a (spell power), 6a/6c/6d (growth, augments and accessories), and 10h (damage cap). For example, PS2 Cat-ear Hood supplies +50 Speed; PS2 Cloud Staff boosts Water alone; PS2 Firaga/Thundaga/Blizzaga have power 124.
- [Kouli's original PS2 License Board List](https://gamefaqs.gamespot.com/ps2/459841-final-fantasy-xii/faqs/41964) independently checks the coordinates and costs. Its translated Japanese names refer to the same original board.
- [Scion's original PS2 Licence Board FAQ](https://gamefaqs.gamespot.com/ps2/459841-final-fantasy-xii/faqs/46739) checks spell/equipment contents and the disputed printed entries.
- [Original board reference](https://finalfantasy.fandom.com/wiki/License_Board/Original) and [Fran's character tables](https://finalfantasy.fandom.com/wiki/Fran_(Final_Fantasy_XII_party_member)) provide additional cross-checks.
- Prima's official Zodiac tables: [all licenses](https://primagames.com/eguides/final-fantasy-xii-the-zodiac-age-eguide/zodiac-job-system/jobs), [Black Mage](https://primagames.com/eguides/final-fantasy-xii-the-zodiac-age-eguide/zodiac-job-system/black-mage), and [Machinist](https://primagames.com/eguides/final-fantasy-xii-the-zodiac-age-eguide/zodiac-job-system/machinist).

Some references contain errors. The implementation resolves these against the independent original-board lists:

| Square | Verified PS2 entry | Conflicting entry |
| --- | --- | --- |
| R12 | +100 HP, 50 LP | Piggyback's diagram prints 100 LP. |
| O15 | Light Armor 12, Dueling Mask / Brave Suit, 100 LP | Piggyback duplicates Heavy Armor 9's contents and 60 LP. |
| O16 | Heavy Armor 9, Magepower Shishak / Maximillian, 60 LP | Piggyback duplicates Heavy Armor 8's contents. |
| S8 | First Aid, 20 LP | One PDF text layer contains the label in place of the LP number. |

The implementation retains Danjuro at 110 LP, Zodiac Spear at 235 LP, Rod of Faith at 120 LP, Mystic Armor 5 at 25 LP, Axes & Hammers 5 at 35 LP, and Potion Lore 1 at 20 LP. These agree with Piggyback and Kouli; conflicting wiki values are not used. Total regular licenses cost 13,180 LP, plus 805 LP for all Espers and 50 LP per Quickening. These totals, the complete family ranges, initial licenses, edition isolation, ownership rules, resets and URL round-trips are covered by `src/model/PS2.test.ts`.

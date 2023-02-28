# Encoding and Decoding URLs

URLs to the character planner can include a query string portion which encodes the characters and licenses selected.
For instance, in this link:

```
https://nattthebear.github.io/ff12characterplanner/?HkBgAAAIARAAAiQiAAAAAADCAw.AA.AA.AA.AA.AA
```

Vaan has selected jobs Uhlan and Monk, and taken licenses Cúchulainn, Adrammelech, and Quickening 3, and if you load
that URL into your browser you'll be restored to that exact job state.

The URL stores information about every selected job on all six characters, and every selected license.  It does not
store any information about the DPS simulator or current UI state, such as which character is selected, and whether
the mist planner is open.

These URLs can be generated and decoded with a bit of simple logic, which is implemented in [src/model/PartyModel.ts]
and documented here.

## Prerequisites

In order to encode and decode job URLs, you need to know the exact shape of all 12 license boards, including
which licenses are on them and exactly where each license is in relation to other licenses, so that adjacency
and order can be determined.  You also need to know what licenses are innately known.  Each of the six characters
has a short list of licenses that they always have learned at the start of the game.
Beyond that, all that's needed is the ability to do base64 encoding and decoding, and some basic logic.

You can see the exact copy of the data that this planner uses:
- Board Layouts: [src/data/Characters.ts](src/data/Characters.ts)
- Innate Licenses: [src/data/Boards.ts](src/data/Boards.ts)

## Decoding a URL

Only the query string portion of the URL, the part after the `?`, is used.  No other part of the URL is examined,
including the hash portion.  If there is no query string in the URL, then we load to the default state, with no
jobs assigned and no licenses learned except for each character's innate licenses.

Given that we do have a query string, we strip off the `?` and then process the rest through a series of steps.

### Split by Character

The string should have five periods (`.`) in it.  Split on these to create six individual strings.  In order, these are the
data for each of the six characters:

- Vaan
- Balthier
- Fran
- Basch
- Ashe
- Penelo

If there are less than 6 substrings, start at Vaan and decode as many as there are strings; the remaining characters
will be in their default state.  If there are more than 6 substrings, extra past 6 are ignored.

Individual strings can be empty, so `....YQAAAAxABA.` makes Ashe a Foebreaker but leaves all other characters in their default state.

### (Per Character) Decode Base64URL

The string for this character is Base64URL encoded.  This is similar to Base64, but uses a different symbol set and no padding.
The exact specification is documented in https://datatracker.ietf.org/doc/html/rfc4648#section-5.  The output is clean raw 8 bit binary
bytes, with all values allowed and no text encoding involved.

If the string is invalid Base64URL or empty, this character is left in the default state.

For subsequent steps, use the raw binary representation.

### (Per Character) Look up Jobs

The first byte of data contains the character's choice of one or two jobs.

The exact byte values are:

| Byte Value | First Job | Second Job |
| -- | -- | -- |
| `0x00` | _none_ | _none_ |
| `0x01` | _none_ | White Mage |
| `0x02` | _none_ | Uhlan |
| `0x03` | _none_ | Machinist |
| `0x04` | _none_ | Red Battlemage |
| `0x05` | _none_ | Knight |
| `0x06` | _none_ | Monk |
| `0x07` | _none_ | Time Battlemage |
| `0x08` | _none_ | Foebreaker |
| `0x09` | _none_ | Archer |
| `0x0a` | _none_ | Black Mage |
| `0x0b` | _none_ | Bushi |
| `0x0c` | _none_ | Shikari |
| `0x0d` | White Mage | _none_ |
| `0x0e` | White Mage | Uhlan |
| `0x0f` | White Mage | Machinist |
| `0x10` | White Mage | Red Battlemage |
| `0x11` | White Mage | Knight |
| `0x12` | White Mage | Monk |
| `0x13` | White Mage | Time Battlemage |
| `0x14` | White Mage | Foebreaker |
| `0x15` | White Mage | Archer |
| `0x16` | White Mage | Black Mage |
| `0x17` | White Mage | Bushi |
| `0x18` | White Mage | Shikari |
| `0x19` | Uhlan | _none_ |
| `0x1a` | Uhlan | White Mage |
| `0x1b` | Uhlan | Machinist |
| `0x1c` | Uhlan | Red Battlemage |
| `0x1d` | Uhlan | Knight |
| `0x1e` | Uhlan | Monk |
| `0x1f` | Uhlan | Time Battlemage |
| `0x20` | Uhlan | Foebreaker |
| `0x21` | Uhlan | Archer |
| `0x22` | Uhlan | Black Mage |
| `0x23` | Uhlan | Bushi |
| `0x24` | Uhlan | Shikari |
| `0x25` | Machinist | _none_ |
| `0x26` | Machinist | White Mage |
| `0x27` | Machinist | Uhlan |
| `0x28` | Machinist | Red Battlemage |
| `0x29` | Machinist | Knight |
| `0x2a` | Machinist | Monk |
| `0x2b` | Machinist | Time Battlemage |
| `0x2c` | Machinist | Foebreaker |
| `0x2d` | Machinist | Archer |
| `0x2e` | Machinist | Black Mage |
| `0x2f` | Machinist | Bushi |
| `0x30` | Machinist | Shikari |
| `0x31` | Red Battlemage | _none_ |
| `0x32` | Red Battlemage | White Mage |
| `0x33` | Red Battlemage | Uhlan |
| `0x34` | Red Battlemage | Machinist |
| `0x35` | Red Battlemage | Knight |
| `0x36` | Red Battlemage | Monk |
| `0x37` | Red Battlemage | Time Battlemage |
| `0x38` | Red Battlemage | Foebreaker |
| `0x39` | Red Battlemage | Archer |
| `0x3a` | Red Battlemage | Black Mage |
| `0x3b` | Red Battlemage | Bushi |
| `0x3c` | Red Battlemage | Shikari |
| `0x3d` | Knight | _none_ |
| `0x3e` | Knight | White Mage |
| `0x3f` | Knight | Uhlan |
| `0x40` | Knight | Machinist |
| `0x41` | Knight | Red Battlemage |
| `0x42` | Knight | Monk |
| `0x43` | Knight | Time Battlemage |
| `0x44` | Knight | Foebreaker |
| `0x45` | Knight | Archer |
| `0x46` | Knight | Black Mage |
| `0x47` | Knight | Bushi |
| `0x48` | Knight | Shikari |
| `0x49` | Monk | _none_ |
| `0x4a` | Monk | White Mage |
| `0x4b` | Monk | Uhlan |
| `0x4c` | Monk | Machinist |
| `0x4d` | Monk | Red Battlemage |
| `0x4e` | Monk | Knight |
| `0x4f` | Monk | Time Battlemage |
| `0x50` | Monk | Foebreaker |
| `0x51` | Monk | Archer |
| `0x52` | Monk | Black Mage |
| `0x53` | Monk | Bushi |
| `0x54` | Monk | Shikari |
| `0x55` | Time Battlemage | _none_ |
| `0x56` | Time Battlemage | White Mage |
| `0x57` | Time Battlemage | Uhlan |
| `0x58` | Time Battlemage | Machinist |
| `0x59` | Time Battlemage | Red Battlemage |
| `0x5a` | Time Battlemage | Knight |
| `0x5b` | Time Battlemage | Monk |
| `0x5c` | Time Battlemage | Foebreaker |
| `0x5d` | Time Battlemage | Archer |
| `0x5e` | Time Battlemage | Black Mage |
| `0x5f` | Time Battlemage | Bushi |
| `0x60` | Time Battlemage | Shikari |
| `0x61` | Foebreaker | _none_ |
| `0x62` | Foebreaker | White Mage |
| `0x63` | Foebreaker | Uhlan |
| `0x64` | Foebreaker | Machinist |
| `0x65` | Foebreaker | Red Battlemage |
| `0x66` | Foebreaker | Knight |
| `0x67` | Foebreaker | Monk |
| `0x68` | Foebreaker | Time Battlemage |
| `0x69` | Foebreaker | Archer |
| `0x6a` | Foebreaker | Black Mage |
| `0x6b` | Foebreaker | Bushi |
| `0x6c` | Foebreaker | Shikari |
| `0x6d` | Archer | _none_ |
| `0x6e` | Archer | White Mage |
| `0x6f` | Archer | Uhlan |
| `0x70` | Archer | Machinist |
| `0x71` | Archer | Red Battlemage |
| `0x72` | Archer | Knight |
| `0x73` | Archer | Monk |
| `0x74` | Archer | Time Battlemage |
| `0x75` | Archer | Foebreaker |
| `0x76` | Archer | Black Mage |
| `0x77` | Archer | Bushi |
| `0x78` | Archer | Shikari |
| `0x79` | Black Mage | _none_ |
| `0x7a` | Black Mage | White Mage |
| `0x7b` | Black Mage | Uhlan |
| `0x7c` | Black Mage | Machinist |
| `0x7d` | Black Mage | Red Battlemage |
| `0x7e` | Black Mage | Knight |
| `0x7f` | Black Mage | Monk |
| `0x80` | Black Mage | Time Battlemage |
| `0x81` | Black Mage | Foebreaker |
| `0x82` | Black Mage | Archer |
| `0x83` | Black Mage | Bushi |
| `0x84` | Black Mage | Shikari |
| `0x85` | Bushi | _none_ |
| `0x86` | Bushi | White Mage |
| `0x87` | Bushi | Uhlan |
| `0x88` | Bushi | Machinist |
| `0x89` | Bushi | Red Battlemage |
| `0x8a` | Bushi | Knight |
| `0x8b` | Bushi | Monk |
| `0x8c` | Bushi | Time Battlemage |
| `0x8d` | Bushi | Foebreaker |
| `0x8e` | Bushi | Archer |
| `0x8f` | Bushi | Black Mage |
| `0x90` | Bushi | Shikari |
| `0x91` | Shikari | _none_ |
| `0x92` | Shikari | White Mage |
| `0x93` | Shikari | Uhlan |
| `0x94` | Shikari | Machinist |
| `0x95` | Shikari | Red Battlemage |
| `0x96` | Shikari | Knight |
| `0x97` | Shikari | Monk |
| `0x98` | Shikari | Time Battlemage |
| `0x99` | Shikari | Foebreaker |
| `0x9a` | Shikari | Archer |
| `0x9b` | Shikari | Black Mage |
| `0x9c` | Shikari | Bushi |

Note that this table can be generated by looping through all 12 jobs (plus no job)
in the following order, iterating second job before first job and skipping all duplicates
except for _none_, _none_:

| Iteration Order | Value |
| -- | -- |
| `0x00` | _none_ |
| `0x01` | White Mage |
| `0x02` | Uhlan |
| `0x03` | Machinist |
| `0x04` | Red Battlemage |
| `0x05` | Knight |
| `0x06` | Monk |
| `0x07` | Time Battlemage |
| `0x08` | Foebreaker |
| `0x09` | Archer |
| `0x0a` | Black Mage |
| `0x0b` | Bushi |
| `0x0c` | Shikari |

If the byte value is higher than `0x9c`, this character is invalid and gets default values.
If the character only has a second job selected (`0x01` through `0x0c`), that's treated as
the same as having just a first job.

### (Per Character) Iterate Licenses

All remaining bytes in this character's data contain the activation state for individual licenses.
Iterate through the licenses in a specific order given below.  Each license has one bit, starting
at the least significant bit in the byte.  A `0` means the license is not taken; a `1` means it
is taken.  If you run out of bytes, any left over licenses are assumed to be not taken.
So for instance, the bytes `0x4c 0x01` (not including the job byte from the previous step), correspond
to the licence data of:

- Not Taken
- Not Taken
- Taken
- Taken
- Not Taken
- Not Taken
- Taken
- Not Taken
- Taken
- Not Taken (Repeat indefinitely)

The iteration order for the licenses depends on the boards selected.  First, we take the character's
first selected board, and iterate through every license on that board, starting at the top left of the
board, and going right and then down.

If the character has a second board, we then immediately follow that with the character's second board,
also starting at the top left and then going right and then down.  On the second board, any license
that already appeared on the first board is omitted and not listed again.

So if the character's job byte is `0x7a` (Black Mage, White Mage), the license iteration order is:

- +70 HP
- Zodiark
- Hand-bombs 3
- Quickening 1
- Mystic Armor 13
- Mystic Armor 12
- Mateus
- Magick Lore 4
- Gambit Slot 5
- Adrammelech
- Hand-bombs 2
- +390 HP
- Quickening 4
- Mystic Armor 11
- Staves 5
- Channeling 1
- Gambit Slot 4
- Magick Lore 11
- Mystic Armor 10
- Magick Lore 2
- Gambit Slot 2
- Magick Lore 10
- Mystic Armor 9
- Magick Lore 1
- Gambit Slot 1
- Gambit Slot 3
- Gambit Slot 6
- Martyr
- Magick Lore 9
- Staves 4
- Quickening 3
- Mystic Armor 1
- Essentials
- Accessories 1
- Accessories 2
- Accessories 4
- Magick Lore 5
- Mystic Armor 8
- Second Board
- Mystic Armor 2
- Black Magick 1
- Accessories 3
- Gambit Slot 7
- Poach
- Black Magick 13
- Mystic Armor 7
- Belias
- Staves 1
- Black Magick 2
- Ether Lore 1
- Accessories 5
- Zalera
- Steal
- Black Magick 12
- Staves 3
- Mystic Armor 3
- Black Magick 3
- Accessories 6
- Magick Lore 3
- Hand-bombs 4
- Black Magick 11
- Mystic Armor 6
- Mystic Armor 5
- Staves 2
- Mystic Armor 4
- Black Magick 4
- Warmage
- Accessories 7
- Hashmal
- Black Magick 10
- Black Magick 9
- Black Magick 8
- Black Magick 7
- Black Magick 6
- Black Magick 5
- Accessories 8
- Inquisitor
- Magick Lore 8
- Green Magick 1
- Channeling 2
- +270 HP
- Charge
- Accessories 9
- Ether Lore 2
- Spellbreaker
- Magick Lore 7
- Magick Lore 6
- Telekinesis
- Ultima
- Magick Lore 14
- Magick Lore 15
- Ribbon
- Channeling 3
- Accessories 19
- Gambit Slot 9
- Accessories 15
- Remedy Lore 1
- Accessories 10
- +150 HP
- Remedy Lore 2
- Headsman
- Shemhazai
- Heavy Armor 7
- Magick Lore 16
- Magick Lore 13
- Magick Lore 12
- Accessories 21
- Green Magick 2
- Accessories 17
- Charm
- Accessories 12
- Serenity
- Accessories 11
- Ether Lore 3
- Green Magick 3
- Chaos
- Famfrit
- Zeromus
- Accessories 13
- Gambit Slot 8
- Accessories 16
- Gambit Slot 10
- Accessories 20
- Staff of the Magi
- +230 HP
- +190 HP
- Heavy Armor 9
- Spellbound
- Accessories 14
- Swiftness 1
- Accessories 18
- Swiftness 2
- Accessories 22
- +310 HP
- Quickening 2
- Cúchulainn
- Exodus
- Heavy Armor 8
- Libra
- Battle Lore 1
- Stamp
- Rod of Faith
- +110 HP
- Greatswords 2
- Rods 3
- Rods 4
- Battle Lore 2
- Battle Lore 4
- White Magick 13
- Rods 2
- Achilles
- Greatswords 1
- Battle Lore 3
- Numerology
- Daggers 5
- Rods 1
- Battle Lore 6
- White Magick 1
- White Magick 2
- +30 HP
- White Magick 3
- Battle Lore 7
- White Magick 4
- Souleater
- White Magick 5
- White Magick 12
- White Magick 10
- White Magick 8
- White Magick 6
- White Magick 7
- White Magick 9
- White Magick 11
- Battle Lore 5

If the character has no jobs, this step is skipped.  If the character only has one job,
the second job is skipped.

### (Per Character) Add Innate Licenses

Each character has a short list of innate licenses that they always know.  Add those to the character's
known licenses, whether they appeared in the iteration order or not and regardless of what their values were
in the iteration order.

### Combine and Verify

At this point, you have 6 characters each with zero to two jobs selected, and each with a set of selected licenses.
Now this data needs to be validated to ensure it could exist in game.

* If more than one character has any Esper selected, remove it from all but one character.  The priority is the same
  as the order the characters appear in the encoded string, so Vaan always has highest priority and would never
  have any Espers removed by this step, but Penelo will always lose an Esper if any other character has it.
* If any character has all four quickenings selected, remove Quickening 4 (125LP) from that character.
* Starting from each character's innate licenses, remove any license that isn't reachable from there.  Just as in
  the real game, in order for a license to be selected, there needs to be a continuous path from an innate license
  to that license.  For instance, if Vaan is a Black Mage, with no second job, and has only chosen the licenses
  Gambit Slot 1, Magick Lore 1, and Accessories 4, remove Accessories 4 because there's no way to get to it.
  But in the same scenario, Ashe would keep Accessories 4 because she knows Accessories 2 innately.

Note that there is no validation of the Second Board license.  In the game, you must reach that license legitimately
from your first board before you can even select a Second Board.  While the license exists here and can be selected,
second jobs are freely usable regardless of its status.

## Encoding a URL

Encoding a party is the reverse of decoding a party, so needs very little additional explanation.  There are a few
choices the encoder makes, but the decoder accepts more than the encoder outputs so it's usually not important:

- If all characters are in the default state, the encoder outputs nothing and there is no query string.  But if any
  character has anything selected, the encoder outputs data for all six characters, even though it could have dropped
  any of the later ones if they are in the default state.
- The encoder always encodes at least one byte of data for each character, so a character with nothing selected will
  be represented by `AA` even though the empty string would work.
- The second job only options, `0x01 - 0x0c`, are not used by the encoder although the decoder treats them as equivalent
  to first job only options.
- When iterating licenses, any all-zero bytes at the end are dropped because the decoder will reconstruct them.

Older versions of the Character Planner did not always behave this way, and the decoder instructions given should always
be used completely to ensure that old links still work.

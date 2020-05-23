# Stract game

## Dev instructions
1. Pull the repo and install the dependencies using `yarn`
2. Build all the packages by running `yarn build`
3. Run `yarn dev` in the root, check out the link it produces to see the game in action!

## How to play Stract
Stract is a team based strategy that happens in semi-real time.

### Winning
The object of the game is to score points, whichever team has the most points at the end of 45 turns wins.

Teams can score points in one of two ways:
1. Destroying an opponent's piece, scoring 2 points
2. Moving a piece into the opponent's end zone, scoring 10 points

### The basics

The game is broken down into a grid with one team starting in the north and the other in the south. The first line on the grid, respective to each team, is considered a team's end zone.

During a turn, all team members can take one of two actions:
1. Spawn a new piece in their team's end zone
2. Move an existing piece

Pieces come in three forms: water, fire, or earth.

All pieces can move freely in any of the 4 basic cardinal directions. In addition each piece has a special move:
1. Waters can move 1 tile diagonally
2. Fires can move up to 2 tiles in any basic cardinal direction
2. Earths can designate a tile up to 2 tiles away. If after the movement phase there's at least one piece in the designated tile, the earth piece will switch its place with the all the pieces on the designated tile.

Action resolution happens in the following order: first all spawns, then all movement, then all earth switching, then piece destruction, then piece scoring. This leads to a few nuances:
1. Fires can jump over other pieces
2. Earth switching can miss because it targets the tile, not the piece. If it misses, the earth piece will do nothing
3. Earth pieces will only take themselves during a switch
4. Any conflicts between earth pieces is resolved via a first-come-first-serve basis

If two pieces occupy the same tile, the following happens:
1. Water destroy Fire
2. Fire destroy Earth
3. Earth destroy Water
4. If the two pieces are the same, or there are more than three pieces, they will all destroy each other. Teams will get points equal to the number of enemy team's pieces that were destroyed

If your team moves a piece into the opponent's end zone, it will score 10 points and if your team destroys an enemy piece, it will score 2 points. Please note if two or more of your pieces occupy the same tile, the piece destruction will resolve normally, except your team will score -2 points per tile destroyed instead. This only happens if there are no opponent pieces on the tile.

### Gameplay

There are three aspects that make Stract very exciting:
1. The game is played in semi-real time with each turn lasting 20 seconds. That means as you take your action, so does everyone else playing! All players are allowed to take a single action per turn and the game ends after 45 turns, or 15 minutes.
2. The specific type of piece you spawn is hidden to your opponent until it occupies the same tile as an enemy piece. After this collision, it will no longer be hidden.
3. Your team gets 10 of each type of piece at the start of the game. When a piece scores, it will be removed from the board and added back to your team's piece pool, but when a piece is destroyed, it does not get added back to your piece pool.

## Attributions

Sounds from ZapSplat.com and FreeSounds.org.

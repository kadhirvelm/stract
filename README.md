# Stract game

## Dev instructions
1. Pull the repo and install the dependencies using `yarn`
2. Build all the packages by running `yarn build`
3. Run `yarn dev` in the root, check out the link it produces to see the game in action!

## How to play Stract

Stract is a team based strategy that happens in semi-real time. The object of the game is to score points, whichever team has the most points at the end of the game wins.

Teams can score points in one of two ways:
1. Destroying an opponent's tile
2. Moving a tile into the opponent's end zone

### The basics

The game is broken down into a grid with one team starting in the north and the other in the south. The first line on the grid, respective to each team, is considered a team's end zone.

During a turn, all team members can take one of two actions:
1. Spawn a new tile in their team's end zone, in the designated spaces
2. Move an existing tile

Tiles come in three forms: a triangle, a circle, a square.

All tiles can move freely in any of the 4 cardinal directions. In addition each tile has a special move:
1. Triangles can move 1 space diagonally
2. Circles can move up to 2 spaces in any cardinal direction
2. Squares can switch places with any tiles (including an opponent's) on an adjacent space

Action resolution happens in the following order: first all movement, then all square switching, then tile destruction, which leads to a couple of nuances:
1. Circles can jump over other tiles
2. Square switching can miss because it targets a space, not a tile. If it misses, the square will do nothing

If two tiles occupy the same space, the following happens:
1. Triangles destroy circles
2. Circles destroy squares
3. Squares destroy triangles
4. If the two tiles are the same, or there are more than three tiles, they will all destroy each other. Teams will get points equal to the number of enemy team's tiles that were destroyed

If your team moves a tile into the opponent's end zone, it will score 10 points and if your team destroys an enemy tile, it will score 2 points. Please note if two or more of your tiles occupy the same
space and there are no opponent tiles, the tile destruction will resolve normally except your team will score -2 points per tile destroyed instead.

### Gameplay

There are three aspects that make Stract very exciting:
1. The game is played in semi-real time with each turn lasting 20 seconds. That means as you take your action, so does everyone else playing! All players are allowed to take a single action per turn.
2. The specific type of tile you spawn is hidden to your opponent until it occupies the same space as an enemy tile. After this collision, it will no longer be hidden.
3. Your team gets 10 of each type of tile at the start of the game. When a tile scores, it will be removed from the board and added back to your team's tile pool, but when a tile is destroyed, it does not get added back to your tile pool.



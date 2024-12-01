import { game } from "./tables.mjs";
import { db1, db2, db3 } from "./databases.mjs";  // Import the databases

/**
 * Inserts a game into Node 1 and the appropriate partitioned node (Node 2 or Node 3).
 */
export async function insertGame(gameData) {
  const { appId, name, releaseDate, price, developers, log } = gameData;

  // Insert into Node 1
  await db1.insert(game).values({ appId, name, releaseDate, price, developers, log });

  // Insert into the appropriate node based on release year
  const targetDb = releaseDate < 2020 ? db2 : db3;
  await targetDb.insert(game).values({ appId, name, releaseDate, price, developers, log });
}

/**
 * Updates a game in Node 1 and the appropriate partitioned node (Node 2 or Node 3).
 */
export async function updateGame(gameData) {
  const { appId, name, releaseDate, price, developers, log } = gameData;

  // Update in Node 1
  await db1.update(game).set({ name, releaseDate, price, developers, log }).where({ appId });

  // Update in the appropriate node based on release year
  const targetDb = releaseDate < 2020 ? db2 : db3;
  await targetDb.update(game).set({ name, releaseDate, price, developers, log }).where({ appId });
}

/**
 * Deletes a game from Node 1 and the appropriate partitioned node (Node 2 or Node 3).
 */
export async function deleteGame(appId, releaseDate) {
  // Delete from Node 1
  await db1.delete(game).where({ appId });

  // Delete from the appropriate node based on release year
  const targetDb = releaseDate < 2020 ? db2 : db3;
  await targetDb.delete(game).where({ appId });
}
 
import { game } from './tables.mjs'; // Import the `game` table model if necessary


function getColumnByWord(word) {
  switch (word.toLowerCase()) {
    case "id":
    case "app id":
      return game.appId; // Maps to the app_id column
    case "name":
      return game.name; // Maps to the name column
    case "release date":
    case "release":
      return game.releaseDate; // Maps to the release_date column
    case "price":
      return game.price; // Maps to the price column
    case "developers":
    case "developer":
      return game.developers; // Maps to the developers column
    case "log":
      return game.log; // Maps to the log column
    default:
      throw new Error(`Invalid word: ${word}. No matching column found.`);
  }
}

function isFloat(a) {
    return a - a === 0 && a.toString(32).indexOf('.') !== -1
  }
function isNumber(str) {
return !isNaN(Number(str));  
}

export { getColumnByWord, isFloat, isNumber };
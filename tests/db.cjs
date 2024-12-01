const mysql = require('mysql2/promise'); // Import the promise-based version of mysql2

// Function to create a connection to a specific node
const createConnection = async (host, port, database) => {
  return mysql.createConnection({
    host: host,
    user: 'root',
    password: 'root',
    database: database,
    port: port,
  });
};

// Export a function to initialize and get the connections
const initializeConnections = async () => {
  const centralNodeConnection = await createConnection('localhost', 3309, 'central_db');  // Central Node
  const node2Connection = await createConnection('localhost', 3307, 'games_pre_2020');    // Node 2 (Games pre-2020)
  const node3Connection = await createConnection('localhost', 3308, 'games_post_2020');   // Node 3 (Games post-2020)

  return {
    centralNodeConnection,
    node2Connection,
    node3Connection,
  };
};

module.exports = initializeConnections;

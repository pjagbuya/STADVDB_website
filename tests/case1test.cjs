let expect;
let centralNodeConnection, node2Connection, node3Connection;

before(async function () {
  // Dynamically import chai
  const chaiModule = await import('chai');
  expect = chaiModule.expect;

  // Import and initialize database connections
  const initializeConnections = (await import('./db.cjs')).default;
  const connections = await initializeConnections();

  centralNodeConnection = connections.centralNodeConnection;
  node2Connection = connections.node2Connection;
  node3Connection = connections.node3Connection;

  // Debugging: Check the tables in each database to ensure they exist
  await checkTables(centralNodeConnection, 'central_db');
  await checkTables(node2Connection, 'games_pre_2020');
  await checkTables(node3Connection, 'games_post_2020');
});

after(async function () {
  // Closing the connections after the tests
  await centralNodeConnection.end();
  await node2Connection.end();
  await node3Connection.end();
});

describe('Case #1: Concurrent transactions in two or more nodes are reading the same data item', function () {
  it('should simulate concurrent read operations on the same data item from central node and node-2', async function () {
    // Start a query from Node-2 (pre-2020 games)
    const [results2] = await node2Connection.query('SELECT * FROM game WHERE app_id = 1');
    console.log('Node-2 Results:', results2);

    // Start a query from Central Node (all data)
    const [results1] = await centralNodeConnection.query('SELECT * FROM game WHERE app_id = 1');
    console.log('Central Node Results:', results1);

    // Check if the app_id from both nodes are the same
    expect(results1[0].app_id).to.equal(results2[0].app_id);

    // Ensure that both nodes returned the same game name
    expect(results1[0].name).to.equal(results2[0].name); // Assuming 'name' is a column in the 'game' table
  });

  it('should simulate concurrent read operations on the same data item from central node and node-3', async function () {
    // Start a query from Node-3 (post-2020 games)
    const [results3] = await node3Connection.query('SELECT * FROM game WHERE app_id = 2');
    console.log('Node-3 Results:', results3);

    // Start a query from Central Node (all data)
    const [results1] = await centralNodeConnection.query('SELECT * FROM game WHERE app_id = 2');
    console.log('Central Node Results:', results1);

    // Check if the app_id from both nodes are the same
    expect(results1[0].app_id).to.equal(results3[0].app_id);

    // Ensure that both nodes returned the same game name
    expect(results1[0].name).to.equal(results3[0].name); // Assuming 'name' is a column in the 'game' table
  });
});

// Helper function to check tables in the database
async function checkTables(connection, databaseName) {
  console.log(`Checking tables in database: ${databaseName}`);

  try {
    // Select the database
    await connection.query(`USE ${databaseName}`);

    // Get and log the list of tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`Tables in ${databaseName}:`, tables);
  } catch (error) {
    console.error(`Error checking tables in ${databaseName}:`, error);
  }
}

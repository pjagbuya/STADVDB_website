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

  // Set transaction isolation level for all nodes
  await centralNodeConnection.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');
  await node2Connection.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');
  await node3Connection.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');

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

describe('Case #2: At least one transaction in the three nodes is writing (update/delete) and the other concurrent transactions are reading the same data item', function () {
  it('should simulate a concurrent update in the central node while reading from node-2', async function () {
    // Start a read query from Node-2 (pre-2020 games) for app_id 1 (which exists in node-2)
    const [results2] = await node2Connection.query('SELECT * FROM game WHERE app_id = 1');
    console.log('Node-2 Results (before update):', results2);

    // Start a write query on Central Node (update game price for app_id 1, which exists in central node)
    const updateResult = await centralNodeConnection.query(
      'UPDATE game SET price = 34.99 WHERE app_id = 1'
    );
    console.log('Central Node Update Result:', updateResult);

    // Start a read query from Central Node (check if price is updated)
    const [results1] = await centralNodeConnection.query('SELECT * FROM game WHERE app_id = 1');
    console.log('Central Node Results (after update):', results1);

    // Ensure that both nodes initially read the same data
    expect(results1[0].app_id).to.equal(results2[0].app_id);
    expect(results1[0].name).to.equal(results2[0].name); // Assuming 'name' is a column in the 'game' table
    expect(results1[0].price).to.not.equal(results2[0].price); // Price should be updated in Central Node
  });

  it('should simulate a concurrent delete in node-3 while reading from central node', async function () {
    // Start a read query from Central Node (all data) for app_id 2 (which exists in central node)
    const [results1] = await centralNodeConnection.query('SELECT * FROM game WHERE app_id = 2');
    console.log('Central Node Results (before delete):', results1);

    // Start a delete query on Node-3 (delete game with app_id = 2, which exists in node-3)
    const deleteResult = await node3Connection.query('DELETE FROM game WHERE app_id = 2');
    console.log('Node-3 Delete Result:', deleteResult);

    // Start a read query from Node-3 (check if game is deleted)
    const [results3] = await node3Connection.query('SELECT * FROM game WHERE app_id = 2');
    console.log('Node-3 Results (after delete):', results3);

    // Ensure that the game is deleted from Node-3
    expect(results3.length).to.equal(0); // No rows should be returned after deletion

    // Ensure that the central node still has the game before deletion (i.e., the delete hasn't propagated yet)
    expect(results1[0].app_id).to.equal(2);
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

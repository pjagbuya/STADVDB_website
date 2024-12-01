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
    const [results3] = await node3Connection.query('SELECT * FROM game WHERE app_id = 4');
    console.log('Node-3 Results:', results3);

    // Start a query from Central Node (all data)
    const [results1] = await centralNodeConnection.query('SELECT * FROM game WHERE app_id = 4');
    console.log('Central Node Results:', results1);

    // Check if the app_id from both nodes are the same
    expect(results1[0].app_id).to.equal(results3[0].app_id);

    // Ensure that both nodes returned the same game name
    expect(results1[0].name).to.equal(results3[0].name); // Assuming 'name' is a column in the 'game' table
  });
});

describe('Case #2: Concurrent transactions in two or more nodes are writing (update/delete) the same data item', function () {
  it('should simulate concurrent updates on the same data item from central node and node-2', async function () {
    const appId = 1;

    // Start a query from Node-2 (pre-2020 games)
    const [results2Before] = await node2Connection.query('SELECT * FROM game WHERE app_id = ?', [appId]);
    console.log('Node-2 Before Update:', results2Before);

    // Start a query from Central Node (all data)
    const [results1Before] = await centralNodeConnection.query('SELECT * FROM game WHERE app_id = ?', [appId]);
    console.log('Central Node Before Update:', results1Before);

    // Start an update query on Central Node (Node-1) for app_id 1
    const centralNodeUpdatePromise = centralNodeConnection.query(
      'UPDATE game SET price = 60.99 WHERE app_id = ?',
      [appId]
    );

    // Start an update query on Node-2 for app_id 1
    const node2UpdatePromise = node2Connection.query(
      'UPDATE game SET price = 60.99 WHERE app_id = ?',
      [appId]
    );

    // Wait for both updates to complete
    await Promise.all([centralNodeUpdatePromise, node2UpdatePromise]);

    // Read the updated value from both nodes
    const [results2After] = await node2Connection.query('SELECT * FROM game WHERE app_id = ?', [appId]);
    console.log('Node-2 After Update:', results2After);

    const [results1After] = await centralNodeConnection.query('SELECT * FROM game WHERE app_id = ?', [appId]);
    console.log('Central Node After Update:', results1After);

    // Ensure that both nodes reflect the changes
    expect(results2After[0].price).to.not.equal(results2Before[0].price);
    expect(results1After[0].price).to.not.equal(results1Before[0].price);
  });

  it('should simulate concurrent deletes on the same data item from central node and node-3', async function () {
    const appId = 2;

    // Start a query from Node-3 (post-2020 games)
    const [results3Before] = await node3Connection.query('SELECT * FROM game WHERE app_id = ?', [appId]);
    console.log('Node-3 Before Delete:', results3Before);

    // Start a query from Central Node (Node-1)
    const [results1Before] = await centralNodeConnection.query('SELECT * FROM game WHERE app_id = ?', [appId]);
    console.log('Central Node Before Delete:', results1Before);

    // Start a delete query on Node-1 (Central Node)
    const centralNodeDeletePromise = centralNodeConnection.query(
      'DELETE FROM game WHERE app_id = ?',
      [appId]
    );

    // Start a delete query on Node-3
    const node3DeletePromise = node3Connection.query(
      'DELETE FROM game WHERE app_id = ?',
      [appId]
    );

    // Wait for both deletes to complete
    await Promise.all([centralNodeDeletePromise, node3DeletePromise]);

    // Read the deleted value from both nodes
    const [results3After] = await node3Connection.query('SELECT * FROM game WHERE app_id = ?', [appId]);
    console.log('Node-3 After Delete:', results3After);

    const [results1After] = await centralNodeConnection.query('SELECT * FROM game WHERE app_id = ?', [appId]);
    console.log('Central Node After Delete:', results1After);

    // Ensure that both nodes reflect the deletion
    expect(results3After.length).to.equal(0);
    expect(results1After.length).to.equal(0);
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

const mysql = require("mysql2");

/* Config follow mysql8-master container */
//create connection to a pool server
const pool = mysql.createPool({
  host: "localhost", // specify host without port
  port: 3307, // specify the port separately
  user: "thaonguyengdw",
  password: "thaonguyengdw",
  database: "shopDEV",
});

const batchSize = 1000000; //adjust the batch size
const totalSize = 10_000_000; // adjust the total size of the data
//10_000_000 = :::::::::TIMER:::::::::: 4:05.658 (m:ss.mmm)
let currentId = 1;

console.time(":::::::::TIMER:::::::::");
const insertBatch = async () => {
  const values = [];

  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name-${currentId}`;
    const age = currentId;
    const address = `address-${currentId}`;
    values.push([currentId, name, age, address]);
    currentId++;
  }

  if (!values.length) {
    console.timeEnd(":::::::::TIMER:::::::::");
    pool.end((err) => {
      if (err) {
        console.log(`error occurred while running batch`);
      } else {
        console.log(`Connection pool closed successfully`);
      }
    });
    return;
  }

  const sql = `INSERT INTO test_table( id, name, age, address) VALUES ?`;

  pool.query(sql, [values], async function (err, results) {
    if (err) {
      throw err;
    }
    console.log(`Inserted ${results.affectedRows} records`); //count the number of records inserted
    insertBatch();
  });
};

insertBatch().catch(console.error);
//perform a sample opeartion
/* pool.query('SELECT * from users ', function(err, results){
    if(err){
        throw err;
    }
    console.log('query result', results);

    //close the connection
    pool.end(function(err) {
        if (err) throw err;
        console.log('Connection closed');
    });
}) */

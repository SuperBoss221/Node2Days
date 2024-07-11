//const mysql = require("mysql2/promise");
const mysql = require("mysql2/promise");

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: atob("bG9jYWxob3N0"),
  user: "root",
  database: "member",
  waitForConnections: true,
  connectionLimit: 1000,
  maxIdle: 100, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// For pool initialization, see above
//const conn = await pool.getConnection();

module.exports = pool;

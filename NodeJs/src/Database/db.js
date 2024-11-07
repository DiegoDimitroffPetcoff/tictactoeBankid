require("dotenv").config(); // Cargar las variables de entorno
const mysql = require("mysql2"); // Cambia a mysql2

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function createUsersTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      personal_number VARCHAR(255) NOT NULL,
      order_ref VARCHAR(255) NOT NULL
    );
  `;

  return new Promise((resolve, reject) => {
    pool.query(createTableQuery, (err) => {
      if (err) {
        console.error("Error al crear la tabla users:", err);
        return reject(err);
      }
      resolve();
    });
  });
}

async function testConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error al conectar a la base de datos:", err);
        return reject(err);
      } else {
        connection.release();
        resolve();
      }
    });
  });
}

async function saveUserInfo(userInfo) {
  await createUsersTable();

  let { personalNumber, name, givenName, surname, orderRef } = userInfo;

  // Generar un valor predeterminado si personalNumber es null
  if (!personalNumber) {
    personalNumber = "no added"; // Genera un UUID como valor predeterminado
    console.log("personalNumber was null, generated default:", personalNumber);
  }

  const query = `
    INSERT INTO users (personal_number, order_ref)
    VALUES (?, ?);
  `;
  const values = [personalNumber, name, givenName, surname, orderRef];

  return new Promise((resolve, reject) => {
    pool.query(query, values, (err, results) => {
      if (err) {
        console.error("Error al guardar la información del usuario:", err);
        return reject(err);
      }
      console.log("Información del usuario guardada exitosamente:", results); // Log de éxito
      resolve(results);
    });
  });
}

// Exporta las funciones necesarias
module.exports = { saveUserInfo, testConnection };

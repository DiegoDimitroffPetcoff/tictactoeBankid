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
      personal_number VARCHAR(255) NOT NULL UNIQUE,
      order_ref VARCHAR(255) NOT NULL,
      login_count INT DEFAULT 0
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

  // Verificar si el usuario ya existe
  const checkUserQuery = `
    SELECT * FROM users WHERE personal_number = ?;
  `;
  
  const userExists = await new Promise((resolve, reject) => {
    pool.query(checkUserQuery, [personalNumber], (err, results) => {
      if (err) {
        console.error("Error al verificar la existencia del usuario:", err);
        return reject(err);
      }
      resolve(results.length > 0 ? results[0] : null);
    });
  });

  if (userExists) {
    // Si el usuario ya existe, incrementar el contador de logins
    const updateLoginCountQuery = `
      UPDATE users SET login_count = login_count + 1 WHERE personal_number = ?;
    `;
    await new Promise((resolve, reject) => {
      pool.query(updateLoginCountQuery, [personalNumber], (err) => {
        if (err) {
          console.error("Error al actualizar el contador de logins:", err);
          return reject(err);
        }
        console.log("Contador de logins actualizado para el usuario:", personalNumber);
        resolve();
      });
    });
  } else {
    // Si el usuario no existe, insertarlo
    const insertUserQuery = `
      INSERT INTO users (personal_number, order_ref, login_count)
      VALUES (?, ?, 1); // Inicializar el contador de logins en 1
    `;
    const values = [personalNumber, orderRef];

    return new Promise((resolve, reject) => {
      pool.query(insertUserQuery, values, (err, results) => {
        if (err) {
          console.error("Error al guardar la información del usuario:", err);
          return reject(err);
        }
        console.log("Información del usuario guardada exitosamente:", results); // Log de éxito
        resolve(results);
      });
    });
  }
}

// Exporta las funciones necesarias
module.exports = { saveUserInfo, testConnection };

import connection from './src/config/database';

async function checkDatabase() {
  console.log('--- Comprobando conexión a MySQL ---');
  try {
    const [rows]: any = await connection.promise().query('SHOW TABLES');
    console.log('Conexión exitosa.');
    console.log('Tablas encontradas:', rows.map((r: any) => Object.values(r)[0]));
    
    // Comprobar tabla PRODUCTS_SERVICES
    const [columns]: any = await connection.promise().query('DESCRIBE PRODUCTS_SERVICES');
    console.log('\nEstructura de PRODUCTS_SERVICES:');
    columns.forEach((col: any) => {
      console.log(`- ${col.Field} (${col.Type})`);
    });

  } catch (error: any) {
    console.error('ERROR conectando a la base de datos:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Parece que el servidor MySQL no está corriendo en localhost.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`La base de datos "${process.env.DB_NAME}" no existe.`);
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Usuario o contraseña incorrectos.');
    }
  } finally {
    process.exit();
  }
}

checkDatabase();

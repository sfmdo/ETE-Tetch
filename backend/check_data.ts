import connection from './src/config/database';

async function checkData() {
  try {
    const [rows]: any = await connection.promise().query('SELECT Name, Item_Type, Sale_Price, Final_Price FROM PRODUCTS_SERVICES');
    console.log('--- Datos en PRODUCTS_SERVICES ---');
    if (rows.length === 0) {
      console.log('La tabla está VACÍA.');
    } else {
      console.table(rows);
      const services = rows.filter((r: any) => r.Item_Type === 'SERVICE');
      const products = rows.filter((r: any) => r.Item_Type === 'PRODUCT');
      console.log(`Resumen: ${services.length} servicios, ${products.length} productos.`);
    }
  } catch (error: any) {
    console.error('Error:', error.message);
  } finally {
    process.exit();
  }
}

checkData();

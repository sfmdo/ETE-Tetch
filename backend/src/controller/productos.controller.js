const db = require('../config/db');

const getProducts = (req,res)=>{
    const sql = 'SELECT * FROM productos';
    db.query(sql,(error,results)=>{
        if(error){
            console.error('Error al obtener productos',error);
        }
        res.json(results);
    });
};
module.exports = {getProducts};
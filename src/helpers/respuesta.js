exports.enviar = (codigo, contenido, res) =>{
    res.statusCode = codigo;
    res.setHeader("Content-Type", "application/json");
    res.json(contenido);
}
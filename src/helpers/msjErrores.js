exports.lista = (errores) =>{
    ListaMsj=[];
    errores.errors.forEach(element => {
        
        ListaMsj.push({campo: element.path, msj: element.msg});
    });
    return ListaMsj;
}
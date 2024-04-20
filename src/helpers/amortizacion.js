const moment = require('moment');
exports.tablaAmortizacion = (datos) =>{
    Tabla=[];
    var fechaInicio = moment(datos.fechaInicio, "YYYY-MM-DD");
    var interes = datos.tasa==0? 0 : ((datos.tasa)/100)/datos.periodicidad;//tasa/((360*periodicidad)/365)
    var cuota = datos.tasa==0? datos.saldo/datos.plazo : datos.saldo/((1- Math.pow((1+interes),(-1*datos.plazo)))/interes)
    var saldocapital = datos.saldo
    for(n=1; n<=datos.plazo; n++){
        var interescuota= (saldocapital)*(((datos.tasa)/100)/datos.periodicidad)
        var amortizacioncapital = cuota-interescuota
        saldocapital=saldocapital-amortizacioncapital
        var contrato = 0;
        if(datos.contratoId){
            contrato= datos.contratoId;
        }
        Tabla.push({
            numero: n,
            fechapago: fechaInicio.add(1, "M").format("YYYY-MM-DD"),
            cuota: cuota.toFixed(2),
            amortizacioncapital: amortizacioncapital.toFixed(2),
            intereses: interescuota.toFixed(2),
            estado: 'PE',
            saldocapital: saldocapital.toFixed(2),
            contratoId: contrato
        });
    }
    return Tabla;
}

exports.calculoCuota = (datos) =>{
    var interes = datos.tasa==0? 0 : ((datos.tasa)/100)/datos.periodicidad//tasa/((360*periodicidad)/365)
    var cuota = datos.tasa==0? datos.saldo/datos.plazo : datos.saldo/((1- Math.pow((1+interes),(-1*datos.plazo)))/interes)
    return cuota.toFixed(2);
}

var express = require('express');
var app = express();

app.get('/', function (req, res) {
   
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'althusadmin@dbetv',
        password: 'Althus123',
        server: 'dbetv.database.windows.net', 
        database: 'H9J',
        options: {
            encrypt: true
          } 
    };

    sql.close();
    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query("SELECT DATEDIFF(HOUR, MAX(A.Data), GETDATE()) AS Diferenca  FROM Tb_Log A WHERE A.Data >= CONVERT(VARCHAR(10),GETDATE(),120) + ' 00:00:00'", function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            //res.send(recordset);
            if(recordset.recordset[0].Diferenca > 0)
                EnviarEmail();                
                
        });
    });
});

var server = app.listen(80, function () {
    //console.log('Server is running..');
});

function EnviarEmail(){
    
    var nodemailer = require('nodemailer');

    // O primeiro passo é configurar um transporte para este
    // e-mail, precisamos dizer qual servidor será o encarregado
    // por enviá-lo:

    //var transporte = nodemailer.createTransport({
    //service: 'Gmail', // Como mencionei, vamos usar o Gmail
    //auth: {
        //user: 'felipelima1987@gmail.com', // Basta dizer qual o nosso usuário
        //pass: 'Coloque aqui a senha'             // e a senha da nossa conta
    //} 
    //});

    var transporte = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: '465',//'587',
        secure: true,
        auth: {
          user: 'felipe.lima@althus.net',
          pass: '@lthus123'
        } 
      });

    // Após configurar o transporte chegou a hora de criar um e-mail
    // para enviarmos, para isso basta criar um objeto com algumas configurações
    var email = {
    from: 'felipelima1987@gmail.com', // Quem enviou este e-mail
    to: 'felipe.lima@althus.net', // Quem receberá
    subject: 'Problemas no serviço de integração H9J',  // Um assunto bacana :-) 
    html: 'Serviço parada há mais de uma hora!' // O conteúdo do e-mail
    };

    // Pronto, tudo em mãos, basta informar para o transporte
    // que desejamos enviar este e-mail
    transporte.sendMail(email, function(err, info){
    if(err)
        throw err; // Oops, algo de errado aconteceu.

    console.log('Email enviado! Leia as informações adicionais: ', info);
    });
}
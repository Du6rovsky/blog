var app, express, http, path, port, underscore, os;

underscore = require('underscore');
express = require('express'); 
http = require('http'); 
path = require('path');
os = require('os'); 
app = express();

rootDir = __dirname;
//Server port
port = 3000;

app.use(express.static(rootDir));
app.all('/*', function(req, res){
    //Build root dir
    return res.sendFile(path.join(rootDir, './build/index.html'));
}); 
http.Server(app).listen(port, function(){ 
    return console.log('Static server started');
});

//===================
console.log('Serving files from: ' + rootDir)
console.log('Listening on: ' + getAddresses() + ':' + port + '');
console.log('Press Ctrl + C to stop.');

function getAddresses(){
    var
        interfaces = os.networkInterfaces(),
        addresses = [];
     
    underscore.each(interfaces,function(net){
        underscore.each(net,function(address){
            if (address.family == 'IPv4' && !address.internal) addresses.push(address.address);
        })
    })
 
    return addresses;
};
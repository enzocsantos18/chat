const express = require('express')
const path = require("path")
const cors = require("cors")


const app = express()
app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req,res) =>{
  res.render('index.html');
})

let messages = []

io.on('connection', socket => { 
  console.log(`Socket conectado ${socket.id}`)


  socket.emit('previousMessages', messages)

  socket.on('sendMessage', data => {
    messages.push(data) 
    socket.broadcast.emit('receivedMessage', data)
    
  } 
 )

})


server.listen(3333, () => {
  console.log("Server rodando...")
})
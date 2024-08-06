const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3003;

app.use(bodyParser.json());

// Importar rotas
const indexRoutes = require('./routes/index');
const solanaRoutes = require('./routes/solana');

// Usar as rotas
app.use('/', indexRoutes);
app.use('/solana', solanaRoutes);

app.listen(port, () => {
    console.log(`Server is Running on PORT ${port}`);
});
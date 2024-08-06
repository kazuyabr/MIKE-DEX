const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('API Solana is Running');
});

module.exports = router;
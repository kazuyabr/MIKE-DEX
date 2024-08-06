const express = require('express');
const { Keypair, Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');

const router = express.Router();
const connection = new Connection(clusterApiUrl('devnet'),'confirmed');

// Gerar par de chaves
router.get('/generate-keypair', async (req, res) => {
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toString();
    const privateKey = JSON.stringify(Array.from(keypair.secretKey));

    const airdropSignature = await connection.requestAirdrop(
        keypair.publicKey,
        0.1*LAMPORTS_PER_SOL
    );

    await connection.confirmTransaction(airdropSignature);

    res.status(200).json({ publicKey, privateKey});
});

// Obter saldo
router.get('/balance/:address', async (req, res) => {
    try {
        const address = req.params.address;
        const publicKey = new PublicKey(address);
        const balance = await connection.getBalance(publicKey);
        res.status(200).json({ address, balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Enviar transação
router.post('/send-transaction', async (req, res) => {
    try {
        const { from, privateKey, to, amount } = req.body;
        const fromKeypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(privateKey)));
        const toPublicKey = new PublicKey(to);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromKeypair.publicKey,
                toPubkey: toPublicKey,
                lamports: amount * LAMPORTS_PER_SOL,
            })
        );

        // Assinar a transação
        const signature = await connection.sendTransaction(transaction, [fromKeypair]);
        await connection.confirmTransaction(signature);

        res.status(200).json({ signature });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

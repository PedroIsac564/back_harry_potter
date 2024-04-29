const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 8888;

const pool = new Pool
    ({
        user: 'postgres',
        host: 'localhost',
        database: 'backharrypotter',
        password: 'ds564',
        port: 7007,
    });



app.use(express.json());

app.get('/', (req, res) => {
    res.send('A rota está funcionando!');
});

//Bruxos 
app.get('/bruxos', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM bruxos');
        res.json({
            total: resultado.rowCount,
            bruxo: resultado.rows,
        })
    } catch (error) {
        console.error('Erro ao obter todos os bruxos', error);
        res.status(500).send('Erro ao obter os bruxos');
    }
});

app.post('/bruxos', async (req, res) => {
    try {
        const { nome, idade, casaHogwarts, habilidade, patrono, sangue } = req.body;


        if (idade < 11 || idade > 100) {
            return res.status(400).send('A idade deve estar entre 11 e 100 anos.');
        }

        let casasValidas = ['Grifinória', 'Sonserina', 'Corvinal', 'Lufa-Lufa'];
        if (!casasValidas.includes(casaHogwarts)) {
            return res.status(400).send('A casa de Hogwarts fornecida não é válida.');
        }

        let tiposSangueValidos = ['Puro', 'Mestiço', 'Trouxa'];
        if (!tiposSangueValidos.includes(sangue)) {
            return res.status(400).send('O tipo de sangue fornecido não é válido.');
        }

        await pool.query('INSERT INTO bruxos (nome, idade, casaHogwarts, habilidade, patrono, sangue) VALUES ($1, $2, $3, $4, $5, $6)',
            [nome, idade, casaHogwarts, habilidade, patrono, sangue]);

        res.status(201).send('Bruxo criado com sucesso!');
    } catch (error) {
        console.error('Erro ao criar o Bruxo', error);
        res.status(500).send('Erro ao criar o Bruxo');
    }
});



app.put('/bruxos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, idade, casaHogwarts, habilidade, patrono, sangue } = req.body;

        await pool.query('UPDATE bruxos SET nome = $1, idade = $2, casaHogwarts = $3, habilidade = $4, patrono = $5, sangue = $6 WHERE id = $7', [nome, idade, casaHogwarts, habilidade, patrono, sangue, id]);
        res.status(201).send({ mensagem: 'Bruxo atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar o Bruxo', error);
        res.status(500).send('Erro ao atualizar o Bruxo');
    }
});

app.delete('/bruxos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM bruxos WHERE id = $1', [id]);
        res.status(201).send({ mensagem: 'Bruxo excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir Bruxo:', error);
        res.status(500).send('Erro ao excluir Bruxo');
    }
});


app.get('/bruxos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query('SELECT * FROM bruxos WHERE id = $1', [id]);
        if (resultado.rowCount === 0) {
            return res.status(404).send('Bruxo não encontrado');
        } else {
            res.json({
                bruxo: resultado.rows[0],
            });
        }
    } catch (error) {
        console.error('Erro ao obter o Bruxo', error);
        res.status(500).send('Erro ao obter o Bruxo');
    }
});

//Varinhas
app.get('/varinhas', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM varinhas');
        res.json({
            total: resultado.rowCount,
            varinha: resultado.rows,
        })
    } catch (error) {
        console.error('Erro ao obter todos os varinhas', error);
        res.status(500).send('Erro ao obter os varinhas');
    }
});

app.post('/varinhas', async (req, res) => {
    try {
        const { material, comprimento, nucleo, dataFabricacao } = req.body;

        await pool.query('INSERT INTO varinhas (material, comprimento, nucleo, dataFabricacao) VALUES ($1, $2, $3, $4)',
            [material, comprimento, nucleo, dataFabricacao]);

        res.status(201).send('Varinha criado com sucesso!');
    } catch (error) {
        console.error('Erro ao criar o Varinha', error);
        res.status(500).send('Erro ao criar o Varinha');
    }
});

app.put('/varinhas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { material, comprimento, nucleo, dataFabricacao } = req.body;

        await pool.query('UPDATE varinhas SET material = $1, comprimento = $2, nucleo = $3, dataFabricacao = $4 WHERE id = $5', [material, comprimento, nucleo, dataFabricacao, id]);
        res.status(201).send({ mensagem: 'Varinhas atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar o Varinhas', error);
        res.status(500).send('Erro ao atualizar o Varinhas');
    }
});

app.delete('/varinhas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM varinhas WHERE id = $1', [id]);
        res.status(201).send({ mensagem: 'Varinha excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir Varinha:', error);
        res.status(500).send('Erro ao excluir Varinha');
    }
});

app.get('/varinhas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query('SELECT * FROM varinhas WHERE id = $1', [id]);
        if (resultado.rowCount === 0) {
            return res.status(404).send('Varinha não encontrado');
        } else {
            res.json({
                varinha: resultado.rows[0],
            });
        }
    } catch (error) {
        console.error('Erro ao obter o Varinha', error);
        res.status(500).send('Erro ao obter o Varinha');
    }
});

app.listen(PORT, () => {
    console.log(`Rodando perfeitamente na porta ${PORT} 🚀`);
});
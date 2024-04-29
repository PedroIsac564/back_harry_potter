const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 8888;

const pool = new Pool
    ({
        user: 'postgres',
        host: 'localhost',
        database: 'backexercicio',
        password: 'ds564',
        port: 7007,
    });



app.use(express.json());

app.get('/', (req, res) => {
    res.send('A rota está funcionando!');
});

function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    const dia = hoje.getDate() - nascimento.getDate();
    if (mes < 0 || (mes === 0 && dia < 0)) {
        idade--;
    }

    return idade;
};

function calcularSigno(mesNascimento, diaNascimento) {
    let signo = '';
    if ((mesNascimento == 1 && diaNascimento >= 20) || (mesNascimento == 2 && diaNascimento <= 18)) signo = 'Aquário';
    else if ((mesNascimento == 2 && diaNascimento >= 19) || (mesNascimento == 3 && diaNascimento <= 20)) signo = 'Peixes';
    else if ((mesNascimento == 3 && diaNascimento >= 21) || (mesNascimento == 4 && diaNascimento <= 19)) signo = 'Áries';
    else if ((mesNascimento == 4 && diaNascimento >= 20) || (mesNascimento == 5 && diaNascimento <= 20)) signo = 'Touro';
    else if ((mesNascimento == 5 && diaNascimento >= 21) || (mesNascimento == 6 && diaNascimento <= 20)) signo = 'Gêmeos';
    else if ((mesNascimento == 6 && diaNascimento >= 21) || (mesNascimento == 7 && diaNascimento <= 22)) signo = 'Câncer';
    else if ((mesNascimento == 7 && diaNascimento >= 23) || (mesNascimento == 8 && diaNascimento <= 22)) signo = 'Leão';
    else if ((mesNascimento == 8 && diaNascimento >= 23) || (mesNascimento == 9 && diaNascimento <= 22)) signo = 'Virgem';
    else if ((mesNascimento == 9 && diaNascimento >= 23) || (mesNascimento == 10 && diaNascimento <= 22)) signo = 'Libra';
    else if ((mesNascimento == 10 && diaNascimento >= 23) || (mesNascimento == 11 && diaNascimento <= 21)) signo = 'Escorpião';
    else if ((mesNascimento == 11 && diaNascimento >= 22) || (mesNascimento == 12 && diaNascimento <= 21)) signo = 'Sagitário';
    else signo = 'Capricórnio';

    return signo;
};

app.get('/usuarios', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM usuarios');
        res.json({
            total: resultado.rowCount,
            usuarios: resultado.rows,
        })
    } catch (error) {
        console.error('Erro ao obter todos os usuarios', error);
        res.status(500).send('Erro ao obter os usuarios');
    }
});

app.post('/usuarios', async (req, res) => {
    try {
        const { nome, sobrenome, datanascimento, email } = req.body;
        const dataNascimento = new Date(datanascimento);

        const idade = calcularIdade(dataNascimento);
        const signo = calcularSigno(dataNascimento.getMonth() + 1, dataNascimento.getDate());

        await pool.query('INSERT INTO usuarios (nome, sobrenome, datanascimento, email, idade, signo) VALUES ($1, $2, $3, $4, $5, $6)',
            [nome, sobrenome, dataNascimento, email, idade, signo]);

        res.status(201).send('Usuário criado com sucesso!');
    } catch (error) {
        console.error('Erro ao criar o usuário', error);
        res.status(500).send('Erro ao criar o usuário');
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        res.status(201).send({ mensagem: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).send('Erro ao excluir usuário');
    }
});

app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, sobrenome, datanascimento, email } = req.body;

        const novaDataNascimento = new Date(datanascimento);
        const idade = calcularIdade(novaDataNascimento);
        const signo = calcularSigno(novaDataNascimento.getMonth() + 1, novaDataNascimento.getDate());

        await pool.query('UPDATE usuarios SET nome = $1, email = $2, sobrenome = $3, datanascimento = $4, idade = $5, signo = $6 WHERE id = $7', [nome, email, sobrenome, novaDataNascimento, idade, signo, id]);
        res.status(201).send({ mensagem: 'Usuário atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar o usuário', error);
        res.status(500).send('Erro ao atualizar o usuário');
    }
});

app.get('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        if (resultado.rowCount === 0) {
            return res.status(404).send('Usuário não encontrado');
        } else {
            res.json({
                usuario: resultado.rows[0],
            });
        }
    } catch (error) {
        console.error('Erro ao obter o usuário', error);
        res.status(500).send('Erro ao obter o usuário');
    }
});

app.listen(PORT, () => {
    console.log(`Rodando perfeitamente na porta ${PORT} 🚀`);
});
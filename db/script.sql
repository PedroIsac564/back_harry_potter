CREATE DATABASE backdesafio;

CREATE TABLE bruxos (
id SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
idade INT NOT NULL,
casaHogwarts VARCHAR(100) NOT NULL,
habilidade VARCHAR(100) NOT NULL,
patrono VARCHAR(100)
);

CREATE TABLE varinhas (
id SERIAL PRIMARY KEY,
material VARCHAR(100) NOT NULL,
comprimento INT NOT NULL,
nucleo VARCHAR(100) NOT NULL,
dataFabricacao DATE NOT NULL
);

INSERT INTO bruxos (nome, idade, casaHogwarts, habilidade, patrono) VALUES ('Harry Potter', 20, 'Grifinória', 'Apanhador', 'Cervo');


INSERT INTO varinhas (material, comprimento, nucleo, dataFabricacao) VALUES ('Madeira', 30, 'Fenix', '2021/01/01'); -teste
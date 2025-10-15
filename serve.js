import { trace } from 'console'
import Fastify from 'fastify'
import pkg from 'pg'

const { Pool } = pkg

const pool = new Pool({
    user:'local',
    host:'localhost',
    database:'Receitas',
    password:'12345',
    port:'5432'
})

const server = Fastify()

server.get('/usuarios', async (req,reply) => {
    try{
        const resultado = await pool.query('SELECT * FROM usuarios')
        reply.status(200).send(resultado.rows)
    }catch(deuRuim){
        reply.status(500).send({ error: deuRuim.message })
    }
})

server.post('/usuarios',async (req,reply) =>{
    const { nome,senha,email,telefone} = req.body
    try{
        const resultado = await pool.query('INSERT INTO USUARIOS (nome, senha, email, telefone) VALUES ($1,$2,$3,$4) RETURNING * ',[nome, senha, email, telefone])
        reply.status(200).send(resultado.rows[0])
    }catch(e){
        reply.status(500).send({ error: e.message })
    }
})

server.get('/categoria', async (req,reply) => {
    try{
        const resultado = await pool.query('SELECT * FROM CATEGORIA')
        reply.status(200).send(resultado.rows)
    }catch(deuRuim){
        reply.status(500).send({ error: deuRuim.message })
    }
})

server.post('/categoria',async (req,reply) =>{
    const {nome} = req.body
    try{
        const resultado = await pool.query('INSERT INTO CATEGORIA (nome) VALUES ($1) RETURNING * ',[nome])
        reply.status(200).send(resultado.rows)
    }catch(e){
        reply.status(500).send({ error: e.message })
    }
})

server.listen({
    port: 3000,
    host: '0.0.0.0'
})


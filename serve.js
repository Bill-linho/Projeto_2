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

server.delete('/usuarios/:id', async (req,reply) =>{
    const id = req.params.id
    try{
        await pool.query('DELETE FROM USUARIOS WHERE id=$1',[id])
        reply.send({message:'Usuario foi F'})
    }catch(feio){
        reply.status(500).send({ error: feio.message })
    }
})

server.put('/usuarios/:id',async (req,reply) =>{
    const {nome,senha,email,telefone, ativo} = req.body
    const id = req.params.id
    try{
        const resultado = await pool.query('UPDATE USUARIOS SET NOME=$1, SENHA=$2, EMAIL=$3, TELEFONE=$4, ativo=$6 WHERE ID=$5 RETURNING *',
            [nome, senha, email, telefone, id, ativo])
        reply.status(200).send(resultado.rows)
    }catch(e){
        reply.status(500).send({ error: e.message })
    }
})

server.put('/categoria/:id',async (req,reply) =>{
    const {nome} = req.body
    const id = req.params.id
    try{
        const resultado = await pool.query('UPDATE CATEGORIA SET NOME=$1 WHERE ID=$2 RETURNING *',
            [nome, id])
        reply.status(200).send(resultado.rows)
    }catch(e){
        reply.status(500).send({ error: e.message })
    }
})

server.get('/receitas',async (req, reply) =>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.page) || 10;
    const offset =(page - 1) * limit;

    const allowedOrder = ['id','name']
    const sort = allowedOrder.includes(req.query.sort) ? req.query.sort : 'id'
    const order = req.query.order === 'desc' ? 'DESC' : "ASC"

    try{
        const resultado = await pool.query(`SELECT * FROM RECEITAS ORDER BY ${sort} ${order} LIMIT ${limit} OFFSET ${offset}`)
        reply.send(resultado.rows)
    }catch(pao){
        reply.status(500).send({ error: pao.message})
    }
})

server.listen({
    port: 3000,
    host: '0.0.0.0'
})


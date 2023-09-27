const express = require('express')      // import express package
const morgan = require('morgan')
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const uuid = require('uuid')
const db = require('./db')

// create express app
const app = express()

const PORT = process.env.PORT || 3000

//  // middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())

app.use(cors({
    origin: ["http://127.0.0.1:5500"],
    credentials: true
}))

app.use((req, res, next) => {
    console.log('Entered')

    next()
})



app.post('/contact_us', (req, res) => {
    const { first_name, last_name, email, body } = req.body

    try {
        if (!first_name) throw Error('Insert your first name')
        res.status(200).json({ message: `Your request has been recorded. We will get back to you soon!` })
    } catch (error) {
        res.status(400).json({ erorr: error.message })
    }
})


app.get('/getUser/:id', (req, res) => {

    const { id } = req.params

    try {
        res.status(200).json({ message: id })
    } catch (error) {
        res.status(400).json({ erorr: error.message })
    }
})

app.post('/addItem', async (req, res) => {
    const { name, description, price } = req.body

    try {

        if (!name) throw Error('Insert product name')
        if (!description) throw Error('Insert product description')
        if (!price) throw Error('Insert product price')

        const id = uuid.v4()        // generate id

        //  create sql statement
        let sql = `INSERT INTO stock(
            id, name, description, price
            ) VALUES(
                '${id}', '${name}', '${description}', '${price}'
                )`


        await db.execute(sql)   // execute sql statement

        res.status(200).json({ message: 'Product Added Successfully' })
    } catch (error) {
        res.status(400).json({ erorr: error.message })
    }
})

app.get('/getAllItems', async (req, res) => {
    try {
        let sql = 'SELECT * FROM stock'

        const [items] = await db.execute(sql)   // execute sql statement

        res.status(200).json({ items })
    } catch (error) {
        res.status(400).json({ erorr: error.message })
    }
})

app.get('/getAllItem/:id', async (req, res) => {

    const { id } = req.params

    try {
        let sql = `SELECT * FROM stock WHERE id = '${id}'`

        const [item] = await db.execute(sql)   // execute sql statement

        res.status(200).json({ item })
    } catch (error) {
        res.status(400).json({ erorr: error.message })
    }
})

app.patch('/updateItem', async (req, res) => {
    const { id, name } = req.body

    try {
        if (!id) throw Error('Insert product id')
        if (!name) throw Error('Insert product name')

        let exitsSql = `SELECT * FROM stock WHERE id = '${id}'`

        const [item] = await db.execute(exitsSql)

        if (!item[0]) throw Error('Product does not exist')

        let updateSql = `UPDATE stock SET name = '${name}' WHERE id='${id}'`

        await db.execute(updateSql)

        res.status(200).json({ message: 'Product Updated Successfully' })

    } catch (error) {
        res.status(400).json({ erorr: error.message })
    }
})

app.put('/updateItem', async (req, res) => {
    const { id, name, description, price } = req.body

    try {
        if (!id) throw Error('Insert product id')
        if (!name) throw Error('Insert product name')
        if (!description) throw Error('Insert product description')
        if (!price) throw Error('Insert product price')

        let exitsSql = `SELECT * FROM stock WHERE id = '${id}'`

        const [item] = await db.execute(exitsSql)

        if (!item[0]) throw Error('Product does not exist')

        let updateSql = `UPDATE stock SET name = '${name}', 
                        description  ='${description}',
                        price = '${price}'  WHERE id='${id}'`

        await db.execute(updateSql)

        res.status(200).json({ message: 'Product Updated Successfully' })

    } catch (error) {
        res.status(400).json({ erorr: error.message })
    }
})

app.delete('/deleteItem/:id', async (req, res) => {
    const { id } = req.params

    try {

        let exitsSql = `SELECT * FROM stock WHERE id = '${id}'`

        const [item] = await db.execute(exitsSql)

        if (!item[0]) throw Error('Product does not exist')

        let updateSql = `DELETE FROM stock WHERE id='${id}'`

        await db.execute(updateSql)

        res.status(200).json({ message: 'Product Deleted Successfully' })

    } catch (error) {
        res.status(400).json({ erorr: error.message })
    }
})


app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})
const express = require('express');
const fs = require("fs");
const { isNull } = require('util');

const app = express();
const PORT = 3000;

app.use(express.json());
let persons = JSON.parse(fs.readFileSync(`${__dirname}/person.json`))

app.get('/', (req, res) => {
    res.send('Hello FSW 3 yang luar biasa dari server nih !');
})

app.post('/', (req, res) => {
    res.send('Kita bisa ngelakuin Post di url ini');
})

app.get('/person', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            persons: persons
        }
    })
})

app.get('/person/:id', (req, res) => {

    const person = persons.findIndex((x) => x.id === parseInt(req.params.id))
    if (person === -1) {
        return res.status(400).json({
            status: 'failed',
            message: `person dengan id ${req.body.id} tersebut invalid`
        })

    }
    res.status(200).json({
        status: 'success',
        data: persons[person]
    })
})


app.put('/person/:id', (req, res) => {
    const id = req.params.id * 1;
    const person = persons.findIndex(el => el.id === id);

    if (person === -1) {
        return res.status(400).json({
            status: 'failed',
            message: `person dengan id ${req.body.id} tersebut invalid`
        })

    }

    const data = {
        id: id,
        name: req.body.name,
        age: req.body.age,
        eyeColor: req.body.eyeColor,
    }

    const personName = persons.findIndex(el => el.name === req.body.name);
    const checkid = persons.findIndex((e) => e.id == req.params.id);
    const cukupUmur = 20 > parseInt(req.body.age)
    const checkRequired = (req.body.age && req.body.name && req.body.eyeColor ? true : false)



    if (!checkRequired) {
        return res.status(400).json({
            status: 'failed',
            message: `Data tidak lengkap silahkan isi terlebih dahulu`
        })
    } else if (personName !== -1 && personName !== checkid) {
        return res.status(400).json({
            status: 'failed',
            message: `name ${req.body.name} ${id} ${personName} sudah dipakai silahkan coba`
        })
    } else if (cukupUmur) {
        return res.status(400).json({
            status: 'failed',
            message: `umur ${req.body.age} belum cukup`
        })
    } else {
        persons.splice(person, 1, data)

        fs.writeFile(
            `${__dirname}/person.json`,
            JSON.stringify(persons),
            errr => {
                res.status(200).json({
                    status: 'success',
                    message: `data dari id ${id} nya berhasil diupdate`,
                    data: data
                })
            }
        )
    }


})


app.delete('/person/:id', (req, res) => {
    const id = req.params.id * 1;
    const person = persons.findIndex(element => element.id === id);

    if (person === -1) {
        return res.status(400).json({
            status: 'failed',
            message: `person dengan id ${req.body.id} tersebut invalid`
        })

    }

    persons.splice(person, 1);
    fs.writeFile(
        `${__dirname}/person.json`,
        JSON.stringify(persons),
        errr => {
            res.status(200).json({
                status: 'success',
                message: `data dari id ${id} nya berhasil dihapus`
            })
        }
    )
})

app.post('/person', (req, res) => {

    const newPerson = Object.assign({
        id: persons.length + 1,
        name: req.body.name,
        age: req.body.age,
        eyeColor: req.body.eyeColor,
    })

    const personName = persons.findIndex(el => el.name === req.body.name);
    const cukupUmur = 20 > parseInt(req.body.age)
    const checkRequired = (req.body.age && req.body.name && req.body.eyeColor ? true : false)



    if (!checkRequired) {
        return res.status(400).json({
            status: 'failed',
            message: `Data tidak lengkap silahkan isi terlebih dahulu`
        })
    } else if (personName !== -1) {
        return res.status(400).json({
            status: 'failed',
            message: `name ${req.body.name} sudah dipakai silahkan coba lagi`
        })
    } else if (cukupUmur) {
        return res.status(400).json({
            status: 'failed',
            message: `umur ${req.body.age} belum cukup`
        })
    } else {
        persons.push(newPerson);
        fs.writeFile(
            `${__dirname}/person.json`,
            JSON.stringify(persons),
            errr => {
                res.status(201).json({
                    status: 'success',
                    data: {
                        person: newPerson
                    }
                })
            }
        )
    }
})


app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`)
})
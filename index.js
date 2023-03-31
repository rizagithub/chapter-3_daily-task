// Live Coding & Daily Task Chapter 3

// import package yang mau kita pakai di aplikasi kita
const express = require('express');
const fs=require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());
// proses baca file json dengan fs modul, dan json dibaca dg json pars
const persons = JSON.parse(fs.readFileSync(`${__dirname}/person.json`))

// url utama dari aplikasi kita
// req=request, res=respon adalah http method
app.get('/',(req,res)=>{
    res.send('Hello FSW3 dari server nih bruhh');
})

app.post('/',(req, res)=>{
    res.send('Kita bisa ngelakuin post di url ini');
})

// get all data person
app.get('/person', (req, res) => {
    res.status(200).json({
        status: 'succes',
        data: 
            {
                 persons: persons
            }
    })
})

// get person by id (data satuan)
app.get('/person/:id', (req, res) => {
    // console.log(req.params);
    const id =req.params.id * 1;
    // menggunakan array method
    const person = persons.find(el=> el.id === id);
    // console.log(person)

    if (!person) {
        res.status(400).json({
            status: 'failed',
            message: `person dengan id ${id} tersebut invalid/tidak ada`
        })
    } else{ 
        res.status(200).json({
        status: 'succes',
        data: 
            {
                 person
            }
    })
}})

// membuat data baru dengan post
app.post('/person', (req, res) => {

    console.log(persons.length - 1)
    const newId = persons.length - 1 + 10;
    const newPerson = Object.assign({ id: newId }, req.body)

    // validasi kalau name nya udh ada, maka gk bisa create data baru
    const personName = persons.find(el => el.name === req.body.name);
    console.log(personName)

    const cukupUmur = req.body.age < 17
    const panjangNama = req.body.name.length < 5

    if (panjangNama) {
        res.status(400).json({
            status: 'failed',
            message: `karakter huruf ${req.body.name} kurang dari 5`
        })
    } else if (personName) {
        res.status(400).json({
            status: 'failed',
            message: `name ${req.body.name} already exist`
        })
    } else if (cukupUmur) {
        res.status(400).json({
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

// HTTP Method PUT = edit existing data
// app.put('/person/:id', (req, res) => {
//     const id = req.params.id * 1;
//     const personIndex = persons.findIndex(el => el.id === id);
  
//     if (personIndex !== -1) {
//         // fs readfile agar data json di kita juga terbaca
//         fs.writeFile(
//             `${__dirname}/person.json`,
//             JSON.stringify(persons),
//             errr => {
//                 const cukupUmur = req.body.age < 17
//                 if(cukupUmur){
//                     res.status(400).json({
//                         status: 'failed',
//                         message: `umur ${req.body.age} belum cukup`
//                     })
//                 } else{
//                     res.status(200).json({
//                     status: "success",
//                     message: `data dari id ${id} berhasil berubah`,
//                     data: persons[personIndex]
//                 })}
//             })
//     } else {
//         res.status(404).json({
//         status: 'fail',
//         message: `Data dengan id ${id} tidak ditemukan`
//       });
//     }
// });
app.put('/person/:id', (req, res) => {
    const id = req.params.id * 1;
    const personIndex = persons.findIndex(el => el.id === id);
    const cukupUmur = req.body.age < 17
  
    if (personIndex !== -1) {
      persons[personIndex] = { ...persons[personIndex], ...req.body };
      fs.writeFile(
        `${__dirname}/person.json`,
        JSON.stringify(persons),
        errr => {
            // validasi jika ingin mengubah data, umur harus lebih dari 17
            if (cukupUmur) {
                res.status(400).json({
                    status: 'failed',
                    message: `umur ${req.body.age} belum cukup`
                })
            } else {
                res.status(200).json({
                    status: 'success',
                    message: `data dari id ${id} nya berhasil diubah`,
                    data: persons[personIndex]
                });
            }    
        })
    } else {
      res.status(404).json({
        status: 'fail',
        message: `Data dengan id ${id} tidak ditemukan`
      });
    }
  });


// HTTP Delete existing data : menghapus data yang ingin dihapus
app.delete('/person/:id', (req, res) => {
    const id = req.params.id * 1;

    const index = persons.findIndex(element => element.id === id);
    const person = persons.find(el => el.id === id);

    if (!person) {
        res.status(400).json({
            status: 'failed',
            message: `person dengan id ${id} tersebut invalid/tidak ada`
        })
    } 

    if (index !== -1) {
        persons.splice(index, 1);
    }

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


// listen adalah package dr node js nya untuk memulai server
app.listen(PORT, () =>{
    console.log(`App running in localhost ${PORT}`)
})
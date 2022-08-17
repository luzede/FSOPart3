const express = require('express');
const morgan = require('morgan')
const app = express();

morgan.token('body', function (req, res) {
    return JSON.stringify(req.body); 
})

app.use(express.static('build'))
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const dataObject = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

//Welcome
app.get('/', (req, res) => {
    res.send('<h1>Sneaking around to find data, are not we?</h1>');
});

//Get info
app.get('/info', (req, res) => {
    const date = new Date();
    res.send(`<p>Phonebook has info for ${dataObject.length} people</p><p>${date}</p>`);
});

//Get all
app.get('/api/persons', (req, res) => {
    res.json(dataObject);
});

//Get one
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = dataObject.find(person => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
})

//Delete
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = dataObject.findIndex(person => person.id === id);
    if (index !== -1) {
        dataObject.splice(index, 1);
        return res.status(204).end();
    }
    res.status(404).end();
})

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if(!body.name || !body.number) {
        return res.status(400).json({ error: "missing content"})
    }
    else if (dataObject.some(person => person.name === body.name)) {
        return res.status(400).json({ error: "name must be unique"})
    }

    const person = {
        id: Math.floor(Math.random() * 5000000),
        number: body.number,
        name: body.name,
    }
    dataObject.push(person);
    res.json(person);

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {console.log('Server running on port ', PORT)});
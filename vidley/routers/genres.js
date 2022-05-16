const express = require('express')

const router = express.Router();
router.use(express.json())
const genres = [
    {id:1, name: "action"},
    {id:2, name:"comedy"},
    {id:3, name:"fantasy"}
]


router.get('/', (req,res) => {
   res.send(genres)
})

router.post('/', (req,res) => {
    const genre = [{
        id: genres.length + 1,
        name: req.body.name   
    }]
        
    genres.push(genre)
    res.send(genre)
    
})

router.put('/:id', (req,res) => {
    const genre = genres.find(c => c.id===parseInt(req.params.id))
    if(!genres) return res.send('genres not found')

    if(!genre.name == req.body.name && genre.name < 3)
    res.send('check again')
    
    genre.name == req.body.name
    res.send(genre)
})

module.exports = router;
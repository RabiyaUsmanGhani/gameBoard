const express = require('express')
const scoreController = require('../controllers/Scores')
const router = express.Router()

router.get('/allScores', scoreController.getScores)
router.post('/addScore', scoreController.addScore)

module.exports = router 

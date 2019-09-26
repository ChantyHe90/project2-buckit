var express = require('express');
var router = express.Router();

const User = require('../models/user')
const Experience = require('../models/experience')
const Location = require('../models/location')

//middleware
const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET profile page. */
router.get('/', function (req, res, next) {
  Promise.all([User.find(), Experience.find(), Location.find()]).then(([users, experiences, locations]) => {
    res.render('profile/index', { user: users[0], experiences, locations });
  })
})

// GET /experiences/add
router.get('/add-experience', isAuthenticated, function (req, res, next) { //isAuthenticated?
  res.render('experiences/add-experience')
});

// POST /experiences/add
router.post('/', isAuthenticated, function (req, res, next) {
  let { title, plan, comments, locations } = req.body;
  Experience.create({ title, plan, comments, locations, owner: req.user })
    .then(() => {
      res.redirect('/profile');
    })
})

//GET /:id/edit 

router.get('/:experience_id/edit-experience', (req, res, next) => {
  Experience.findById(req.params.experience_id).then((result) => {
    console.log("result", result)
    res.render('experiences/edit-experience', result);
  })
});

//POST /:id/ 

router.post('/:experience_id', (req, res, next) => {
  const { title, plan, comments, locations } = req.body;
  Experience.update(
    { _id: req.params.experience_id },
    { title, plan, comments, locations }).then(() => {
      res.redirect('/profile')
    })
});

module.exports = router;
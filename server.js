require('dotenv').config();
const express = require('express');
const app = express();
const expressSession = require('express-session')
const mongoose = require('mongoose');
const Role = require('./models/Role');
const Community = require('./models/Community');
const Member = require('./models/Member');
const postRolecontroller = require('./controllers/postRole');
const storeUserController = require('./controllers/storeUser');
const loginUserController = require('./controllers/loginUser');
const getUserController = require('./controllers/getUser');
const getCommunityController = require('./controllers/getCommunity');
const authMiddleware = require('./middleware/authMiddleware');
const postMemberController = require('./controllers/postMember');
const deleteMemberController = require('./controllers/deleteMember');
global.loggedIn = null;
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to database'));
app.use(expressSession({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))
app.use(express.json());


app.listen(3000, () => console.log('Server started'));
app.use('*',(req,res, next)=> {
    loggedIn = req.session.userId;
    next()
});

function paginatedResults(model) {
    return async (req, res, next) => {
      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)
      const communityName = req.params.id;
        console.log(communityName);
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      const results = {}
      results.total =   await model.countDocuments().exec()
      results.pages = await model.countDocuments().exec() / limit
      if (endIndex < await model.countDocuments().exec()) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
      
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      if (model == Role) {
      try {
        results.results = await model.find().limit(limit).skip(startIndex).exec()
        res.paginatedResults = results
        next()
      } catch (e) {
        res.status(500).json({ message: e.message })
      }}
      if (model == Community) {
        try {
            results.results = await model.find().populate('owner','name _id').limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            next()
          } catch (e) {
            res.status(500).json({ message: e.message })
          }
      }
      if (model == Member) {
        try {
            const comm = await Community.find({name: `westworld`}).limit(1).exec();
            results.results = await model.find({community: comm[0]._id}).populate('user','name _id').populate('role','name _id').limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            next()
          } catch (e) {
            res.status(500).json({ message: e.message })
          }
      }
    }
  }
  function paginatedResults3(model) {
    return async (req, res, next) => {
      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)
      const communityName = req.params.id;
        console.log(communityName);
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      const results = {}
      results.total =   await model.countDocuments().exec()
      results.pages = await model.countDocuments().exec() / limit
      if (endIndex < await model.countDocuments().exec()) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
      
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
     
      if (model == Community) {
        try {
            results.results = await model.find({owner: req.session.userId}).limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            next()
          } catch (e) {
            res.status(500).json({ message: e.message })
          }
      }
     
    }
  }

  function paginatedResults2(model) {
    return async (req, res, next) => {
      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      
  
      const results = {}
      results.total =   await model.countDocuments().exec()
      results.pages = await model.countDocuments().exec() / limit
      if (endIndex < await model.countDocuments().exec()) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
      
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      const doc = await Member.find({user: req.session.userId}).exec();
      var doc2 = [];
      for (let i =0; i< doc.length; i++) {
            doc2.push(doc[i].community);
      }
     
      if (model == Community) {
        let doc3 = [];
        try {
            for (let i = 0; i < doc2.length; i++) {
                let doc4 = await model.findById(doc2[i]).limit(limit).skip(startIndex).exec();
                for(let j = 0; j < doc4.length; j++) {
                doc3.push(doc4[j]);}
            }
            results.results = doc3;
            res.paginatedResults = results
            next()
          } catch (e) {
            res.status(500).json({ message: e.message })
          }
      }
     
    }
  }
// Role routes
app.get('/v1/role',paginatedResults(Role), (req, res) => {
    res.json(res.paginatedResults)
  } )
app.post('/v1/role',postRolecontroller)
//User routes
app.post('/v1/auth/signup',storeUserController)
app.post('/v1/auth/signin',loginUserController)
app.get('/v1/auth/me',getUserController)

//community routes
app.post('/v1/community',getCommunityController)
app.get('/v1/community',authMiddleware,paginatedResults(Community),(req, res) => {
    res.json(res.paginatedResults)
  })
app.get('/v1/community/:id/members',authMiddleware,paginatedResults(Member),(req, res) => {
    res.json(res.paginatedResults)
  })
app.get('/v1/community/me/owner',authMiddleware,paginatedResults3(Community),(req, res) => {
    res.json(res.paginatedResults)
  })
app.get('/v1/community/me/member',authMiddleware,paginatedResults2(Community),(req, res) => {
    res.json(res.paginatedResults)
  })

//member routes
app.post('/v1/member',authMiddleware,postMemberController)
app.delete('/v1/member/:id',authMiddleware,deleteMemberController)

  
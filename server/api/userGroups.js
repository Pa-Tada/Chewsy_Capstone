const router = require('express').Router()

const UserGroups = require("../db/models/UserGroups");

//get all user groups

router.get('/', async(req,res,next)=>{
  try{
    const userGroups = await UserGroups.findAll()
    res.json(userGroups)
  }catch(error){
    next(error)
  }
})

module.exports = router

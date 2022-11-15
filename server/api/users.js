const router = require('express').Router()

// const {
// 	models: { User },
// } = require('../db');
const User = require('../db/models/User')

//get all users /api/users
router.get('/', async(req,res,next)=>{
  try{

    const users = await User.findAll()
    res.json(users)
    //will implement security soon
  }catch(error){
    next(error)
  }
})

// get user by id
router.get("/:id", async(req,res,next)=>{
  try{
    const user = await User.findByPk(req.params.id);
    res.json(user)
  }catch(error){
    next(error)
  }
})

// create users
router.post('/', async (req, res, next) => {
	try {
		const user = await User.create(req.body);
		res.json(user);
	} catch (err) {
		next(err);
	}
});

// api/users/edit - edit user
router.put('/:id', async (req, res, next) => {
	try {
		const user = await User.findByPk(req.params.id);
		await user.update(req.body);
		res.json(user);
	} catch (error) {
		next(error);
	}
});

// delete user by id
router.delete('/:id', async (req, res, next) => {
	try {
		const user = await User.findByPk(req.params.id, {
			attributes: ['id', 'username'],
		});
		await user.destroy();
		res.send(user);
	} catch (error) {
		next(error);
	}
});

module.exports = router;

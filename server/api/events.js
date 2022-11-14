const router = require('express').Router()

const Event = require('../db/models/Event');

// get all events
router.get('/', async(req,res,next)=>{
  try{

    const events = await Event.findAll()
    res.json(events)
  }catch(error){
    next(error)
  }
})

// get event by id
router.get("/:id", async(req,res,next)=>{
  try{
    const event = await Event.findByPk(req.params.id);
    res.json(event)
  }catch(error){
    next(error)
  }
})

//create event
router.post('/', async (req, res, next) => {
	try {
		const event = await Event.create(req.body);
		res.json(event);
	} catch (err) {
		next(err);
	}
});

//update event
router.put('/:id', async (req, res, next) => {
	try {
		const event = await Event.findByPk(req.params.id);
		await event.update(req.body);
		res.json(event);
	} catch (error) {
		next(error);
	}
});

// delete event by id
router.delete('/:id', async (req, res, next) => {
	try {
		const event = await Event.findByPk(req.params.id, {
			attributes: ['id'],
		});
		await event.destroy();
		res.send(user);
	} catch (error) {
		next(error);
	}
});

module.exports = router

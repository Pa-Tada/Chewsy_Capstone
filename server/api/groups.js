const router = require("express").Router();

const Group = require("../db/models/Group");

//get all groups
router.get("/", async (req, res, next) => {
  try {
    const users = await Group.findAll();
    console.log(users);
    res.json(users);
    //will implement security soon
  } catch (error) {
    next(error);
  }
});

// get single group
router.get("/:id", async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id);
    res.json(group);
  } catch (error) {
    next(error);
  }
});

// create group
router.post('/', async (req, res, next) => {
	try {
		const group = await Group.create(req.body);
		res.json(group);
	} catch (err) {
		next(err);
	}
});

// delete group by id
router.delete('/:id', async (req, res, next) => {
	try {
		const group = await Group.findByPk(req.params.id, {
			attributes: ['id'],
		});
		await group.destroy();
		res.send(group);
	} catch (error) {
		next(error);
	}
});

module.exports = router;

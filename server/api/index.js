const router = require("express").Router()

router.use("/users", require("./users"))
router.use("/groups", require("./groups"))
router.use("/events", require("./events"))
router.use("/userGroups", require("./userGroups"))



router.use((req,res,next)=>{
  const error = new Error("Not Found");
  error.status = 404
  next(error)
})

module.exports = router

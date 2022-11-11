const { Router } = require(`express`);
const { User } = require("../models/User");
const { Show } = require(`../models/Show`);

const userRouter = Router();

//testing only - post
userRouter.post(`/`, async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).send({newUser})
  } catch (error) {
    res.status(400).send(error)
  }
});
//--------------------------
// GET all users from db with endpoint 'users'
userRouter.get(`/`, async (req, res) => {
  const users = await User.findAll();

  // if (!req.body.users) {
  //   return res.status(204).send(users); //no content
  // }
  res.status(200).send(users);
});

// GET one user from db using an endpoint e.g. /users/1 returns first user
userRouter.get(`/:uId`, async (req, res) => {
  const uId = await User.findByPk(req.params.uId);
  res.status(200).send({"The server has returned the following user ":uId});
});

// GET all shows watched by user using endpoint e.g. /users/2/shows returns all shows for second user
//One-to-many

//Show.belongsTo(User)
//User.hasMany(Show)

//setting user id on the foreign column of shows in the db
userRouter.get(`/:uId/shows`, async (req, res) => {
  const uId = req.params.uId
  const user = await User.findByPk(uId)
  if (!user) {
    return res.status(404).send(`Failed to find user ${uId}`)
  }
  const userShows = await user.getShows()
  res.status(200).send(userShows);
});

// // PUT (update and add) show if user has watched it e.g. PUT /users/2/shows/9 updates 9th show for second user

//this has to work for one above to work

//http://localhost:3000/users/1/shows/1 . --adding first user to first show
userRouter.put(`/:uId/shows/:sId`, async (req, res) => {
  //only using this for string interpolation pruposes
  const userName = await User.findByPk(req.params.uId)
  const show = await Show.findByPk(req.params.sId);
  await show.update({ userId: req.params.uId });
  res.status(200).send(`${show.title} has been added to the client with the 
  email: ${userName.username}
  id: ${req.params.uId}.`);

});

module.exports = userRouter;

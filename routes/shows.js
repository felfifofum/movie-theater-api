const { Router } = require("express");
const { Show } = require(`../models/Show`);
const { body, validationResult } = require("express-validator");

const showRouter = Router();

//testing only - POST
showRouter.post(`/`, async (req, res) => {
  try {
    const newShow = await Show.create(req.body);
    res.status(201).send({ newShow });
  } catch (error) {
    res.status(400).send(error);
  }
});
//--------------------------

// GET all shows from db using endpoint /shows
showRouter.get(`/`, async (req, res) => {
  const shows = await Show.findAll();
  res.status(200).send(shows);
});

// GET one show from the database using endpoint e.g. /shows/genres/Comedy returns all shows with genre Comedy
showRouter.get(`/genres/:uGenre`, async (req, res) => {
  // try {
  //   const show = await Show.findAll({
  //     where: { genre: req.params.uGenre },
  //   });
  //   res.status(200).send(`shows containg the genre ${req.params.uGenre} is being returned :)`);

  //   //catch only happens if soemthing breaks-do it if u want shows from a user
  // } catch (error) {
  //   res.status(404).send(`${show} not found.`)
  // }
  const show = await Show.findAll({
    where: { genre: req.params.uGenre },
  });

  if (show.length === 0) {
    res.status(404).send(`${req.params.uGenre} not found.`);
  } else {
    res.status(200).send(
      `shows containg the genre ${
        req.params.uGenre
      } is being returned :) , ${JSON.stringify(show, null, 2)}` //spaces for each new line
    );
  }
});













// PUT (update) rating on specific show using endpoint e.g. PUT request to /shows/4/watched updates fourth show that's been watched - 4th show in list
showRouter.put(
  `/:num/watched`,

  //validation: rating field cant be empty or contain white spaces
  body(`rating`)
    .notEmpty()
    .withMessage(`cant be blank`),
  async (req, res) => {
    const num = req.params.num;
    /**
   * in PUT body thunder
   * {
  "rating":"test20"
  }
   */
    const errors = validationResult(req);
    //check for blank scpec - custom
    const containsSpace = /\s/.test(req.body.rating)
    if (!errors.isEmpty() || containsSpace) {
      return res.status(400).send({ errors: errors.array() });
    }

    const show = await Show.findByPk(num);
    await show.update({ rating: req.body.rating });
    res.status(200).send(show.rating);
  }
);














// PUT (update) status on a specific show from 'cancelled' to 'on-going' or vice-versa using endpoint e.g. PUT req w endpoint /shows/3/updates updates 3rd show to 'cancelled' or 'ongoing'
showRouter.put(
  `/:sId/:status`,
  //validation: status field cant be empty or contain whitespace and between 5 and 25 characters

  //originally tried .includes(' ') - stackOverflow
  body(`status`)
    .notEmpty()
    .withMessage(`cant be blank`)
    .isLength({ min: 5, max: 25 })
    .withMessage(`letters have to be between 5 and 25`)
    .custom(`value=> !/\s/.test(value)`)
    .withMessage(`Cant ocntain blank spaces`),
  async (req, res) => {
    const show = await Show.findByPk(req.params.sId);

    // needs return if its not the last step - return statemnt showa that its the end
    if (req.params.status === `canceled` || req.params.status === `on-going`) {
      await show.update({ status: req.params.status });

      return res
        .status(200)
        .send(`${show.title}'s status has been changed to ${show.status}.`);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
    }
  }
);

// DELETE a show
showRouter.delete(`/:sId`, async (req, res) => {
  const sId = req.params.sId;
  const show = await Show.findByPk(sId);
  await show.destroy();
  res.sendStatus(200);
});

module.exports = showRouter;

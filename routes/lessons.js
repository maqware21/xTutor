const {
  getAllLessons,
  createLesson,
  updateLesson,
  deleteLesson,
} = require('../controllers/lessons/lessonsController');
const bodyParser = require('body-parser');
const multer = require('multer');
const express = require('express');
const app = express();
const router = express.Router();
const upload = multer();

app.use(bodyParser.urlencoded({ extended: true }));

/***************************** Get All Lesson ******************************/

router.get('/', getAllLessons);

/***************************** Create Lesson ******************************/

router.post('/', upload.none(), createLesson);

/***************************** Update Single Lesson ******************************/

router.put('/:id', upload.none(), updateLesson);

/***************************** Update Single Lesson ******************************/

router.delete('/:id', deleteLesson);

module.exports = router;

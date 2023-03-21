const { supabase } = require('../config/supa');
const { validateLesson } = require('../models/lessons');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));

//Get All Lessons
router.post('/', async (req, resp) => {
  // const { error } = validateLesson(req.body);
  // if (error) return resp.status(400).send({ error: error?.details[0].message });

  const {
    title,
    educational_level,
    subject,
    topic,
    quiz_type,
    publish,
    description,
    lo1,
    lo2,
    lo3,
    lo1_media,
    lo2_media,
    lo3_media,
    lo1_description,
    lo2_description,
    lo3_description,
  } = req.body;

  console.log(req.body);

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (token === undefined) {
    resp.status(401).send({ message: 'Unauthorized' });
  } else {
    await supabase.auth.getUser(token).then(async (response) => {
      if (response?.data?.user === null) {
        resp.status(401).send({ message: 'Unauthorized' });
      } else {
        const { email, role } = response?.data?.user;
        await supabase
          .from('superAdmin')
          .select('*')
          .eq('email', email)
          .then(async (res) => {
            const { data, error, statusText } = res;
            if (data && statusText === 'OK') {
              // const { data, error } = await supabase.from('lessons').insert({});
              resp.send(true);
            }
          });
      }
    });
  }
});

module.exports = router;

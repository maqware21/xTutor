const { supabase } = require('../../config/supa');
const HandleResponse = require('../../models/lessons/handleResponseLessons');
const { validateLesson } = require('../../validations/lessonValidate');

/***************************** Get All Lessons ******************************/
const getAllLessons = async (req, resp) => {
  await supabase
    .from('lessons')
    .select('*')
    .then(async (response) => {
      const { data, statusText, error } = response;
      if (data && statusText === 'OK') {
        resp.send(data);
      } else {
        resp.status(401).send(error?.message);
      }
    });
};

/***************************** Create Lesson ******************************/

const createLesson = async (req, resp) => {
  const { error } = validateLesson(req.body);
  if (error) return resp.status(400).send({ error: error?.details[0].message });

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
              await supabase
                .from('lessons')
                .insert(HandleResponse.insertLesson(req.body))
                .then(async (response) => {
                  const { data, error, statusText } = response;
                  if (data === null && statusText === null) {
                    resp.status(400).send({ message: error?.message });
                  } else {
                    resp.send({ message: 'Lesson successfully created' });
                  }
                });
            }
          });
      }
    });
  }
};

/***************************** Update Lesson ******************************/

const updateLesson = async (req, resp) => {
  const { error } = validateLesson(req.body);
  if (error) return resp.status(400).send({ error: error?.details[0].message });

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
              await supabase
                .from('lessons')
                .update(HandleResponse.insertLesson(req.body))
                .eq('lessons_id', req.params.id)
                .then((response) => {
                  if (response?.error) {
                    resp
                      .status(401)
                      .send({ message: response?.error?.message });
                  } else {
                    resp.send({ message: 'Lesson successfully updated.' });
                  }
                });
            }
          });
      }
    });
  }
};

/***************************** Update Lesson ******************************/

const deleteLesson = async (req, resp) => {
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
              await supabase
                .from('lessons')
                .delete()
                .eq('lessons_id', req.params.id)
                .then((response) => {
                  if (response?.error) {
                    resp
                      .status(400)
                      .send({ message: response?.error?.message });
                  } else {
                    resp.send({ message: 'Lesson successfully deleted.' });
                  }
                });
            }
          });
      }
    });
  }
};

module.exports = { getAllLessons, createLesson, updateLesson, deleteLesson };

const { supabase } = require('../../config/supa');
const Authenticator = require('../../middleware/authenticator');
const HandleResponse = require('../../models/quiz/handleResponseQuiz');
const { validateQuiz } = require('../../validations/quizValidate');

/***************************** Get All Quiz ******************************/

const getAllQuiz = async (req, resp) => {
  const user = await Authenticator.superAdminAuthenticator(req, resp);

  if (user[0]?.role !== 1) {
    await supabase
      .from('quiz')
      .select('*')
      .then(async (response) => {
        const { data, statusText, error } = response;
        if (data && statusText === 'OK') {
          resp.send(data);
        } else {
          resp.status(401).send(error?.message);
        }
      });
  } else {
    resp.status(401).send({ message: 'Unauthorized' });
  }
};

/***************************** Add New Quiz ******************************/

const addNewQuiz = async (req, resp) => {
  const { error } = validateQuiz(req.body);
  if (error)
    return resp.status(400).send({ error: error?.details[0]?.message });

  const user = await Authenticator.superAdminAuthenticator(req, resp);

  if (user[0]?.role !== 1) {
    await supabase
      .from('quiz')
      .insert(HandleResponse.createQuiz(req.body))
      .then((respo) => {
        const { data, statusText, error } = respo;
        if (data === null && statusText === null) {
          resp.status(400).send({ message: error?.message });
        } else {
          resp.send({ message: 'Quiz successfully created' });
        }
      });
  }
};

const updateQuiz = async (req, resp) => {
  const { error } = validateQuiz(req.body);
  if (error)
    return resp.status(400).send({ error: error?.details[0]?.message });

  const user = await Authenticator.superAdminAuthenticator(req, resp);

  if (user[0]?.role !== 1) {
    await supabase
      .from('quiz')
      .update(HandleResponse.createQuiz(req.body))
      .eq('quiz_uuid', req.params.id)
      .then((resp2) => {
        if (resp2?.error) {
          resp.status(401).send({ message: resp2?.error?.message });
        } else {
          resp.send({ message: 'Lesson successfully updated.' });
        }
      });
  } else {
    resp.status(401).send({ message: 'Unauthorized' });
  }
};

const deleteQuiz = async (req, resp) => {
  const user = await Authenticator.superAdminAuthenticator(req, resp);

  if (user[0]?.role !== 1) {
    await supabase
      .from('quiz')
      .delete()
      .eq('quiz_uuid', req.params.id)
      .then((response) => {
        if (response?.error) {
          resp.status(400).send({ message: response?.error?.message });
        } else {
          resp.send({ message: 'Quiz successfully deleted.' });
        }
      });
  } else {
    resp.status(401).send({ message: 'Unauthorized' });
  }
};

module.exports = { getAllQuiz, addNewQuiz, updateQuiz, deleteQuiz };

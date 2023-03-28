const { supabase } = require('../../config/supa');
const HandleResponse = require('../../models/quiz/handleResponseQuiz');
const { validateQuiz } = require('../../validations/quizValidate');

/***************************** Get All Quiz ******************************/

const getAllQuiz = async (req, resp) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (token === undefined) {
    resp.status(401).send({ message: 'Unauthorized' });
  } else {
    await supabase.auth.getUser(token).then(async (response) => {
      if (response?.data?.user === null) {
        resp.status(401).send({ message: 'Unauthorized' });
      } else {
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
      }
    });
  }
};

/***************************** Add New Quiz ******************************/

const addNewQuiz = async (req, resp) => {
  const { error } = validateQuiz(req.body);
  if (error)
    return resp.status(400).send({ error: error?.details[0]?.message });

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
          .from('users')
          .select('*')
          .eq('email', email)
          .then(async (res) => {
            const { data } = res;
            if (data[0].role !== 1) {
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
            } else {
              resp.send({ message: 'Unauthorized' });
            }
          });
      }
    });
  }
};

const updateQuiz = async (req, resp) => {
  const { error } = validateQuiz(req.body);
  if (error)
    return resp.status(400).send({ error: error?.details[0]?.message });

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (token === undefined) {
    resp.status(401).send({ message: 'Unauthorized' });
  } else {
    await supabase.auth.getUser(token).then(async (response) => {
      if (response?.data?.user === null) {
        resp.status(401).send({ message: 'Unauthorized' });
      } else {
        const { email } = response?.data?.user;
        await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .then(async (resp1) => {
            const { data } = resp1;
            if (data[0].role !== 1) {
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
              resp.send({ message: 'Unauthorized' });
            }
          });
      }
    });
  }
};

const deleteQuiz = async (req, resp) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (token === undefined) {
    resp.status(401).send({ message: 'Unauthorized' });
  } else {
    await supabase.auth.getUser(token).then(async (response) => {
      if (response?.data?.user === null) {
        resp.status(401).send({ message: 'Unauthorized' });
      } else {
        const { email } = response?.data?.user;
        await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .then(async (resp1) => {
            const { data } = resp1;
            if (data[0].role !== 1) {
              await supabase
                .from('quiz')
                .delete()
                .eq('quiz_uuid', req.params.id)
                .then((response) => {
                  if (response?.error) {
                    resp
                      .status(400)
                      .send({ message: response?.error?.message });
                  } else {
                    resp.send({ message: 'Quiz successfully deleted.' });
                  }
                });
            } else {
              resp.send({ message: 'Unauthorized' });
            }
          });
      }
    });
  }
};

module.exports = { getAllQuiz, addNewQuiz, updateQuiz, deleteQuiz };

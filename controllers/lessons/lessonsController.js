const { supabase } = require('../../config/supa');
const { validateLesson } = require('../../validations/lessonValidate');
const express = require('express');

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
                .insert({
                  title: title,
                  educational_level: educational_level,
                  subject: subject,
                  topic: topic,
                  quiz_type: quiz_type,
                  publish: publish,
                  description: description,
                  lo1: lo1,
                  lo2: lo2,
                  lo3: lo3,
                  lo1_media: lo1_media,
                  lo2_media: lo2_media,
                  lo3_media: lo3_media,
                  lo1_description: lo1_description,
                  lo2_description: lo2_description,
                  lo3_description: lo3_description,
                })
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
              await supabase
                .from('lessons')
                .update({
                  title: title,
                  educational_level: educational_level,
                  subject: subject,
                  topic: topic,
                  quiz_type: quiz_type,
                  publish: publish,
                  lo1: lo1,
                  lo2: lo2,
                  lo3: lo3,
                  lo1_media: lo1_media,
                  lo2_media: lo2_media,
                  lo3_media: lo3_media,
                  lo1_description: lo1_description,
                  lo2_description: lo2_description,
                  lo3_description: lo3_description,
                })
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

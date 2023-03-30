const { supabase } = require('../../config/supa');
const Authenticator = require('../../middleware/authenticator');
const { validateLesson } = require('../../validations/lessonValidate');
const express = require('express');
const fs = require('fs');

/***************************** Setting SupaBase Bucket ******************************/
const bucket = supabase.storage.from('lessons');

/***************************** Get All Lessons ******************************/
const getAllLessons = async (req, resp) => {
  const user = await Authenticator.superAdminAuthenticator(req, resp);
  if (user[0]?.role !== 1) {
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
  } else {
    resp.status(401).send({ message: 'Unauthorized' });
  }
};

/***************************** Create Lesson ******************************/

const createLesson = async (req, resp) => {
  const body = { ...req.fields, ...req.files };
  const { error } = validateLesson(body);
  if (error) return resp.status(400).send({ error: error?.details[0].message });

  const user = await Authenticator.superAdminAuthenticator(req, resp);

  // const authHeader = req.headers.authorization;
  // const token = authHeader?.split(' ')[1];
  // if (token === undefined) {
  //   resp.status(401).send({ message: 'Unauthorized' });
  // } else {
  //   await supabase.auth.getUser(token).then(async (response) => {
  //     if (response?.data?.user === null) {
  //       resp.status(401).send({ message: 'Unauthorized' });
  //     } else {
  //       const { email, role, id } = response?.data?.user;
  //       await supabase
  //         .from('users')
  //         .select('*')
  //         .eq('email', email)
  //         .then(async (res) => {
  //           const { data } = res;
  //         });
  //     }
  //   });
  // }

  console.log(user, 'user');
  if (user[0]?.role !== 1) {
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
      lo4,
      lo5,
      lo1_description,
      lo2_description,
      lo3_description,
      lo4_description,
      lo5_description,
    } = req.fields;
    // Setting images and creating their names
    let lo1_media_files = [];
    let lo2_media_files = [];
    let lo3_media_files = [];
    let lo4_media_files = [];
    let lo5_media_files = [];
    const lo1_media = req?.files?.lo1_media;
    const lo2_media = req?.files?.lo2_media;
    const lo3_media = req?.files?.lo3_media;
    const lo4_media = req?.files?.lo4_media;
    const lo5_media = req?.files?.lo5_media;

    // LO1 Media Check Array
    if (Array.isArray(lo1_media)) {
      if (lo1_media?.length > 3)
        return resp.status(413).send({
          message: 'Each lesson object can have maximum 3 images.',
        });

      lo1_media?.map((item, index) => {
        const lo1_media_name = `${title}_lo1_media_${index}.${item?.type
          .split('/')
          .pop()}`;
        const lo1_mediaFile = fs.readFileSync(item?.path);
        lo1_media_files.push({
          mediaName: lo1_media_name,
          mediaFile: lo1_mediaFile,
        });
      });
    } else {
      var lo1_mediaFile = fs.readFileSync(lo1_media.path);
      var lo1_media_name = `${title}_lo1_media.${lo1_media?.type
        .split('/')
        .pop()}`;
    }

    // LO2 Media Check Array
    if (Array.isArray(lo2_media)) {
      if (lo2_media?.length > 3)
        return resp.status(413).send({
          message: 'Each lesson object can have maximum 3 images.',
        });

      lo2_media?.map((item, index) => {
        const lo2_media_name = `${title}_lo2_media_${index}.${item?.type
          .split('/')
          .pop()}`;
        const lo2_mediaFile = fs.readFileSync(item?.path);
        lo2_media_files.push({
          mediaName: lo2_media_name,
          mediaFile: lo2_mediaFile,
        });
      });
    } else {
      var lo2_mediaFile = fs.readFileSync(lo2_media.path);
      var lo2_media_name = `${title}_lo2_media.${lo2_media?.type
        .split('/')
        .pop()}`;
    }

    // LO3 Media Check Array

    if (Array.isArray(lo3_media)) {
      if (lo3_media?.length > 3)
        return resp.status(413).send({
          message: 'Each lesson object can have maximum 3 images.',
        });

      lo3_media?.map((item, index) => {
        const lo3_media_name = `${title}_lo3_media_${index}.${item?.type
          .split('/')
          .pop()}`;
        const lo3_mediaFile = fs.readFileSync(item?.path);
        lo3_media_files.push({
          mediaName: lo3_media_name,
          mediaFile: lo3_mediaFile,
        });
      });
    } else {
      var lo3_mediaFile = fs.readFileSync(lo3_media?.path);
      var lo3_media_name = `${title}_lo3_media.${lo3_media?.type
        .split('/')
        .pop()}`;
    }

    // LO4 Media Check Array
    if (Array.isArray(lo4_media)) {
      if (lo4_media?.length > 3) {
        return resp.status(413).send({
          message: 'Each lesson object can have maximum 3 images.',
        });
      }

      lo4_media?.map((item, index) => {
        const lo4_media_name = `${title}_lo4_media_${index}.${item?.type
          .split('/')
          .pop()}`;
        const lo4_mediaFile = fs.readFileSync(item?.path);
        lo4_media_files.push({
          mediaName: lo4_media_name,
          mediaFile: lo4_mediaFile,
        });
      });
    } else if (lo4_media?.path && lo4_media?.type) {
      var lo4_mediaFile = fs.readFileSync(lo4_media?.path);
      var lo4_media_name = `${title}_lo4_media.${lo4_media?.type
        .split('/')
        .pop()}`;
    }

    // LO5 Media Check Array

    if (Array.isArray(lo5_media)) {
      if (lo5_media?.length > 3)
        return resp.status(413).send({
          message: 'Each lesson object can have maximum 3 images.',
        });

      lo5_media?.map((item, index) => {
        const lo5_media_name = `${title}_lo5_media_${index}.${item?.type
          .split('/')
          .pop()}`;
        const lo5_mediaFile = fs.readFileSync(item?.path);
        lo5_media_files.push({
          mediaName: lo5_media_name,
          mediaFile: lo5_mediaFile,
        });
      });
    } else if (lo5_media?.path && lo5_media?.type) {
      var lo5_mediaFile = fs.readFileSync(lo5_media?.path);
      var lo5_media_name = `${title}_lo5_media.${lo5_media?.type
        .split('/')
        .pop()}`;
    }

    // Check image size
    if (
      lo1_media?.size >= 2e6 ||
      lo2_media?.size >= 2e6 ||
      lo3_media?.size >= 2e6 ||
      lo4_media?.size >= 2e6 ||
      lo5_media?.size >= 2e6
    ) {
      console.log('array check size');
      //Check if   LO1 Array item Greator than 2 MB
      if (Array.isArray(lo1_media)) {
        lo1_media?.map((item) => {
          if (item?.size >= 2e6) {
            return resp.status(413).send({
              error: 'LO1 images size must not be greater than 2mb.',
            });
          }
        });
      } else {
        if (lo1_media?.size >= 2e6) {
          return resp.status(413).send({
            error: 'LO1 image size must not be greater than 2mb.',
          });
        }
      }
      //Check if   LO2 Array item Greator than 2 MB

      if (Array.isArray(lo2_media)) {
        lo2_media?.map((item) => {
          if (item?.size >= 2e6) {
            return resp.status(413).send({
              error: 'LO2 images size must not be greater than 2mb.',
            });
          }
        });
      } else {
        if (lo2_media?.size >= 2e6) {
          return resp.status(413).send({
            error: 'LO2 image size must not be greater than 2mb.',
          });
        }
      }

      //Check if   LO3 Array item Greator than 2 MB
      if (Array.isArray(lo3_media)) {
        lo3_media?.map((item) => {
          if (item?.size >= 2e6)
            return resp.status(413).send({
              error: 'LO3 images size must not be greater than 2mb.',
            });
        });
      } else {
        if (lo3_media?.size >= 2e6) {
          return resp.status(413).send({
            error: 'LO3 image size must not be greater than 2mb.',
          });
        }
      }

      //Check if   LO4 Array item Greator than 2 MB
      if (Array.isArray(lo4_media)) {
        lo4_media?.map((item) => {
          if (item?.size >= 2e6) {
            return resp.status(413).send({
              error: 'LO4 images size must not be greater than 2mb.',
            });
          }
        });
      } else {
        if (lo4_media?.size >= 2e6) {
          return resp.status(413).send({
            error: 'LO4 image size must not be greater than 2mb.',
          });
        }
      }

      //Check if   LO5 Array item Greator than 2 MB
      if (Array.isArray(lo5_media)) {
        lo5_media?.map((item) => {
          if (item?.size >= 2e6) {
            return resp.status(413).send({
              error: 'LO5 images size must not be greater than 2mb.',
            });
          }
        });
      } else {
        if (lo5_media?.size >= 2e6) {
          return resp.status(413).send({
            error: 'LO5 image size must not be greater than 2mb.',
          });
        }
      }
    } else {
      console.log('array map upload bucket');
      // Upoading Images
      //Upload Multiple Images For LO 1 Media Uploading
      if (lo1_media_files?.length !== 0) {
        lo1_media_files.map((item) => {
          bucket.upload(item?.mediaName, item?.mediaFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: lo1_media?.type,
          });
        });
      } else {
        await bucket.upload(lo1_media_name, lo1_mediaFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: lo1_media?.type,
        });
      }

      //Upload Multiple Images For LO 2 Media Uploading

      if (lo2_media_files?.length !== 0) {
        lo2_media_files.map((item) => {
          bucket.upload(item?.mediaName, item?.mediaFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: lo2_media?.type,
          });
        });
      } else {
        await bucket.upload(lo2_media_name, lo2_mediaFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: lo2_media?.type,
        });
      }
      //Upload Multiple Images For LO 3 Media Uploading
      if (lo3_media_files?.length !== 0) {
        lo3_media_files.map((item) => {
          bucket.upload(item?.mediaName, item?.mediaFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: lo3_media?.type,
          });
        });
      } else {
        await bucket.upload(lo3_media_name, lo3_mediaFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: lo3_media?.type,
        });
      }

      //Upload Multiple Images For LO4 Media Uploading
      if (lo4_media_files?.length !== 0) {
        lo4_media_files.map((item) => {
          bucket.upload(item?.mediaName, item?.mediaFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: lo4_media?.type,
          });
        });
      } else if (lo4_media?.path && lo4_media?.type) {
        await bucket.upload(lo4_media_name, lo4_mediaFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: lo4_media?.type,
        });
      }

      //Upload Multiple Images For LO5 Media Uploading
      if (lo5_media_files?.length !== 0) {
        lo5_media_files.map((item) => {
          bucket.upload(item?.mediaName, item?.mediaFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: lo5_media?.type,
          });
        });
      } else if (lo5_media?.path && lo5_media?.type) {
        await bucket.upload(lo5_media_name, lo5_mediaFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: lo5_media?.type,
        });
      }
    }

    // Get Public URL
    let lo1_media_All_URL = [];
    let lo2_media_All_URL = [];
    let lo3_media_All_URL = [];
    let lo4_media_All_URL = [];
    let lo5_media_All_URL = [];

    //Get Public URL For LO1

    if (lo1_media_files?.length !== 0) {
      lo1_media_files
        ?.map((item) => bucket.getPublicUrl(item?.mediaName))
        .map((item) => lo1_media_All_URL.push(item?.data?.publicUrl));
    } else {
      const lo1_media_URL = bucket.getPublicUrl(lo1_media_name);
      lo1_media_All_URL.push(lo1_media_URL?.data?.publicUrl);
    }

    //Get Public URL For LO2

    if (lo2_media_files?.length !== 0) {
      lo2_media_files
        ?.map((item) => bucket.getPublicUrl(item?.mediaName))
        .map((item) => lo2_media_All_URL.push(item?.data?.publicUrl));
    } else {
      const lo2_media_URL = bucket.getPublicUrl(lo2_media_name);
      lo2_media_All_URL.push(lo2_media_URL?.data?.publicUrl);
    }

    //Get Public URL For LO3

    if (lo3_media_files?.length !== 0) {
      lo3_media_files
        ?.map((item) => bucket.getPublicUrl(item?.mediaName))
        .map((item) => lo3_media_All_URL.push(item?.data?.publicUrl));
    } else {
      const lo3_media_URL = bucket.getPublicUrl(lo3_media_name);
      lo3_media_All_URL.push(lo3_media_URL?.data?.publicUrl);
    }

    //Get Public URL For LO4

    if (lo4_media_files?.length !== 0) {
      lo4_media_files
        ?.map((item) => bucket.getPublicUrl(item?.mediaName))
        .map((item) => lo4_media_All_URL.push(item?.data?.publicUrl));
    } else if (lo4_media?.path && lo4_media?.type) {
      const lo4_media_URL = bucket.getPublicUrl(lo4_media_name);
      lo4_media_All_URL.push(lo4_media_URL?.data?.publicUrl);
    }

    //Get Public URL For LO5

    if (lo5_media_files?.length !== 0) {
      lo5_media_files
        ?.map((item) => bucket.getPublicUrl(item?.mediaName))
        .map((item) => lo5_media_All_URL.push(item?.data?.publicUrl));
    } else if (lo5_media?.path && lo5_media?.type) {
      const lo5_media_URL = bucket.getPublicUrl(lo5_media_name);
      lo5_media_All_URL.push(lo5_media_URL?.data?.publicUrl);
    }

    const formData = {
      user_uuid: user[0]?.user_uuid,
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
      lo4: lo4,
      lo5: lo5,
      lo1_media: lo1_media_All_URL,
      lo2_media: lo2_media_All_URL,
      lo3_media: lo3_media_All_URL,
      lo4_media: lo4_media_All_URL,
      lo5_media: lo5_media_All_URL,
      lo1_description: lo1_description,
      lo2_description: lo2_description,
      lo3_description: lo3_description,
      lo4_description: lo4_description,
      lo5_description: lo5_description,
    };

    console.log('formdata', formData);

    await supabase
      .from('lessons')
      .insert(formData)
      .then(async (response) => {
        console.log(response);
        const { status, statusText } = response;
        if (status === 201 && statusText === 'Created') {
          resp.send({ message: 'Lesson successfully created' });
        } else {
          resp.status(400).send({ message: response?.error?.message });
        }
      });
  } else {
    resp.status(401).send({ message: 'Unauthorized' });
  }
};

/***************************** Update Lesson ******************************/

const updateLesson = async (req, resp) => {
  const body = { ...req.fields, ...req.files };
  // const { error } = validateLesson(body);
  // if (error) return resp.status(400).send({ error: error?.details[0].message });

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (token === undefined) {
    resp.status(401).send({ message: 'Unauthorized' });
  } else {
    await supabase.auth.getUser(token).then(async (response) => {
      if (response?.data?.user === null) {
        resp.status(401).send({ message: 'Unauthorized' });
      } else {
        const { email, role, id } = response?.data?.user;
        await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .then(async (res) => {
            const { data, error, statusText } = res;
            console.log(res, 'res');
            if (data[0].role === 4) {
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
                lo1_description,
                lo2_description,
                lo3_description,
              } = req.fields;
              // Setting images and creating their names
              const lo1_media = req?.files?.lo1_media;
              const lo1_mediaFile = fs.readFileSync(lo1_media.path);
              const lo1_media_name = `${title}_lo1_media.${lo1_media?.type
                .split('/')
                .pop()}`;

              const lo2_media = req?.files?.lo2_media;
              const lo2_mediaFile = fs.readFileSync(lo2_media.path);
              const lo2_media_name = `${title}_lo2_media.${lo2_media?.type
                .split('/')
                .pop()}`;

              const lo3_media = req?.files?.lo3_media;
              const lo3_mediaFile = fs.readFileSync(lo3_media.path);
              const lo3_media_name = `${title}_lo3_media.${lo3_media?.type
                .split('/')
                .pop()}`;

              // Check image size
              if (
                lo1_media?.size >= 2e6 ||
                lo2_media?.size >= 2e6 ||
                lo3_media?.size >= 2e6
              ) {
                resp
                  .status(413)
                  .send({ error: 'Image size must not be greater than 2mb.' });
              } else {
                // Upoading Images
                await bucket.upload(lo1_media_name, lo1_mediaFile, {
                  cacheControl: '3600',
                  upsert: false,
                  contentType: lo1_media?.type,
                });
                await bucket.upload(lo2_media_name, lo2_mediaFile, {
                  cacheControl: '3600',
                  upsert: false,
                  contentType: lo2_media?.type,
                });
                await bucket.upload(lo3_media_name, lo3_mediaFile, {
                  cacheControl: '3600',
                  upsert: false,
                  contentType: lo3_media?.type,
                });
              }
              // Get Public URL

              const lo1_media_URL = bucket.getPublicUrl(lo1_media_name);
              const lo2_media_URL = bucket.getPublicUrl(lo2_media_name);
              const lo3_media_URL = bucket.getPublicUrl(lo3_media_name);

              const formData = {
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
                lo1_media: lo1_media_URL?.data?.publicUrl,
                lo2_media: lo2_media_URL?.data?.publicUrl,
                lo3_media: lo3_media_URL?.data?.publicUrl,
                lo1_description: lo1_description,
                lo2_description: lo2_description,
                lo3_description: lo3_description,
              };

              await supabase
                .from('lessons')
                .update(formData)
                .eq('lesson_uuid', req.params.id)
                .then((response) => {
                  if (response?.error) {
                    resp
                      .status(401)
                      .send({ message: response?.error?.message });
                  } else {
                    resp.send({ message: 'Lesson successfully updated.' });
                  }
                });
            } else {
              resp.status(401).send({ message: 'Unauthorized' });
            }
          });
      }
    });
  }
};

/***************************** Update Lesson ******************************/

const deleteLesson = async (req, resp) => {
  const user = await Authenticator.superAdminAuthenticator(req, resp);
  if (user[0]?.role !== 1) {
    await supabase
      .from('lessons')
      .delete()
      .eq('lesson_uuid', req.params.id)
      .then((response) => {
        if (response?.error) {
          resp.status(400).send({ message: response?.error?.message });
        } else {
          resp.send({ message: 'Lesson successfully deleted.' });
        }
      });
  } else {
    resp.status(401).send({ message: 'Unauthorized' });
  }
};

module.exports = { getAllLessons, createLesson, updateLesson, deleteLesson };

class handleResponse {
  registerAdmin = (body) => {
    const { email, password } = body;
    let createBody = {
      email: email,
      password: password,
    };
    return createBody;
  };
  createAdmin = (body) => {
    const {
      name,
      email,
      password,
      phone_number,
      educational_level,
      main_subjects,
    } = body;

    let newUser = {
      name: name,
      email: email,
      password: password,
      phone_number: phone_number,
      educational_level: educational_level,
      main_subjects: main_subjects,
      role: 3,
    };
    return newUser;
  };

  login = (body) => {
    const { email, password } = body;
    let loginObject = {
      email: email,
      password: password,
    };
    return loginObject;
  };

  loginResponse = (resp1, resp2) => {
    const { access_token, token_type, expires_in, refresh_token } =
      resp1?.data?.session;
    const { user_uuid, name, email, role } = resp2?.data[0];
    return {
      token: {
        acceess_token: access_token,
        token_type: token_type,
        expires_in: expires_in,
        refresh_token: refresh_token,
      },
      status: resp2?.statusText,
      user: {
        user_uuid: user_uuid,
        name: name,
        email: email,
        role: role,
      },
    };
  };
}
const HandleResponse = new handleResponse();
module.exports = HandleResponse;

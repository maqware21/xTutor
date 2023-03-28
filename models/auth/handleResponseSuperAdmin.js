class handleResponse {
  handleRegisterSuperAdmin = (body) => {
    const { email, password } = body;
    let createBody = {
      email: email,
      password: password,
    };
    return createBody;
  };

  createSuperAdmin = (body) => {
    const { first_name, last_name, email, password } = body;
    let newUser = {
      first_name: first_name,
      last_name: last_name,
      role: 4,
      email: email,
      password: password,
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
    const { user_uuid, first_name, last_name, email, role } = resp2?.data[0];
    let response = {
      token: {
        access_token: access_token,
        token_type: token_type,
        expires_in: expires_in,
        refresh_token: refresh_token,
      },
      status: resp2?.statusText,
      user: {
        user_uuid: user_uuid,
        first_name: first_name,
        last_name: last_name,
        email: email,
        role: role,
      },
    };
    return response;
  };
}

const HandleResponse = new handleResponse();
module.exports = HandleResponse;

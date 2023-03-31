class HandleResponse {
    handleRegisterSuperAdmin = body => {
        const { email, password } = body;
        const createBody = {
            email,
            password
        };
        return createBody;
    };

    createSuperAdmin = body => {
        const { first_name, last_name, email, password, role } = body;
        const newUser = {
            first_name,
            last_name,
            role,
            email,
            password
        };
        return newUser;
    };

    login = body => {
        const { email, password } = body;
        const loginObject = {
            email,
            password
        };
        return loginObject;
    };

    loginResponse = (resp1, resp2) => {
        const { access_token, token_type, expires_in, refresh_token } =
            resp1?.data?.session;
        const user = resp2?.data;
        const response = {
            token: {
                acceess_token: access_token,
                token_type,
                expires_in,
                refresh_token
            },
            status: resp2?.statusText,
            user
        };
        return response;
    };
}

export default new HandleResponse();

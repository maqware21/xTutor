class HandleResponse {
    registerAdmin = body => {
        const { email, password } = body;
        const createBody = {
            email,
            password
        };
        console.log("🚀 ~ Class createBody:", createBody);
        return createBody;
    };

    createAdmin = (body, data) => {
        const {
            name,
            email,
            password,
            phone_number,
            educational_level,
            main_subjects,
        } = body;

        const newUser = {
            name,
            email,
            password,
            phone_number,
            educational_level,
            main_subjects,
            uuid: data?.user?.id
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
        return {
            token: {
                acceess_token: access_token,
                token_type,
                expires_in,
                refresh_token
            },
            status: resp2?.statusText,
            user: resp2?.data
        };
    };
}

export default new HandleResponse();

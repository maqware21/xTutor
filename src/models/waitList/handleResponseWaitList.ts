class HandleResponse {
    createWaitList = body => {
        const { name, email, educational_level, subject } = body;
        const createList = {
            name,
            email,
            educational_level,
            subject
        };
        return createList;
    };
}

export default new HandleResponse();

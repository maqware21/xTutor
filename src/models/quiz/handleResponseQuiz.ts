class HandleResponse {
    createQuiz = body => {
        const { lesson_uuid, mcqs, written } = body;
        const response = {
            lesson_uuid,
            mcqs,
            written
        };
        return response;
    };
}

export default new HandleResponse();

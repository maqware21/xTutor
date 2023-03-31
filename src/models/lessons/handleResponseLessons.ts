class HandleResponse {
    insertLesson = body => {
        const {
            title,
            educationalLevel,
            subject,
            topic,
            quizType,
            publish,
            description,
            lo1,
            lo2,
            lo3,
            lo1Media,
            lo2Media,
            lo3Media,
            lo1Description,
            lo2Description,
            lo3Description,
        } = body;

        return {
            title,
            educationalLevel,
            subject,
            topic,
            quizType,
            publish,
            description,
            lo1,
            lo2,
            lo3,
            lo1Media,
            lo2Media,
            lo3Media,
            lo1Description,
            lo2Description,
            lo3Description
        };
    };
}

export default new HandleResponse();

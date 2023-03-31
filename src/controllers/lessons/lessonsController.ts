// @ts-nocheck
import { type Request, type Response,Router } from "express";
import fs from "fs";

import supabase from "../../_supabase/client";
import HandleResponse from "../../models/lessons/handleResponseLessons";
import { validateLesson } from "../../validations/lessonValidate";

const router = Router();

// Set the bucket
const bucket = supabase.storage.from("lessons");

/**
 * Get all lessons
 * @param req Request object
 * @param resp Response object
 * @returns {Promise<void>} void
 */
export const getAllLessons = async (req: Request, resp: Response) => {
    // Get
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (token === undefined) {
        return resp.status(401).send({ message: "Unauthorized" });
    }
    await supabase.auth.getUser(token).then(async response => {
        if (response?.data?.user === undefined) {
            return resp.status(401).send({ message: "Unauthorized" });
        }
        await supabase
            .from("lessons")
            .select("*")
            .then(async response => {
                const { data, statusText, error } = response;
                if (data && statusText === "OK") {
                    return resp.send(data);
                }
                return resp.status(401).send(error?.message);
            });
    });
};

/** *************************** Create Lesson ******************************/
export const createLesson = async (req: Request, resp: Response) => {
    const body = { ...req.fields, ...req.files };
    if (!req.fields || !req.files) {
        return resp.status(400).send({ error: "Please fill all fields" });
    }

    const { error } = validateLesson(body);
    if (error) {
        return resp.status(400).send({ error: error?.details[0].message });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (token === undefined) {
        return resp.status(401).send({ message: "Unauthorized" });
    }
    await supabase.auth.getUser(token).then(async response => {
        if (response?.data?.user === undefined) {
            return resp.status(401).send({ message: "Unauthorized" });
        }
        const { email, role } = response?.data?.user;
        await supabase
            .from("superAdmin")
            .select("*")
            .eq("email", email)
            .then(async res => {
                const { data, error, statusText } = res;
                if (data && statusText !== "OK") {
                    // TODO: What is the error message?
                    return;
                }
                const {
                    title,
                    educationalLevel,
                    subject,
                    topic,
                    quiz_type,
                    publish,
                    description,
                    lo1,
                    lo2,
                    lo3,
                    lo1Description,
                    lo2Description,
                    lo3Description,
                } = req.fields;
                // Setting images and creating their names
                const lo1Media: File = req.files.lo1Media;

                const lo1MediaFile = fs.readFileSync(
                    lo1Media.path
                );
                const lo1MediaName =
                    `${title}_lo1Media.${lo1Media?.type
                        .split("/")
                        .pop()}`;

                const lo2Media = req?.files?.lo2Media;
                const lo2MediaFile = fs.readFileSync(
                    lo2Media.path
                );
                const lo2MediaName =
                    `${title}_lo2Media.${lo2Media?.type
                        .split("/")
                        .pop()}`;

                const lo3Media = req?.files?.lo3Media;
                const lo3MediaFile = fs.readFileSync(
                    lo3Media.path
                );
                const lo3MediaName =
                    `${title}_lo3Media.${lo3Media?.type
                        .split("/")
                        .pop()}`;

                // Check image size
                if (
                    lo1Media?.size >= 2e6 ||
                    lo2Media?.size >= 2e6 ||
                    lo3Media?.size >= 2e6
                ) {
                    return resp.status(413).send({
                        error: "Image size must not be greater than 2mb.",
                    });
                }
                // Uploading Images
                await bucket.upload(
                    lo1MediaName,
                    lo1MediaFile,
                    {
                        cacheControl: "3600",
                        upsert: false,
                        contentType: lo1Media?.type
                    }
                );
                await bucket.upload(
                    lo2MediaName,
                    lo2MediaFile,
                    {
                        cacheControl: "3600",
                        upsert: false,
                        contentType: lo2Media?.type
                    }
                );
                await bucket.upload(
                    lo3MediaName,
                    lo3MediaFile,
                    {
                        cacheControl: "3600",
                        upsert: false,
                        contentType: lo3Media?.type
                    }
                );

                // Get Public URL
                const lo1MediaURL =
                    bucket.getPublicUrl(lo1MediaName);
                const lo2MediaURL =
                    bucket.getPublicUrl(lo2MediaName);
                const lo3MediaURL =
                    bucket.getPublicUrl(lo3MediaName);

                const formData = {
                    title,
                    educationalLevel,
                    subject,
                    topic,
                    quiz_type,
                    publish,
                    description,
                    lo1,
                    lo2,
                    lo3,
                    lo1Media: lo1MediaURL?.data?.publicUrl,
                    lo2Media: lo2MediaURL?.data?.publicUrl,
                    lo3Media: lo3MediaURL?.data?.publicUrl,
                    lo1Description,
                    lo2Description,
                    lo3Description
                };

                await supabase
                    .from("lessons")
                    .insert(formData)
                    .then(async response => {
                        const { data, error, statusText } =
                            response;
                        if (data === undefined && statusText === undefined) {
                            resp.status(400).send({
                                message: error?.message
                            });
                        }
                        else {
                            resp.send({
                                message:
                                    "Lesson successfully created",
                            });
                        }
                    });
            });
    });
};

/** *************************** Update Lesson ******************************/

export const updateLesson = async (req: Request, resp: Response) => {
    const body = { ...req.fields, ...req.files };
    const { error } = validateLesson(body);
    if (error) {
        return resp.status(400).send({ error: error?.details[0].message });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (token === undefined) {
        resp.status(401).send({ message: "Unauthorized" });
    }
    else {
        await supabase.auth.getUser(token).then(async response => {
            if (response?.data?.user === undefined) {
                resp.status(401).send({ message: "Unauthorized" });
            }
            else {
                const { email, role } = response?.data?.user;
                await supabase
                    .from("superAdmin")
                    .select("*")
                    .eq("email", email)
                    .then(async res => {
                        const { data, error, statusText } = res;
                        if (data && statusText === "OK") {
                            const {
                                title,
                                educationalLevel,
                                subject,
                                topic,
                                quiz_type,
                                publish,
                                description,
                                lo1,
                                lo2,
                                lo3,
                                lo1Description,
                                lo2Description,
                                lo3Description,
                            } = req.fields;
                            // Setting images and creating their names
                            const lo1Media = req?.files?.lo1Media;
                            const lo1MediaFile = fs.readFileSync(
                                lo1Media.path
                            );
                            const lo1MediaName =
                                `${title}_lo1Media.${lo1Media?.type
                                    .split("/")
                                    .pop()}`;

                            const lo2Media = req?.files?.lo2Media;
                            const lo2MediaFile = fs.readFileSync(
                                lo2Media.path
                            );
                            const lo2MediaName =
                                `${title}_lo2Media.${lo2Media?.type
                                    .split("/")
                                    .pop()}`;

                            const lo3Media = req?.files?.lo3Media;
                            const lo3MediaFile = fs.readFileSync(
                                lo3Media.path
                            );
                            const lo3MediaName =
                                `${title}_lo3Media.${lo3Media?.type
                                    .split("/")
                                    .pop()}`;

                            // Check image size
                            if (
                                lo1Media?.size >= 2e6 ||
                                lo2Media?.size >= 2e6 ||
                                lo3Media?.size >= 2e6
                            ) {
                                resp.status(413).send({
                                    error: "Image size must not be greater than 2mb.",
                                });
                            }
                            else {
                                // Uploading Images
                                await bucket.upload(
                                    lo1MediaName,
                                    lo1MediaFile,
                                    {
                                        cacheControl: "3600",
                                        upsert: false,
                                        contentType: lo1Media?.type
                                    }
                                );
                                await bucket.upload(
                                    lo2MediaName,
                                    lo2MediaFile,
                                    {
                                        cacheControl: "3600",
                                        upsert: false,
                                        contentType: lo2Media?.type
                                    }
                                );
                                await bucket.upload(
                                    lo3MediaName,
                                    lo3MediaFile,
                                    {
                                        cacheControl: "3600",
                                        upsert: false,
                                        contentType: lo3Media?.type
                                    }
                                );
                            }
                            // Get Public URL
                            const lo1MediaURL =
                                bucket.getPublicUrl(lo1MediaName);
                            const lo2MediaURL =
                                bucket.getPublicUrl(lo2MediaName);
                            const lo3MediaURL =
                                bucket.getPublicUrl(lo3MediaName);

                            const formData = {
                                title,
                                educationalLevel,
                                subject,
                                topic,
                                quiz_type,
                                publish,
                                description,
                                lo1,
                                lo2,
                                lo3,
                                lo1Media: lo1MediaURL?.data?.publicUrl,
                                lo2Media: lo2MediaURL?.data?.publicUrl,
                                lo3Media: lo3MediaURL?.data?.publicUrl,
                                lo1Description,
                                lo2Description,
                                lo3Description
                            };

                            await supabase
                                .from("lessons")
                                .update(formData)
                                .eq("lessons_id", req.params.id)
                                .then(response => {
                                    if (response?.error) {
                                        resp.status(401).send({
                                            message: response?.error?.message
                                        });
                                    }
                                    else {
                                        resp.send({
                                            message:
                                                "Lesson successfully updated.",
                                        });
                                    }
                                });
                        }
                    });
            }
        });
    }
};

/** *************************** Update Lesson ******************************/

export const deleteLesson = async (req: Request, resp: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (token === undefined) {
        resp.status(401).send({ message: "Unauthorized" });
    }
    else {
        await supabase.auth.getUser(token).then(async response => {
            if (response?.data?.user === undefined) {
                resp.status(401).send({ message: "Unauthorized" });
            }
            else {
                const { email, role } = response?.data?.user;
                await supabase
                    .from("superAdmin")
                    .select("*")
                    .eq("email", email)
                    .then(async res => {
                        const { data, error, statusText } = res;
                        if (data && statusText === "OK") {
                            await supabase
                                .from("lessons")
                                .delete()
                                .eq("lessons_id", req.params.id)
                                .then(response => {
                                    if (response?.error) {
                                        resp.status(400).send({
                                            message: response?.error?.message
                                        });
                                    }
                                    else {
                                        resp.send({
                                            message:
                                                "Lesson successfully deleted.",
                                        });
                                    }
                                });
                        }
                    });
            }
        });
    }
};

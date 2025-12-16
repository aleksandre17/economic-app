import {z, ZodTypeAny } from "zod";


export const collectErrorMessages = (obj: any, messages: string[] = []) => {
    if (!obj || typeof obj !== "object") return messages;

    // თუ აქვს message — დავამატოთ
    if (typeof obj.message === "string") {
        messages.push(obj.message);
    }

    // გადავუვლით ყველა პროპსს
    for (const [key, value] of Object.entries(obj)) {

        // თუ პროპსის სახელი არის "ref" — გამოვტოვოთ
        if (key === "ref") continue;

        // დანარჩენებზე ჩავიდეთ შიგნით
        if (value && typeof value === "object") {
            collectErrorMessages(value, messages);
        }
    }

    return messages;
};

function generateUUID() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export const schemaToEmptyTypedObjectDeep = (schema: ZodTypeAny, keyName?: string): any => {

    // 🎯 ყალბი UUID ქვეყანად "id" ველისთვის
    if (keyName === "id") {
        if (schema instanceof z.ZodString || schema instanceof z.ZodUnion) {
            return generateUUID();
        }
    }

    // -------- OBJECT --------
    if (schema instanceof z.ZodObject) {
        const shape = schema.shape;
        const obj: any = {};
        for (const key of Object.keys(shape)) {
            obj[key] = schemaToEmptyTypedObjectDeep(shape[key], key);
        }
        return obj;
    }

    // -------- ARRAY --------
    if (schema instanceof z.ZodArray) {
        return [];
    }

    // -------- PRIMITIVES --------
    if (schema instanceof z.ZodString) return "";
    if (schema instanceof z.ZodNumber) return null;
    if (schema instanceof z.ZodBoolean) return null; //false
    if (schema instanceof z.ZodBigInt) return null;
    if (schema instanceof z.ZodDate) return null;

    // -------- OPTIONAL / NULLABLE / DEFAULT --------
    if (
        schema instanceof z.ZodOptional ||
        schema instanceof z.ZodNullable ||
        schema instanceof z.ZodDefault
    ) {
        // always go deeper
        return schemaToEmptyTypedObjectDeep(schema._def.innerType || schema._def.schema, keyName);
    }

    // -------- UNION (pick first) --------
    if (schema instanceof z.ZodUnion) {
        return schemaToEmptyTypedObjectDeep(schema.options[0], keyName);
    }

    // -------- LITERAL --------
    if (schema instanceof z.ZodLiteral) {
        return schema.value;
    }

    // -------- ENUM --------
    if (schema instanceof z.ZodEnum) {
        return null;  // first enum schema.options[0]
    }

    // -------- RECORD --------
    if (schema instanceof z.ZodRecord) {
        return {};
    }

    // -------- TUPLE --------
    if (schema instanceof z.ZodTuple) {
        return schema.items.map(item => schemaToEmptyTypedObjectDeep(item));
    }

    // -------- MAP / SET --------
    if (schema instanceof z.ZodMap || schema instanceof z.ZodSet) {
        return [];
    }

    // -------- FALLBACK --------
    return null;
};
















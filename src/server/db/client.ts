import postgres from "postgres";
export const createDatabaseClient = (url: string) => postgres(url, { max: 1 });

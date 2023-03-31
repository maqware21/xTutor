import dotenv from "dotenv";

import server from "./server";
dotenv.config();

const port = process.env.PORT || 3002;

async function main() {
    await server.listen(port);
    console.log(`Listening on port ${port}`);
}

main();

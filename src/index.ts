export * from "colors";
export { client };
    import { ExtendedClient } from "./structs/ExtendedClient";

const client = new ExtendedClient();
client.start();
client.on("ready", ()=>{console.log("RIQUELMEEE".green)})

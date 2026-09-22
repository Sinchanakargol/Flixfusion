import { createClient } from "redis";

const client = createClient({
  url: "rediss://default:LJ2VZjqwvp8zSgXDtOBNhS47QMjXRf13@redis-16036.crce206.ap-south-1-1.ec2.redns.redis-cloud.com:16036"
});

client.on("error", (err) => console.error("❌ Redis Error:", err));
client.on("connect", () => console.log("✅ Redis Connected"));

await client.connect();

await client.set("test", "hello");
console.log("Stored value:", await client.get("test"));

await client.disconnect();

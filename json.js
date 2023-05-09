import { access, constants, mkdir, writeFile } from "fs/promises";
import JsonServer from "json-server";
import auth from "json-server-auth";
import { apiAuthMiddlware } from "./auth.js";

const { create, defaults, router } = JsonServer;

const db = "data/db.json";

const jsonServer = create();

try {
  await access(
    "data/db.json",
    constants.F_OK | constants.R_OK | constants.W_OK
  );
} catch {
  await mkdir("data");
  await writeFile(db, `{\n  "users": []\n}`, { flag: "w" });
}

const rules = auth.rewriter({
  db: 400,
  todo: 600,
  "/todo/:id": 600,
  "/todo?filter=done": "/todo?complete=true",
  "/todo?filter=undone": "/todo?complete=false",
  "/todo?filter=all": "/todo",
});

const jsonRouter = router(db);
const jsonMiddlewares = defaults();
jsonServer.db = jsonRouter.db;

jsonServer.use(jsonMiddlewares);
jsonServer.use(apiAuthMiddlware());
jsonServer.use(rules);
jsonServer.use(auth);
jsonServer.use(jsonRouter);

export default jsonServer;

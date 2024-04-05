import { app, BrowserWindow } from "electron";
import Fastify from "fastify";
import pointOfView from "@fastify/view";
import nunjucks from "nunjucks";
import getCurrentDirectory from "./utils/getCurrentDirectory.mjs";
import loadCharacters from "./characters/loadCharacters.mjs";

const fastify = Fastify({
  logger: true,
});
fastify.register(pointOfView, {
  engine: {
    nunjucks,
  },
  defaultContext: {
    dev: process.env.NODE_ENV === "development",
  },
});

fastify.get("/", async (request, reply) => {
  const currentDirectory = getCurrentDirectory();
  const charactersByCategory = await loadCharacters(
    `${currentDirectory}/chars.json`,
  );
  return reply.view("pages/index.njk", { charactersByCategory });
});

app.on("window-all-closed", async () => {
  await fastify.close();
  if (process.platform !== "darwin") {
    app.quit();
  }

  process.exit(0);
});

app.whenReady().then(async () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
  });
  window.loadFile(`pages/loading.html`);

  try {
    await fastify.listen({ host: "localhost", port: 0 });
    const port = fastify.server.address().port;
    window.loadURL(`http://localhost:${port}`);
  } catch (error) {
    console.error(error);
    window.loadFile(`pages/error.html`, {
      query: { message: "Unable to start the server" },
    });
  }
});

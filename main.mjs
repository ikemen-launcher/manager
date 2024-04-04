import { app, BrowserWindow } from "electron";
import Fastify from "fastify";
import pointOfView from "@fastify/view";
import twig from "twig";

const fastify = Fastify({
  logger: true,
});
fastify.register(pointOfView, {
  engine: {
    twig,
  },
});

fastify.get("/", function (request, reply) {
  reply.view("pages/index.twig", { text: "text" });
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
    window.loadFile(`pages/error.html`, {
      query: { message: "Unable to start the server" },
    });
  }
});

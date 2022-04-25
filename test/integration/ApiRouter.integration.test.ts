import spawn from "cross-spawn-with-kill";
import path from "path";
import axios from "axios";

const ROOT_PATH = process.cwd();
const exampleRootPath = `examples/remix-api-example`;

describe("ApiRouter integration tests", () => {
  let childProcess;
  let serviceBaseUrl;

  beforeAll((done) => {
    const servicePath = path.resolve(ROOT_PATH, exampleRootPath);
    childProcess = spawn(`npm start`, { cwd: servicePath, shell: true, stdio: ["ignore", "pipe", process.stderr] });
    childProcess.on("error", (data) => {
      console.error(data.toString());
      done();
    });
    childProcess.stdout.on("data", (data) => {
      const message: string = data.toString();

      if (message.includes("http://localhost")) {
        serviceBaseUrl = /^.*(http:\/\/localhost:....).*$/gm.exec(message)[1] || "http://localhost:3000";
        done();
        console.log(message);
      }
    });
  });

  afterAll(() => {
    console.log("Killing Remix server child process..");
    childProcess.kill();
  });

  it("should resolve 2xx requests", async () => {
    expect((await axios.get(`${serviceBaseUrl}/api/products`)).data).toStrictEqual({ message: "GET" });
    expect((await axios.put(`${serviceBaseUrl}/api/products`)).data).toStrictEqual({ message: "PUT" });
    expect((await axios.patch(`${serviceBaseUrl}/api/products`)).data).toStrictEqual({ message: "PATCH" });
  });

  it("should properly handle client errors (4xx)", async () => {
    try {
      const result = await axios.post(`${serviceBaseUrl}/api/products`);
      expect(result).toBeUndefined();
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response.data).toStrictEqual({ error: "Unauthorized" });
    }
  });

  it("should properly handle not found/not match by default", async () => {
    try {
      const result = await axios.options(`${serviceBaseUrl}/api/products`);
      expect(result).toBeUndefined();
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response.status).toBe(405);
    }
  });

  it("should properly handle errors in the handlers by default", async () => {
    try {
      const result = await axios.delete(`${serviceBaseUrl}/api/products`);
      expect(result).toBeUndefined();
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response.status).toBe(500);
      expect(err.response.data).toStrictEqual({ error: "Custom message: Server unavailable!" });
    }
  });
});

import Api from "./Api";

const api = new Api();

self.addEventListener('message', async (event) => {
  const buffer = await Api.readFile(event.data.file);
  const cryptoFn = api[event.data.cryptoID];
  const hash = api.getHash(buffer, cryptoFn)
  self.postMessage(hash);
});

self.addEventListener('error', (event) => {
  self.postMessage(event.message);
})
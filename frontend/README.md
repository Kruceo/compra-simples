# Frontend

## Configuration

All basic necessary config is located at `config.json`.

Any like this:

```json
{
  "api_address": "192.168.0.62",
  "api_protocol": "http",
  "api_port": 8080,
  "printer": {
      "address": "192.168.0.62",
      "protocol": "http",
      "port": 8888
  }
}
```

## Printer Configuration

The printer config is for the server `kruceo/thermal-printer`, that can be run with **docker**, using the image `rafola/thermal-printer`.

## Testing

```bash
npm run dev
```


## Build

One time that build are complete, the config is static.

```bash
npm i 
npm run build
cd dist
```
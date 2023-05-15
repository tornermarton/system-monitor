# system-monitor

A simple microservice which provides htop-like information via 
REST API and Server Sent Events and a simple Angular frontend.

## Configure frontend container

To work correctly you must configure the frontend to use the correct BE url.
Add this to a config.json next to the docker-compose.yml:
```json
{
  "url": "https://example.com:1234"
}

```

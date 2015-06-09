# Analytics for MeteorJS
This package has to be installed on the clients applications.

With the package installed, the app wil send informations to analytics server

## Client side package

### Server side events

**Event** : client_connexion
```javascript
{
    ip: this._session.socket.remoteAddress,
    headers: this._session.socket.headers,
    ddp: this._session.version,
    secure: clientParams.secure,
    preview: clientParams.preview,
    language: clientParams.language,
    referrer: clientParams.referrer,
    uid: clientParams.uid
}
```

**Event** : client_deconnexion
```
{
    count: _.size(self._session.server.sessions)
}
```

**Event** : log
```
{
    text: stdout,
}
```

**Event** : health
```
{
    cpus: os.cpus(),
    loadavg: os.loadavg(),
    totalmem: os.totalmem(),
    memory: (os.totalmem() - os.freemem()),
    processMem: process.memoryUsage().rss
}
```
** Example response **
```shell
health { cpus:
 [ { model: 'Intel(R) Core(TM) i7-4712MQ CPU @ 2.30GHz',
     speed: 800,
     times: [Object] },
   { model: 'Intel(R) Core(TM) i7-4712MQ CPU @ 2.30GHz',
     speed: 2301,
     times: [Object] },
   { model: 'Intel(R) Core(TM) i7-4712MQ CPU @ 2.30GHz',
     speed: 800,
     times: [Object] },
   { model: 'Intel(R) Core(TM) i7-4712MQ CPU @ 2.30GHz',
     speed: 800,
     times: [Object] },
   { model: 'Intel(R) Core(TM) i7-4712MQ CPU @ 2.30GHz',
     speed: 800,
     times: [Object] },
   { model: 'Intel(R) Core(TM) i7-4712MQ CPU @ 2.30GHz',
     speed: 2301,
     times: [Object] },
   { model: 'Intel(R) Core(TM) i7-4712MQ CPU @ 2.30GHz',
     speed: 800,
     times: [Object] },
   { model: 'Intel(R) Core(TM) i7-4712MQ CPU @ 2.30GHz',
     speed: 800,
     times: [Object] } ],
loadavg: [ 1.517578125, 1.6474609375, 1.49951171875 ],
totalmem: 12516794368,
memory: 11988996096,
processMem: 99954688,
appId: 'itJKKC4h4o9H8vv2g',
type: 'health' }
```


**Event** : server_info
```
{
    env: process.env,
    key: applicationId,
    arch: os.arch(),
    version: process.version,
    meteortics_version: meteortics_version,
    release: Meteor.release,
    platform: os.platform(),
    type: os.type(),
    processMem: process.memoryUsage().rss,
    hostname: os.hostname(),
    os_release: os.release(),
    webapp: typeof WebApp != "undefined" && WebApp.clientProgram ? WebApp.clientProgram : null,
    uptime: os.uptime(),
    memory: os.totalmem(),
    cpus: os.cpus(),
    networkInterfaces: os.networkInterfaces(),
    modules: process.versions,
    freemem: os.freemem(),
    loadavg: os.loadavg()
}
```

### Client side events
**Event** : boot
```
{
    connection: Meteor.connection._lastSessionId,
    time: new Date().getTime() - booted
}
```

**Event** : event
```
{
    template: template,
    selector: selector,
    formdata: $(tmpl.findAll('input[type=text],input[type=number],input[type=email],input[type=check],input[type=search],textarea,select')).serializeArray(),
    connection: Meteor.connection._lastSessionId
}
```

**Event** : page
```
{
    title: document.title,
    path: window.location.pathname,
    params: {},
    connection: Meteor.connection._lastSessionId
}
```

**Event** : event (for window activated events)
```
{
    template: "",
    selector: "Window activated",
    connection: Meteor.connection._lastSessionId
}
```

**Event** : event (for window in background events)
```
{
    template: "",
    selector: "Window in background",
    connection: Meteor.connection._lastSessionId
}
```

**Event** : event (for window error events)
```
{
    template: "",
    error: {
        stack: stack,
        line: event.lineno,
        filename: event.filename
    },
    selector: "Javascript Error",
    connection: Meteor.connection._lastSessionId
}
```

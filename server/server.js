// Default variables
var meteortics_version = '0.0.1',
    default_server = "http://localhost:4000",
    booted = new Date(),
    app_setup = false,
    applicationId = null,
    logInstalled = false,
    healthInstalled = false,
    serverId = Random.id(),
    maxRetries = 10,
    Meteortics_Local_Collection = new Mongo.Collection("meteortics_settings"),
    Meteortics_Remote_Server = DDP.connect(process.env.METEORTICS_URL || default_server),
    Meteortics_Remote_Collection = new Mongo.Collection("server_auth", {
        connection: Meteortics_Remote_Server
    })

/**********************************************************
 *
 * Application server startup and logging
 *
 **********************************************************/

//Removing all documents on startup
Meteortics_Local_Collection.remove({})



// Function sending informations to remote server
var send_event = function(type, params) {
    if (type != 'log')
        console.log('sending event type', type)
    params.appId = applicationId;
    params.serverId = serverId;
    params.type = type;
    Meteortics_Remote_Server.call("Meteortics_Event", params, function() {});
}



// Helper function to install hook on stdout
var install_hook_to = function(obj) {
    if (obj.hook || obj.unhook)
        throw new Error('Object already has properties hook and/or unhook');

    obj.hook = function(_meth_name, _fn, _is_async) {
        var self = this,
            meth_ref;

        if (!(Object.prototype.toString.call(self[_meth_name]) === '[object Function]'))
            throw new Error('Invalid method: ' + _meth_name);

        if (self.unhook.methods[_meth_name])
            throw new Error('Method already hooked: ' + _meth_name);

        meth_ref = (self.unhook.methods[_meth_name] = self[_meth_name]);

        self[_meth_name] = function() {
            var args = Array.prototype.slice.call(arguments);

            while (args.length < meth_ref.length) {
                args.push(undefined);
            }

            args.push(function() {
                var args = arguments;

                if (_is_async) {
                    process.nextTick(function() {
                        meth_ref.apply(self, args);
                    });
                } else {
                    meth_ref.apply(self, args);
                }
            });

            _fn.apply(self, args);
        };
    };

    obj.unhook = function(_meth_name) {
        var self = this,
            ref = self.unhook.methods[_meth_name];

        if (ref) {
            self[_meth_name] = self.unhook.methods[_meth_name];
            delete self.unhook.methods[_meth_name];
        } else throw new Error('Method not hooked: ' + _meth_name);
    };

    obj.unhook.methods = {};
};



// Listen for local collection settings to start logging
var handle = Meteortics_Local_Collection.find().observe({
    added: function(doc) {
        console.log('local observe: Settings inserted, Start Logging ...', doc)
            // handle.stop();

        if (doc.log_enabled && !logInstalled) startup_log();
        if (doc.health_enabled && !healthInstalled) startup_health();

        send_server_info()
    }
});



// Send server informations
var send_server_info = function() {
    var os = Npm.require('os');
    var infos = {
        env: process.env,
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
        loadavg: os.loadavg(),
        usedmemory: (os.totalmem() - os.freemem()),
    }
    console.log('sending server informations', applicationId)
    send_event('server_info', infos)
}



// Init Logging functionnality
var startup_log = function() {
    // Install hook to stdout
    console.log('Installing Hook on stdout')
    var stdout = process.stdout;
    install_hook_to(stdout);

    stdout.hook('write', function(string, encoding, fd, write) {
        write(string);
        Npm.require('fibers')(function() {
            send_event('log', {
                text: string.length > 1000 ? string.substr(0, 1000) + ". . . [truncated]" : string
            });
        }).run();
    });
    logInstalled = true;
    console.log('Hook on stdout installed')
}



// Init Logginf functionnality
var startup_health = function() {
    console.log('Installing Health')
    healthCheck = Meteor.setInterval(function() {
        var os = Npm.require('os');
        send_event('health', {
            cpus: os.cpus(),
            loadavg: os.loadavg(),
            uptime: os.uptime(),
            freemem: os.freemem(),
            usedmemory: (os.totalmem() - os.freemem()),
            processMem: process.memoryUsage().rss
        });
    }, 300000);
    healthInstalled = true
    console.log('Health installed')
}



// Login Remote Server
var auth = function(params) {
    console.log('auth:Starting Authentication ...')
    var appId = (params && params.appId) || (Meteor.settings && Meteor.settings.meteortics && Meteor.settings.meteortics.appId)
    var secret = (params && params.secret) || (Meteor.settings && Meteor.settings.meteortics && Meteor.settings.meteortics.secret)
    if (!appId) {
        return 
    }
    // We subscribe to remote collection
    Meteortics_Remote_Server.subscribe('server_auth', {
        appId: appId,
        secret: secret,
        serverId:serverId
    });
    console.log('auth:Subscribed to server_auth',appId,secret)

    // We start observing remote collection change to get default settings
    var connect = function() {
        Meteortics_Remote_Collection.find({
            appId: Meteor.settings.meteortics.appId
        }).observe({
            added: function(doc) {
                console.log('auth:received information from remote server', {
                    doc: doc
                })
                if (doc.secret == Meteor.settings.meteortics.secret) {
                    applicationId = Meteor.settings.meteortics.appId
                    Meteortics_Local_Collection.insert(_.omit(doc, '_id'), function() {
                        console.log('settings inserted into local collection')
                    })
                }
            }

        });
    }

    connect()

    Meteortics_Remote_Server.onReconnect = connect;
    return true
}


// Start authentication
Meteor.startup(function() {
    var intervalId, retries = 0
    intervalId = Meteor.setInterval(function() {
        ++retries
        if (retries > maxRetries || auth())
            Meteor.clearInterval(intervalId)
    }, 2000)
})



/**********************************************************
 *
 * Clients methods
 *
 **********************************************************/

// Listening to clientside events
Meteor.methods({
    '_Mevent': function(params) {
        send_event(params.type, params);
    }
});



// Publishto clients
Meteor.publish("_meteortics", function(clientParams) {
    console.log('Publishing _meteortics')
    var sessionId = Random.id()
    var params = {
            ip: this._session.socket.remoteAddress,
            headers: this._session.socket.headers,
            ddp: this._session.version,
            secure: clientParams.secure,
            preview: clientParams.preview,
            language: clientParams.language,
            referrer: clientParams.referrer,
            resolution: clientParams.resolution,
            uid: clientParams.uid,
            sessionId:sessionId
        },
        self = this;
    if (this.userId) params.user = getSafeUserProfile(this.userId);

    send_event('client_connexion', params);

    var onclose = Meteor.bindEnvironment(function() {
        console.log('Connexion closed by client')
        send_event('client_deconnexion', {
            count: _.size(self._session.server.sessions),
            userId: clientParams.uid,
            sessionId: sessionId
        })
    }, function() {});

    if (this.connection)
        this.connection.onClose(onclose);
    else this._session.socket._session.connection._events.close.push(onclose);

    this.ready();
});

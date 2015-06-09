Package.describe({
	summary: "Analytics package for meteor",
	version: "0.0.1",
	name: "meteortics-client"
});

Package.on_use(function (api) {
	if(api.versionsFrom) api.versionsFrom("METEOR@1.1.0.2");

	api.use(['templating', 'jquery'],'client');
	api.use(['ddp'],'server');
	api.use(['underscore', 'mongo', 'tracker', 'random', 'accounts-base'], ['server', 'client']);

	api.add_files(['client/client.js'], 'client');
	api.add_files(['server/server.js'], 'server');


	api.export(['Meteortics']);
});
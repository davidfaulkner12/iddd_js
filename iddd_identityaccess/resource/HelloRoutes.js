module.exports = [
{
    method: 'GET',
    path: '/hello',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
},

{
    method: 'GET',
    path: '/hello/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
}
]

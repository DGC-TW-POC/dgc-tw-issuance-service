module.exports = function (app ,passport) {
    app.set('json spaces', 4);
    //app.use('/api', require('api/example'));
    app.use('/api/vaccine' , require('./api/vaccine'));
    //app.use('/', require('web/index'));
    app.route('/:url(api|auth|web)/*').get((req, res) => {
        res.status(404).json({
          status: 404,
          message: "not found"
        });
    });
}
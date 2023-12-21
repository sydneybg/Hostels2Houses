
const express = require('express');
const router = express.Router();
const apiRouter = require('./api');


router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });


router.use('/api', apiRouter);

router.use(restoreUser);

router.use('/users', require('./users'));

router.use('/session', require('./session'));

module.exports = router;


//Testing Route:
// router.get('/hello/world', function(req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });

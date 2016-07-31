import express from 'express';

const router = express.Router();

function es6(req, res, next) {
  req.es6 = ' with es6';
  next();
}

router.get('/', es6, (req, res) => {
  res.end(`Works${req.es6}`);
});

router.route('/test').get(es6, (req, res) => {
    res.end(`Works${req.es6}`);
  }).post(es6, (req, res) => {
    res.end(`Works${req.es6} (post)`);
  });

export default router;
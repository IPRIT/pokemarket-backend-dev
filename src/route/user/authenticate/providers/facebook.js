export default (req, res) => {
  res.json({ result: req.facebookUser });
};
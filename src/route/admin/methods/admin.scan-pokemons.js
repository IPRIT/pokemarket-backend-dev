import { scanPokemons } from "../../../lib/pokedex";
import Log from 'log4js';

const log = Log.getLogger('Pokedex scanner');

export default async (req, res, next) => {
  let options = req.body;
  scanPokemons(options).then(() => {
    log.info('Scanner task is done!');
  }).catch(console.error.bind(console));
  res.json({ result: { message: 'Created task' } });
}
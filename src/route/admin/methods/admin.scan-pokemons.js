import { scanPokemons } from "../../../lib/pokedex/pokedex";

export default async (req, res, next) => {
  let options = req.body;
  scanPokemons(options).then(pokemons => {
    res.json({ handled: pokemons.length });
  }).catch(next);
}
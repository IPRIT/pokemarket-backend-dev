import Promise from 'bluebird';
import request from 'request-promise';
import deap from 'deap';
import { Pokemon } from '../../models';
import { filterEntity as filter } from '../../utils';

const API_URI_BASE = 'http://pokeapi.co/api/v2';

export function scanPokemons(options = { force: false }) {
  let concurrency = 40;
  return getPokemons().delay(1000).map(async (pokemonMetaInfo, pokemonIndex) => {
    let existPokemon = await Pokemon.getByName(pokemonMetaInfo && pokemonMetaInfo.name);
    if (existPokemon && !options.force) {
      console.log(`A pokemon "${pokemonMetaInfo.name}" already exists.`);
      return Promise.resolve(existPokemon.get({ plain: true })).delay(200);
    }
    console.log(`Encountering pokemon ${pokemonMetaInfo.name} (id: ${pokemonMetaInfo.url.match(/(\d+)\/$/i)[1]}) (index: ${pokemonIndex + 1})...`);
    let pokemonInfo = await getRequest(pokemonMetaInfo.url).delay(300);
    console.log(`Got a pokemon ${pokemonMetaInfo.name} (id: ${pokemonMetaInfo.url.match(/(\d+)\/$/i)[1]}) (index: ${pokemonIndex + 1})...`);
    let filteredPokemonInfo = filter(pokemonInfo, { include: [
      'name', 'height', 'weight', 'id', 'base_experience'
    ] });
    filteredPokemonInfo.weight /= 10;
    filteredPokemonInfo.height /= 10;
    deap.extend(filteredPokemonInfo, {
      image: pokemonInfo.sprites && (
        pokemonInfo.sprites.front_default
        || pokemonInfo.front_female
        || pokemonInfo.sprites.front_shiny
        || pokemonInfo.front_shiny_female
      ),
      types: pokemonInfo.types && (
        pokemonInfo.types.map(typeEntity => typeEntity.type.name)
      )
    });
    await (!!existPokemon ? updatePokemon.bind(null, existPokemon) : savePokemon)(filteredPokemonInfo);
    return filteredPokemonInfo;
  }, { concurrency }).call('sort', (a, b) => a.id - b.id);
}

async function getPokemons(options = { limit: 1000, offset: 0 }) {
  let apiEndpointUri = '/pokemon';
  console.log('Fetching pokemons...');
  let apiResult = await getRequest(apiEndpointUri, options);
  return apiResult.results;
}

function savePokemon(pokemonInfo) {
  return Pokemon.create(pokemonInfo).catch(err => {
    console.error('Unable to save a pokemon:', err);
  });
}

function updatePokemon(pokemonInstance, pokemonInfo) {
  console.log(`Updating pokemon "${pokemonInfo.name}"...`);
  return pokemonInstance.update(pokemonInfo).catch(err => {
    console.error('Unable to update a pokemon:', err);
  });
}

function getRequest(uriEndpoint, params = {}) {
  let absoluteUriRegexp = /^https?/i;
  let apiEndpoint = absoluteUriRegexp.test(uriEndpoint) ?
    uriEndpoint : `${API_URI_BASE}${uriEndpoint}`;
  var options = {
    uri: apiEndpoint,
    qs: params,
    headers: {
      'User-Agent': 'Poke Market'.split('').reverse().join('')
    },
    json: true
  };
  return Promise.resolve(request(options));
}
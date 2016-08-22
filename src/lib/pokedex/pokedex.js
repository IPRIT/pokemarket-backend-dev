import Promise from 'bluebird';
import request from 'request-promise';
import deap from 'deap';
import { Pokemon } from '../../models';
import { filterEntity as filter } from '../../utils';import Log from 'log4js';

const log = Log.getLogger('Pokedex scanner');
const API_URI_BASE = 'http://pokeapi.co/api/v2';
let isActive = false;
let activeTimeout;

export function scanPokemons(options = { force: false }) {
  if (isActive) {
    return Promise.reject(new Error('Task is still running'));
  }
  isActive = true;
  activeTimeout = setTimeout(() => isActive = false, 1000 * 30 * 60); // 30 minutes for timeout
  let concurrency = 40;
  return getPokemons().delay(1000).map(async (pokemonMetaInfo, pokemonIndex) => {
    let existPokemon = await Pokemon.getByName(pokemonMetaInfo && pokemonMetaInfo.name);
    if (existPokemon && !options.force) {
      log.debug(`A pokemon "${pokemonMetaInfo.name}" (id: ${pokemonMetaInfo.url.match(/(\d+)\/$/i)[1]}) already exists.`);
      return Promise.resolve().delay(500);
    }
    log.debug(`Encountering pokemon ${pokemonMetaInfo.name} (id: ${pokemonMetaInfo.url.match(/(\d+)\/$/i)[1]}) (index: ${pokemonIndex + 1})...`);
    let pokemonInfo = await getRequest(pokemonMetaInfo.url).delay(300);
    if (!pokemonInfo) {
      return Promise.resolve().delay(500);
    }
    log.debug(`Got a pokemon ${pokemonMetaInfo.name} (id: ${pokemonMetaInfo.url.match(/(\d+)\/$/i)[1]}) (index: ${pokemonIndex + 1})...`);
    let filteredPokemonInfo = filter(pokemonInfo, { include: [
      'name', 'height', 'weight', 'id', 'base_experience'
    ] });
    filteredPokemonInfo.weight /= 10;
    filteredPokemonInfo.height /= 10;
    deap.extend(filteredPokemonInfo, {
      image: pokemonInfo.sprites && (
        pokemonInfo.sprites.front_default
        || pokemonInfo.sprites.front_female
        || pokemonInfo.sprites.front_shiny
        || pokemonInfo.sprites.front_shiny_female
      ),
      types: pokemonInfo.types && (
        pokemonInfo.types.map(typeEntity => typeEntity.type.name)
      ) || []
    });
    await (!!existPokemon ? updatePokemon.bind(null, existPokemon) : savePokemon)(filteredPokemonInfo);
    return Promise.resolve().delay(500);
  }, { concurrency }).then(() => {
    isActive = false;
    clearTimeout(activeTimeout);
  });
}

async function getPokemons(options = { limit: 1000, offset: 0 }) {
  let apiEndpointUri = '/pokemon';
  log.debug('Fetching pokemons...');
  let apiResult = await getRequest(apiEndpointUri, options);
  return apiResult.results;
}

function savePokemon(pokemonInfo) {
  return Pokemon.create(pokemonInfo).catch(err => {
    console.error('Unable to save a pokemon:', err);
  });
}

function updatePokemon(pokemonInstance, pokemonInfo) {
  log.debug(`Updating pokemon "${pokemonInfo.name}"...`);
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
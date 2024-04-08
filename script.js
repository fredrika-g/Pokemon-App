// global variabes
let mainPokemonSelect = document.querySelector("#pokemonSelect1");
let secondPokemonSelect = document.querySelector("#pokemonSelect2");
let secondaryDropdown = document.querySelector(".secondaryDropdown");
let compareBtn = document.querySelector("#compareBtn");

// storing chosen pokemon
let chosenPokemonList = [];
let allPokemon = [];

// pokemon class
class Pokemon {
  constructor(id, name, imageUrl, types, weight, height, stats) {
    this.id = id;
    this.name = name;
    this.image = imageUrl;
    this.types = types;
    this.weight = weight;
    this.height = height;
    this.stats = stats;
  }
  static compareTwoPokemon(pokemon1, pokemon2) {}
}

// get data function
const getData = async (url) => {
  let data = await fetch(url);
  let response = data.json();

  return response;
};

// getting one pokemon and related data
const getPokemon = async (pokemonId) => {
  try {
    let pokemon = await getData(
      "https://pokeapi.co/api/v2/pokemon/" + pokemonId
    );

    let name = pokemon.name;
    name = name.charAt(0).toUpperCase() + name.slice(1);

    let image = pokemon.sprites.other["official-artwork"].front_default;

    let newPokemon = new Pokemon(
      +pokemon.id,
      name,
      image,
      pokemon.types,
      pokemon.weight,
      pokemon.height,
      pokemon.stats
    );
    return newPokemon;
  } catch (err) {
    console.log(err);
  }
};

// creating pokemon cards
const renderPokemonCards = () => {
  let displayDiv = document.querySelector(".displayedPokemon");
  displayDiv.innerHTML = "";

  chosenPokemonList.forEach((pokemon) => {
    let pokemonCard = document.createElement("article");
    pokemonCard.classList.add("pokemonCard");

    let header = document.createElement("div");
    header.classList.add("flex", "flex-row");
    header.innerHTML = `<span>${pokemon.name}</span><img class="cardImage" src="${pokemon.image}" alt="${pokemon.name} image">`;

    pokemonCard.append(header);
    displayDiv.append(pokemonCard);
  });
};

// populating the dropdown
window.addEventListener("load", async () => {
  let data = await getData("https://pokeapi.co/api/v2/pokemon?limit=151");
  let pokemons = data.results;
  allPokemon = pokemons;

  pokemons.forEach((pokemon, index) => {
    let name = pokemon.name;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    mainPokemonSelect.innerHTML += `<option value="${
      index + 1
    }">${name}</option>`;
  });
});

mainPokemonSelect.addEventListener("change", async () => {
  let chosenPokemon = +mainPokemonSelect.value;

  let thisPokemon = await getPokemon(chosenPokemon);
  chosenPokemonList[0] = thisPokemon;

  //   populating second dropdown
  allPokemon.forEach((pokemon, index) => {
    if (pokemon.name.toLowerCase() !== thisPokemon.name.toLowerCase()) {
      let name = pokemon.name;
      name = name.charAt(0).toUpperCase() + name.slice(1);
      secondPokemonSelect.innerHTML += `<option value="${
        index + 1
      }">${name}</option>`;
    }
  });

  secondaryDropdown.classList.remove("display-none");
});

secondPokemonSelect.addEventListener("change", async () => {
  let chosenPokemon = +secondPokemonSelect.value;

  chosenPokemon = await getPokemon(chosenPokemon);
  chosenPokemonList[1] = chosenPokemon;

  compareBtn.classList.remove("display-none");
  console.log(chosenPokemonList);
  renderPokemonCards();
});

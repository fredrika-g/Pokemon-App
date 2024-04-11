// global variabes
let mainPokemonSelect = document.querySelector("#pokemonSelect1");
let secondPokemonSelect = document.querySelector("#pokemonSelect2");
let secondaryDropdown = document.querySelector(".secondaryDropdown");
let compareBtn = document.querySelector("#compareBtn");
let toBattleBtn = document.querySelector("#toBattleBtn");

let compareSection = document.querySelector("#compareSection");
let battleSection = document.querySelector("#battleSection");

let breakpoint = 768;

// storing chosen pokemon
let chosenPokemonList = [];
let allPokemon = [];
let comparingPokemonList = [];
let battlingPokemon = [];

// pokemon class
class Pokemon {
  constructor(
    id,
    name,
    imageUrl,
    types,
    weight,
    height,
    stats,
    moves,
    showdown
  ) {
    this.id = id;
    this.name = name;
    this.image = imageUrl;
    this.types = types;
    this.weight = weight;
    this.height = height;
    this.stats = stats;
    this.moves = moves;
    this.showdown = showdown;
    this.compared = {};
  }
  static compareTwoPokemon(pokemon1, pokemon2) {
    let p1Score = 0;
    let p2Score = 0;

    let p1 = { ...pokemon1 };
    let p2 = { ...pokemon2 };

    comparingPokemonList = [p1, p2];

    getHighestValue(p1, p2, "weight");
    getHighestValue(p1, p2, "height");

    pokemon1.stats.forEach((stat) => {
      getHighestStat(stat.stat.name);
    });

    for (let key in p1.compared) {
      p1.compared[key].value > p2.compared[key].value ? p1Score++ : p2Score++;
    }

    let winner = p1Score > p2Score ? p1.name : p2.name;

    return `${
      p1Score === p2Score
        ? "It's a tie!"
        : `${winner} wins in the most categories!`
    }`;
  }
}

// functions to compare stats (2)
const getHighestValue = (p1, p2, valueName) => {
  if (p1[valueName] > p2[valueName]) {
    p1.compared[valueName] = {
      stat_name: valueName,
      value: p1[valueName],
      isHighest: true,
    };
    p2.compared[valueName] = {
      stat_name: valueName,
      value: p2[valueName],
      isHighest: false,
    };
  } else {
    p1.compared[valueName] = {
      stat_name: valueName,
      value: p1[valueName],
      isHighest: false,
    };
    p2.compared[valueName] = {
      stat_name: valueName,
      value: p2[valueName],
      isHighest: true,
    };
  }
};

const getHighestStat = (statType) => {
  let pokemon1 = comparingPokemonList[0];
  let pokemon2 = comparingPokemonList[1];

  let stat1 = pokemon1.stats.filter(
    (stat) => stat.stat.name.toLowerCase() === statType
  );
  let stat2 = pokemon2.stats.filter(
    (stat) => stat.stat.name.toLowerCase() === statType
  );

  stat1 = stat1[0];
  stat2 = stat2[0];

  stat1.base_stat > stat2.base_stat
    ? (pokemon1.compared[statType] = {
        stat_name: statType,
        value: stat1.base_stat,
        isHighest: true,
      })
    : (pokemon1.compared[statType] = {
        stat_name: statType,
        value: stat1.base_stat,
        isHighest: false,
      });

  stat2.base_stat > stat1.base_stat
    ? (pokemon2.compared[statType] = {
        stat_name: statType,
        value: stat2.base_stat,
        isHighest: true,
      })
    : (pokemon2.compared[statType] = {
        stat_name: statType,
        value: stat2.base_stat,
        isHighest: false,
      });
};

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

    let { front_default, back_default } = pokemon.sprites.other.showdown;

    let showdown = { front: front_default, back: back_default };

    let newPokemon = new Pokemon(
      +pokemon.id,
      name,
      image,
      pokemon.types,
      pokemon.weight,
      pokemon.height,
      pokemon.stats,
      pokemon.moves,
      showdown
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
    let stats = {};

    pokemon.stats.forEach((stat) => {
      stats[stat.stat.name] = stat.base_stat;
    });

    let pokemonCard = document.createElement("article");
    pokemonCard.classList.add("pokemonCard");

    let header = document.createElement("div");
    header.classList.add("flex", "flex-row", "card-header");
    header.innerHTML = `<h2>${pokemon.name}</h2><img class="cardImage" src="${pokemon.image}" alt="${pokemon.name} image">`;

    let types = pokemon.types.map((typeObj) => {
      return typeObj.type.name;
    });

    types = types.toString();
    let body = document.createElement("div");
    body.classList.add("stats", "flex", "flex-column");

    let regularStats = document.createElement("div");
    regularStats.classList.add("flex", "flex-column");
    regularStats.innerHTML = `<div class="flex"><h3 class="flex"><span>Weight</span><span>${pokemon.weight}</span></h3><h3 class="flex"><span>Height</span><span>${pokemon.height}</span></h3></div>
    <h3 class="flex"><span>Type(s)</span><span>${types}</span></h3>`;

    let specStatsDiv = document.createElement("div");
    specStatsDiv.classList.add("statsDiv", "flex", "flex-column");
    let specStats = document.createElement("div");
    specStats.classList.add("flex", "flex-row");
    specStats.innerHTML = `<div class="flex flex-column left-stats">
    <h3 class="flex"><span>HP</span><span>${stats.hp}</span></h3>
    <h3 class="flex"><span>Attack</span><span>${stats.attack}</span></h3>
    <h3 class="flex"><span>Defense</span><span>${stats.defense}</span></h3>
    </div>
    <div class="flex flex-column right-stats">
    <h3 class="flex"><span>Speed</span><span>${stats.speed}</span></h3>
    <h3 class="flex"><span>Special Attack</span><span>${stats["special-attack"]}</span></h3>
    <h3 class="flex"><span>Special Defense</span><span>${stats["special-defense"]}</span></h3>
    
    </div>`;

    specStatsDiv.innerHTML = "<h3 class='title'>Stats</h3>";
    specStatsDiv.append(specStats);
    body.append(regularStats, specStatsDiv);
    pokemonCard.append(header, body);
    displayDiv.append(pokemonCard);
  });
};

// creating comparison display
const showComparison = () => {
  let pokemon1 = comparingPokemonList[0];
  let pokemon2 = comparingPokemonList[1];

  let statNames = [
    { name: "Weight", className: "weight" },
    { name: "Height", className: "height" },
    { name: "HP", className: "hp" },
    { name: "Speed", className: "speed" },
    { name: "Attack", className: "attack" },
    { name: "Special Attack", className: "specAtt" },
    { name: "Defense", className: "defense" },
    { name: "Special Defense", className: "specDef" },
  ];

  compareSection.innerHTML = "";

  statNames.forEach((item) => {
    compareSection.innerHTML += `<h3 class="${item.className}">${item.name}</h3>`;
  });

  comparingPokemonList.forEach((pokemon, i) => {
    let { weight, height, hp, speed, attack, defense } = pokemon.compared;
    let specialAttack = pokemon.compared["special-attack"];
    let specialDefense = pokemon.compared["special-defense"];
    let statArray = [
      weight,
      height,
      hp,
      speed,
      attack,
      specialAttack,
      defense,
      specialDefense,
    ];

    compareSection.innerHTML += `<img class="compare-image${i}" src="${pokemon.image}" alt="${pokemon.name}"/>`;
    compareSection.innerHTML += `<h2 class="compare-name${i}">${pokemon.name}</h2>`;
    statArray.forEach((stat) => {
      compareSection.innerHTML += `<h4 class="${
        stat.isHighest ? "highest" : ""
      } ${stat.stat_name}Val${i}">${stat.value}</h4>`;
    });
  });

  compareSection.innerHTML += `<p class="compare-msg">${Pokemon.compareTwoPokemon(
    pokemon1,
    pokemon2
  )}</p>`;
};

// starting battle
const startBattle = () => {
  document.querySelector("#battleStatus").innerText = "Battle has started!";

  battlingPokemon = [...chosenPokemonList];

  let startingPlayer = battlingPokemon.find(
    (pokemon) => pokemon.compared.speed.isHighest
  );
  let nonStartingPlayer = battlingPokemon.find(
    (pokemon) => !pokemon.compared.speed.isHighest
  );

  console.log(startingPlayer);

  let attackPoints =
    startingPlayer.compared.attack.value +
    startingPlayer.compared["special-attack"].value;

  let defensePoints =
    nonStartingPlayer.compared.defense.value +
    nonStartingPlayer.compared["special-defense"].value;

  let damage = attackPoints - defensePoints * 0.8;
  console.log("Damage: ", damage);
  console.log("HP: ", nonStartingPlayer.compared.hp.value);

  nonStartingPlayer.battleHP = nonStartingPlayer.compared.hp.value - damage;
  console.log("New HP: ", nonStartingPlayer.battleHP);

  renderBattleBoard(true);
};

const renderBattleBoard = (isStartOfGame, nextPlayerIndex = "") => {
  battleSection.innerHTML = "";
  let playersAndStatsSection = document.createElement("div");
  playersAndStatsSection.classList.add("playersAndStats");
  battleSection.append(playersAndStatsSection);
  playersAndStatsSection.innerHTML = '<h3 class="versus">vs</h3>';
  playersAndStatsSection.innerHTML += '<span class="battleHP">HP</span>';

  let attackSelect = document.createElement("select");
  attackSelect.id = "attackSelect";
  attackSelect.classList.add("pokemonSelect");

  let currentPlayer;
  let nextPlayer;
  chosenPokemonList.forEach((pokemon, i) => {
    let turn;
    let isCurrentPlayer;
    if (isStartOfGame) {
      turn = pokemon.compared.speed.isHighest
        ? "currentPlayer"
        : "nonCurrentPlayer";

      isCurrentPlayer = pokemon.compared.speed.isHighest;
    } else if (nextPlayerIndex === i) {
      turn = "currentPlayer";
      isCurrentPlayer = true;
    } else if (nextPlayerIndex !== i) {
      turn = "nonCurrentPlayer";
      isCurrentPlayer = false;
    }

    if (isCurrentPlayer) {
      currentPlayer = pokemon;

      pokemon.moves.forEach((move) => {
        attackSelect.innerHTML += `<option value="${move.move.url}">${move.move.name}</option>`;
      });
    } else {
      nextPlayer = pokemon;
    }

    playersAndStatsSection.innerHTML += `<h3 class="player${i}">${pokemon.name}</h3>`;
    playersAndStatsSection.innerHTML += `<span class="player${i}HP">${pokemon.compared.hp.value}</span>`;

    playersAndStatsSection.innerHTML += `<img class="${turn}" src="${
      isCurrentPlayer ? pokemon.showdown.back : pokemon.showdown.front
    }" alt="${pokemon.name}"/>`;
  });

  battleSection.innerHTML += `<div class="flex flex-column currentMove">
  <h4>Current move:</h4>
  <span id="playerName">${currentPlayer.name}</span>
  </div>`;
  battleSection.innerHTML +=
    '<div class="flex flex-column battleMessages"></div>';

  let attackSelectSection = document.createElement("div");
  attackSelectSection.classList.add("flex", "flex-column", "attackSection");
  battleSection.append(attackSelectSection);

  attackSelectSection.innerHTML = "<h5>Pick an attack</h5>";
  let attackBtn = document.createElement("button");
  attackBtn.id = "attackBtn";
  attackBtn.classList.add("primary-btn");
  attackBtn.innerText = "Attack!";
  attackBtn.addEventListener("click", () => {
    attack(currentPlayer, nextPlayer);
  });
  attackSelectSection.append(attackSelect, attackBtn);
};

const attack = (current, next) => {
  console.log("Current player: ", current.name);
  console.log("Next player: ", next.name);
};

// toggling class on section based on window size
window.addEventListener("resize", () => {
  let w = window.innerWidth;

  if (w <= breakpoint) {
    compareSection.classList.add("mobile");
    compareSection.classList.remove("desktop");
  } else {
    compareSection.classList.add("desktop");
    compareSection.classList.remove("mobile");
  }
});

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
  toBattleBtn.classList.remove("display-none");
  document.querySelector(".battle-break").classList.remove("display-none");
  renderPokemonCards();
  Pokemon.compareTwoPokemon(chosenPokemonList[0], chosenPokemonList[1]);

  showComparison();
});

compareBtn.addEventListener("click", () => {
  compareSection.scrollIntoView({ behavior: "smooth" });
});

toBattleBtn.addEventListener("click", () => {
  battleSection.scrollIntoView({ behavior: "smooth" });

  startBattle();
});

// Inlämningsuppgift - Pokemon Application G/VG

// Er uppgift är att skapa ett gränssnitt där man kan få ut information om olika Pokemon.

// API Endpoint: https://pokeapi.co/api/v2/pokemon?limit=151

// Del 1 - Pokedex

// Skapa en dropdown-lista med samtliga dina Pokemon. Användaren ska kunna välja en Pokemon för att hämta dess data.
// Skapa en klass för varje Pokemon som har följande värden:
// Namn.
// Bild på en Pokemon.
// Vilken/Vilka typer din pokemon har (dvs “types” i API:et)
// Vikt
// Längd
// Samtliga 6 av dess stats - HP (Hit points), Attack, Special Attack, Defense, Special Defense, Speed.
// Metod för att jämföra två Pokemon med varandra.
// Visa ut den valda Pokemonen med alla dess tillhörande värden.

// Del 2 - Jämför Pokemon
// Gör det möjligt för användaren att välja ytterligare en Pokemon. Skriv ut alla dess värden.
// Användare ska kunna jämföra två Pokemon med varandra.
// Markera med färg vilken Pokemon som har högst värde vid jämförelse - jämför vikt, längd samt alla dess stats. Skriv ut i DOM:en vilken Pokemon som vinner i flest kategorier.

// Del 3 - Pokemon Battle (VG)
// Gör det möjligt för de två valda Pokemon att slåss mot varandra och se vem som vinner.

// Hur det går till:
// Bägge Pokemon turas om att attackera varandra, tills en av deras HP (Hit points) når 0.
// Den Pokemon med högst speed börjar.
// Namnet på en Pokemon attack är den första i dess “moves”-lista.
// Damage calculation formula:
// Attackerande Pokemon (röd) - Försvarande Pokemon (blå)
// (Attack+Special Attack) - (Defense+Special defense) * 0.8 = Skada
// Subtrahera den försvarande Pokemons HP med den gjorda skadan.
// Varje attack måste göra minst 10 i skada. T.ex om den beräknade skadan är 4, ändra det till 10.

// Skriv ut i DOM:en hur kampen går till.
// T.ex “Mewtwo used Mega punch and did 45 damage. Bulbasaur remaining HP: 10.
// Bulbasaur used Razor Wind and did 10 damage. Mewtwo remaining HP: 180.
// Mewtwo used Mega punch and did 45 damage. Bulbasaur remaining HP: 0. Mewtwo wins!

// Lycka till!

// Individuell rapport (ca 0,5-1 sida)
// Arbetsprocessen
// Hur såg arbetsprocessen ut med slutprojektet?
// Vilka moment var mest utmanande?
// Vilka hinder stötte du på och hur lyckades du lösa dem?
// Reflektioner
// Har du funnit något moment mer intressant/roligt under projektet?
// Vilka lärdomar tar du med dig från projektarbetet?

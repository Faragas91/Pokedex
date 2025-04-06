async function fetchPokemonData(startIndex, endIndex) {
    for (let index = startIndex; index <= endIndex; index++) {
        let responseJson = await fetchSinglePokemonData(index);
        pokemonCardsData.push(responseJson);
        generatePokemonCards(responseJson);
    }
    return pokemonCardsData;
}

async function fetchSinglePokemonData(pokemonId) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let responseJson = await response.json();
    return responseJson;
}

function generatePokemonCards(responseJson) {
    const content = document.getElementById('content');
    const cardId = `card-${responseJson.id}`;
    const textTypeId1 = `textType1-${responseJson.id}`;
    const textTypeId2 = `textTypeId2-${responseJson.id}`;

    templateForPokemonCards(responseJson, content, cardId, textTypeId1, textTypeId2)
    addPokemonTypes(responseJson, cardId, textTypeId1, textTypeId2);
}

function addPokemonTypes(responseJson, cardId, textTypeId1, textTypeId2) {
    const card = document.getElementById(cardId);
    const textType1 = document.getElementById(textTypeId1);
    const typeName1 = responseJson.types[0].type.name;
    card.classList.add(typeName1);
    textType1.classList.add(`${typeName1}-bg-type`);
        
    if (responseJson.types[1]) {
        const textType2 = document.getElementById(textTypeId2);
        const typeName2 = responseJson.types[1].type.name;
        textType2.classList.add(`${typeName2}-bg-type`);
    }
}
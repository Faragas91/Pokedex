async function fetchAllTypeDetails() {
    const typeList = await getListFromTypes();
    const typeDetails = await getDetailsFromTypes(typeList)
    return typeDetails;
}

async function getListFromTypes() {
    const response = await fetch('https://pokeapi.co/api/v2/type');
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
}

async function getDetailsFromTypes(typeList) {
    for (const type of typeList.results) {
        const typeResponse = await fetch(type.url);
        if (!typeResponse.ok) {
            throw new Error(`Failed to fetch details for ${type.name}`);
        }
        const typeData = await typeResponse.json();
        extractDetailsFromTypes(type, typeData);
    }
}

function extractDetailsFromTypes(type, typeData) {
    const details = {
        name: type.name,
        strengths: typeData.damage_relations.double_damage_to.map(t => t.name),
        weaknesses: typeData.damage_relations.double_damage_from.map(t => t.name),
        immunities: typeData.damage_relations.no_damage_from.map(t => t.name),
    };
    if (!typeDetails.some(t => t.name === details.name)) {
        typeDetails.push(details);
    }
    return typeDetails;
}
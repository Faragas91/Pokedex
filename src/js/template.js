function templateForPokemonCards(responseJson, content, cardId, textTypeId1, textTypeId2) {
    return content.innerHTML += 
    `
        <div onclick="makeImagesBigger('${cardId}', 'responseJson')"class="card" id="${cardId}">
            ${templateForCardBody(responseJson)}
            ${templateForImageAndType(responseJson, textTypeId1, textTypeId2)}
            ${templateForCardFooter(cardId)}
        </div>
        <div class="next-buttons none">
            <button onclick="navigateCard('left')" class="next__left-picture"></button>
            <button onclick="navigateCard('right')" class="next__right-picture"></button>
        </div>
     `;
}

function templateForCardBody(responseJson) {
    return `
        <div class="card-body">
            <p class="card-text text-id">#${responseJson.id}</p>
            <p class="card-text kanit-medium-italic">${responseJson.name.charAt(0).toUpperCase() + responseJson.name.slice(1).toLowerCase()}</p>
        </div>
    `;
}

function templateForImageAndType(responseJson, textTypeId1, textTypeId2) {
    return `
        <div class="display-flex-center direction-row-reverse space-evenly">
            <img src="${responseJson.sprites.other["official-artwork"].front_default}" class="card-img-top">
            <div class="display-flex-center direction-column gap-10">
                <p class="card-text text-type" id="${textTypeId1}">${responseJson.types[0].type.name.charAt(0).toUpperCase() + responseJson.types[0].type.name.slice(1).toLowerCase()}</p>
                    ${
                        responseJson.types[1] 
                        ? `<p class="card-text text-type" id="${textTypeId2}">${responseJson.types[1].type.name.charAt(0).toUpperCase() + responseJson.types[1].type.name.slice(1).toLowerCase()}</p>`
                        : ''
                    }
            </div>
        </div>
    `;
}

function templateForCardFooter(cardId) {
    return `
        <div class="card-footer none">
        <div class="btn-group display-flex-center" role="group" aria-label="Second group">
            <button onclick="generateCardDetails('about')" type="button" class="btn btn-secondary hover-underline-animation">About</button>
            <button onclick="generateCardDetails('status')" type="button" class="btn btn-secondary hover-underline-animation">Status</button>
            <button onclick="generateCardDetails('strong/weak')" type="button" class="btn btn-secondary hover-underline-animation">Strong/Weak</button>
        </div>
        <div class="card-details display-flex-center direction-column" id="details-${cardId}"></div>
    `;
}

////////////////////////////////////
// Template for the About section //
////////////////////////////////////
function templateForAboutSection(currentPokemon, cardDetails) {
    const hiddenAbility = currentPokemon.abilities.length < 2 
        ? '-----' 
        : currentPokemon.abilities[1].ability.name;

    templateForAbout(currentPokemon, cardDetails, hiddenAbility);
}

function templateForAbout(currentPokemon, cardDetails, hiddenAbility) {
    cardDetails.innerHTML = `
    <ul class="list-group list-group-flush pd-top-bottom-10 wd-100">
        <li class="list-group-item sour-gummy"><p class="ft-size-24 text-underline">Name:</p> ${capitalize(currentPokemon.name)}</li>
        <li class="list-group-item sour-gummy"><p class="ft-size-24 text-underline">Weight:</p> ${currentPokemon.weight}kg</li>
        <li class="list-group-item sour-gummy"><p class="ft-size-24 text-underline">Height:</p> ${currentPokemon.height}m</li>
        <li class="list-group-item sour-gummy"><p class="ft-size-24 text-underline">Abilities:</p> ${currentPokemon.abilities[0].ability.name}</li>
        <li class="list-group-item sour-gummy"><p class="ft-size-24 text-underline">Abilities (hidden):</p> ${hiddenAbility}</li>
    </ul>
    `;
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/////////////////////////////////////
// Template for the Status section //
/////////////////////////////////////

function templateForStatusSection(cardIndex, cardDetails) {
    const stats = templateStats();
    const statsHTML = stats.map(stat => generateStatHTML(stat.id, stat.label, cardIndex)).join('');

    cardDetails.innerHTML = `
        <div class="mg-top-bottom-10 wd-100" id="stats-container">
            ${statsHTML}
        </div>
    `;
}

function templateStats() {
    return [
        { id: 'hp', label: 'HP' },
        { id: 'attack', label: 'Attack' },
        { id:'special-attack', label: 'Special Attack' },
        { id: 'defense', label: 'Defense' },
        { id:'special-defense', label: 'Special Defense' },
        { id:'speed', label: 'Speed' }
    ];
}

function generateStatHTML(statId, label, cardIndex) {
    return `
        <p class="sour-gummy ft-size-24 text-underline">${label}:</p>
        <div class="progress">
            <div id="${statId}-bar-${cardIndex}" class="progress-bar ft-size-15" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                <span id="${statId}-value-${cardIndex}"></span>
            </div>
        </div>
    `;
}

/////////////////////////////////////////
// Template for the StrongWeak section //
/////////////////////////////////////////

function templateForStrongWeakSection(typeDetails) {
    const strengthsHTML = templateToGenerateTypeHTML('Strengths', typeDetails.strengths);
    const weaknessesHTML = templateToGenerateTypeHTML('Weakness', typeDetails.weaknesses);
    const immunitiesHTML = templateToGenerateTypeHTML('Immunities', typeDetails.immunities);

    return { strengthsHTML, weaknessesHTML, immunitiesHTML };
}

function templateToGenerateTypeHTML(title, types) {
    if (types.length === 0) return '';
    return `
        <p class="sour-gummy ft-size-20 text-underline">${title}:</p>
        <ul class="wrap-center">
            ${types.map(type => `<li class="card-text text-type ${type}-bg-type">${type}</li>`).join('')}
        </ul>
    `;
}

function generateTypeHTML(cardDetails, currentPokemon, strengthsHTML, weaknessesHTML, immunitiesHTML) {
    cardDetails.innerHTML += `
        <p class="type-headliner card-text text-type ${currentPokemon}-bg-type" > ${currentPokemon.charAt(0).toUpperCase() + currentPokemon.slice(1).toLowerCase()}</p>
        ${strengthsHTML}
        ${weaknessesHTML}
        ${immunitiesHTML}
        <div class="divider"></div>
    `;
}



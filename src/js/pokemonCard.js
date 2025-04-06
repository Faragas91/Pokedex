let pokemonCardsData = [];
let typeDetails = [];
let isPokemonCardActive = false;
let activeCardId = null;

//////////////////////////////////////////
// Section for to make the Image bigger //
//////////////////////////////////////////
function makeImagesBigger(cardId) {
    if (activeCardId === cardId || isPokemonCardActive) return;

    const clickedCard = document.getElementById(cardId);
    const cardFooter = clickedCard.querySelector('.card-footer');
    const cardElements = document.querySelectorAll('[id^="card-"]');
    const loadMorePokemons = document.getElementById('button-load'); 
    const pageHeader = document.getElementById('header');
    const navigationButton = clickedCard.querySelector('.next-buttons');

    checkToCloseBiggerImage(cardId);
    checkIfCardIsActive(clickedCard, cardId, cardFooter, cardElements, loadMorePokemons, pageHeader, navigationButton);
    generateCardDetails('about');
}

function checkIfCardIsActive(clickedCard, cardId, cardFooter, cardElements, loadMorePokemons, pageHeader, navigationButton) {
    if (!isPokemonCardActive || activeCardId !== cardId) {
        activeCardId = cardId

        changeDisplayForCardElements(cardElements, cardId, clickedCard)
        styleImageBigger(clickedCard, navigationButton);
        showOverlay(loadMorePokemons, pageHeader);
        addCardFooter(cardFooter)
    }
}

function styleImageBigger(clickedCard, navigationButton) {
    clickedCard.classList.add('clicked-card');
    clickedCard.classList.add('no-hover');
    addNextButtons(navigationButton)
}

function checkToCloseBiggerImage(cardId) {
    if (isPokemonCardActive && activeCardId && activeCardId !== cardId) {
        closeCard(activeCardId);
    }
}

function changeDisplayForCardElements(cardElements, cardId, clickedCard) {
    cardElements.forEach(card => {
        card.style.display = card.id === cardId ? 'block' : 'none';
    });
    clickedCard.classList.add('clicked-card');
}

function showOverlay(loadMorePokemons, pageHeader) {
    loadMorePokemons.style.display = 'none'
    const overlay = document.getElementById('overlay');
    pageHeader.style.display = 'none';
    overlay.style.display = 'block';
    isPokemonCardActive = true;
}

function addCardFooter(cardFooter) {
    if (cardFooter) {
        cardFooter.classList.remove('none');
    }
}

function addNextButtons(navigationButton) {
    if (navigationButton) {
        navigationButton.classList.remove('none');
    }
}

////////////////////////////////////////////
// Section for to close the bigger Image ///
////////////////////////////////////////////

function closeCard(cardId) {
    const clickedCard = document.getElementById(cardId);
    const cardFooter = clickedCard.querySelector('.card-footer');
    const cardElements = document.querySelectorAll('[id^="card-"]');
    const overlay = document.getElementById('overlay');
    const loadMorePokemons = document.getElementById('button-load');
    const pageHeader = document.getElementById('header');
    const navigationButton = clickedCard.querySelector('.next-buttons');
    
    for (let i = 0; i < cardElements.length; i++) {
        styleImageToNormal(cardElements[i], clickedCard, navigationButton)
    }   
    changeLayoutToNormal(clickedCard, loadMorePokemons, overlay, pageHeader, cardFooter)
}

function styleImageToNormal(cardElements, clickedCard, navigationButton) {
    clickedCard.classList.remove('no-hover');
    cardElements.style.display = 'flex';
    cardElements.style.minHeight = 'auto';
    cardElements.style.maxWidth = '300px';
    cardElements.style.marginTop = 'auto';
    cardElements.style.marginBottom = '10px';
    cardElements.style.zIndex = 1;
    removeNextButtons(navigationButton)
}

function changeLayoutToNormal(clickedCard, loadMorePokemons, overlay, pageHeader, cardFooter) {
    if (clickedCard && isPokemonCardActive) {
        loadMorePokemons.style.display = 'flex';
        overlay.style.display = 'none';
        pageHeader.style.display = 'flex';

        removeFooter(cardFooter);
        clickedCard.classList.remove('clicked-card');
        
        isPokemonCardActive = false;
        activeCardId = null;
    }
}

function removeFooter(cardFooter) {
    if (cardFooter) {
        cardFooter.classList.add('none');
    }
}

function removeNextButtons(navigationButton) {
    if (navigationButton) {
        navigationButton.classList.add('none');
    }
}

///////////////////////////////////////////
// Section for to navigate between cards //
///////////////////////////////////////////
function navigateCard(direction) {
    if (!activeCardId) return;

    const cardElements = Array.from(document.querySelectorAll('[id^="card-"]'));
    const pokemonCardIndex = cardElements.findIndex(card => card.id === activeCardId);

    let newIndex = chooseDirection(direction, pokemonCardIndex, cardElements)
    setNewCard(cardElements, newIndex)
}

function chooseDirection(direction, pokemonCardIndex, cardElements) {
    if (direction === 'left') {
        leftOrRight = pokemonCardIndex > 0 ? pokemonCardIndex - 1 : cardElements.length - 1;
    } else if (direction === 'right') {
        leftOrRight = pokemonCardIndex < cardElements.length - 1 ? pokemonCardIndex + 1 : 0;
    }
    return leftOrRight;
}

function setNewCard(cardElements, newIndex) {
    const newCard = cardElements[newIndex];
    if (newCard) {
        closeCard(activeCardId);
        makeImagesBigger(newCard.id);
        updateProgressBars(pokemonCardsData[newIndex]);
    }
}

////////////////////////////////////////////////////////
// Section for select the Details for the Pokemoncard //
////////////////////////////////////////////////////////

function generateCardDetails(detail) {
    const cardDetails = document.querySelector(`#details-${activeCardId}`);
    cardDetails.innerHTML = '';
    const cardIndex = pokemonCardsData.findIndex(pokemon => `card-${pokemon.id}` === activeCardId);
    const currentPokemon = pokemonCardsData[cardIndex];
    selectSection(detail, currentPokemon, cardDetails, cardIndex)
}

function selectSection(detail, currentPokemon, cardDetails, cardIndex) {
    if (detail === 'about') {
        templateForAboutSection(currentPokemon, cardDetails)
    } else if (detail === 'status') {
        templateForStatusSection(cardIndex, cardDetails)
        updateProgressBars(currentPokemon, cardIndex);
    } else if (detail === 'strong/weak') {
        strongWeakSection(currentPokemon, cardDetails)
    }
}

//////////////////////////////////////////////////////////
// Section for updating the progress bars in the status //
//////////////////////////////////////////////////////////

function updateProgressBars(currentPokemon, cardIndex) {
    const statsMap = statsOfTheCurrentPokemon(currentPokemon);
    setProgressBar(statsMap, cardIndex);
};

function statsOfTheCurrentPokemon(currentPokemon) {
    return [
        { id: 'hp', value: currentPokemon.stats[0].base_stat },
        { id: 'attack', value: currentPokemon.stats[1].base_stat },
        { id: 'defense', value: currentPokemon.stats[2].base_stat },
        { id: 'special-attack', value: currentPokemon.stats[3].base_stat },
        { id: 'special-defense', value: currentPokemon.stats[4].base_stat },
        { id: 'speed', value: currentPokemon.stats[5].base_stat },
    ];
}

function setProgressBar(statsMap, cardIndex) {
    const maxStat = 255;

    statsMap.forEach(stat => {
        const progressBar = document.getElementById(`${stat.id}-bar-${cardIndex}`);
        const valueSpan = document.getElementById(`${stat.id}-value-${cardIndex}`);
        const percentage = Math.round((stat.value / maxStat) * 100);
        if (progressBar && valueSpan) {
            progressBar.style.width = `${percentage}%`;
            valueSpan.textContent = stat.value;
        }
    });
}

////////////////////////////////////////////////////////////////////////
// Section for the update the Strengths/Weakness for the Pokemontypes //
////////////////////////////////////////////////////////////////////////

function strongWeakSection(currentPokemon, cardDetails) {
    for (let j = 0; j < currentPokemon.types.length; j++) {
        for (let i = 0; i < typeDetails.length; i++) {
            if (typeDetails[i].name === currentPokemon.types[j].type.name) {
                const { strengthsHTML, weaknessesHTML, immunitiesHTML } = templateForStrongWeakSection(typeDetails[i]);
                generateTypeHTML(cardDetails, currentPokemon.types[j].type.name, strengthsHTML, weaknessesHTML, immunitiesHTML)
            }
        }
    }
}


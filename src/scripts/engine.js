import state from './state.js';
import cardData from './cardData.js';

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);

    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard);
        });
    
        cardImage.addEventListener("click", ()=> {
            setCardsField(cardImage.getAttribute("data-id"));
        });

    }

    return cardImage;

}

async function setCardsField(cardId) {

    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showHiddenFieldsCards(true);

    await hiddenCardDetails();

    await drawCardsInField(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);

}

async function drawCardsInField(cardId, computerCardId) {

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

}
async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function showHiddenFieldsCards(valor) {

    if(valor === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    } 
    
    if (valor === false){
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
  
}
async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore}  | Lose: ${state.score.computerScore}`;

}

async function drawButton(text) {
    state.action.buttonNextDuel.innerText = text.toUpperCase();
    state.action.buttonNextDuel.style.display = "block";
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "draw";
    let playerCard = cardData[playerCardId]

    if(playerCard.WinOf.includes(computerCardId)) {
        duelResults = "win";
        state.score.playerScore++;
    }

    if(playerCard.LoseOF.includes(computerCardId)) {
        duelResults = "lose";
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
}

async function removeAllCardsImages() {

    // let cards = state.playerSides.computerBox;

    //fazendo com desestruturacação

    let {computerBox, player1Box} = state.playerSides;
    console.log(computerBox);

    let imageElements = computerBox.querySelectorAll("img");
    imageElements.forEach((img) => img.remove());

    imageElements = player1Box.querySelectorAll("img");
    imageElements.forEach((img) => img.remove());


}

async function drawSelectCard(id) {
    console.log(state.cardSprites.avatar.src = cardData[id].img);
    state.cardSprites.avatar.src = cardData[id].img;
    state.cardSprites.name.innerText = cardData[id].name;
    state.cardSprites.type.innerText = "Atributo: " +  cardData[id].type;
}

async function drawCards(cardNumbers, fieldSide) {

    const containerElement = document.getElementById(fieldSide);

    if (!containerElement) {
        console.error(`Elemento com ID ${fieldSide} não encontrado.`);
        return;
    }

    for(let i = 0; i < cardNumbers; i ++) {
        //sortear a carta

        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.action.buttonNextDuel.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();

}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

    try{
        audio.play();
    }catch {}
   
}
const init = function() {
   
    showHiddenFieldsCards(false);

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    console.log(bgm);

    bgm.play();
}

document.addEventListener('DOMContentLoaded', function() {
    init();
});

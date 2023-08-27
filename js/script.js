const vocabulary = [
    {
        name: "retirement",
        transcription: "rə'tī(ə)rmənt",
        translation: "відставка",
        description: "Retirement is when someone stops working, usually after many years, to take a break or start a new occupation."
    },
    {
        name: "numb",
        transcription: "nəm",
        translation: "оніміння",
        description: "Numb is an adjective that describes a lack of sensation. After skiing all day, your toes might be numb from the cold. You'd feel numb for hours after hearing that your favorite band broke up."
    }
];

const btns = document.querySelector('.header__list');

function createList(array) {
    const ul = document.createElement('ul');

    array.forEach(({name, transcription, translation, description}) => {
        const li = document.createElement('li');
        li.className = 'vocabulary__item';
        li.innerHTML = `
            <h3 class="title"><span class="transcription">${name}</span>[ ${transcription} ]</h3>
            <span class="translation">${translation}</span>
            <p class="description">${description}</p>
        `;
        ul.append(li);
    });

    document.getElementById('root').append(ul);
}

createList(vocabulary);


btns.addEventListener('click', (e) => {
    const target = e.target;
    if (target.nodeName != "LI") return;

    if (target.classList.contains('vocabulary_btn')) {
        document.querySelector('.adding').style.display = 'none';
        document.querySelector('.vocabulary').style.display = 'block';
    } else {
        document.querySelector('.adding').style.display = 'block';
        document.querySelector('.vocabulary').style.display = 'none';
    }
});


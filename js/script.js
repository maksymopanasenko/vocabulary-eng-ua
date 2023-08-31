const logInForm = document.querySelector('.login__form'),
      logOutBtn = document.querySelector('.log-out'),
      navigation = document.querySelector('.header__list'),
      vocabulary = document.querySelector('.vocabulary'),
      wordAddingForm = document.querySelector('.adding__form');

const loginURL = 'https://ajax.test-danit.com/api/v2/cards/login';
const TOKEN = 'token';

logInForm.addEventListener('submit', function(event){
    event.preventDefault();
    const body = {}
    event.target.querySelectorAll('input').forEach(input => {
        body[input.name] = input.value;
    });

    axios.post(loginURL, body)
        .then(({ data }) => {
            localStorage.setItem(TOKEN, data);
            location.reload();
        })
        .catch(({response}) => {
            alert(response.data);
        });
});

if (localStorage.getItem(TOKEN)) {
    logInForm.style.display = 'none';
    logOutBtn.style.display = 'block';
    navigation.style.display = 'flex';
    vocabulary.style.display = 'block';

    getWords();
}

function getWords() {
    fetch("https://ajax.test-danit.com/api/v2/cards", {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem(TOKEN)}`
        }
    })
    .then(response => response.json())
    .then(response => {
        const ul = document.getElementById('root');
        ul.innerHTML = '';
        response.forEach(({id, word, transcription, translation, description}) => {
            const li = document.createElement('li');
            li.className = 'vocabulary__item';
            li.innerHTML = `
                <div class="vocabulary__body">
                    <h3 class="title"><span class="transcription">${word}</span>[ ${transcription} ]</h3>
                    <span class="translation">${translation}</span>
                    <p class="description">${description}</p>                
                </div>
                <button class="delete__btn" onClick="deleteCard(${id})">Delete</button>
            `;
            ul.append(li);
        });
    });
}

wordAddingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let body = {};

    e.target.querySelectorAll('input').forEach(input => {
        body[input.name] = input.value;
    });

    fetch("https://ajax.test-danit.com/api/v2/cards", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(TOKEN)}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const matchedWord = data.find(({word}) => word.toLowerCase() === body.word.toLowerCase());

        if (matchedWord) {
            const nameInput = document.querySelector('#name');
            const message = document.querySelector('.message');

            nameInput.style.color = 'red';
            document.querySelector('.message__text').innerText = `The word "${body.word}" is already on the list.`
            message.style.top = 0;

            setTimeout(() => {
                message.style.top = '120px';
                nameInput.style.color = 'black';
                e.target.reset();
            }, 2500);
        } else {
            fetch("https://ajax.test-danit.com/api/v2/cards", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem(TOKEN)}`
                },
                body: JSON.stringify(body)
            })
            .then(response => response.json())
            .then(() => getWords());
        
            e.target.reset();   
        }
    });
});

function deleteCard(id) {
    try {
        fetch(`https://ajax.test-danit.com/api/v2/cards/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(TOKEN)}`
            }
        })
        .then(() => location.reload());
    } catch(e) {
        console.log(e);
    }
}

logOutBtn.addEventListener('click', () => {
    localStorage.removeItem(TOKEN);
    location.reload();
});


const btns = document.querySelector('.header__list');

btns.addEventListener('click', (e) => {
    const target = e.target;
    if (target.nodeName != "LI") return;

    if (target.classList.contains('vocabulary_btn')) {
        document.querySelector('.adding').style.display = 'none';
        document.querySelector('.vocabulary').style.display = 'block';
        document.querySelector('.vocabulary_btn').classList.add('active');
        document.querySelector('.new-word_btn').classList.remove('active');
    } else {
        document.querySelector('.adding').style.display = 'block';
        document.querySelector('.vocabulary').style.display = 'none';
        document.querySelector('.new-word_btn').classList.add('active');
        document.querySelector('.vocabulary_btn').classList.remove('active');
    }
});
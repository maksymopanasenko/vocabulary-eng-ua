const logInForm = document.querySelector('.login__form'),
      logOutBTN = document.querySelector('.log-out'),
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
    logOutBTN.style.display = 'block';
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
        const ul = document.createElement('ul');
        console.log(response);

        response.forEach(({word, transcription, translation, description}) => {
            const li = document.createElement('li');
            li.className = 'vocabulary__item';
            li.innerHTML = `
                <h3 class="title"><span class="transcription">${word}</span>[ ${transcription} ]</h3>
                <span class="translation">${translation}</span>
                <p class="description">${description}</p>
            `;
            ul.append(li);
        });

        document.getElementById('root').append(ul);
    });
}

wordAddingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let body = {};

    e.target.querySelectorAll('input').forEach(input => {
        body[input.name] = input.value;
    });

    fetch("https://ajax.test-danit.com/api/v2/cards", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(TOKEN)}`
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(response => console.log(response));

    e.target.reset();  
    getWords();          
});

logOutBTN.addEventListener('click', () => {
    localStorage.removeItem(TOKEN);
    location.reload();
});


const btns = document.querySelector('.header__list');

btns.addEventListener('click', (e) => {
    const target = e.target;
    if (target.nodeName != "LI") return;
    
    document.querySelector('.new-word_btn').classList.toggle('active');
    document.querySelector('.vocabulary_btn').classList.toggle('active');

    if (target.classList.contains('vocabulary_btn')) {
        document.querySelector('.adding').style.display = 'none';
        document.querySelector('.vocabulary').style.display = 'block';
    } else {
        document.querySelector('.adding').style.display = 'block';
        document.querySelector('.vocabulary').style.display = 'none';
    }
});
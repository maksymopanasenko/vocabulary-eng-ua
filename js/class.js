import { TOKEN } from "./script.js";

class WordCard {
    constructor(id, word, transcription, translation, description) {
        this.id = id;
        this.word = word;
        this.transcription = transcription;
        this.translation = translation;
        this.description = description;
        this.li = document.createElement('li');
        this.btn = document.createElement('button');
    }

    createCard() {
        this.li.className = 'vocabulary__item';
        this.li.innerHTML = `
            <div class="vocabulary__body">
                <h3 class="title"><span class="transcription">${this.word}</span>[ ${this.transcription} ]</h3>
                <span class="translation">${this.translation}</span>
                <p class="description">${this.description}</p>                
            </div>
        `;
        this.btn.className = "delete__btn";
        this.btn.innerText = "Delete";
        this.li.append(this.btn);
        this.onDelete();
    }

    onDelete() {
        this.btn.addEventListener('click', () => {
            try {
                fetch(`https://ajax.test-danit.com/api/v2/cards/${this.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem(TOKEN)}`
                    }
                })
                .then(() => location.reload());
            } catch(e) {
                console.log(e);
            }
        });
    }

    render(elem) {
        this.createCard();
        elem.append(this.li);
    }
}

export default WordCard;
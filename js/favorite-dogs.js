document.addEventListener('DOMContentLoaded', async () => {
    await loadFavoriteDogs();   
    const generateMatchBtn = document.getElementById('generate-match-btn');
    if (generateMatchBtn) {
        generateMatchBtn.addEventListener('click', generateMatch);
    } else {
        console.error('Generate match button not found');
    }
});

const loadFavoriteDogs = async () => {
    const favoriteDogs = JSON.parse(localStorage.getItem('favoriteDogs')) || [];
    if (favoriteDogs.length > 0) {
        try {
            const response = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(favoriteDogs),
                credentials: 'include'
            });

            if (response.ok) {
                const dogs = await response.json();
                displayFavoriteDogs(dogs);
                document.getElementById('generate-match-btn').addEventListener('click', () => generateMatch(dogs));
            } else {
                console.error('Failed to fetch favorite dogs');
            }
        } catch (error) {
            console.error('Error fetching favorite dogs:', error);
        }
    } else {
        document.getElementById('favorite-dogs-list').innerHTML = 'No favorite dogs found.';
    }
};

const displayFavoriteDogs = (dogs) => {
    const favoriteDogList = document.getElementById('favorite-dogs-list');

    if (!favoriteDogList) {
        console.error('Favorite dog list element not found');
        return;
    }

    favoriteDogList.innerHTML = '';

    dogs.forEach(dog => {
        const dogCard = document.createElement('div');
        dogCard.classList.add('dog-card');
        dogCard.innerHTML = `
            <img src="${dog.img}" alt="${dog.name}">
            <h3>${dog.name}</h3>
            <p>Breed: ${dog.breed}</p>
            <p>Age: ${dog.age}</p>
            <p>Location: ${dog.zip_code}</p>
            <button onclick="removeFavoriteDog('${dog.id}')">Remove from Favorites</button>
        `;
        favoriteDogList.appendChild(dogCard);
    });
};

const removeFavoriteDog = (id) => {
    const favoriteDogs = JSON.parse(localStorage.getItem('favoriteDogs')) || [];
    const index = favoriteDogs.indexOf(id);

    if (index !== -1) {
        favoriteDogs.splice(index, 1);
        localStorage.setItem('favoriteDogs', JSON.stringify(favoriteDogs));
        loadFavoriteDogs();  
    }
};

const generateMatch = async () => {
    const favoriteDogs = JSON.parse(localStorage.getItem('favoriteDogs')) || [];
    if (favoriteDogs.length < 3) {
        alert('Please favorite at least 3 dogs to generate a match.');
        return;
    }

    try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(favoriteDogs),
            credentials: 'include'
        });

        if (response.ok) {
            const match = await response.json();
            displayMatchedDog(match.match);
        } else {
            console.error('Failed to generate match');
        }
    } catch (error) {
        console.error('Error generating match:', error);
    }
};

const displayMatchedDog = async (matchId) => {
    try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([matchId]),
            credentials: 'include'
        });

        if (response.ok) {
            const [matchedDog] = await response.json();
            const favoritesSection = document.getElementById('favorites');
            favoritesSection.innerHTML = `
                <h2>Your Perfect Match!</h2>
                <div class="dog-card">
                    <img src="${matchedDog.img}" alt="${matchedDog.name}">
                    <h3>${matchedDog.name}</h3>
                    <p>Breed: ${matchedDog.breed}</p>
                    <p>Age: ${matchedDog.age}</p>
                    <p>Location: ${matchedDog.zip_code}</p>
                    <p>Call us to learn more about your potential new pal!</p>
                </div>
            `;
        } else {
            console.error('Failed to fetch matched dog');
        }
    } catch (error) {
        console.error('Error fetching matched dog:', error);
    }
};
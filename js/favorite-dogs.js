document.addEventListener('DOMContentLoaded', async () => {
    await loadFavoriteDogs();
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
        loadFavoriteDogs();  // Reload the list to reflect changes
    }
};
document.addEventListener('DOMContentLoaded', async () => {
    await populateBreedFilter();
    await fetchAndDisplayDogs();
});

const populateBreedFilter = async () => {
    const breedSelect = document.getElementById('breed');
    try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
            credentials: 'include'
        });
        if (response.ok) {
            const breeds = await response.json();
            breeds.forEach(breed => {
                const option = document.createElement('option');
                option.value = breed;
                option.textContent = breed;
                breedSelect.appendChild(option);
            });
        } else {
            console.error('Failed to fetch breeds');
        }
    } catch (error) {
        console.error('Error fetching breeds:', error);
    }
};

const fetchAndDisplayDogs = async (breed = '', page = 1, size = 25) => {
    const dogList = document.getElementById('dog-list');
    dogList.innerHTML = 'Loading...';

    const query = new URLSearchParams({
        breeds: breed,
        size,
        from: (page - 1) * size,
        sort: 'breed:asc'
    });

    try {
        const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search?${query.toString()}`, {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            displayDogs(data.resultIds);
        } else {
            console.error('Failed to fetch dogs');
            dogList.innerHTML = 'Failed to load dogs.';
        }
    } catch (error) {
        console.error('Error fetching dogs:', error);
        dogList.innerHTML = 'Error loading dogs.';
    }
};

const displayDogs = async (dogIds) => {
    const dogList = document.getElementById('dog-list');
    dogList.innerHTML = '';

    try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dogIds),
            credentials: 'include'
        });

        if (response.ok) {
            const dogs = await response.json();
            dogs.forEach(dog => {
                const dogCard = document.createElement('div');
                dogCard.classList.add('dog-card');
                dogCard.innerHTML = `
                    <img src="${dog.img}" alt="${dog.name}">
                    <h3>${dog.name}</h3>
                    <p>Breed: ${dog.breed}</p>
                    <p>Age: ${dog.age}</p>
                    <p>Location: ${dog.zip_code}</p>
                    <button onclick="favoriteDog('${dog.id}')">Add to Favorites</button>
                `;
                dogList.appendChild(dogCard);
            });
        } else {
            console.error('Failed to fetch dog details');
            dogList.innerHTML = 'Failed to load dog details.';
        }
    } catch (error) {
        console.error('Error fetching dog details:', error);
        dogList.innerHTML = 'Error loading dog details.';
    }
};

const favoriteDogs = [];

const favoriteDog = (id) => {
    if (!favoriteDogs.includes(id)) {
        favoriteDogs.push(id);
        console.log(`Dog with ID ${id} added to favorites`);
    }
};

const generateMatch = async () => {
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
            displayMatch(match.match);
        } else {
            console.error('Failed to generate match');
        }
    } catch (error) {
        console.error('Error generating match:', error);
    }
};

const displayMatch = async (matchId) => {
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
            const matchedDog = await response.json();
            console.log('Matched Dog:', matchedDog);
            // Display the matched dog details
            // Add your display code here
        } else {
            console.error('Failed to fetch matched dog details');
        }
    } catch (error) {
        console.error('Error fetching matched dog details:', error);
    }
};

document.getElementById('search-btn').addEventListener('click', async () => {
    const breed = document.getElementById('breed').value;
    await fetchAndDisplayDogs(breed);
});

document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    fetchAndDisplayDogs(document.getElementById('breed').value, currentPage);
});

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchAndDisplayDogs(document.getElementById('breed').value, currentPage);
    }
});
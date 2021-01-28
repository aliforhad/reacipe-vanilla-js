const mealsEl = document.getElementById("meals");
const favMealitem = document.getElementById("fav-meals");
const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");

getRandomMeal();
fetchMealLS();

async function getRandomMeal() {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    const respData = await resp.json();
    const randomMeal = respData.meals[0];

    addMeal(randomMeal, true);
}


async function getMealById(id) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);

    const respData = await resp.json();
    const meal = respData.meals[0];

    return meal;

}

async function getMealsBySearch(term) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);

    const respData = await resp.json();
    const meal = respData.meals;
    return meal;
}


function addMeal(mealData, random = false) {

    const meal = document.createElement("div");
    meal.classList.add("meal");

    meal.innerHTML = `
                <div class="meal-header">
                    ${random ? '<span class="random">Random receipe</span>' : ""}
                    <img src="${mealData.strMealThumb}" alt="${mealData.strMealThumb}">
                </div>
                <div class="meal-body">
                    <h4>${mealData.strMeal}</h4>
                    <button class="fav-btn"><i class="fas fa-heart"></i> </button>
                </div>
                
    `;


    const btn = meal.querySelector(".meal-body .fav-btn");
    btn.addEventListener("click", () => {

        if (btn.classList.contains("active")) {
            removeMealToLS(mealData.idMeal);
            btn.classList.remove("active")
        } else {
            addMealToLS(mealData.idMeal);
            btn.classList.add("active")
        }

    fetchMealLS();
    });
    
    mealsEl.appendChild(meal);
}


function addMealToLS(mealId) {
    const mealIds = getMealToLS();

    localStorage.setItem("mealId", JSON.stringify([...mealIds, mealId]));
}


function removeMealToLS(mealId) {
    const mealIds = getMealToLS();
    localStorage.setItem("mealId", JSON.stringify(mealIds.filter((id) => id !== mealId)));
}


function getMealToLS() {
    const mealIds = JSON.parse(localStorage.getItem("mealId"));

    return mealIds === null ? [] : mealIds
}


async function fetchMealLS() {
    // Clear the item
    favMealitem.innerHTML = "";

    const mealIds = getMealToLS();

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        meal = await getMealById(mealId);

        addFavMeal(meal);
    }
}

function addFavMeal(mealData) {
    const favMeal = document.createElement("li");

    favMeal.innerHTML = `

                 <img src="${mealData.strMealThumb}"  alt="${mealData.strMeal}"">
                 <span>${mealData.strMeal}</span>
                 <button class= "clear"><i class="far fa-window-close"></i></button>

                 `;

    const btn = favMeal.querySelector(".clear");
    btn.addEventListener("click", () => {
        removeMealToLS(mealData.idMeal);

        fetchMealLS();
    });


    favMealitem.appendChild(favMeal);

}


searchBtn.addEventListener("click", async () => {
    const search = searchTerm.value;
    const meals = await getMealsBySearch(search);
    
    meals.forEach(meal => {
        addMeal(meal);
    });

});

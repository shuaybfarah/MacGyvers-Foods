import apiActions from './api-actions/api-actions.js';
import ParentPage from './pages/ParentPage.js';
import AllergyComponent from './components/AllergyComponent.js';
import AddChildPage from './pages/AddChildPage.js';
import DeleteChildPage from './pages/DeleteChildPage.js';
import FoodCategories from './components/FoodCategories.js';
import FoodCategory from './components/FoodCategory.js';
import RecipeInstructions from './components/RecipeInstructions.js';
import RecipeIngredients from './components/RecipeIngredients.js';
import About from './pages/About.js';
import RecipeIngredientsListPage from './pages/RecipeIngredientsListPage.js';
import RecipePage from './pages/RecipePage.js';
import ContactPage from './pages/ContactPage.js';
import SignInPage from './pages/SignInPage.js';
import SignInJs from './signin.js';
import LandingCategories from './components/LandingCategories.js';
import FaqPage from './pages/Faq.js';
import Terms from './pages/Terms.js';
import Privacy from './pages/Privacy.js';
import RemoveAllergy from './components/RemoveAllergy.js';
// import LandingPage from './index.html';
import RemovePreferences from './components/RemovePreferences.js';
import SavedRecipesToChildPage from './pages/SavedRecipesToChildPage.js';
import startSite from './landing-page.js';
import SavedSingleRecipePage from './pages/SavedSingleRecipePage.js';
import LoadingPage from './pages/LoadingPage.js';
import AddToPantry from './pages/AddToPantry.js';
import PantryPage from './pages/PantryPage.js';
import RemoveFromPantry from './components/RemoveFromPantry.js';
import LandingPreferences from './components/LandingPagePreferences.js';
import startPrefSite from './preferences.js';
import NonUserRecipePage from './pages/NonUserRecipePage.js';

buildPage();

function buildPage() {
    // renderProfileInfo();
    navAllergies();
    navFoodCategories();
    navigateToContactPage();
    navLandingCategories();
    navFaq();
    navTerms();
    navPrivacy();
    navHome();
    navToAboutPageFooter();
    navToAboutPageMenu();
    navToSignInPage();
    toggleSearchBar();
    searchForRecipes();
    navToPantry();
    menuToContactPage();
    menuToFaq();
    menuToTerms();
    menuToPrivacy();
    renderLandingPreferences();
    navTempChoices();
}

const app = document.querySelector('#app');

// const apiKeyNum = '985a2080f8094fdea57cb96fa855b0dd';
// const apiKeyNum = '78bc7509124db458df764b454c2dc1e57807eff5';
// const apiKeyNum = 'd16a986f5295496bb236ca7062f1841a';
// const apiKeyNum = '4d2f51bba03b42a59ba6d0843ac5b5f9';
const apiKeyNum = '733246d3691c4203855fd5063ee214b6';
// const apiKeyNum = '00f757b09028492da86c30d8109241c0';
// const apiKeyNum = '985a2080f8094fdea57cb96fa855b0dd';

let parentId = 203;

// function renderProfileInfo() {
//     const profileButton = document.querySelector('#profile_button');
//     profileButton.addEventListener('click', () => {
//         app.innerHTML = LoadingPage();
//         apiActions.getRequest('http://localhost:8080/parents/203', (parents) => {
//             wireUpParent(parents);
//         });
//         toggleSearchBar();
//     });
// }

function wireUpParent(parents) {
    app.innerHTML = ParentPage(parents);
    navToAddChildPage();
    navToDeleteChildPage();
    toggleChildren();
    navToRecipesPage();
    viewSavedRecipes();
    navToSpecificRecipePage();
    navToSignInPage();
    viewFullSavedRecipe();
    toggleSearchBar();
    navToPantry();
    updatePantry();
}

function toggleChildren() {
    const childNames = document.querySelectorAll('.child__name');
    console.log(childNames);
    childNames.forEach((childName) => {
        console.log(childName);
        childName.addEventListener('click', (event) => {
            console.log(event);
            if (event.target.classList.contains('child__name')) {
                if (event.target.parentElement.style.visibility !== 'visible') {
                    event.target.parentElement.style.visibility = 'visible';
                    event.target.parentElement.style.height = 'auto';
                } else {
                    event.target.parentElement.style.visibility = 'hidden';
                    event.target.parentElement.style.height = '20px';
                }
            }
        });
    });
}

function toggleSearchBar() {
    const searchButton = document.querySelector('.fas.fa-search');
    searchButton.addEventListener('click', (event) => {
        if (event.target.classList.contains('fa-search')) {
            const search = document.querySelector('.hidden_search_bar');
            if (search.querySelector('input').style.visibility !== 'visible') {
                search.querySelector('input').style.visibility = 'visible';
                search.querySelector('button').style.display = 'block';
            } else {
                search.querySelector('input').style.visibility = 'hidden';
                search.querySelector('button').style.display = 'none';
            }
        }
    });
}

function navToAddChildPage() {
    const navToAdd = document.querySelector('.add_child_plus');
    navToAdd.addEventListener('click', () => {
        app.innerHTML = AddChildPage();
        createChild();
        toggleSearchBar();
    });
}

function navToDeleteChildPage() {
    const deleteChildButton = document.querySelector('.delete_child_minus');
    deleteChildButton.addEventListener('click', () => {
        parentId = event.target.parentElement.parentElement.querySelector('input').value;
        apiActions.getRequest(`http://localhost:8080/parents/${parentId}/children`, children => {
            app.innerHTML = DeleteChildPage(children);
            deleteChild();
            toggleSearchBar();
        });
    });
}

function createChild() {
    const submitButton = document.querySelector('.add_child_submit');
    submitButton.addEventListener('click', (event) => {
        if (event.target.classList.contains('add_child_submit')) {
            const firstName = event.target.parentElement.querySelector('#add_child_firstName').value;
            const lastName = event.target.parentElement.querySelector('#add_child_lastName').value;
            const age = event.target.parentElement.querySelector('#add_child_age').value;
            apiActions.postRequest(`http://localhost:8080/parents/${parentId}/add-child`, {
                'firstName': firstName,
                'lastName': lastName,
                'age': age
            }, (parents) => {
                wireUpParent(parents);
            });
        }
    });
}

let childrenToRemoveCount = 0;
function deleteChild() {
    const deleteButton = document.querySelector('.delete_child_submit');
    deleteButton.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete_child_submit')) {
            var childrenToRemove = [];
            childrenToRemoveCount = 0;
            var allChildrenToRemove = app.querySelectorAll('.childToRemove');
            allChildrenToRemove.forEach((currentChild) => {
                if (currentChild.checked) {
                    var checkedChildToRemove = currentChild.value;
                    childrenToRemove.push(checkedChildToRemove);
                    childrenToRemoveCount++;
                }
            });
            childrenToRemove.forEach(removeChildFromParentProfile);
        }
    });
}

let currentChildrenToRemoveCount = 0;
function removeChildFromParentProfile(firstName) {
    apiActions.deleteRequest(`http://localhost:8080/parents/${parentId}/delete-child`, {'firstName': firstName}, (children) => {
        currentChildrenToRemoveCount++;
        if (currentChildrenToRemoveCount === childrenToRemoveCount) {
            apiActions.getRequest(`http://localhost:8080/parents/${parentId}`, (parents) => {
                currentChildrenToRemoveCount = 0;
                wireUpParent(parents);
            });
        }
    });
}

function navAllergies() {
    const app = document.querySelector('#app');
    app.addEventListener('click', (event) => {
        if (event.target.classList.contains('allergy-list-btn')) {
            childId = event.target.parentElement.parentElement.querySelector('input').value;
            apiActions.getRequest('http://localhost:8080/allergies', allergies => {
                app.innerHTML = AllergyComponent(allergies);
            });
        } else if (event.target.classList.contains('delete__allergy_minus')) {
            childId = event.target.parentElement.parentElement.querySelector('input').value;
            apiActions.getRequest(`http://localhost:8080/children/${childId}/allergies`, allergies => {
                app.innerHTML = RemoveAllergy(allergies);
            });
        }
    });
    submitAllergySelections();
}

let allergyCount = 0;

let allergyToRemoveCount = 0;

function submitAllergySelections() {
    const app = document.querySelector('#app');
    app.addEventListener('click', (event) => {
        if (event.target.classList.contains('submit-allergies-btn')) {
            var allergiesToAdd = [];
            allergyCount = 0;
            var allAllergies = app.querySelectorAll('.allergies');
            allAllergies.forEach((currentAllergy) => {
                if (currentAllergy.checked) {
                    var checkedAllergy = currentAllergy.value;
                    allergiesToAdd.push(checkedAllergy);
                    allergyCount++;
                }
            });
            allergiesToAdd.forEach(addAllergiesToChildProfile);
        } else if (event.target.classList.contains('submit-allergies-to-remove-btn')) {
            var allergiesToRemove = [];
            allergyToRemoveCount = 0;
            var allAllergiesToRemove = app.querySelectorAll('.allergies');
            allAllergiesToRemove.forEach((currentAllergy) => {
                if (currentAllergy.checked) {
                    var checkedAllergyToRemove = currentAllergy.value;
                    allergiesToRemove.push(checkedAllergyToRemove);
                    allergyToRemoveCount++;
                }
            });
            allergiesToRemove.forEach(removeAllergiesFromChildProfile);
        }
    });
}

let currentAllergyCount = 0;

function addAllergiesToChildProfile(allergy) {
    apiActions.postRequest(`http://localhost:8080/children/${childId}/add-allergy`, {
        'allergy': allergy
    }, allergies => {
        currentAllergyCount++;
        if (currentAllergyCount == allergyCount) {
            apiActions.getRequest(`http://localhost:8080/parents/${parentId}`, (parents) => {
                currentAllergyCount = 0;
                wireUpParent(parents);
            });
        }
    });
}

let currentAllergiesToRemoveCount = 0;

function removeAllergiesFromChildProfile(allergy) {
    apiActions.deleteRequest(`http://localhost:8080/children/${childId}/delete-allergy`, {
        'allergy': allergy
    }, allergies => {
        currentAllergiesToRemoveCount++;
        if (currentAllergiesToRemoveCount == allergyToRemoveCount) {
            apiActions.getRequest(`http://localhost:8080/parents/${parentId}`, (parents) => {
                currentAllergiesToRemoveCount = 0;
                wireUpParent(parents);
            });
        }
    });
}

let childIdPreference = 0;

function navFoodCategories() {
    const app = document.querySelector('#app');
    app.addEventListener('click', () => {
        if (event.target.classList.contains('preference-list-btn')) {
            childIdPreference = event.target.parentElement.parentElement.querySelector('input').value;
            apiActions.getRequest('http://localhost:8080/foodCategories', foodCategories => {
                app.innerHTML = FoodCategories(foodCategories);
            });
        } else if (event.target.classList.contains('delete_preference_minus')) {
            childIdPreference = event.target.parentElement.parentElement.querySelector('input').value;
            apiActions.getRequest(`http://localhost:8080/children/${childIdPreference}/preferences`, preferences => {
                app.innerHTML = RemovePreferences(preferences);
            });
        }
    });
    submitPreferenceSelections();
}

let preferenceCount = 0;
let preferenceToRemoveCount = 0;

function submitPreferenceSelections() {
    const app = document.querySelector('#app');
    app.addEventListener('click', (event) => {
        if (event.target.classList.contains('submit-btn')) {
            var preferencesToAdd = [];
            preferenceCount = 0;
            var allPreferences = app.querySelectorAll('.preferences');
            allPreferences.forEach((currentPreference) => {
                if (currentPreference.checked) {
                    var checkedPreference = currentPreference.value;
                    preferencesToAdd.push(checkedPreference);
                    preferenceCount++;
                }
            });
            preferencesToAdd.forEach(addPreferencesToChildProfile);
        } else if (event.target.classList.contains('remove-btn')) {
            var preferencesToRemove = [];
            preferenceToRemoveCount = 0;
            var allPreferencesToRemove = app.querySelectorAll('.preferences');
            allPreferencesToRemove.forEach((currentPreference) => {
                if (currentPreference.checked) {
                    var checkedPreferenceToRemove = currentPreference.value;
                    preferencesToRemove.push(checkedPreferenceToRemove);
                    preferenceToRemoveCount++;
                }
            });
            preferencesToRemove.forEach(removePreferencesFromChildProfile);
        }
    });
}

let currentPreferenceCount = 0;

function addPreferencesToChildProfile(preference) {
    apiActions.postRequest(`http://localhost:8080/children/${childIdPreference}/add-preference`, {
        'preference': preference
    }, preferences => {
        currentPreferenceCount++;
        if (currentPreferenceCount == preferenceCount) {
            apiActions.getRequest(`http://localhost:8080/parents/${parentId}`, (parents) => {
                currentPreferenceCount = 0;
                wireUpParent(parents);
            });
        }
    });
}

let currentPreferencesToRemoveCount = 0;

function removePreferencesFromChildProfile(preference) {
    apiActions.deleteRequest(`http://localhost:8080/children/${childIdPreference}/delete-preference`, {
        'preference': preference
    }, preferences => {
        currentPreferencesToRemoveCount++;
        if (currentPreferencesToRemoveCount == preferenceToRemoveCount) {
            apiActions.getRequest(`http://localhost:8080/parents/${parentId}`, (parents) => {
                currentPreferencesToRemoveCount = 0;
                wireUpParent(parents);
            });
        }
    });
}

function navLandingCategories() {
    const categoryElem = document.querySelector('#ingredient__categories');
    apiActions.getRequest('http://localhost:8080/foodCategories', foodCategories => {
        console.log(foodCategories);
        categoryElem.innerHTML = LandingCategories(foodCategories);
        startSite();
    });
}

function renderLandingPreferences() {
    const preferenceElem = document.querySelector('#preference__categories');
    apiActions.getRequest('http://localhost:8080/foodCategories', foodCategories => {
        preferenceElem.innerHTML = LandingPreferences(foodCategories);
        startPrefSite();
    });
}

function navToPantry() {
    let pantryButton = document.querySelector('#pantry-button');
    pantryButton.addEventListener('click', () => {
        apiActions.getRequest(`http://localhost:8080/parents/${parentId}/ingredients`, ingredients => {
            app.innerHTML = PantryPage(ingredients);
        });
    });
}

function updatePantry() {
    const app = document.querySelector('#app');
    app.addEventListener('click', (event) => {
        if (event.target.classList.contains('add_ingredient_plus')) {
            apiActions.getRequest('http://localhost:8080/foodCategories', foodCategories => {
                app.innerHTML = AddToPantry(foodCategories);
                startSite();
            });
        } else if (event.target.classList.contains('delete_ingredient_minus')) {
            apiActions.getRequest(`http://localhost:8080/parents/${parentId}/ingredients`, ingredients => {
                app.innerHTML = RemoveFromPantry(ingredients);
            });
        }
    });
    submitIngredientSelections();
}

let pantryItemsToAddCount = 0;
let pantryItemsToRemoveCount = 0;
function submitIngredientSelections() {
    const app = document.querySelector('#app');
    app.addEventListener('click', (event) => {
        if (event.target.classList.contains('ingredients__submitBtn')) {
            var pantryItemsToAdd = [];
            pantryItemsToAddCount = 0;
            let allIngredients = app.querySelectorAll('.pantry-ingredients');
            allIngredients.forEach((currentItem) => {
                if (currentItem.checked) {
                    var  checkedItem = currentItem.value;
                    pantryItemsToAdd.push(checkedItem);
                    pantryItemsToAddCount++;
                }
            });
            pantryItemsToAdd.forEach(addItemsToPantry);
        } else if (event.target.classList.contains('submit-pantry-items-to-remove-btn')) {
            var pantryItemsToRemove = [];
            pantryItemsToRemoveCount = 0;
            const allIngredientsToRemove = app.querySelectorAll('.pantry-ingredients-to-remove');
            allIngredientsToRemove.forEach((currentItemToRemove) => {
                if (currentItemToRemove.checked) {
                    var  checkedItem = currentItemToRemove.value;
                    pantryItemsToRemove.push(checkedItem);
                    pantryItemsToRemoveCount++;
                }
            });
            pantryItemsToRemove.forEach(removeItemsFromPantry);
        }
    });
}

let currentIngredientCount = 0;
function addItemsToPantry(ingredient) {
    apiActions.postRequest(`http://localhost:8080/parents/${parentId}/add-ingredient`, {
        'ingredient': ingredient
    }, ingredients => {
        currentIngredientCount++;
        if (currentIngredientCount === pantryItemsToAddCount) {
            apiActions.getRequest(`http://localhost:8080/parents/${parentId}`, (parents) => {
                currentIngredientCount = 0;
                wireUpParent(parents);
            });
        }
    });
}

let currentIngredientToRemoveCount = 0;
function removeItemsFromPantry(ingredient) {
    apiActions.deleteRequest(`http://localhost:8080/parents/${parentId}/delete-ingredient`, {
        'ingredient': ingredient
    }, ingredients => {
        currentIngredientToRemoveCount++;
        if (currentIngredientToRemoveCount === pantryItemsToRemoveCount) {
            apiActions.getRequest(`http://localhost:8080/parents/${parentId}`, (parents) => {
                currentIngredientToRemoveCount = 0;
                wireUpParent(parents);
            });
        }
    });
}

function navToRecipesPage() {
    const navToRecipesPageButton = document.querySelectorAll('.search_recipes_button');

    for (const navToRecipesPageButton of navToRecipesPageButton) {
        navToRecipesPageButton.addEventListener('click', (event) => {
            app.innerHTML = LoadingPage();
            childId = event.target.parentElement.querySelector('input').value;
            apiActions.getRequest(`http://localhost:8080/parents/${parentId}`, (parents) => {
                let stringName = '';
                for (let i = 0; i < parents.ingredients.length; i++) {
                    stringName += parents.ingredients[i].ingredient.toLowerCase() + ',';
                }
                apiActions.getRequest(`http://localhost:8080/children/${childId}`, (child) => {
                    let stringName2 = '';
                    for (let i = 0; i < child.allergies.length; i++) {
                        stringName2 += child.allergies[i].allergy.toLowerCase() + ',';
                    }
                    apiActions.getRequest(`http://localhost:8080/children/${childId}`, (child) => {
                        let stringName3 = '';
                        for (let i = 0; i < child.preferences.length; i++) {
                            stringName3 += child.preferences[i].preference.toLowerCase() + ',';
                        }
                        let stringInclude = stringName + stringName3;
                        let stringExclude = stringName2;
                        const parsedString = stringInclude.substring(0,stringInclude.length -1) ;

                        apiActions.getRequest(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKeyNum}&includeIngredients=${parsedString}&intolerances=${stringExclude}&fillIngredients=true&number=12&sort=popularity&limitLicense=true`, (recipes) => {
                            console.log(recipes);
                            app.innerHTML = RecipeIngredientsListPage(recipes);
                            // const recipeId = recipes.results[0].id;
                            // apiActions.getRequest(`https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?apiKey=${apiKeyNum}`, (recipeInstructions) => {
                            //     // console.log(recipeInstructions);
                            //     app.innerHTML += RecipeInstructions(recipeInstructions);
                            // });
                            navToSpecificRecipePage();
                        });
                    });
                });
            });
        });
    }
}

function navToSpecificRecipePage() {
    const nav_full_recipe_button = document.querySelectorAll('.nav_full_recipe');
    for (const nav_full_recipe_button of nav_full_recipe_button) {
        nav_full_recipe_button.addEventListener('click', (event) => {
            if (event.target.classList.contains('nav_full_recipe')) {
                app.innerHTML = LoadingPage();
                singleRecipe = event.target.parentElement.parentElement.querySelector('input').value;
                apiActions.getRequest(`https://api.spoonacular.com/recipes/${singleRecipe}/card?apiKey=${apiKeyNum}&backgroundImage=background1`, (recipe) => {
                    console.log(recipe);
                    app.innerHTML = RecipePage(recipe);
                    saveRecipeToChild();
                });
            }
        });
    }
}

function saveRecipeToChild() {
    const save_recipe_to_child_button = document.querySelector('.save_recipe_to_child')
    save_recipe_to_child_button.addEventListener('click', (event) => {
        if (event.target.classList.contains('save_recipe_to_child')) {
            app.innerHTML = LoadingPage();
            const recipe = singleRecipe;
            console.log(singleRecipe);
            apiActions.postRequest(`http://localhost:8080/children/${childId}/add-recipe`, {
                'recipe': recipe
            }, (child) => {
                console.log(child);
                apiActions.getRequest(`http://localhost:8080/parents/${parentId}`, (parents) => {
                    wireUpParent(parents);
                });
            });
        }
    });
}

function viewSavedRecipes() {
    const viewSavedRecipesButton = document.querySelectorAll('.view_saved_recipes');
    for (const viewSavedRecipesButton of viewSavedRecipesButton) {
        viewSavedRecipesButton.addEventListener('click', (event) => {
            app.innerHTML = LoadingPage();
            childId = event.target.parentElement.querySelector('input').value;
            apiActions.getRequest(`http://localhost:8080/children/${childId}`, (savedRecipes) => {
                let stringName4 = '';
                for (let i = 0; i < savedRecipes.recipes.length; i++) {
                    stringName4 += savedRecipes.recipes[i].recipe + ',';
                }
                apiActions.getRequest(`https://api.spoonacular.com/recipes/informationBulk?ids=${stringName4}&apiKey=${apiKeyNum}&includeNutrition=false`, (recipe) => {
                    app.innerHTML = SavedRecipesToChildPage(recipe);
                    viewFullSavedRecipe();
                });
            });
        });
    }
}

function viewFullSavedRecipe() {
    const savedFullRecipeButton = document.querySelectorAll('.saved_full_recipe');
    for (const savedFullRecipeButton of savedFullRecipeButton) {
        savedFullRecipeButton.addEventListener('click', (event) => {
            if (event.target.classList.contains('saved_full_recipe')) {
                app.innerHTML = LoadingPage();
                singleRecipe = event.target.parentElement.querySelector('input').value;
                apiActions.getRequest(`https://api.spoonacular.com/recipes/${singleRecipe}/card?apiKey=${apiKeyNum}&backgroundImage=background1`, (recipe) => {
                    app.innerHTML = SavedSingleRecipePage(recipe);
                    toggleSearchBar();
                });
            }
        });
    }
}

let singleRecipe = 0;
let childId = 0;

function navFaq() {
    const faqElem = document.querySelector('.footer__faq_listItem');
    faqElem.addEventListener('click', () => {
        const app = document.querySelector('#app');
        app.innerHTML = FaqPage();
    });
}

function menuToFaq() {
    const menuFaqElem = document.querySelector('#faq');
    menuFaqElem.addEventListener('click', () => {
        const app = document.querySelector('#app');
        app.innerHTML = FaqPage();
    });
}

function navTerms() {
    const termsElem = document.querySelector('.footer__terms_listItem');
    termsElem.addEventListener('click', () => {
        const app = document.querySelector('#app');
        app.innerHTML = Terms();
    });
}

function menuToTerms() {
    const menuTermsElem = document.querySelector('#terms');
    menuTermsElem.addEventListener('click', () => {
        const app = document.querySelector('#app');
        app.innerHTML = Terms();
    });
}

function navPrivacy() {
    const privacyElem = document.querySelector('.footer__privacy_listItem');
    privacyElem.addEventListener('click', () => {
        const app = document.querySelector('#app');
        app.innerHTML = Privacy();
    });
}

function menuToPrivacy() {
    const menuPrivacyElem = document.querySelector('#privacy');
    menuPrivacyElem.addEventListener('click', () => {
        const app = document.querySelector('#app');
        app.innerHTML = Privacy();
    });
}

function navigateToContactPage() {
    const contactButton = document.querySelector('.footer__contact_listItem');
    contactButton.addEventListener('click', () => {
        const app = document.querySelector('#app');
        app.innerHTML = ContactPage();
    });
}

function menuToContactPage() {
    const contactMenuBtn = document.querySelector('#contact');
    contactMenuBtn.addEventListener('click', () => {
        const app = document.querySelector('#app');
        app.innerHTML = ContactPage();
    });
}

function navToAboutPageMenu() {
    const navToAboutPageButton = document.querySelector('#about')
    navToAboutPageButton.addEventListener('click', () => {
        const app = document.querySelector('#app');
        app.innerHTML = About();
    });
}

function navToAboutPageFooter() {
    const navToAboutPageButton = document.querySelector('.footer__about_listItem');
    navToAboutPageButton.addEventListener('click', () => {
        const app = document.querySelector('#app');
        app.innerHTML = About();
    });
}

function navToSignInPage() {
    const navToSignInButton = document.querySelector('#profile_button');
    navToSignInButton.addEventListener('click', () => {
        app.innerHTML = SignInPage();
        const loginForm = document.getElementById("login-form");
        const loginButton = document.getElementById("login-form-submit");
        const loginErrorMsg = document.getElementById("login-error-msg");
        loginButton.addEventListener("click", (e) => {
            e.preventDefault();
            const username = loginForm.username.value;
            const password = loginForm.password.value;

            if (username === "teammacgyver" && password === "teammacgyver") {
                apiActions.getRequest('http://localhost:8080/parents/203', (parents) => {
                    wireUpParent(parents);
                    toggleSearchBar();
                    const profileButton = document.querySelector('#profile_button');
                    profileButton.addEventListener('click', () => {
                        apiActions.getRequest('http://localhost:8080/parents/203', (parents) => {
                            wireUpParent(parents);
                            toggleSearchBar();
                        });
                    });
                });
            } else {
                loginErrorMsg.style.opacity = 1;
            }
            SignInJs();
        });
    })
}

function navHome() {
    const homeElem = document.querySelector('#home-button');
    homeElem.addEventListener('click', () => {
        location.href='index.html';
        navTempChoices();
    });
}

function searchForRecipes() {
    const searchButton1 = document.querySelector('.search_for_recipes_button');
    searchButton1.addEventListener('click', (event) => {
        if (event.target.classList.contains('search_for_recipes_button')) {
            app.innerHTML = LoadingPage();
            const searchedRecipe = event.target.parentElement.querySelector('.search_for_recipes_input').value;
            apiActions.getRequest(`https://api.spoonacular.com/recipes/autocomplete?number=12&query=${searchedRecipe}&apiKey=${apiKeyNum}`, (theSearchedRecipes) => {
                console.log(theSearchedRecipes);
                toggleSearchBar();

                let stringName5 = '';
                for (let i = 0; i < theSearchedRecipes.length; i++) {
                    stringName5 += theSearchedRecipes[i].id + ',';
                }
                apiActions.getRequest(`https://api.spoonacular.com/recipes/informationBulk?ids=${stringName5}&apiKey=${apiKeyNum}&includeNutrition=false`, (recipe) => {
                    app.innerHTML = SavedRecipesToChildPage(recipe);
                    viewFullSavedRecipe();
                    toggleSearchBar();
                });
            });
        }
    });
}

function navTempChoices() {
    const searchForIngredientsBtn = document.querySelector('.ingredients__submitBtn');
    searchForIngredientsBtn.addEventListener('click', (event) => {
        if (event.target.classList.contains('ingredients__submitBtn'))
            var tempItemsToAdd = [];
        let allIngredientsToAdd = app.querySelectorAll('.temp-ingredient');
        allIngredientsToAdd.forEach((currentItem) => {
            if (currentItem.checked) {
                var checkedItem = currentItem.value;
                tempItemsToAdd.push(checkedItem);
            }
        });
        var tempPreferencesToAdd = [];
        let allTempPreferences = app.querySelectorAll('.temp-preferences');
        allTempPreferences.forEach((currentItem) => {
            if (currentItem.checked) {
                var checkedItem = currentItem.value;
                tempPreferencesToAdd.push(checkedItem);
            }
        });
        let tempItemsAndPreferences = [];
        tempItemsAndPreferences.push(tempItemsToAdd);
        tempItemsAndPreferences.push(tempPreferencesToAdd);
        let stringName6 = '';
        for (let i = 0; i < tempItemsAndPreferences.length; i++) {
            stringName6 += tempItemsAndPreferences[i] + ',';
        }

        apiActions.getRequest(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKeyNum}&includeIngredients=${stringName6}&fillIngredients=true&number=12&sort=popularity&limitLicense=true`, (recipes) => {
                            console.log(recipes);
                            app.innerHTML = RecipeIngredientsListPage(recipes);
                            navRecipe();
                        });
    });
}

function navRecipe() {
    const nav_full_recipe_button = document.querySelectorAll('.nav_full_recipe');
    for (const nav_full_recipe_button of nav_full_recipe_button) {
        nav_full_recipe_button.addEventListener('click', (event) => {
            if (event.target.classList.contains('nav_full_recipe')) {
                app.innerHTML = LoadingPage();
                singleRecipe = event.target.parentElement.parentElement.querySelector('input').value;
                apiActions.getRequest(`https://api.spoonacular.com/recipes/${singleRecipe}/card?apiKey=${apiKeyNum}&backgroundImage=background1`, (recipe) => {
                    console.log(recipe);
                    app.innerHTML = NonUserRecipePage(recipe);
                });
            }
        });
    }
}
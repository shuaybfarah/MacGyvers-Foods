package com.macgyverfoods.pickyeater.rest.controllers;

import com.macgyverfoods.pickyeater.models.Allergy;
import com.macgyverfoods.pickyeater.models.Child;
import com.macgyverfoods.pickyeater.models.Ingredient;
import com.macgyverfoods.pickyeater.models.Parent;
import com.macgyverfoods.pickyeater.repositories.AllergyRepository;
import com.macgyverfoods.pickyeater.repositories.ChildRepository;
import com.macgyverfoods.pickyeater.repositories.IngredientRepository;
import com.macgyverfoods.pickyeater.repositories.ParentRepository;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;

@RestController
@CrossOrigin
public class ParentRestController {

    @Resource
    private ParentRepository parentRepo;

    @Resource
    private IngredientRepository ingredientRepo;

    @Resource
    private ChildRepository childRepo;

    @Resource
    private AllergyRepository allergyRepo;

    @GetMapping("/parents")
    public Collection<Parent> getParents() {
        return (Collection<Parent>) parentRepo.findAll();
    }

    @GetMapping("/parents/{id}")
    public Optional<Parent> getParent(@PathVariable Long id) {
        return parentRepo.findById(id);
    }

    @GetMapping("/parents/{id}/children")
    public Collection<Child> getChildren(@PathVariable Long id) {
        Optional<Parent> parentToGetChildrenFor = Optional.of(parentRepo.findById(id).get());
        return parentToGetChildrenFor.get().getChild();
    }

    @GetMapping("/parents/{id}/ingredients")
    public Collection<Ingredient> getIngredients(@PathVariable Long id) {
        Optional<Parent> parentToGetIngredientsFor = Optional.of(parentRepo.findById(id).get());
        return parentToGetIngredientsFor.get().getIngredients();
    }

    @PostMapping("/parents/{id}/add-ingredient")
    public Optional<Parent> addIngredients(@RequestBody String body, @PathVariable Long id) throws JSONException {
        JSONObject newIngredient = new JSONObject(body);
        String ingredient = newIngredient.getString("ingredient");
        Optional<Ingredient> ingredientToAddOpt = ingredientRepo.findByIngredient(ingredient);
        if (ingredientToAddOpt.isPresent()) {
            Optional<Parent> parentToAddIngredientToOpt = parentRepo.findById(id);
            Parent parentToAddIngredientTo = parentToAddIngredientToOpt.get();
            parentToAddIngredientTo.addIngredient(ingredientToAddOpt.get());
            parentRepo.save(parentToAddIngredientTo);
        }
        return parentRepo.findById(id);
    }

    @DeleteMapping("/parents/{id}/delete-ingredient")
    public Optional<Parent> removeIngredients(@RequestBody String body, @PathVariable Long id) throws JSONException {
        JSONObject removedIngredient = new JSONObject(body);
        String ingredient = removedIngredient.getString("ingredient");
        Optional<Ingredient> ingredientToAddOpt = ingredientRepo.findByIngredient(ingredient);
        if (ingredientToAddOpt.isPresent()) {
            Optional<Parent> parentToAddIngredientToOpt = parentRepo.findById(id);
            Parent parentToAddIngredientTo = parentToAddIngredientToOpt.get();
            parentToAddIngredientTo.removeIngredient(ingredientToAddOpt.get());
            parentRepo.save(parentToAddIngredientTo);
        }
        return parentRepo.findById(id);
    }

    @PostMapping("/parents/{id}/add-child")
    public Optional<Parent> addChild(@RequestBody String body, @PathVariable Long id) throws JSONException {
        JSONObject newChild = new JSONObject(body);
        String firstName = newChild.getString("firstName");
        String lastName = newChild.getString("lastName");
        String age = newChild.getString("age");
        Optional<Child> childToAddOpt = childRepo.findByFirstName(firstName);
        if (childToAddOpt.isEmpty()) {
                Parent parentToAddChild2 = parentRepo.findById(id).get();
                Child childToAdd = new Child(firstName,lastName,age,parentToAddChild2);
                parentToAddChild2.addChild(childToAdd);
                childRepo.save(childToAdd);
//                parentRepo.save(parentToAddChild2);
        }
        return parentRepo.findById(id);
    }

    @DeleteMapping("/parents/{id}/delete-child")
    public Parent removeChild(@RequestBody String body, @PathVariable Long id) throws JSONException {
        JSONObject removedChild = new JSONObject(body);
        String firstName = removedChild.getString("firstName");
        Optional<Child> childToAddOpt = childRepo.findByFirstName(firstName);
        if (childToAddOpt.isPresent()) {
            Parent parentToRemoveChild2 = parentRepo.findById(id).get();
            childRepo.delete(childToAddOpt.get());
//            parentToRemoveChild2.removeChild(childToAddOpt.get());
            parentRepo.save(parentToRemoveChild2);
        }
        return parentRepo.findById(id).get();
    }
}
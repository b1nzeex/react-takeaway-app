import React, { useEffect, useState } from "react";

import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import Category from "./MealItem/Category";
import classes from "./AvailableMeals.module.css";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();

  const updateCategory = (event) => {
    setActiveCategory(event.target.id);
  };

  useEffect(() => {
    const fetchMeals = async () => {
      const response = await fetch(
        "https://react-meals-c6dea-default-rtdb.firebaseio.com/meals.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const responseData = await response.json();

      const loadedMeals = [];

      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price,
          category: responseData[key].category,
        });
      }

      const availableCategories = [
        ...new Set(loadedMeals.map((meal) => meal.category)),
      ];

      setCategories(availableCategories);
      setActiveCategory(availableCategories[0]);
      setMeals(loadedMeals);
      setIsLoading(false);
    };

    fetchMeals().catch((error) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

  if (isLoading) {
    return (
      <section className={classes.mealsLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  if (httpError) {
    return (
      <section className={classes.mealsError}>
        <p>{httpError}</p>
      </section>
    );
  }

  const mealsList = meals
    .filter((meal) => meal.category === activeCategory)
    .map((meal) => (
      <MealItem
        key={meal.id}
        id={meal.id}
        name={meal.name}
        description={meal.description}
        price={meal.price}
      />
    ));

  const categoryList = categories.map((category) => (
    <Category
      key={category}
      category={category}
      activeCategory={activeCategory === category}
      updateCategory={updateCategory}
    />
  ));

  return (
    <React.Fragment>
      <section className={classes.categories}>
        <Card>{categoryList}</Card>
      </section>

      <section className={classes.meals}>
        <Card>
          <ul>{mealsList}</ul>
        </Card>
      </section>
    </React.Fragment>
  );
};

export default AvailableMeals;

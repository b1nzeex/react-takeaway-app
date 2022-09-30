import classes from "./Category.module.css";

const Category = (props) => {
  const classList = `${classes.category} ${
    props.activeCategory ? classes.active : ""
  }`;

  return (
    <button
      onClick={props.updateCategory}
      id={props.category}
      className={classList}
    >
      {props.category}
    </button>
  );
};

export default Category;

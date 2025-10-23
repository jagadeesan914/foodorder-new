import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category = "All" }) => {
  const { foodList } = useContext(StoreContext); // ✅ updated variable

  if (!foodList || foodList.length === 0) {
    return <p>Loading foods...</p>; // prevent map on undefined
  }

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {foodList.map((item, index) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={item._id} // use _id instead of index for stable keys
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
          return null; // skip items not matching category
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;


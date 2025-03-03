// Default Imports
import { useEffect, useState } from "react";

// Custom Imports
import agent from "../api/agent";
import { styles } from "./styles";


const PizzaTable = () => {
  const [pizzas, setPizzas] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [newPizza, setNewPizza] = useState({ name: "", cheese: "", crust: "", sauce: "", toppings: [] });
  const [updatedPizza, setUpdatedPizza] = useState({ name: "", cheese: "", crust: "", sauce: "", toppings: [] });
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState("");
  const [editingPizza, setEditingPizza] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeToast, setActiveToast] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPizzas();
    fetchIngredients();
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setActiveToast(false);
    }, 5000)

    return () => clearTimeout(timer);
  }, [notification]);

  const fetchPizzas = async () => {
    try {
      const response = await agent.Requests.getPizzas();
      setPizzas(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching pizzas:", error);
      setPizzas([]);
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await agent.Requests.getToppings();
      setIngredients(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      setIngredients([]);
    }
  };

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);

  const handleAddPizza = async () => {
    if (!newPizza.name || !newPizza.cheese || !newPizza.crust || !newPizza.sauce || !newPizza.toppings.length) {
      setNotification("Please complete all steps before adding a pizza. 🥲");
      setActiveToast(true);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setNotification("No token found! Please log in again. 🥲");
      setActiveToast(true);
      return;
    }

    try {
      setLoading(true);
      setNotification("");
      await agent.Requests.addPizza(newPizza, token);
      setNotification("Pizza added successfully! 👍");
      fetchPizzas();
      setNewPizza({ name: "", cheese: "", crust: "", sauce: "", toppings: [] });
      setStep(1);
      setActiveToast(true);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding pizza:", error);
      setNotification("Failed to add pizza. 🥲");
      setActiveToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePizza = async (pizzaName: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setNotification("No token found! Please log in again. 🥲");
      setActiveToast(true);
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${pizzaName}?`)) {
      try {
        setLoading(true);
        await agent.Requests.deletePizza(pizzaName, token);
        setNotification(`Deleted ${pizzaName}! 👍`);
        setActiveToast(true);
        fetchPizzas();
      } catch (error) {
        console.error("Error deleting pizza:", error);
        setNotification("Failed to delete pizza. 🥲");
        setActiveToast(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditPizza = (pizza: any) => {
    setEditingPizza(pizza);
    setUpdatedPizza({ name: pizza.name, cheese: pizza.cheese, crust: pizza.crust, sauce: pizza.sauce, toppings: pizza.toppings });
    setStep(2);
    setShowModal(true);
  };

  const handleUpdatePizza = async () => {
    if (!updatedPizza.cheese || !updatedPizza.crust || !updatedPizza.sauce || !updatedPizza.toppings.length) {
      setNotification(`Please complete all steps before updating the pizza. 🥲 (${Date.now()})`);
      setActiveToast(true);
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      setNotification(`No token found! Please log in again. 🥲 (${Date.now()})`);
      setActiveToast(true);
      return;
    }
  
    try {
      setLoading(true);
      const oldPizzaName = editingPizza.name;
  
      const updatedPizzaData = {
        cheese: updatedPizza.cheese,
        crust: updatedPizza.crust,
        sauce: updatedPizza.sauce,
        toppings: updatedPizza.toppings,
        date_added: new Date().toISOString(),
      };
  
      if (updatedPizza.name !== oldPizzaName) {
        updatedPizzaData.name = updatedPizza.name;
      }
  
      await agent.Requests.updatePizza(oldPizzaName, updatedPizzaData, token);
  
      setNotification(`Pizza updated successfully! 👍 (${Date.now()})`);
      setActiveToast(true);
  
      fetchPizzas();
      setEditingPizza(null);
      setStep(1);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating pizza:", error);
      setNotification(`Failed to update pizza. 🥲 (${Date.now()})`);
      setActiveToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewPizza({ name: "", cheese: "", crust: "", sauce: "", toppings: [] });
    setUpdatedPizza({ name: "", cheese: "", crust: "", sauce: "", toppings: [] });
    setStep(1);
  };

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    if (checked) {
      setNewPizza((prev) => ({ ...prev, toppings: [...prev.toppings, value] }));
      setUpdatedPizza((prev) => ({ ...prev, toppings: [...prev.toppings, value] }));
    } else {
      setNewPizza((prev) => ({ ...prev, toppings: prev.toppings.filter((item) => item !== value) }));
      setUpdatedPizza((prev) => ({ ...prev, toppings: prev.toppings.filter((item) => item !== value) }));
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ fontWeight: 800 }}>Pizza Management</h1>

      {activeToast && <p style={styles.activeToast}>{notification}</p>}

      <button
        onClick={() => {
          setStep(2);
          setNewPizza({ name: "", cheese: "", crust: "", sauce: "", toppings: [] });
          setShowModal(true);
        }}
        style={styles.addToppingButton}
      >
        Add Pizza
      </button>

      {showModal && (
        <>
          <div style={styles.openModal} onClick={handleCloseModal} />
          <div style={styles.modalContent}>
            <button onClick={handleCloseModal} style={styles.modalCloseBtn}>
              X
            </button>
            <h3>{editingPizza ? "Edit Pizza" : "Add Pizza"}</h3>
            <div>
              {step === 1 && (
                <button onClick={handleNextStep} style={styles.startButton}>
                  {editingPizza ? "Update Pizza" : "Add Pizza"}
                </button>
              )}

              {step === 2 && (
                <div style={styles.editContainer}>
                  <h3>{editingPizza ? "Would you like to rename this pizza?" : "What do you want to call this masterpiece?"}</h3>
                  <input
                    type="text"
                    value={editingPizza ? updatedPizza.name : newPizza.name}
                    onChange={(e) => (editingPizza ? setUpdatedPizza({ ...updatedPizza, name: e.target.value }) : setNewPizza({ ...newPizza, name: e.target.value }))}
                    placeholder="Enter pizza name"
                    style={styles.inputText}
                  />
                  <div style={styles.actions}>
                    <button style={styles.actionsProceed} onClick={handleNextStep} disabled={editingPizza ? !updatedPizza.name : !newPizza.name}>
                      Next
                    </button>
                    <button style={styles.actionsBack} onClick={handlePrevStep}>
                      Back
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={styles.editContainer}>
                  <h3>Select Cheese:</h3>
                  <select
                    value={editingPizza ? updatedPizza.cheese : newPizza.cheese}
                    onChange={(e) => (editingPizza ? setUpdatedPizza({ ...updatedPizza, cheese: e.target.value }) : setNewPizza({ ...newPizza, cheese: e.target.value }))}
                    style={styles.inputText}
                  >
                    <option value="">Select Cheese</option>
                    {ingredients.filter((ingredient) => ingredient.topping_type === "cheese").map((ingredient) => (
                      <option key={ingredient.name} value={ingredient.name}>
                        {ingredient.name}
                      </option>
                    ))}
                  </select>
                  <div style={styles.actions}>
                    <button style={styles.actionsProceed} onClick={handleNextStep} disabled={editingPizza ? !updatedPizza.cheese : !newPizza.cheese}>
                      Next
                    </button>
                    <button style={styles.actionsBack} onClick={handlePrevStep}>
                      Back
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div style={styles.editContainer}>
                  <h3>Select Crust:</h3>
                  <select
                    value={editingPizza ? updatedPizza.crust : newPizza.crust}
                    onChange={(e) => (editingPizza ? setUpdatedPizza({ ...updatedPizza, crust: e.target.value }) : setNewPizza({ ...newPizza, crust: e.target.value }))}
                    style={styles.inputText}
                  >
                    <option value="">Select Crust</option>
                    {ingredients.filter((ingredient) => ingredient.topping_type === "crust").map((ingredient) => (
                      <option key={ingredient.name} value={ingredient.name}>
                        {ingredient.name}
                      </option>
                    ))}
                  </select>
                  <div style={styles.actions}>
                    <button style={styles.actionsProceed} onClick={handleNextStep} disabled={editingPizza ? !updatedPizza.crust : !newPizza.crust}>
                      Next
                    </button>
                    <button style={styles.actionsBack} onClick={handlePrevStep}>
                      Back
                    </button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div style={styles.editContainer}>
                  <h3>Select Sauce:</h3>
                  <select
                    value={editingPizza ? updatedPizza.sauce : newPizza.sauce}
                    onChange={(e) => (editingPizza ? setUpdatedPizza({ ...updatedPizza, sauce: e.target.value }) : setNewPizza({ ...newPizza, sauce: e.target.value }))}
                    style={styles.inputText}
                  >
                    <option value="">Select Sauce</option>
                    {ingredients.filter((ingredient) => ingredient.topping_type === "sauce").map((ingredient) => (
                      <option key={ingredient.name} value={ingredient.name}>
                        {ingredient.name}
                      </option>
                    ))}
                  </select>
                  <div style={styles.actions}>
                    <button style={styles.actionsProceed} onClick={handleNextStep} disabled={editingPizza ? !updatedPizza.sauce : !newPizza.sauce}>
                      Next
                    </button>
                    <button style={styles.actionsBack} onClick={handlePrevStep}>
                      Back
                    </button>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div style={styles.editContainer}>
                  <h3>Select Meat:</h3>
                  {ingredients.filter((ingredient) => ingredient.topping_type === "meat").map((ingredient) => (
                    <div key={ingredient.name}>
                      <input
                        type="checkbox"
                        value={ingredient.name}
                        checked={editingPizza ? updatedPizza.toppings.includes(ingredient.name) : newPizza.toppings.includes(ingredient.name)}
                        onChange={(e) => handleCheckboxChange(e, "toppings")}
                      />
                      <label>{ingredient.name}</label>
                    </div>
                  ))}
                  <div style={styles.actions}>
                    <button style={styles.actionsProceed} onClick={handleNextStep} disabled={editingPizza ? !updatedPizza.toppings.length : !newPizza.toppings.length}>
                      Next
                    </button>
                    <button style={styles.actionsBack} onClick={handlePrevStep}>
                      Back
                    </button>
                  </div>
                </div>
              )}

              {step === 7 && (
                <div style={styles.editContainer}>
                  <h3>Select Vegetables:</h3>
                  {ingredients.filter((ingredient) => ingredient.topping_type === "vegetable").map((ingredient) => (
                    <div key={ingredient.name}>
                      <input
                        type="checkbox"
                        value={ingredient.name}
                        checked={editingPizza ? updatedPizza.toppings.includes(ingredient.name) : newPizza.toppings.includes(ingredient.name)}
                        onChange={(e) => handleCheckboxChange(e, "toppings")}
                      />
                      <label>{ingredient.name}</label>
                    </div>
                  ))}
                  <div style={styles.actions}>
                    <button style={styles.actionsProceed} onClick={handleNextStep} disabled={editingPizza ? !updatedPizza.toppings.length : !newPizza.toppings.length}>
                      Next
                    </button>
                    <button style={styles.actionsBack} onClick={handlePrevStep}>
                      Back
                    </button>
                  </div>
                </div>
              )}

              {step === 8 && (
                <>
                  <h4>Review your Pizza:</h4>
                  <div style={styles.reviewContainer}>
                    <table style={styles.reviewTable}>
                      <tbody>
                        <tr>
                          <th style={styles.reviewRowCol}>Name</th>
                          <td style={styles.reviewRowCol}>{editingPizza ? updatedPizza.name : newPizza.name}</td>
                        </tr>
                        <tr>
                          <th style={styles.reviewRowCol}>Cheese</th>
                          <td style={styles.reviewRowCol}>{editingPizza ? updatedPizza.cheese : newPizza.cheese}</td>
                        </tr>
                        <tr>
                          <th style={styles.reviewRowCol}>Crust</th>
                          <td style={styles.reviewRowCol}>{editingPizza ? updatedPizza.crust : newPizza.crust}</td>
                        </tr>
                        <tr>
                          <th style={styles.reviewRowCol}>Sauce</th>
                          <td style={styles.reviewRowCol}>{editingPizza ? updatedPizza.sauce : newPizza.sauce}</td>
                        </tr>
                        <tr>
                          <th style={styles.reviewRowCol}>Toppings</th>
                          <td style={styles.reviewRowCol}>{editingPizza ? updatedPizza.toppings.join(", ") : newPizza.toppings.join(", ")}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div style={styles.actions}>
                    <button style={styles.actionsProceed} onClick={editingPizza ? handleUpdatePizza : handleAddPizza}>
                      {loading ? "Processing..." : "Confirm"}
                    </button>
                    <button style={styles.actionsBack} onClick={handlePrevStep}>
                      Back
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <table style={styles.tableContainer}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Name</th>
            <th style={styles.tableHeader}>Cheese</th>
            <th style={styles.tableHeader}>Crust</th>
            <th style={styles.tableHeader}>Sauce</th>
            <th style={styles.tableHeader}>Toppings</th>
            <th style={styles.tableHeader}>Prices</th>
            <th style={styles.tableHeader}>Date Added / Updated</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pizzas.map((pizza) => (
            <tr key={pizza.name}>
              <td style={styles.tableRow}>{pizza.name}</td>
              <td style={styles.tableRow}>{pizza.cheese}</td>
              <td style={styles.tableRow}>{pizza.crust}</td>
              <td style={styles.tableRow}>{pizza.sauce}</td>
              <td style={styles.tableRow}>{pizza.toppings.join(", ")}</td>
              <td style={styles.tableRow}>
                {Object.entries(pizza.price).map(([size, price]) => (
                  <div key={size}>{`${size}: $${price.toFixed(2)}`}</div>
                ))}
              </td>
              <td style={styles.tableRow}>{pizza.date_added}</td>
              <td style={styles.tableRow}>
                <button style={styles.tableEditBtn} onClick={() => handleEditPizza(pizza)}>
                  Edit
                </button>
                <button style={styles.tableDeleteBtn} onClick={() => handleDeletePizza(pizza.name)}>
                  Del
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default PizzaTable;

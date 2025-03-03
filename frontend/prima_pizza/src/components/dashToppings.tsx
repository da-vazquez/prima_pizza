// Default Imports
import { useEffect, useState } from "react";

// Custom Imports
import agent from "../api/agent";
import { styles } from "./styles";

const ToppingsTable = () => {
  const [toppings, setToppings] = useState([]);
  const [newTopping, setNewTopping] = useState({ name: "", price: "", topping_type: "" });
  const [updatedTopping, setUpdatedTopping] = useState({ name: "", price: "", topping_type: "" });
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState("");
  const [editingTopping, setEditingTopping] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeToast, setActiveToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const toppingTypes = ["meat", "cheese", "sauce", "crust", "vegetable"];

  useEffect(() => {
    fetchToppings();
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setActiveToast(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification]);

  const fetchToppings = async () => {
    try {
      const response = await agent.Requests.getToppings();
      setToppings(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching toppings:", error);
      setToppings([]);
    }
  };

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);

  const handleAddTopping = async () => {
    if (!newTopping.name || !newTopping.price || !newTopping.topping_type) {
      setNotification("Please complete all steps before adding a topping. 🥲");
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
      await agent.Requests.addTopping(newTopping, token);
      setNotification("Topping added successfully! 👍");
      fetchToppings();
      setNewTopping({ name: "", price: "", topping_type: "" });
      setStep(1);
      setActiveToast(true);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding topping:", error);
      setNotification("Failed to add topping. 🥲");
      setActiveToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopping = async (toppingName: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setNotification("No token found! Please log in again. 🥲");
      setActiveToast(true);
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${toppingName}?`)) {
      try {
        setLoading(true);
        await agent.Requests.deleteTopping(toppingName, token);
        setNotification(`Deleted ${toppingName}! 👍`);
        setActiveToast(true);
        fetchToppings();
      } catch (error) {
        console.error("Error deleting topping:", error);
        setNotification("Failed to delete topping. 🥲");
        setActiveToast(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditTopping = (topping: any) => {
    setEditingTopping(topping);
    setUpdatedTopping({ name: topping.name, price: topping.price, topping_type: topping.topping_type });
    setStep(2);
    setShowModal(true);
  };

  const handleUpdateTopping = async () => {
    if (!updatedTopping.price || !updatedTopping.topping_type) {
      setNotification(`Please complete all steps before updating the topping. 🥲 (${Date.now()})`);
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
      const oldToppingName = editingTopping.name;

      const updatedToppingData = {
        price: updatedTopping.price,
        topping_type: updatedTopping.topping_type,
        date_added: new Date().toISOString(),
      };

      if (updatedTopping.name !== oldToppingName) {
        updatedToppingData.name = updatedTopping.name;
      }

      await agent.Requests.updateTopping(oldToppingName, updatedToppingData, token);

      setNotification(`Topping updated successfully! 👍 (${Date.now()})`);
      setActiveToast(true);
      fetchToppings();
      setEditingTopping(null);
      setStep(1);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating topping:", error);
      setNotification(`Failed to update topping. 🥲 (${Date.now()})`);
      setActiveToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewTopping({ name: "", price: "", topping_type: "" });
    setUpdatedTopping({ name: "", price: "", topping_type: "" });
    setStep(1);
  };

  return (
    <div style={styles.container}>
      <h1 style={{ fontWeight: 800 }}>Toppings Management</h1>

      {activeToast && <p style={styles.activeToast}>{notification}</p>}

      <button
        onClick={() => {
          setStep(2);
          setNewTopping({ name: "", price: "", topping_type: "" });
          setShowModal(true);
        }}
        style={styles.addToppingButton}
      >
        Add Topping
      </button>

      {showModal && (
        <>
          <div style={styles.openModal} onClick={handleCloseModal} />
          <div style={styles.modalContent}>
            <button onClick={handleCloseModal} style={styles.modalCloseBtn}>
              X
            </button>
            <h3>{editingTopping ? "Edit Topping" : "Add Topping"}</h3>
            <div>
              {step === 1 && (
                <button onClick={handleNextStep} style={styles.startButton}>
                  {editingTopping ? "Update Topping" : "Add Topping"}
                </button>
              )}

              {step === 2 && (
                <div style={styles.editContainer}>
                  <h3>{editingTopping ? "Would you like to rename this topping?" : "What do you want to call this topping?"}</h3>
                  <input
                    type="text"
                    value={editingTopping ? updatedTopping.name : newTopping.name}
                    onChange={(e) => (editingTopping ? setUpdatedTopping({ ...updatedTopping, name: e.target.value }) : setNewTopping({ ...newTopping, name: e.target.value }))}
                    placeholder="Enter topping name"
                    style={styles.inputText}
                  />
                  <div style={styles.actions}>
                    <button style={styles.actionsProceed} onClick={handleNextStep} disabled={editingTopping ? !updatedTopping.name : !newTopping.name}>
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
                  <h3>Select Topping Type:</h3>
                  <select
                    value={editingTopping ? updatedTopping.topping_type : newTopping.topping_type}
                    onChange={(e) => (editingTopping ? setUpdatedTopping({ ...updatedTopping, topping_type: e.target.value }) : setNewTopping({ ...newTopping, topping_type: e.target.value }))}
                    style={styles.inputText}
                  >
                    <option value="">Select Type</option>
                    {toppingTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <div style={styles.actions}>
                    <button style={styles.actionsProceed} onClick={handleNextStep} disabled={editingTopping ? !updatedTopping.topping_type : !newTopping.topping_type}>
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
                  <h3>Set the Price:</h3>
                  <input
                    type="number"
                    value={editingTopping ? updatedTopping.price : newTopping.price}
                    onChange={(e) => (editingTopping ? setUpdatedTopping({ ...updatedTopping, price: e.target.value ? parseFloat(e.target.value) : parseFloat("1.00") }) : setNewTopping({ ...newTopping, price: e.target.value ? parseFloat(e.target.value) : parseFloat("1.00") }))}
                    placeholder="Enter price"
                    style={styles.inputText}
                  />
                  <div style={styles.actions}>
                    <button style={styles.actionsProceed} onClick={handleNextStep} disabled={editingTopping ? !updatedTopping.price : !newTopping.price}>
                      Next
                    </button>
                    <button style={styles.actionsBack} onClick={handlePrevStep}>
                      Back
                    </button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <>
                  <h4>Review your Topping:</h4>
                  <div style={styles.reviewContainer}>
                    <table style={styles.reviewTable}>
                      <tbody>
                        <tr>
                          <th style={styles.reviewRowCol}>Name</th>
                          <td style={styles.reviewRowCol}>{editingTopping ? updatedTopping.name : newTopping.name}</td>
                        </tr>
                        <tr>
                          <th style={styles.reviewRowCol}>Type</th>
                          <td style={styles.reviewRowCol}>{editingTopping ? updatedTopping.topping_type : newTopping.topping_type}</td>
                        </tr>
                        <tr>
                          <th style={styles.reviewRowCol}>Price</th>
                          <td style={styles.reviewRowCol}>${editingTopping ? updatedTopping.price : newTopping.price}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div style={styles.actions}>
                    <button style={styles.actionsProceed} onClick={editingTopping ? handleUpdateTopping : handleAddTopping}>
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
            <th style={styles.tableHeader}>Type</th>
            <th style={styles.tableHeader}>Price</th>
            <th style={styles.tableHeader}>Date Added / Updated</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {toppings.map((topping) => (
            <tr key={topping.name}>
              <td style={styles.tableRow}>{topping.name}</td>
              <td style={styles.tableRow}>{topping.topping_type}</td>
              <td style={styles.tableRow}>${topping.price.toFixed(2)}</td>
              <td style={styles.tableRow}>{topping.date_added}</td>
              <td style={styles.tableRow}>
                <button style={styles.tableEditBtn} onClick={() => handleEditTopping(topping)}>
                  Edit
                </button>
                <button style={styles.tableDeleteBtn} onClick={() => handleDeleteTopping(topping.name)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ToppingsTable;

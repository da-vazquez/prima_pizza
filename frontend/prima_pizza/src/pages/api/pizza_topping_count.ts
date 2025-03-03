import clientPromise from "../../api/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const pizzas = await db.collection("pizzas").countDocuments();
    const toppings = await db.collection("toppings").countDocuments();
    const meats = await db.collection("toppings").countDocuments({ topping_type: "meat" });
    const cheeses = await db.collection("toppings").countDocuments({ topping_type: "cheese" });
    const vegetables = await db.collection("toppings").countDocuments({ topping_type: "vegetable" });
    const sauces = await db.collection("toppings").countDocuments({ topping_type: "sauce" });
    const crusts = await db.collection("toppings").countDocuments({ topping_type: "crust" });

    res.status(200).json({
      pizzas,
      toppings,
      meats,
      cheeses,
      vegetables,
      sauces,
      crusts
    })
  
  } catch (error) {
    console.error("Error fetching pizza and topping data", error);
    res.status(500).json({ error: "Error fetching pizza and topping data" });
  }
}

import clientPromise from "../../api/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://prima-pizza.vercel.app',
    'https://prima-pizza-backend-west.azurewebsites.net',
    'https://localhost:3000'
  ];

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log("Attempting to connect to MongoDB...");
    
    const client = await clientPromise;
    const db = client.db("prima_pizza");

    console.log("Connected to MongoDB, executing queries...");
    
    const [pizzas, toppings, meats, cheeses, vegetables, sauces, crusts] = await Promise.all([
      db.collection("pizzas").countDocuments(),
      db.collection("toppings").countDocuments(),
      db.collection("toppings").countDocuments({ topping_type: "meat" }),
      db.collection("toppings").countDocuments({ topping_type: "cheese" }),
      db.collection("toppings").countDocuments({ topping_type: "vegetable" }),
      db.collection("toppings").countDocuments({ topping_type: "sauce" }),
      db.collection("toppings").countDocuments({ topping_type: "crust" })
    ]);

    console.log("Queries executed successfully");

    return res.status(200).json({
      pizzas,
      toppings,
      meats,
      cheeses,
      vegetables,
      sauces,
      crusts
    });
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({ 
      error: "Error fetching pizza and topping data",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

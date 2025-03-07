import clientPromise from "../../api/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
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
    console.log("MongoDB URL:", process.env.NEXT_PUBLIC_MONGODB_URL ? "URL exists" : "URL missing");
    
    const client = await clientPromise;
    console.log("Connected to MongoDB, executing queries...");
    
    const [pizzas, toppings, meats, cheeses, vegetables, sauces, crusts] = await Promise.all([
      client.db("prima_pizza").collection("pizzas").countDocuments(),
      client.db("prima_pizza").collection("toppings").countDocuments(),
      client.db("prima_pizza").collection("toppings").countDocuments({ topping_type: "meat" }),
      client.db("prima_pizza").collection("toppings").countDocuments({ topping_type: "cheese" }),
      client.db("prima_pizza").collection("toppings").countDocuments({ topping_type: "vegetable" }),
      client.db("prima_pizza").collection("toppings").countDocuments({ topping_type: "sauce" }),
      client.db("prima_pizza").collection("toppings").countDocuments({ topping_type: "crust" })
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
    console.log("MongoDB Error details:", error);
    return res.status(500).json({ 
      error: "Error fetching pizza and topping data",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

import express from "express";
import Item from "../models/item.model.js";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post("/recipe", async (req, res) => {
  try {
    const { dish } = req.body;
    if (!dish) return res.status(400).json({ message: "Dish name required" });

    // 1. AI GENERATION - Use broader prompts for better coverage
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a JSON array of raw ingredients for "${dish}". Keep names simple (e.g., "chicken", "chilli", "oil").`
    });

    const ingredientList = JSON.parse(response.text.match(/\[.*\]/s)[0]);

    // 2. FETCH ALL POTENTIAL COOKING CATEGORIES
    const cookingCategories = [
      "Bakery, Cakes & Dairy",
      "Foodgrains, Oil & Masala",
      "Fruits & Vegetables",
      "Eggs, Meat & Fish"
    ];
    const products = await Item.find({ category: { $in: cookingCategories } });

    // 3. SUPER FLEXIBLE MATCHING LOGIC
    const result = ingredientList.map((ingredient) => {
      const rawInput = ingredient.toLowerCase().trim();
      
      // Normalize: "chilly" & "chilli" -> "chill", "potatoes" -> "potato"
      const normalize = (str) => str.replace(/ies$|s$|i$|y$/g, '');
      
      const searchTerms = rawInput
        .split(/[\s-]+/) // Split by space or hyphen
        .map(term => normalize(term))
        .filter(term => term.length > 2);

      const matchedProducts = products
        .map(product => {
          const name = product.productName.toLowerCase();
          const normalizedName = normalize(name);
          let score = 0;

          // A. Term Matching: Count how many words match (even partially)
          const matches = searchTerms.filter(term => normalizedName.includes(term));
          
          // If NOT A SINGLE TERM matches, it's irrelevant
          if (matches.length === 0) return null;

          // B. Base Score: Points per matching term
          score += (matches.length * 20);

          // C. Sequence Bonus: Did they appear in the original order?
          if (name.includes(rawInput)) score += 50;

          // D. Exact Start Bonus: "Chicken..."
          if (name.startsWith(searchTerms[0])) score += 15;

          // E. Soft Exclusion Penalty: We don't hide Masalas, we just push them down
          const exclusions = ["masala", "powder", "mix", "paste"];
          const hasExclusion = exclusions.some(ex => name.includes(ex));
          
          // If AI didn't ask for powder/masala, but product is one, penalize it
          if (hasExclusion && !rawInput.includes("masala") && !rawInput.includes("powder")) {
            score -= 40; 
          }

          return { product, score };
        })
        .filter(item => item !== null) // Keep everything that had at least one word match
        .sort((a, b) => b.score - a.score)
        .slice(0, 8) // Show up to 8 options
        .map(item => item.product);

      return {
        name: ingredient,
        matchedProducts
      };
    });

    res.json({ ingredients: result });
  } catch (error) {
    console.error("Critical AI Error:", error);
    res.status(500).json({ message: "Recipe generation failed" });
  }
});

export default router;
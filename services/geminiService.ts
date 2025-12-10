import { GoogleGenAI } from "@google/genai";
import { Transaction, Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRetailInsights = async (transactions: Transaction[], products: Product[]) => {
  try {
    // Prepare data summary to reduce token usage and provide clear context
    const recentTransactions = transactions.slice(0, 50); // Analyze last 50 transactions
    const lowStock = products.filter(p => p.stock <= p.minStock).map(p => p.name);
    
    const summary = {
      totalTransactions: transactions.length,
      sampleData: recentTransactions.map(t => ({
        time: t.timestamp,
        amount: t.totalAmount,
        method: t.paymentMethod,
        items: t.items.map(i => i.product.name).join(", ")
      })),
      lowStockItems: lowStock
    };

    const prompt = `
      Agis en tant qu'Analyste Senior pour un magasin appelé SHOP CONNECT.
      Analyse les données JSON suivantes concernant les transactions et l'inventaire.
      
      Données: ${JSON.stringify(summary)}

      Veuillez fournir une analyse concise en texte brut (pas de formatage markdown comme le gras) en FRANÇAIS couvrant :
      1. Tendance des Ventes : Identifiez les modèles d'achat immédiats dans les transactions récentes.
      2. Action Stocks : Conseils spécifiques sur les articles en rupture de stock basés sur leur vitesse de vente.
      3. Prévision Trésorerie : Une brève prédiction pour les prochaines heures basée sur les méthodes de paiement utilisées.
      
      Garde un ton professionnel et actionnable. Limite la réponse à 150 mots.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Impossible de générer des analyses pour le moment. Veuillez vérifier votre connexion ou votre clé API.";
  }
};
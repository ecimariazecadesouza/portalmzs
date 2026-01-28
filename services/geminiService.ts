import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const draftAnnouncement = async (topic: string, tone: string): Promise<string> => {
  try {
    const prompt = `
      Atue como um coordenador escolar experiente.
      Escreva um aviso para o mural da escola (para alunos e pais) sobre o seguinte tópico: "${topic}".
      
      Tom de voz desejado: ${tone}.
      
      Regras:
      1. Seja claro, conciso e profissional, mas acolhedor.
      2. Use formatação adequada (parágrafos).
      3. Não coloque título, apenas o corpo do texto.
      4. O texto deve ter entre 2 a 4 parágrafos curtos.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar o aviso no momento.";
  } catch (error) {
    console.error("Erro ao conectar com Gemini:", error);
    return "Erro ao gerar o rascunho. Por favor, tente novamente.";
  }
};
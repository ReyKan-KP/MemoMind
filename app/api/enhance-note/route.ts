import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {


    const body = await request.json();
    const { content, enhanceType } = body;

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    if (!enhanceType) {
      return new NextResponse("Enhancement type is required", { status: 400 });
    }

    // Select the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create prompts based on enhancement type
    let prompt = "";
    switch (enhanceType) {
      case "grammar":
        prompt = `Improve the grammar and spelling of the following text without changing its meaning: ${content}`;
        break;
      case "elaborate":
        prompt = `Elaborate on the following text to make it more detailed and informative while maintaining its original meaning: ${content}`;
        break;
      case "concise":
        prompt = `Make the following text more concise while preserving its key points: ${content}`;
        break;
      case "professional":
        prompt = `Rewrite the following text in a more professional tone: ${content}`;
        break;
      default:
        prompt = `Enhance the following text to improve its clarity and readability: ${content}`;
    }

    // Generate content with Gemini
    const result = await model.generateContent(prompt + " Return plain text only. Do not use markdown formatting, bullet points, or any special text formatting. Provide the enhanced text directly without any additional explanations or headers.");
    const response = await result.response;
    const enhancedContent = response.text();

    return NextResponse.json({ enhancedContent });
  } catch (error) {
    console.error("[ENHANCE_NOTE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

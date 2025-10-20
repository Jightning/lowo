import { SnippetType } from "@/types";
import { GoogleGenAI, Type } from "@google/genai";

export async function suggestSnippetsFromText(content: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: content,
        config: {
            systemInstruction: `You are an analysis tool. 
            Your main goal to to find any useful snippets in the given content. 
            Useful snippets are defined as pieces of text within the content which contains 
            information that the user may want to save or copy and paste in the future.
            A snippet could be the whole content, or just piece of it, it depends on what the content provides.

            Given the contents you are provided, give me a list of any useful snippets you may find.
            `,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: {
                            type: Type.STRING,
                            description: "title of the snippet"
                        },
                        content: {
                            type: Type.OBJECT,
                            description: "object representing the content within the snippet (what the user copies when they want to reuse the snippet)",
                            properties: {
                                type: {
                                    type: Type.STRING,
                                    enum: Object.values(SnippetType),
                                    description: 'the type of the snippet'
                                },
                                content: {
                                    type: Type.STRING,
                                    description: `
                                        The content snippet from the original content provided.
                                        DO NOT ADD ANY EXTRA INFORMATION THAT ISN'T PRESENT IN THE ORIGINAL CONTENT.
                                        Try to maintain the same formatting as in the content (maintain newlines, tabs, etc.).
                                    `
                                }
                            },
                            propertyOrdering: ["type", "content"],
                        }
                    },
                    description: "An object representing a snippet found in the text",
                    propertyOrdering: ["title", "content"],
                },
            },
        },      
    });
    console.log(response)
    return response
}
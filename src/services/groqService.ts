const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1';

interface ChatCompletionParams {
  model: string;
  messages: { role: string; content: string }[];
  temperature?: number;
  max_completion_tokens?: number;
  top_p?: number;
  stream?: boolean;
  stop?: string | string[] | null;
  response_format?: { type: string; json_schema?: object };
}

export async function getChatCompletion(params: ChatCompletionParams) {
  if (!GROQ_API_KEY) {
    console.error("Groq API Key is not configured.");
    throw new Error("Groq API Key is not configured.");
  }

  try {
    const response = await fetch(`${GROQ_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API Error:", errorData);
      // Consider more specific error handling based on Groq's responses
      throw new Error(`API request failed: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw error;
  }
}

// Example of how you might call this from a component:
// import { getChatCompletion } from './services/groqService'; // Updated path
//
// async function handleSomeAction() {
//   try {
//     const completion = await getChatCompletion({
//       model: "qwen-qwq-32b", // From user's JSON
//       messages: [{ role: "user", content: "Tell me a very short story about a brave llama." }], // Example messages
//       temperature: 0.6, // From user's JSON
//       max_completion_tokens: 4096, // From user's JSON
//       top_p: 0.95, // From user's JSON
//       stream: false, // IMPORTANT: Changed from user's true for current function compatibility
//       stop: null // From user's JSON
//     });
//     console.log("Groq API Response:", completion);
//     if (!params.stream && completion.choices && completion.choices.length > 0) {
//       console.log("Message from model:", completion.choices[0].message.content);
//     }
//   } catch (error) {
//     // Handle error in UI
//   }
// }

// Example of how you might call this from a component FOR CASE GENERATION:
// import { getChatCompletion } from './services/groqService';
//
// // Simplified example of your case study structure for the prompt
// const caseStudyStructureExample = `
// {
//   "id": "case_new_001",
//   "title": "New Case Title",
//   "description": "Detailed description of the new case.",
//   "initialInfo": {
//     "projectGoals": ["Goal 1", "Goal 2"],
//     "targetUsers": [{ "persona": "Example Persona", "needs": "Needs of this persona." }],
//     "constraints": { "budget": 100000, "timelineMonths": 3 }
//   },
//   "scenarios": [
//     {
//       "id": "sc_new_001",
//       "projectPhase": "Initiation",
//       "title": "Initial Challenge",
//       "description": "Description of the first scenario.",
//       "choices": {
//         "ProductManager": [
//           { "id": "sc_new_001_prod_opt1", "text": "Option 1 for Product Manager", "effects": {}, "nextScenarioId": null }
//         ],
//         "ProjectManager": [
//           { "id": "sc_new_001_proj_opt1", "text": "Option 1 for Project Manager", "effects": {}, "nextScenarioId": null }
//         ]
//       }
//     }
//     // ... more scenarios ...
//   ]
// }
// `;
//
// async function generateNewCase() {
//   try {
//     const caseGenerationMessages = [
//       {
//         role: "system",
//         content: `You are an expert game designer creating JSON-formatted case studies for a product and project management game. Ensure the output is a single, valid JSON object matching the structure of the example provided. Do not include any explanatory text before or after the JSON.`
//       },
//       {
//         role: "user",
//         content: `Please generate a new case study about a non-profit organization trying to launch a new fundraising platform. It should have at least 2 initial scenarios. Here is an example of the desired JSON structure: ${caseStudyStructureExample}`
//       }
//     ];
//
//     const newCaseData = await getChatCompletion({
//       model: "qwen-qwq-32b", // Updated model
//       messages: caseGenerationMessages,
//       temperature: 0.7,
//       max_completion_tokens: 3000, // Adjust as needed for complex JSON
//       response_format: { type: "json_object" }, // Request JSON output
//       stream: false,
//     });
//     console.log("Generated Case Study Data:", newCaseData);
//     // The actual case study should be in newCaseData.choices[0].message.content
//     // You'll need to parse it: JSON.parse(newCaseData.choices[0].message.content)
//     const generatedCase = JSON.parse(newCaseData.choices[0].message.content);
//     console.log("Parsed Generated Case:", generatedCase);
//   } catch (error) {
//     console.error("Error generating case study:", error);
//   }
// } 
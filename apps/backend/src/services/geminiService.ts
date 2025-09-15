import { GoogleGenAI, Modality } from "@google/genai";

// 環境変数の型安全な取得（Cloudflare Workers用）
const getApiKey = (env: any): string => {
	const apiKey = env.GEMINI_API_KEY;
	if (!apiKey) {
		throw new Error("GEMINI_API_KEY environment variable not set");
	}
	return apiKey;
};

// AIインスタンスを動的に作成する関数
const createAI = (env: any) => {
	return new GoogleGenAI({ apiKey: getApiKey(env) });
};

// ファイルをBase64エンコードしてGenerative AI用の形式に変換
const fileToGenerativePart = async (
	file: File,
): Promise<{ inlineData: { data: string; mimeType: string } }> => {
	const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			const result = reader.result as string;
			if (!result) {
				reject(new Error("Failed to read file"));
				return;
			}
			resolve(result.split(",")[1] ?? "");
		};
		reader.onerror = () => reject(new Error("Failed to read file"));
		reader.readAsDataURL(file);
	});

	return {
		inlineData: {
			data: await base64EncodedDataPromise,
			mimeType: file.type,
		},
	};
};

// YAMLプロンプトを生成する関数
export const generateYamlPrompt = async (
	imageFile: File,
	prompt: string,
	env: any,
): Promise<string> => {
	try {
		const ai = createAI(env);
		const imagePart = await fileToGenerativePart(imageFile);
		const textPart = { text: prompt };

		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: { parts: [imagePart, textPart] },
		});

		const yamlText = response.text;
		if (!yamlText) {
			throw new Error("API did not return any text. Please try again.");
		}

		// YAMLコードブロックのマークダウン記法を除去
		return yamlText
			.replace(/^```yaml\n/, "")
			.replace(/```$/, "")
			.trim();
	} catch (error) {
		console.error("Error generating YAML prompt:", error);
		throw error instanceof Error
			? error
			: new Error("Failed to generate YAML prompt");
	}
};

// キャラクターシートを生成する関数
export const generateCharacterSheet = async (
	imageFile: File,
	yamlPrompt: string,
	env: any,
): Promise<string> => {
	try {
		const ai = createAI(env);
		const imagePart = await fileToGenerativePart(imageFile);
		const textPart = {
			text: `From the provided character image, generate a character reference sheet. This sheet will be used as the definitive reference for all future images of this character, so it must be a faithful and accurate reproduction.
The output image must contain:
1.  A full-body front view.
2.  A full-body back view.
3.  A full-body side view.
The style, coloring, and line art must be consistent with the provided reference image and the style defined in the YAML below. The background must be plain white.
The following YAML contains a detailed analysis of the character to assist you:
---
${yamlPrompt}`,
		};

		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash-image-preview",
			contents: { parts: [imagePart, textPart] },
			config: {
				responseModalities: [Modality.IMAGE, Modality.TEXT],
			},
		});

		let imageUrl: string | null = null;

		if (response.candidates && response.candidates.length > 0) {
			const candidate = response.candidates[0];
			if (candidate?.content?.parts) {
				for (const part of candidate.content.parts) {
					if (part.inlineData?.data) {
						const base64ImageBytes: string = part.inlineData.data;
						imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
						break; // Found the image, exit loop
					}
				}
			}
		}

		if (!imageUrl) {
			let fallbackText =
				"Character sheet generation failed. The model did not return an image.";
			const textResponse = response.text;
			if (textResponse) {
				fallbackText += ` The AI returned text instead: "${textResponse.trim()}"`;
			}
			throw new Error(fallbackText);
		}

		return imageUrl;
	} catch (error) {
		console.error("Error generating character sheet:", error);
		throw error instanceof Error
			? error
			: new Error("Failed to generate character sheet");
	}
};

// 新しい画像を生成する関数
export const generateNewImage = async (
	characterSheetFile: File,
	prompt: string,
	env: any,
	compositionImageFile?: File,
): Promise<{ image: string | null; text: string | null }> => {
	try {
		const ai = createAI(env);
		const parts: (
			| { text: string }
			| { inlineData: { data: string; mimeType: string } }
		)[] = [];

		// 1. Add Character Sheet
		const characterSheetPart = await fileToGenerativePart(characterSheetFile);
		parts.push(characterSheetPart);

		// 2. Add Composition Image if it exists
		if (compositionImageFile) {
			const compositionImagePart =
				await fileToGenerativePart(compositionImageFile);
			parts.push(compositionImagePart);
		}

		// 3. Create and Add Text Prompt
		let textPrompt = `You will be given one or two images and a text prompt.
- The **first image** is the definitive character reference sheet. The character's appearance, clothing, style, and coloring **must** be perfectly consistent with this first image.
`;

		if (compositionImageFile) {
			textPrompt +=
				"- The **second image** is a reference for the pose and composition. Recreate the pose and composition from the second image, but draw the character from the first image.\n";
		}

		textPrompt += `- The **text prompt** provides specific instructions. Follow these instructions: "${prompt}"`;

		parts.push({ text: textPrompt });

		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash-image-preview",
			contents: { parts },
			config: {
				responseModalities: [Modality.IMAGE, Modality.TEXT],
			},
		});

		let imageUrl: string | null = null;
		let responseText: string | null = null;

		if (response.candidates && response.candidates.length > 0) {
			const candidate = response.candidates[0];
			if (candidate?.content?.parts) {
				for (const part of candidate.content.parts) {
					if (part.inlineData?.data) {
						const base64ImageBytes: string = part.inlineData.data;
						imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
					} else if (part.text) {
						responseText = part.text;
					}
				}
			}
		}

		if (!imageUrl) {
			const fallbackText =
				responseText ||
				response.text ||
				"No image was generated. The model might have refused the prompt for safety reasons.";
			return { image: null, text: fallbackText };
		}

		return { image: imageUrl, text: responseText };
	} catch (error) {
		console.error("Error generating new image:", error);
		throw error instanceof Error
			? error
			: new Error("Failed to generate new image");
	}
};

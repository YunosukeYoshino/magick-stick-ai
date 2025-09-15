// バックエンドAPIのベースURL
const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";

// YAMLプロンプトを生成する関数
export const generateYamlPrompt = async (
	imageFile: File,
	prompt: string,
): Promise<string> => {
	try {
		const formData = new FormData();
		formData.append("image", imageFile);
		formData.append("prompt", prompt);

		const response = await fetch(`${API_BASE_URL}/api/generate-yaml`, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "Failed to generate YAML prompt");
		}

		const data = await response.json();
		return data.yamlPrompt;
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
): Promise<string> => {
	try {
		const formData = new FormData();
		formData.append("image", imageFile);
		formData.append("yamlPrompt", yamlPrompt);

		const response = await fetch(
			`${API_BASE_URL}/api/generate-character-sheet`,
			{
				method: "POST",
				body: formData,
			},
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "Failed to generate character sheet");
		}

		const data = await response.json();
		return data.characterSheet;
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
	compositionImageFile?: File,
): Promise<{ image: string | null; text: string | null }> => {
	try {
		const formData = new FormData();
		formData.append("characterSheet", characterSheetFile);
		formData.append("prompt", prompt);

		if (compositionImageFile) {
			formData.append("compositionImage", compositionImageFile);
		}

		const response = await fetch(`${API_BASE_URL}/api/generate-new-image`, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "Failed to generate new image");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error generating new image:", error);
		throw error instanceof Error
			? error
			: new Error("Failed to generate new image");
	}
};

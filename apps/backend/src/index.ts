import { Hono } from "hono";
import { cors } from "hono/cors";
import {
	generateCharacterSheet,
	generateNewImage,
	generateYamlPrompt,
} from "./services/geminiService";

type Bindings = {
	GEMINI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS設定
app.use(
	"*",
	cors({
		origin: ["http://localhost:5173", "http://localhost:3000"], // Viteのデフォルトポート
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	}),
);

app.get("/", (c) => {
	return c.text("Character Sheet AI Assistant API");
});

// YAMLプロンプト生成エンドポイント
app.post("/api/generate-yaml", async (c) => {
	try {
		const formData = await c.req.formData();
		const imageFile = formData.get("image") as File;
		const prompt = formData.get("prompt") as string;

		if (!imageFile || !prompt) {
			return c.json({ error: "Image file and prompt are required" }, 400);
		}

		const yamlPrompt = await generateYamlPrompt(imageFile, prompt, c.env);
		return c.json({ yamlPrompt });
	} catch (error) {
		console.error("Error in generate-yaml endpoint:", error);
		return c.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to generate YAML prompt",
			},
			500,
		);
	}
});

// キャラクターシート生成エンドポイント
app.post("/api/generate-character-sheet", async (c) => {
	try {
		const formData = await c.req.formData();
		const imageFile = formData.get("image") as File;
		const yamlPrompt = formData.get("yamlPrompt") as string;

		if (!imageFile || !yamlPrompt) {
			return c.json({ error: "Image file and YAML prompt are required" }, 400);
		}

		const characterSheet = await generateCharacterSheet(
			imageFile,
			yamlPrompt,
			c.env,
		);
		return c.json({ characterSheet });
	} catch (error) {
		console.error("Error in generate-character-sheet endpoint:", error);
		return c.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to generate character sheet",
			},
			500,
		);
	}
});

// 新しい画像生成エンドポイント
app.post("/api/generate-new-image", async (c) => {
	try {
		const formData = await c.req.formData();
		const characterSheetFile = formData.get("characterSheet") as File;
		const prompt = formData.get("prompt") as string;
		const compositionImageFile = formData.get(
			"compositionImage",
		) as File | null;

		if (!characterSheetFile || !prompt) {
			return c.json(
				{ error: "Character sheet file and prompt are required" },
				400,
			);
		}

		const result = await generateNewImage(
			characterSheetFile,
			prompt,
			c.env,
			compositionImageFile || undefined,
		);
		return c.json(result);
	} catch (error) {
		console.error("Error in generate-new-image endpoint:", error);
		return c.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to generate new image",
			},
			500,
		);
	}
});

export default app;

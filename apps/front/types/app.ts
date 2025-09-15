// App.tsx用の型定義

export interface ImageState {
	file: File | null;
	previewUrl: string;
}

export interface GeneratedImage {
	url: string;
	text: string | null;
}

export interface AppState {
	referenceImage: ImageState | null;
	generatedYaml: string | null;
	isYamlLoading: boolean;
	characterSheet: string | null;
	isSheetLoading: boolean;
	newPosePrompt: string;
	compositionImage: ImageState | null;
	generatedImage: GeneratedImage | null;
	isNewImageLoading: boolean;
	error: string | null;
	copySuccess: boolean;
}

export interface SavedData {
	referenceImagePreviewUrl: string;
	generatedYaml: string;
	characterSheetUrl: string | null;
}

export type AppAction =
	| { type: "SET_REFERENCE_IMAGE"; payload: ImageState | null }
	| { type: "SET_GENERATED_YAML"; payload: string | null }
	| { type: "SET_YAML_LOADING"; payload: boolean }
	| { type: "SET_CHARACTER_SHEET"; payload: string | null }
	| { type: "SET_SHEET_LOADING"; payload: boolean }
	| { type: "SET_NEW_POSE_PROMPT"; payload: string }
	| { type: "SET_COMPOSITION_IMAGE"; payload: ImageState | null }
	| { type: "SET_GENERATED_IMAGE"; payload: GeneratedImage | null }
	| { type: "SET_NEW_IMAGE_LOADING"; payload: boolean }
	| { type: "SET_ERROR"; payload: string | null }
	| { type: "SET_COPY_SUCCESS"; payload: boolean }
	| { type: "RESET_STATE" };

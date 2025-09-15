// 共通の型定義

// API関連の型
export interface ApiResponse<T = unknown> {
	data: T;
	success: boolean;
	message?: string;
	error?: string;
}

// エラーハンドリング用の型
export interface AppError {
	code: string;
	message: string;
	details?: Record<string, unknown>;
}

// ファイルアップロード関連の型
export interface FileUploadResult {
	success: boolean;
	file?: File;
	error?: string;
	preview?: string;
}

// Gemini API関連の型
export interface GeminiConfig {
	apiKey: string;
	model?: string;
	temperature?: number;
	maxTokens?: number;
}

export interface GeminiResponse {
	text: string;
	usage?: {
		promptTokens: number;
		completionTokens: number;
		totalTokens: number;
	};
}

// コンポーネント用の共通型
export interface BaseComponentProps {
	className?: string;
	children?: React.ReactNode;
}

// フォーム関連の型
export interface FormState<T = Record<string, unknown>> {
	values: T;
	errors: Partial<Record<keyof T, string>>;
	isSubmitting: boolean;
	isValid: boolean;
}

// ユーティリティ型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// イベントハンドラーの型
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// 状態管理用の型
export interface StateAction<T> {
	type: string;
	payload?: T;
}

export type StateReducer<T, A extends StateAction<unknown>> = (
	state: T,
	action: A,
) => T;

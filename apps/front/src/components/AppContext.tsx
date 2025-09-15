import type React from "react";
import { createContext, useContext, useState } from "react";

interface AppContextType {
	resetApplication: () => void;
	setResetFunction: (fn: () => void) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within an AppContextProvider");
	}
	return context;
};

export const AppContextProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [resetFunction, setResetFunction] = useState<() => void>(() => {});

	return (
		<AppContext.Provider
			value={{
				resetApplication: resetFunction,
				setResetFunction: setResetFunction,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

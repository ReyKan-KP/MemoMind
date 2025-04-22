import { useState } from "react";
import axios, { AxiosError } from "axios";

export type EnhanceType = "grammar" | "elaborate" | "concise" | "professional" | "general";

export const useEnhance = () => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enhanceContent = async (content: string, enhanceType: EnhanceType): Promise<string> => {
    setIsEnhancing(true);
    setError(null);

    try {
      const response = await axios.post("/api/enhance-note", {
        content,
        enhanceType,
      });

      setIsEnhancing(false);
      return response.data.enhancedContent;
    } catch (err: unknown) {
      setIsEnhancing(false);
      const errorMessage = axios.isAxiosError(err) 
        ? (err as AxiosError<string>).response?.data || "Failed to enhance content" 
        : "An unexpected error occurred";
      
      setError(typeof errorMessage === 'string' ? errorMessage : "Failed to enhance content");
      throw new Error(typeof errorMessage === 'string' ? errorMessage : "Failed to enhance content");
    }
  };

  return {
    enhanceContent,
    isEnhancing,
    error,
  };
}; 
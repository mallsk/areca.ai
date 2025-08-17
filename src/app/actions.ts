'use server';

import { analyzeArecaNutGrade } from '@/ai/flows/analyze-areca-nut-grade';
import type { AnalysisResult } from '@/lib/types';

export type FormState = {
  result: AnalysisResult | null;
  error: string | null;
};

export async function getAnalysis(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const photoDataUri = formData.get('photoDataUri') as string;

  if (!photoDataUri || !photoDataUri.startsWith('data:image/')) {
    return { result: null, error: 'Please upload a valid image.' };
  }

  try {
    const result = await analyzeArecaNutGrade({ photoDataUri });
    return { result, error: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { result: null, error: `Failed to analyze the image. ${errorMessage}. Please try again.` };
  }
}

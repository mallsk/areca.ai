'use server';
/**
 * @fileOverview Analyzes the grade and quality of areca nuts from an image.
 *
 * - analyzeArecaNutGrade - A function that analyzes the grade and quality of areca nuts.
 * - AnalyzeArecaNutGradeInput - The input type for the analyzeArecaNutGrade function.
 * - AnalyzeArecaNutGradeOutput - The return type for the analyzeArecaNutGrade function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeArecaNutGradeInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of areca nuts, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeArecaNutGradeInput = z.infer<typeof AnalyzeArecaNutGradeInputSchema>;

const AnalyzeArecaNutGradeOutputSchema = z.object({
  grade: z.string().describe('The grade of the areca nuts (e.g., A, B, C).'),
  gradingReason: z
    .string()
    .describe('The reasoning for assigning the grade, based on visual characteristics.'),
  bestQualityPercentage: z
    .number()
    .describe('The estimated percentage of best quality areca nuts in the sample.'),
  worstQualityPercentage: z
    .number()
    .describe('The estimated percentage of worst quality areca nuts in the sample.'),
  damagedPercentage: z
    .number()
    .describe('The estimated percentage of visibly damaged areca nuts in the sample.'),
});
export type AnalyzeArecaNutGradeOutput = z.infer<typeof AnalyzeArecaNutGradeOutputSchema>;

export async function analyzeArecaNutGrade(
  input: AnalyzeArecaNutGradeInput
): Promise<AnalyzeArecaNutGradeOutput> {
  return analyzeArecaNutGradeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeArecaNutGradePrompt',
  input: {schema: AnalyzeArecaNutGradeInputSchema},
  output: {schema: AnalyzeArecaNutGradeOutputSchema},
  prompt: `You are an expert in areca nut grading.

You will analyze the provided image of areca nuts and determine their grade based on visual characteristics such as size, color, and apparent defects. Provide a reason for the grade you assign.

You will also estimate the percentage of the sample that is of the best quality, the percentage that is of the worst quality, and the percentage that appears to be damaged.

Analyze the following image:
{{media url=photoDataUri}}`,
});

const analyzeArecaNutGradeFlow = ai.defineFlow(
  {
    name: 'analyzeArecaNutGradeFlow',
    inputSchema: AnalyzeArecaNutGradeInputSchema,
    outputSchema: AnalyzeArecaNutGradeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

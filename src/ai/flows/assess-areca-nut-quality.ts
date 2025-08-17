'use server';
/**
 * @fileOverview Assesses the quality of areca nuts in an image by estimating the percentage of 'best' and 'worst' quality nuts.
 *
 * - assessArecaNutQuality - A function that handles the areca nut quality assessment process.
 * - AssessArecaNutQualityInput - The input type for the assessArecaNutQuality function.
 * - AssessArecaNutQualityOutput - The return type for the assessArecaNutQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessArecaNutQualityInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of areca nuts, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AssessArecaNutQualityInput = z.infer<typeof AssessArecaNutQualityInputSchema>;

const AssessArecaNutQualityOutputSchema = z.object({
  qualityAssessment: z.object({
    bestQualityPercentage: z
      .number()
      .describe('The estimated percentage of best quality areca nuts in the image.'),
    worstQualityPercentage: z
      .number()
      .describe('The estimated percentage of worst quality areca nuts in the image.'),
  }),
});
export type AssessArecaNutQualityOutput = z.infer<typeof AssessArecaNutQualityOutputSchema>;

export async function assessArecaNutQuality(
  input: AssessArecaNutQualityInput
): Promise<AssessArecaNutQualityOutput> {
  return assessArecaNutQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessArecaNutQualityPrompt',
  input: {schema: AssessArecaNutQualityInputSchema},
  output: {schema: AssessArecaNutQualityOutputSchema},
  prompt: `You are an expert in areca nut quality assessment. Analyze the provided image and estimate the percentage of areca nuts that are of the best quality and the percentage that are of the worst quality.  Return your estimates as two numbers that sum to 100.

Image: {{media url=photoDataUri}}

Ensure that the outputted percentages accurately reflect the visual characteristics of the areca nuts in the provided image, considering factors such as color, size, shape, and overall appearance.
`,
});

const assessArecaNutQualityFlow = ai.defineFlow(
  {
    name: 'assessArecaNutQualityFlow',
    inputSchema: AssessArecaNutQualityInputSchema,
    outputSchema: AssessArecaNutQualityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

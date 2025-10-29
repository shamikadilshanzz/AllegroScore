'use server';
/**
 * @fileOverview Recommends new sheet music to purchase based on a user's purchase history.
 *
 * - recommendNewSheetMusic - A function that recommends new sheet music for a user.
 * - RecommendNewSheetMusicInput - The input type for the recommendNewSheetMusic function.
 * - RecommendNewSheetMusicOutput - The return type for the recommendNewSheetMusic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendNewSheetMusicInputSchema = z.object({
  purchaseHistory: z
    .string()
    .describe("A comma separated list of sheet music titles the user has purchased."),
});
export type RecommendNewSheetMusicInput = z.infer<typeof RecommendNewSheetMusicInputSchema>;

const RecommendNewSheetMusicOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('A comma separated list of sheet music titles to recommend to the user.'),
});
export type RecommendNewSheetMusicOutput = z.infer<typeof RecommendNewSheetMusicOutputSchema>;

export async function recommendNewSheetMusic(input: RecommendNewSheetMusicInput): Promise<RecommendNewSheetMusicOutput> {
  return recommendNewSheetMusicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendNewSheetMusicPrompt',
  input: {schema: RecommendNewSheetMusicInputSchema},
  output: {schema: RecommendNewSheetMusicOutputSchema},
  prompt: `You are a sheet music recommendation expert. Based on a user's purchase history, you will recommend new sheet music to purchase. Only recommend sheet music that the user has not purchased yet.

Purchase History: {{{purchaseHistory}}}

Recommendations:`,
});

const recommendNewSheetMusicFlow = ai.defineFlow(
  {
    name: 'recommendNewSheetMusicFlow',
    inputSchema: RecommendNewSheetMusicInputSchema,
    outputSchema: RecommendNewSheetMusicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

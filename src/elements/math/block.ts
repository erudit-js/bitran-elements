import { ensureMathNotEmpty, latexToHtml } from './render';

export const blockMathGroupGaps = ['small', 'normal', 'big'] as const;

export interface BlockMathGroup<T = string> {
    gap: (typeof blockMathGroupGaps)[number] | (string & {});
    parts: (T | BlockMathGroup<T>)[];
}

export async function resolveMathGroups<T = string>(
    latex: string,
    transform: (text: string) => Promise<T> | T = (text) => text as T,
): Promise<BlockMathGroup<T>> {
    // If there are no delimiters, return simple structure
    if (!latex.includes('>>')) {
        const trimmed = latex.trim();
        const processedText = await transform(trimmed);
        return {
            gap: 'normal',
            parts: [processedText],
        };
    }

    // Find the rightmost delimiter and its gap specification
    const delimiterRegex = />>(?:\{([^}]+)\})?/g;
    let match;
    let lastDelimiterMatch!: RegExpExecArray;

    while ((match = delimiterRegex.exec(latex)) !== null) {
        lastDelimiterMatch = match;
    }

    // Extract gap from the last delimiter
    const gap = lastDelimiterMatch[1] || 'normal';

    // Calculate positions
    const lastDelimiterPos = lastDelimiterMatch.index;
    const lastDelimiterLength = lastDelimiterMatch[0].length;

    // Split the latex string
    const leftPart = latex.substring(0, lastDelimiterPos);
    const rightPart = latex.substring(lastDelimiterPos + lastDelimiterLength);

    const parts: (T | BlockMathGroup<T>)[] = [];

    // Process left part recursively if it contains delimiters
    if (leftPart.includes('>>')) {
        parts.push(await resolveMathGroups(leftPart, transform));
    } else {
        const trimmedLeft = leftPart.trim();
        parts.push(await transform(trimmedLeft));
    }

    // Add right part
    const trimmedRight = rightPart.trim();
    parts.push(await transform(trimmedRight));

    return {
        gap,
        parts,
    };
}

export async function renderBlockMath(
    latex: string,
): Promise<BlockMathGroup<string>> {
    ensureMathNotEmpty(latex);
    return resolveMathGroups(latex, (text) => latexToHtml(text, 'block'));
}

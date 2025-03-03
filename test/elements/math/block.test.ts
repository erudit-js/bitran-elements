import { resolveMathGroups } from '../../../src/elements/math/block';

describe('resolveMathGroups', () => {
    test('should handle empty string', async () => {
        const result = await resolveMathGroups('');
        expect(result).toEqual({
            gap: 'normal',
            parts: [''],
        });
    });

    test('should handle simple text with no delimiters', async () => {
        const result = await resolveMathGroups('x + y = z');
        expect(result).toEqual({
            gap: 'normal',
            parts: ['x + y = z'],
        });
    });

    test('should split by simple delimiter', async () => {
        const result = await resolveMathGroups('a >> b');
        expect(result).toEqual({
            gap: 'normal',
            parts: ['a', 'b'],
        });
    });

    test('should handle gap specification', async () => {
        const result = await resolveMathGroups('a >>{small} b');
        expect(result).toEqual({
            gap: 'small',
            parts: ['a', 'b'],
        });
    });

    test('should handle custom gap size', async () => {
        const result = await resolveMathGroups('a >>{30px} b');
        expect(result).toEqual({
            gap: '30px',
            parts: ['a', 'b'],
        });
    });

    test('should handle nested groups', async () => {
        const result = await resolveMathGroups('a >> b >>{small} c');
        expect(result).toEqual({
            gap: 'small',
            parts: [
                {
                    gap: 'normal',
                    parts: ['a', 'b'],
                },
                'c',
            ],
        });
    });

    test('should handle complex nested groups', async () => {
        const result = await resolveMathGroups('a >>{big} b >> c >>{small} d');
        expect(result).toEqual({
            gap: 'small',
            parts: [
                {
                    gap: 'normal',
                    parts: [
                        {
                            gap: 'big',
                            parts: ['a', 'b'],
                        },
                        'c',
                    ],
                },
                'd',
            ],
        });
    });
});

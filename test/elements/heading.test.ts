import { BlockErrorNode, ParagraphNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import {
    headingName,
    type HeadingNode,
} from '../../src/elements/heading/shared';
import {
    headingTranspiler,
    defineHeadingTranspiler,
} from '../../src/elements/heading/transpiler';

const bitran = defineBitranTranspiler({
    [headingName]: headingTranspiler,
});

it('Should correctly parse and stringify valid headings', async () => {
    const text = `
# Hello!

## This is me.

### All this is valid, event "with $special$ characters"!
`;

    const parsed = await bitran.parser.parse(text);

    expect(
        parsed.children!.map((node) => (node as HeadingNode).parseData)
    ).toEqual([
        { level: 1, title: 'Hello!' },
        { level: 2, title: 'This is me.' },
        {
            level: 3,
            title: 'All this is valid, event "with $special$ characters"!',
        },
    ]);

    expect(await bitran.stringifier.stringify(parsed)).toEqual(text.trim());
});

it('Should reject headings with invalid levels', async () => {
    const text = `

#### Foobar

    `.trim();

    const headings = (await bitran.parser.parse(text)).children!;

    for (const heading of headings) {
        expect(heading).toBeInstanceOf(BlockErrorNode);
    }
});

it('Should treat text that resembles headings but violates structure as paragraphs', async () => {
    const text = `
#

###

# Some
text

Some
# text
`;

    const paragraphs = (await bitran.parser.parse(text)).children!;

    for (const paragraph of paragraphs) {
        expect(paragraph).toBeInstanceOf(ParagraphNode);
    }
});

it('Should generate slugified IDs for headings with default locale', async () => {
    const text = `
# Some long phrase

# Containing-!#$%*():bad characters

# И немного текста

# Some long phrase
`;

    const headings = (await bitran.parser.parse(text)).children!;

    expect(headings.map((heading) => (heading as HeadingNode).autoId)).toEqual([
        'some-long-phrase',
        'containing-dollarpercentbad-characters',
        'i-nemnogo-teksta',
        'some-long-phrase-',
    ]);
});

it('Should generate locale-specific IDs when locale is provided', async () => {
    const text = `
# Маленький Під'їзд
`;

    const localeBitran = defineBitranTranspiler({
        [headingName]: defineHeadingTranspiler({
            language: 'uk',
        }),
    });

    const headings = (await localeBitran.parser.parse(text)).children!;

    expect(headings.map((heading) => (heading as HeadingNode).autoId)).toEqual([
        'malenkyy-pidyizd',
    ]);
});

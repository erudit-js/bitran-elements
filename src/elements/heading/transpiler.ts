import {
    defineElementTranspiler,
    defineProvideElementTranspiler,
} from '@bitran-js/transpiler';

import { HeadingParser, HeadingStringifier } from './factory';
import { type HeadingSchema, HeadingNode } from './shared';

export const headingTranspiler = defineElementTranspiler<HeadingSchema>({
    Node: HeadingNode,
    Parsers: [HeadingParser],
    Stringifier: HeadingStringifier,
});

export const defineHeadingTranspiler =
    defineProvideElementTranspiler<HeadingSchema>({
        Node: HeadingNode,
        Parsers: [HeadingParser],
        Stringifier: HeadingStringifier,
    });

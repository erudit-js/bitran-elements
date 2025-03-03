import { BlockParseFactory, StringifyFactory } from '@bitran-js/transpiler';
import slugify from 'slugify';

import type { HeadingNode, HeadingParseData, HeadingSchema } from './shared';

export class HeadingParser extends BlockParseFactory<HeadingSchema> {
    regexp = /^(?<level>#+) (?<title>.+)$/;
    level!: number;
    title!: string;

    override canParse(strBlock: string): boolean {
        const [, strLevel, strTitle] = strBlock.match(this.regexp) ?? [];

        if (!strLevel) return false;
        this.level = strLevel.length;

        this.title = (strTitle || '').trim();
        if (!this.title) return false;

        return true;
    }

    override async createParseData(): Promise<HeadingParseData> {
        const validLevels = [1, 2, 3];

        if (!validLevels.includes(this.level))
            throw new Error(
                `Invalid heading level: ${
                    this.level
                }! Available levels: ${validLevels.join(', ')}.`
            );

        if (!this.title) throw new Error('Heading title must not be empty!');

        return {
            level: this.level,
            title: this.title,
        };
    }

    override alterAutoId(autoId: string, node: HeadingNode): string {
        const { provide: { language } = { language: 'en' } } = this.payload();

        // TODO: If Chinese-like locale is set just return auto-id or original title?
        const slug = slugify(node.parseData.title, {
            lower: true,
            strict: true,
            locale: language,
        });

        return slug || autoId;
    }
}

export class HeadingStringifier extends StringifyFactory<HeadingSchema> {
    override async stringifyElement(elementNode: HeadingNode) {
        const parseData = elementNode.parseData;
        return `${'#'.repeat(parseData.level)} ${parseData.title}`;
    }
}

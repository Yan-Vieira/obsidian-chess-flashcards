import { MarkdownPostProcessorContext } from "obsidian"
import { ChessFlashcards } from "./types"

export class ChessCardCodeblockService {

    private CHESSCARD_BLOCK_REGEX = /```chess-card\s*([\s\S]*?)```/g
    private KEYVALUE_REGEX = /^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/

    /**
     * Extract every chess-card codeblocks from the passed `content` string
     * @param content text that possibly contains chess-card codeblocks
     * @returns an array of `ParsedCardBlock` objects
     */
    public extractChessCardBlocks(content: string): ChessFlashcards.ParsedCardBlock[] {

        const blocks:ChessFlashcards.ParsedCardBlock[] = [];
        let match:RegExpExecArray | null;

        while ((match = this.CHESSCARD_BLOCK_REGEX.exec(content)) !== null) {
            
            blocks.push(this.extractChessCardBlock(match))
        }

        return blocks;
    }

    /**
     * Ensures that the desired field is present in the passed chess-card codeblock
     * @param block a `ParsedChessCardBlock` representing the target chess-card codeblock
     * @param key the key of the field
     * @param value the value of the field
     * @returns a string containing the chess-card codeblock with the desired field ensured
     */
    public ensureField(
        block: ChessFlashcards.ParsedCardBlock,
        key: ChessFlashcards.ChessCardKeys,
        value: string
    ):string {

        return this.withField(block, key, value);
    }

    /**
     * Parses the passed `chess-card` code block into a structured `ParsedCardBlock` object
     * @param match The raw string content inside a chess-card block
     * @returns `ParsedCardBlock` object
     */
    public parseChessCard(source:string) {

        const card: ChessFlashcards.ChessCard = {
            name: '',
            fen: '',
            bestLine: []
        }

        const lines = source.split('\n');

        let currentKey: string | null = null;

        for (let line of lines) {

            line = line.trim();

            if (!line) continue;

            const keyValueMatch = line.match(/^(\w+):\s*(.*)$/)

            if (!keyValueMatch) {

                // Remove comentário inline {...} opcional
                const move = line.replace(/\{.*\}/, '').trim()

                if (move) card.bestLine.push(move);

                continue
            }

            const [_, key, value] = keyValueMatch;

            if (key === ChessFlashcards.ChessCardKeys.BEST_LINE) {

                currentKey = ChessFlashcards.ChessCardKeys.BEST_LINE;

                continue

            }

            card[key as keyof ChessFlashcards.ChessCard] = value as string & string[]

            currentKey = null
        }

        return card
    }

    private extractChessCardBlock(match:RegExpExecArray):ChessFlashcards.ParsedCardBlock {

        const body = match[1].trim();
        const start = match.index!;
        const end = start + match[0].length;

        const lines = body.split(/\r?\n/);
        const fields: Record<string, string | string[]> = {};
        const moves: string[] = [];

        let parsingBestLine = false;

        for (const raw of lines) {
                
            const line = raw.trim();

            if (!line) continue;

            const keyValue = line.match(this.KEYVALUE_REGEX);

            if (!keyValue) continue

            const key = keyValue[1];
            const value = keyValue[2];

            if (key === ChessFlashcards.ChessCardKeys.BEST_LINE) {

                parsingBestLine = true;

                fields[ChessFlashcards.ChessCardKeys.BEST_LINE] = []; // placeholder; moves virão nas próximas linhas

                continue;

            }

            parsingBestLine = false;

            fields[key] = value;

            if (parsingBestLine) {

                const move = line.replace(/\{[^}]*\}/g, "").trim();
                    
                if (move) moves.push(move);
            }
        }
        
        return {
            fullMatch: match[0],
            body,
            start,
            end,
            fields,
            moves
        }
    }

    /**
     * Returns a chess-card codeblock containing the passed field
     * @param block a `ParsedChessCardBlock` representing the target chess-card codeblock
     * @param key the key of the field
     * @param value the value of the field
     * @returns a string containing the chess-card codeblock with the desired field
     */
    private withField(
        block: ChessFlashcards.ParsedCardBlock,
        key:string,
        value:string
    ): string {

        // Reescreve (ou insere) uma linha Key: Value no corpo do bloco
        const lines = block.body.split(/\r?\n/);
        const out: string[] = [];
        let found = false;

        for (const raw of lines) {

            const m = raw.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);

            if (m && m[1] === key) {

                out.push(`${key}: ${value}`);
                found = true;

            } else {

                out.push(raw);
            }
        }
        
        if (!found) out.unshift(`${key}: ${value}`); // insere no topo por padrão

        return "```chess-card\n" + out.join("\n") + "\n```";
    }
}

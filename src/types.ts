export namespace ChessFlashcards {

    export interface ChessCard {
        'id'?: string,
        'name': string,
        'fen': string,
        'bestLine': string[],
        'note'?: string,
        'nextReview'?: string,
    }

    export enum ChessCardKeys {
        NAME = 'name',
        ID = 'id',
        FEN = 'fen',
        BEST_LINE = 'bestLine',
        NOTE = 'note',
        NEXT_REVIEW = 'nextReview'
    }

    export interface ParsedCardBlock {
        fullMatch: string;                          // texto completo do bloco (inclui ```chess-card ... ```)
        body: string;                               // conteúdo interno (sem as cercas de código)
        start: number;                              // índice inicial no arquivo
        end: number;                                // índice final no arquivo
        fields: Record<string, string | string[]>;  // campos chaveados
        moves: string[];                            // BestLine (somente lances, sem comentários inline)
    }

    export type Difficulty = "again" | "hard" | "good" | "easy";
}
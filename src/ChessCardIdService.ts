import ChessFlashcardsPlugin from "main";
import { TFile } from "obsidian";
import { ChessCardBlockService } from "./ChessCardCodeblockService";
import { ChessFlashcards } from "./types";

/**
 * Service that handles all IDs in the vault
*/
export default class ChessCardIdService {

    constructor(
        private plugin:ChessFlashcardsPlugin,
        private chessCardBlockService:ChessCardBlockService
    ) { }
    
    /**
     * Runs through all md files and ensures that every flashcard have an unique ID
    */
    public async ensureAllFilesHaveUniqueIds() {

        const mdFiles = this.plugin.app.vault.getMarkdownFiles();

        const used = new Set<number>();

        for (const file of mdFiles) {

            await this.ensureFileIds(file, used);
        }
    }

    /**
     * Ensures that every flashcard within the passed md file have an unique ID
     * @param file the md file to run through
     * @param globalUsed a set containing all the IDs used in vault so far
     */
    private async ensureFileIds(file:TFile, globalUsed:Set<number>) {

        const content = await this.plugin.app.vault.read(file);
        const blocks = this.chessCardBlockService.extractChessCardBlocks(content);

        if (blocks.length === 0) return;

        let changed = false;
        let newContent = content;

        const blocksReversed = [...blocks].reverse();

        for (const block of blocksReversed) {

            let idValue:number = 0

            idValue = await this.ensureId(idValue, globalUsed)

            const updatedBlock = this.chessCardBlockService.ensureField(block, ChessFlashcards.ChessCardKeys.ID, String(idValue));
            
            newContent = newContent.slice(0, block.start) +
            updatedBlock +
            newContent.slice(block.end);

            changed = true;
        }

        if (changed) {

            await this.plugin.app.vault.modify(file, newContent);
        }
    }

    /**
     * Returns the next sequential ID, according to the current sequencial in plugin's "private" settings
     * @returns the next sequential ID, according to the current sequencial in plugin's "private" settings
    */
    private async getNextId(): Promise<number> {

        this.plugin.settings.lastId += 1

        await this.plugin.saveSettings()
  
        return this.plugin.settings.lastId
    }
    
    /**
     * Ensures that the passed ID is not equal to any other ID within the vault
     * @param value the ID to be checked
     * @param globalUsed a set containing all the IDs used in vault so far
     * @returns The ID value after the check. If a duplicate is detected, this value will be the next unused sequential ID.
     */
    private async ensureId(value:number, globalUsed:Set<number>):Promise<number> {

        if(!globalUsed.has(value)) {

            globalUsed.add(value)

            return value
        }

        return await this.ensureId(await this.getNextId(), globalUsed)
    }
}
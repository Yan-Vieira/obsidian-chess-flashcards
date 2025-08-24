import { Notice, Plugin } from 'obsidian'

export default class ChessFlashcardsPlugin extends Plugin {

	async onload() {

		this.addRibbonIcon('crown', 'Chess Flashcards plugin', (evt: MouseEvent) => {

			new Notice('Hello world!');
		})
	}
}
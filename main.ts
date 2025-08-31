import { Plugin } from 'obsidian'
import { ChessCardCodeblockService } from 'src/ChessCardCodeblockService'
import ChessCardIdService from 'src/ChessCardIdService'

export interface ChessFlashcardsSettings {
	lastId: number
}

export const DEFAULT_SETTINGS:ChessFlashcardsSettings = {
	lastId: 0
}

export default class ChessFlashcardsPlugin extends Plugin {

	public settings:ChessFlashcardsSettings

	private CHESS_CARD_CODEBLOCK_NAME = "chess-card"

	private chessCardCodeblockService:ChessCardCodeblockService = new ChessCardCodeblockService()

	private chessCardIdService:ChessCardIdService = new ChessCardIdService(this, this.chessCardCodeblockService)

	public async onload() {

		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())

		await this.chessCardIdService.ensureAllFilesHaveUniqueIds()

		this.registerMarkdownCodeBlockProcessor(
			this.CHESS_CARD_CODEBLOCK_NAME,
			async (source:string, el:HTMLElement) => {
        
				const cardData = this.chessCardCodeblockService.parseChessCard(source)

				const element = el.createDiv()
				element.innerHTML = `
					<p style="border-radius: 5px; border: 1px solid #ccc; padding: 10px;">
						<em>chess flashcard</em>
						<br/>
						<strong>name:</strong> ${cardData.name}
						<br/>
						<strong>position:</strong> ${cardData.fen}
						<br/>
						<strong>next review:</strong> feature under construction
					</p>
				`
			}
		)
	}

	public async onunload() {
		
		this.settings.lastId = 0

		await this.saveSettings()
	}

	public async saveSettings() {

		await this.saveData(this.settings)
	}
}
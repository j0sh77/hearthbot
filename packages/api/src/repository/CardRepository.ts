import { Card } from "../model/Card"
import { Database } from "../db/Database"

export class CardRepository {
  constructor(private db: Database) {}

  public getCards = async (): Promise<Card[]> => {
    const dbResult = await this.db.run<{[key: string]: any}>(`SELECT * FROM card`)

    return dbResult.map(row => {
      const {
        id,
        artist,
        attack,
        collectible,
        cost,
        dbfId,
        flavor,
        health,
        name,
        rarity,
        setId,
        text,
        type,
        tribes,
      } = row

      return new Card({
        id,
        artist,
        attack,
        collectible,
        cost,
        dbfId,
        flavor,
        health,
        name,
        rarity,
        setId,
        text,
        type,
        tribes,
      })
    })
  }

  public createCard = async (card: Card) => {
    card.validate()

    const query = `INSERT INTO card (id, artist, attack, collectible, cost, dbfId, flavor, health, name, rarity, setId, text, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    await this.db.run(query, [
      card.id, card.artist, card.attack, card.collectible, card.cost, card.dbfId, card.flavor, card.health, card.name, card.rarity, card.setId, card.text, card.type
    ])
  }
}
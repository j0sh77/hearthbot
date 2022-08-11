import { Card } from "../model/Card"
import { Database } from "../db/Database"

type CardFilter = {
  limit?: number,
  name?: string,
  locale?: string
  collectible?: boolean
}

const cardFilterDefault: CardFilter = {
  limit: 100,
  locale: `enUS`,
}

export class CardRepository {
  constructor(private db: Database) {}

  public getCards = async (cardFilter?: CardFilter): Promise<Card[]> => {
    const filter: CardFilter = Object.assign({}, cardFilterDefault)
    for (const [key, value] of Object.entries(cardFilter)) {
      if (value !== undefined && value !== null) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        filter[key] = value
      }
    }

    const params: (string | boolean | number)[] = []
    const wheres: string[] = []

    if (filter.name) {
      // Short circuit for name to avoid a join

      // TODO add search field to cardTranslation
      const nameDbResult = await this.db.run<{[key: string]: any}>(
        `SELECT * from cardTranslation WHERE locale = ? AND name = ?`,
        [filter.locale, filter.name]
      )

      if (!nameDbResult.length) {
        return []
      }

      const ids = nameDbResult.map(row => row.cardId)
      wheres.push(`id IN (${ids.map(_ => `?`).join(`, `)})`)
      ids.forEach(id => params.push(id))
    }

    if (filter.collectible === true || filter.collectible === false) {
      wheres.push(`collectible = ?`)
      params.push(filter.collectible)
    }

    const query = `
    SELECT * FROM card 
    ${wheres.length ? ` WHERE ` : ``}${wheres.join(` AND `)} 
    LIMIT ${filter.limit}
    `

    const dbResult = await this.db.run<{[key: string]: any}>(query, params)

    return dbResult.map(row => {
      const {
        id,
        artist,
        attack,
        collectible,
        cost,
        dbfId,
        health,
        rarity,
        setId,
        type,
        tribe,
        durability, 
        mechanics, 
      } = row

      return new Card({
        id,
        artist,
        attack,
        collectible,
        cost,
        dbfId,
        health,
        rarity,
        setId,
        type,
        tribe,
        durability, 
        mechanics,
      })
    })
  }

  public upsertCard = async (card: Card) => {
    const params = [card.artist, card.attack, card.collectible, card.cost, card.dbfId, card.health, card.rarity, card.setId, card.type, card.durability, card.mechanics]
    const query = `
    INSERT INTO card (
      id, 
      artist, 
      attack, 
      collectible, 
      cost, 
      dbfId, 
      health, 
      rarity, 
      setId, 
      type, 
      durability, 
      mechanics
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    artist = ?,
    attack = ?,
    collectible = ?,
    cost = ?,
    dbfId = ?,
    health = ?,
    rarity = ?,
    setId = ?,
    type = ?,
    durability = ?,
    mechanics = ?
    `
    await this.db.run(query, [
      card.id, ...params, ...params
    ])
  }
}
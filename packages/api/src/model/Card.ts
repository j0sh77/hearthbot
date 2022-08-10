type CardConstructor = {
  id: string,
  artist: string,
  attack: number,
  collectible: boolean,
  cost: number,
  dbfId: number,
  durability: number,
  health: number,
  mechanics: string,
  rarity: number,
  setId: string,
  type: number,
  tribe: string,
}

export class Card {
  public id: string
  public artist: string
  public attack: number
  public collectible: boolean
  public cost: number
  public dbfId: number
  public durability: number
  public health: number
  public mechanics: string
  public rarity: number
  public setId: string
  public tribe: string
  public type: number

  constructor(card: CardConstructor) {
    this.id = card.id
    this.artist = card.artist
    this.attack = card.attack
    this.collectible = card.collectible
    this.cost = card.cost
    this.dbfId = card.dbfId
    this.durability = card.durability
    this.health = card.health
    this.mechanics = card.mechanics
    this.rarity = card.rarity
    this.setId = card.setId
    this.type = card.type
    this.tribe = card.tribe
  }
}
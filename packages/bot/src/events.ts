import * as constants from "./constants"
import { Message, ButtonComponent, ButtonStyle } from "discord.js"
import { createCardEmbed, createDeckEmbed } from "./embed"
import { HearthbotClient, objectToGraphqlArgs } from "./api"
import yargs from "yargs"

const getDefaultComponents = () => {
  const components = []

  if (Math.floor(Math.random() * constants.DONATE_CHANCE) === 0) {
    components.push({
      "type": 1,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      components: [
        {
          type: 2,
          style: 5,
          "label": `Buy me a coffee!`,
          "url": constants.DONATE_LINK,
          "emoji": {
            "name": `☕`
          },
        }
      ]
    })
  }
  
  return components
}

const parseQuery = async (card: string) => {
  // remove [[...]]
  const search = card.slice(2, -2).trim()

  const args = await yargs(search)
    .option(`token`, {
      alias: `k`,
      type: `boolean`,
      default: false,
    })
    .option(`locale`, {
      alias: `l`,
      type: `string`,
      default: `enUS`,
    })
    .parse()


  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const name = args[`_`].join(` `)

  const filters = {
    name,
    collectible: !args.token,
  }

  const fields = {
    locale: args.locale,
  }

  return {filters, fields}
}

export const onCards = async (message: Message, cards: string[], hearthbotClient: HearthbotClient) => {
  // TODO make multiple card query endpoint
  const embeds = []

  for (const card of cards) {
    // TODO regex match filter/search params
    const query = await parseQuery(card)
    const response = await hearthbotClient.call(`
      query {
        cards(
          ${objectToGraphqlArgs(query.filters)}
        ) {
          attack,
          classes,
          cost,
          durability,
          image,
          health,
          mechanics,
          rarity,
          setId,
          type,
          tribe, 
          strings {
            ${query.fields.locale} {
              name,
              text,
            }
          }
        }
      }
    `)

    const json = await response.json()
    if (json?.data?.cards?.length) {
      const cardObject = json.data.cards[0]
      const embed = createCardEmbed(cardObject)
      embeds.push(embed)
    }
  }
  
  if (embeds.length) {
    message.reply({
      embeds: embeds, 
      components: getDefaultComponents(),
    })
  }
}

export const onDeck = async (message: Message, deckCode: string, hearthbotClient: HearthbotClient) => {
  const embeds = []

  const response = await hearthbotClient.call(`
    query {
      deck(code:"${deckCode}") {
        cards {
          classes,
          count,
          rarity,
          strings {
            enUS{
              name,
              text,
            }
          }
        }
      }
    }
  `)

  const json = await response.json()
  if (json?.data?.deck?.cards?.length) {
    const cardObjects = json.data.deck?.cards
    const embed = createDeckEmbed(deckCode, cardObjects)
    embeds.push(embed)
  }
  
  if (embeds.length) {
    const deckName = /### ((.*?)+)/.exec(message.content)
    const content = `<@${message.author.id}>'s ${deckName ? `**${deckName[1]}** ` : ``}deck:`
    message.reply({
      content: content,
      embeds: embeds, 
      components: getDefaultComponents(),
    })
  }
}
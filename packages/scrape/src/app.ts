import dotenv from "dotenv"
import * as constants from "./constants"
import { api } from "./util"
import { scrape } from "./scrape"

dotenv.config()

const run = async() => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = await api(`
      query {
        cardSets(hasScrapeUrl: true, released: false) {
          id,
          scrapeUrl,
        }
      }
    `)

    const json = await response.json()
    if (json.data?.cardSets?.length) {
      for (const cardSet of json.data.cardSets) {
        if (!cardSet.id?.startsWith(`PRE-`)) {
          continue
        }
        
        await scrape(cardSet.id, cardSet.scrapeUrl)
        await new Promise(res => setTimeout(res, constants.REQUEST_SLEEP_TIME))
      }
    }

    // sleep until we're ready to try again
    await new Promise(res => setTimeout(res, constants.ITERATION_SLEEP_TIME))
  }
}

run()

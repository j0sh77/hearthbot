import { GraphQLFieldConfig } from "graphql"
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { createCard } from "./createCard"
import { createCards } from "./createCards"
import { createCardTranslation } from "./createCardTranslation"
import { createCardTranslations } from "./createCardTranslations"
import { createSet } from "./createSet"
import { createSets } from "./createSets"

export type GraphqlMutationExport = (objects: GraphqlObjects, dependencies: DependencyTree) => GraphQLFieldConfig<any, any>

export const GraphqlMutations = {
  createCard,
  createCards,
  createCardTranslation,
  createCardTranslations,
  createSet,
  createSets,
}
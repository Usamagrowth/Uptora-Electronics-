import { type SchemaTypeDefinition } from 'sanity'
import { productType } from './productType'
import { categoryType } from './categoryType'
import { orderType } from './orderType'
import { brandType } from './brandTypes'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productType, brandType, orderType, categoryType],
}

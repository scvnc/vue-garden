/**
 * Slice of what is returned from the API
 */
export interface BreachDto {
  Name: string
  BreachedDate: string
}

export const getBreaches = async (): Promise<BreachDto[]> => {
  return []
}

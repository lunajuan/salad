import saladData from "./salad-data";

export type SaladChoice = { category: string; value: string };

export type Salad = {id: string; choices: SaladChoice[]}

export type SaladIngredientsData = typeof saladData

import { Timestamp } from "@angular/fire/firestore"

export interface NutritionReport {
    userUuid: string
    reportDate: Timestamp
    calories: number
    carbohydrates: number
    fats: number
    fiber: number
    protein: number
}

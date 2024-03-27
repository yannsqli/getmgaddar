import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { NutritionReport } from '@interfaces/nutrition_report';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private firestore: Firestore = inject(Firestore);

  getReports(): Observable<NutritionReport[]> {
    return collectionData(collection(this.firestore, 'nutrition_reports')) as Observable<NutritionReport[]>
  }
  addReport(report: NutritionReport) {
    return addDoc(collection(this.firestore, 'nutrition_reports'), report);
  }
}

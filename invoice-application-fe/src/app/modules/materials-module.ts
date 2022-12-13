import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
// import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
// import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
// import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
// import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { FormsModule } from '@angular/forms';
// import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatPaginatorModule} from '@angular/material/paginator';


const modules = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatSidenavModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatRadioModule,
  FormsModule,
  MatPaginatorModule,
  MatSortModule
];

@NgModule({
  imports: modules,
  exports: modules,
  providers: [
    MatNativeDateModule,
    MatDatepickerModule
    ]
})

export class MaterialModule {
}

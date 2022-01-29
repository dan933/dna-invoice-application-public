import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';


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

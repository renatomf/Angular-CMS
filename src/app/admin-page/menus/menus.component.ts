import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MenusService, Menu } from './../../service/menus/menus.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './../shared/confirmation-dialog/confirmation-dialog.component';
import { EditMenuComponent } from './edit-menu/edit-menu.component';


@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  menuDetails: Menu = {
    title: "",
    url: ""
  }

  dataSource = new MatTableDataSource();
  displayedColumns = ["id", "title", "url", "actions"];

  constructor(private menus: MenusService, public dialog: MatDialog) { }

  ngOnInit() {
    this.menus.getMenus().subscribe( (data: any) => {
      this.dataSource.data = data;
    })
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  addMenu() {
    this.menus.addMenu(this.menuDetails);
    this.menuDetails.title = "";
    this.menuDetails.url = "";

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLocaleLowerCase();
    this.dataSource.filter = filterValue;
  }

  editMenu(menuId, menu: Menu) {
    this.menus.updateMenu(menuId, menu);
  }

  deleteMenu(menuId) {
    this.menus.deleteMenu(menuId);
  }

  openDialog(menuId): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log('The dialog was closed'+menuId);
        this.deleteMenu(menuId);
      }
    });
  }

  openEditDialog(menuId: string, title: string, url: string): void {
    const dialogRef = this.dialog.open(EditMenuComponent, {
      width: '250px',
      data: {title, url}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log('The edit dialog was closed');
        this.editMenu(menuId, result);
      }
    });
  }
}

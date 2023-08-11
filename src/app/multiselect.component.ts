import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-multi-select',
  template: `
    <mat-form-field fxFlex appearance="outline" floatLabel="always" style="width:100%">
      <mat-label>{{ label }}</mat-label>
      <mat-select
        [formControl]="control"
        multiple
        [value]="selected"
        (openedChange)="openChange.emit($event)"
        placeholder="{{ selected.length > 0 ? selectedTexts : 'Select' }}"
      >
        <mat-select-trigger>
          {{ selectedTexts }}
        </mat-select-trigger>
        <cdk-virtual-scroll-viewport itemSize="50" [style.height.px]="5 * 48">
          <button (click)="selectAll()">Select All</button>
          <button (click)="clear()">Clear</button>
          <mat-option
            *cdkVirtualFor="let option of options"
            [value]="option"
            (onSelectionChange)="onSelectionChange($event)"
          >
            {{ option.viewValue }}
          </mat-option>
        </cdk-virtual-scroll-viewport>
      </mat-select>
    </mat-form-field>
  `,
})
export class MultiSelectComponent {
  @Input() label: string;
  @Input() control: FormControl;
  @Input() options: any[] = [];
  @Input() selected: any[] = [];
  @Output() openChange = new EventEmitter<boolean>();
  @Output() selectionChange = new EventEmitter<any[]>();

  selectedTexts: string[] = [];

  constructor() {}

  displaySelectedTexts() {
    this.selectedTexts = this.selected.map((x) => x.viewValue);
  }

  selectAll() {
    this.selected = [...this.options];
    this.control.patchValue(this.options);
    this.selectionChange.emit(this.selected);
    this.displaySelectedTexts();
  }

  clear() {
    this.selected = [];
    this.control.patchValue([]);
    this.selectionChange.emit(this.selected);
  }

  onSelectionChange(change): void {
    if (!change.isUserInput) {
      return;
    }
    const value = change.source.value;
    const idx = this.selected.indexOf(change.source.value);

    if (idx > -1) {
      this.selected.splice(idx, 1);
    } else {
      this.selected.push(value);
    }

    this.control.patchValue(this.selected);
    this.selectionChange.emit(this.selected);
    this.displaySelectedTexts();
  }
}

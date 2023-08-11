import {
  Component,
  ViewChild,
  ViewChildren,
  QueryList,
  ChangeDetectorRef
} from "@angular/core";
import { FormControl } from "@angular/forms";
import {
  CdkVirtualScrollViewport,
  ScrollDispatcher
} from "@angular/cdk/scrolling";
import { MatOption } from "@angular/material/core";
import { debounceTime, filter } from "rxjs/operators";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "test-proj";

  toppings = new FormControl();
  toppingList: any[] = [];
  selected: any = [];

  @ViewChild(CdkVirtualScrollViewport, { static: true })
  cdkVirtualScrollViewPort: CdkVirtualScrollViewport;

  multiSelectControl = new FormControl();

  @ViewChildren(MatOption)
  options: QueryList<MatOption>;
  selectedTexts: string[] = [];

  constructor(private cd: ChangeDetectorRef, readonly sd: ScrollDispatcher) {
    for (let i = 0; i < 10000; i++) {
      this.toppingList.push({ id: i, viewValue: "option-" + i });
    }
  }

  ngAfterViewInit(): void {
    this.sd
      .scrolled()
      .pipe(filter(scrollable => this.cdkVirtualScrollViewPort === scrollable))
      .subscribe(() => {
        let needUpdate = false;

        this.options.forEach(option => {
          const selected = this.selected.includes(option.value);

          if (selected && !option.selected) {
            option.select();
            needUpdate = true;
          } else if (!selected && option.selected) {
            option.deselect();
            needUpdate = true;
          }
        });

        if (needUpdate) {
          this.cd.detectChanges();
        }
      });
  }

  displaySelectedTexts() {
    this.selectedTexts = this.selected.map(x => x.viewValue);
  }

  foropen() {
    this.cdkVirtualScrollViewPort.scrollToIndex(5);
  }

  selectAll() {
    this.selected = Array.from(this.toppingList);
    this.multiSelectControl.patchValue(this.toppingList);
    this.displaySelectedTexts();
  }

  clear() {
    this.selected = [];
    this.multiSelectControl.patchValue([]);
  }

  openChange($event: boolean) {
    if ($event) {
      this.foropen();
      this.cdkVirtualScrollViewPort.scrollToIndex(0);
      this.cdkVirtualScrollViewPort.checkViewportSize();
      this.displaySelectedTexts();
    }
  }

  onSelectionChange(change): void {
    if (!change.isUserInput) {
      return;
    }
    console.log(change.source.value);
    const value = change.source.value;
    const idx = this.selected.indexOf(change.source.value);

    if (idx > -1) {
      this.selected.splice(idx, 1);
    } else {
      this.selected.push(value);
    }
    this.displaySelectedTexts();
  }
}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileslistComponent } from './fileslist.component';

describe('FileslistComponent', () => {
  let component: FileslistComponent;
  let fixture: ComponentFixture<FileslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodePopover } from './node-popover';

describe('NodePopover', () => {
  let component: NodePopover;
  let fixture: ComponentFixture<NodePopover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodePopover]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodePopover);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

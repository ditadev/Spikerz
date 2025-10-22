import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrls: ['./card.scss']
})
export class CardComponent {
  @Input() title?: string;
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'lg';
  @Input() shadow: boolean = true;
  @Input() border: boolean = true;
  @Input() headerDivider: boolean = false;
  @Input() clickable: boolean = false;
  @Input() rounded: 'md' | 'lg' | 'xl' | '2xl' = '2xl';
  
  get paddingClass(): string {
    const paddingMap = {
      'none': '',
      'sm': 'p-4',
      'md': 'p-6',
      'lg': 'p-8'
    };
    return paddingMap[this.padding];
  }
  
  get roundedClass(): string {
    const roundedMap = {
      'md': 'rounded-lg',
      'lg': 'rounded-xl',
      'xl': 'rounded-2xl',
      '2xl': 'rounded-2xl'
    };
    return roundedMap[this.rounded];
  }
}
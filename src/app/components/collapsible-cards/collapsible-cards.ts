import { Component, signal } from '@angular/core';

interface CollapsibleCard {
  id: string;
  title: string;
  items: CardItem[];
  description: string;
  expanded: boolean;
}

interface CardItem {
  label: string;
  sublabel: string;
  info: string;
}

@Component({
  selector: 'app-collapsible-cards',
  standalone: true,
  templateUrl: './collapsible-cards.html',
  styleUrls: ['./collapsible-cards.scss']
})
export class CollapsibleCardsComponent {
  cards = signal<CollapsibleCard[]>([
    {
      id: 'card-1',
      title: 'Lorem P',
      items: [
        {
          label: 'Server',
          sublabel: 'Server',
          info: 'Lorem Ipsum Dolor Sit Amet Consectetur.'
        }
      ],
      description: 'Lorem Ipsum Dolor Sit Amet Consectetur. Nunc Vitae Tortor Convallis Vitae Arcu. Magna.',
      expanded: true
    },
    {
      id: 'card-2',
      title: 'Lorem S',
      items: [
        {
          label: 'Server',
          sublabel: 'Server',
          info: 'Lorem Ipsum Dolor Sit Amet Consectetur.'
        }
      ],
      description: 'Lorem Ipsum Dolor Sit Amet Consectetur. Quis Viverra Etiam Pellentesque Lectus Semper In Massa Purus. Auctor Aenean Aenean Senectus Massa Dignissim Vehicula Mi Erat Purus. Praesent Scelerisque Aliquet Metus Sagittis Dictum Sed Sed. Sed Venenatis Sed Urna Quam.',
      expanded: false
    },
    {
      id: 'card-3',
      title: 'Lorem T',
      items: [
        {
          label: 'Server',
          sublabel: 'Server',
          info: 'Lorem Ipsum Dolor Sit Amet Consectetur.'
        }
      ],
      description: 'Lorem Ipsum Dolor Sit Amet Consectetur. In Laoreet Elementum Luctus Odio. Id Enim Urna.',
      expanded: false
    }
  ]);

  toggleCard(cardId: string): void {
    this.cards.update(currentCards => 
      currentCards.map(card => 
        card.id === cardId 
          ? { ...card, expanded: !card.expanded }
          : card
      )
    );
  }
}
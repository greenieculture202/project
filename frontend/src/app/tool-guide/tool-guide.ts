import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-tool-guide',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './tool-guide.html',
    styleUrls: ['./tool-guide.css']
})
export class ToolGuideComponent {
    guides = [
        {
            title: 'The Trowel (Khurpa)',
            icon: 'fas fa-hand-holding-seedling',
            steps: [
                'Use it for digging small holes for planting seeds or seedlings.',
                'Keep the blade at a 45-degree angle for easy soil penetration.',
                'Clean the blade after every use to prevent rust.'
            ]
        },
        {
            title: 'Pruning Shears',
            icon: 'fas fa-cut',
            steps: [
                'Use these to trim dead branches or shape your plants.',
                'Always cut at a slight angle above a leaf node.',
                'Wipe with alcohol after cutting diseased branches to prevent spread.'
            ]
        },
        {
            title: 'Watering Can/Spray',
            icon: 'fas fa-tint',
            steps: [
                'Water the base of the plant, not the leaves, to avoid fungal issues.',
                'Early morning is the best time to water your garden.',
                'Adjust the spray nozzle for delicate indoor plants.'
            ]
        },
        {
            title: 'Hand Rake',
            icon: 'fas fa-stream',
            steps: [
                'Use it to loosen the top layer of soil (aeration).',
                'Helps in removing weeds and debris from the pot.',
                'Ensure you don’t dig too deep to avoid damaging roots.'
            ]
        }
    ];
}

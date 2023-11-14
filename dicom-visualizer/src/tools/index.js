import {Contraste} from './windowLevel';
import {Desplazar} from './scroll';
import {Mover} from './zoomPan';
import {Opacidad} from './opacity';
import {Draw} from './draw';
import {Floodfill} from './floodfill';
import {Livewire} from './livewire';

import {ArrowFactory} from './arrow';
import {CircleFactory} from './circle';
import {EllipseFactory} from './ellipse';
import {FreeHandFactory} from './freeHand';
import {ProtractorFactory} from './protractor';
import {RectangleFactory} from './rectangle';
import {RoiFactory} from './roi';
import {RulerFactory} from './ruler';

import {Filter, Threshold, Sobel, Sharpen} from './filter';

export const toolList = {
  Contraste,
  Desplazar,
  Mover,
  Opacidad,
  Draw,
  Filter,
  Floodfill,
  Livewire
};

export const toolOptions = {
  draw: {
    ArrowFactory,
    CircleFactory,
    EllipseFactory,
    FreeHandFactory,
    ProtractorFactory,
    RectangleFactory,
    RoiFactory,
    RulerFactory
  },
  filter: {
    Threshold,
    Sobel,
    Sharpen
  }
};
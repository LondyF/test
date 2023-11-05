import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Pharmacy } from '../Pharmacy/types/pharmacy';

export interface NavItem {
  title: string;
  action: () => void;
  icon: IconDefinition;
  requireValidation: boolean | (() => boolean);
}

export interface BotikaNaWarda {
  data: PharmaciesNaWarda;
  status: Status;
}

export interface PharmaciesNaWarda {
  datum: Date;
  otrobanda: Pharmacy;
  punda: Pharmacy;
}

export interface BotikaNaWardaResponse {
  naWarda: BotikaNaWarda;
}

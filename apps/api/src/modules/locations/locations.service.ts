import { Injectable } from '@nestjs/common';
import { Country, State, City } from 'country-state-city';
import * as naijaRaw from 'nigerian-states-and-lgas';
import { CountryConfig } from './locations.types';

const naija: any = (naijaRaw as any).default || naijaRaw;

@Injectable()
export class LocationsService {
  getCountries(): CountryConfig[] {
    const all = Country.getAllCountries();
    return all.map((c) => {
      const isNigeria = c.isoCode.toUpperCase() === 'NG';
      const isUS = c.isoCode.toUpperCase() === 'US';
      const isUK = c.isoCode.toUpperCase() === 'GB';
      const isCanada = c.isoCode.toUpperCase() === 'CA';
      const isKenya = c.isoCode.toUpperCase() === 'KE';
      const isGhana = c.isoCode.toUpperCase() === 'GH';
      const isSouthAfrica = c.isoCode.toUpperCase() === 'ZA';
      const isUAE = c.isoCode.toUpperCase() === 'AE';

      return {
        code: c.isoCode,
        name: c.name,
        currency: c.currency || 'USD',
        registrationLabel: isNigeria
          ? 'CAC / RC Registration Number'
          : isUS
          ? 'State Entity / Filing Number (or LLC/Inc ID)'
          : isUK
          ? 'Companies House CRN'
          : isCanada
          ? 'Corporation / Business Number'
          : isKenya
          ? 'BRS Registration Number'
          : isGhana
          ? 'Registrar General (RGD) Number'
          : isSouthAfrica
          ? 'CIPC Registration Number'
          : isUAE
          ? 'Trade License Number'
          : 'Company Registration / Business ID',
        registrationPlaceholder: isNigeria
          ? 'RC-1948291 or BN-...'
          : isUS
          ? 'e.g. DE-7291048'
          : isUK
          ? 'e.g. 12345678'
          : 'Corporate Registration Number',
        taxIdLabel: isNigeria
          ? 'Corporate Tax ID (TIN / FIRS)'
          : isUS
          ? 'Federal Employer ID Number (EIN)'
          : isUK
          ? 'Unique Taxpayer Reference (UTR) / VAT'
          : isCanada
          ? 'CRA Tax Number / BN'
          : isKenya
          ? 'KRA PIN Number'
          : isGhana
          ? 'GRA Taxpayer Identification (TIN)'
          : isSouthAfrica
          ? 'SARS Income Tax Reference Number'
          : isUAE
          ? 'Federal Tax Authority (FTA) TRN'
          : 'Corporate Tax ID / VAT Number',
        taxIdPlaceholder: isNigeria
          ? 'TIN-29481940'
          : isUS
          ? '12-3456789'
          : isUK
          ? '10-digit UTR'
          : 'Tax Identification Number',
        stateLabel: isNigeria ? 'State' : isCanada ? 'Province' : isKenya ? 'County' : 'State / Province',
        lgaLabel: isNigeria ? 'Local Government Area (LGA)' : 'City / Municipality',
        hasLga: isNigeria,
        directorIdLabel: isNigeria
          ? 'Director BVN or NIN (11 digits)'
          : isUS
          ? 'Director SSN (last 4) or Passport Number'
          : 'Director National ID or Passport Number',
        directorIdPlaceholder: isNigeria ? '22345678901' : 'Enter Government ID / Passport Number',
        directorDocTypes: isNigeria
          ? [
              { value: 'BVN', label: 'Bank Verification Number (BVN - 11 digits)' },
              { value: 'NIN', label: 'National Identification Number (NIN - 11 digits)' },
            ]
          : [
              { value: 'PASSPORT', label: 'Passport' },
              { value: 'NATIONAL_ID', label: 'National Identity Card' },
            ],
      };
    });
  }

  getCountry(code: string): CountryConfig {
    const all = this.getCountries();
    return all.find((c) => c.code.toUpperCase() === code.toUpperCase()) || all[0];
  }

  getStates(countryCode: string): string[] {
    const code = countryCode.toUpperCase();
    if (code === 'NG') {
      try {
        const states = naija.states();
        if (Array.isArray(states)) return states;
      } catch {
        // Fallback to Country-State-City if library throws
      }
    }
    const states = State.getStatesOfCountry(code);
    return states ? states.map((s) => s.name) : [];
  }

  getCitiesOrLgas(countryCode: string, stateName: string): string[] {
    const code = countryCode.toUpperCase();
    if (code === 'NG' && stateName) {
      try {
        const cleanState = stateName.replace(' State', '').trim();
        const lgas = naija.lgas(cleanState);
        if (Array.isArray(lgas) && lgas.length > 0) return lgas;
      } catch {
        // Continue to state lookup
      }
      try {
        const allStates = naija.all ? naija.all() : [];
        const match = allStates.find((s: any) => s.state?.toLowerCase() === stateName.trim().toLowerCase());
        if (match && Array.isArray(match.lgas)) return match.lgas;
      } catch {
        // Continue to city lookup
      }
    }

    const states = State.getStatesOfCountry(code);
    const matchedState = states.find(
      (s) =>
        s.name.toLowerCase() === stateName.trim().toLowerCase() ||
        s.isoCode.toLowerCase() === stateName.trim().toLowerCase(),
    );
    const stateIso = matchedState ? matchedState.isoCode : stateName;

    const cities = City.getCitiesOfState(code, stateIso);
    return cities && cities.length > 0 ? cities.map((c) => c.name) : [];
  }
}

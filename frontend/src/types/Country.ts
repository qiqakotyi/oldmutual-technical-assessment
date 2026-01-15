export interface Country {
  name: string;
  flag: string;
  population: number;
  capital: string;
}

export interface CountryDetail extends Country {
  region?: string;
  subregion?: string;
  area?: number;
}

import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';
import { useMemo } from 'react';
import { List, type RowComponentProps } from 'react-window';

import styles from './country-list.module.css';

const ROW_HEIGHT = 400;

type RowProps = {
  countries: Country[];
  selectedYear: number;
  selectedColumns: string[];
};

const CountryRow = ({
  index,
  style,
  countries,
  selectedYear,
  selectedColumns,
}: RowComponentProps<RowProps>) => {
  const country = countries[index];

  return (
    <div style={style}>
      <CountryCard
        country={country}
        selectedYear={selectedYear}
        selectedColumns={selectedColumns}
      />
    </div>
  );
};

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

export const CountryList = ({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
  const filteredCountries = useMemo(() => {
    const filtered = countries.filter((c) => {
      const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
      return matchesSearch && matchesRegion;
    });

    const populationByCountryId = new Map(
      countries.map((country) => [
        country.id,
        getPopulationForYear(createYearDataMap(country.data), selectedYear) || 0,
      ])
    );

    return [...filtered].sort((a, b) => {
      if (sortField === 'name') {
        return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      }

      const popA = populationByCountryId.get(a.id) ?? 0;
      const popB = populationByCountryId.get(b.id) ?? 0;
      return sortOrder === 'asc' ? popA - popB : popB - popA;
    });
  }, [countries, searchQuery, selectedRegion, sortField, sortOrder, selectedYear]);

  const rowProps = useMemo(
    () => ({
      countries: filteredCountries,
      selectedYear,
      selectedColumns,
    }),
    [filteredCountries, selectedYear, selectedColumns]
  );

  return (
    <div className={styles.countryList}>
      <List
        rowCount={filteredCountries.length}
        rowHeight={ROW_HEIGHT}
        rowComponent={CountryRow}
        rowProps={rowProps}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
};

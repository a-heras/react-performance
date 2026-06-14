# Performance Report

## Phase 1: Baseline Profiling (Before Optimization)

### 1. Search countries

**Interaction:** Typed in the search input to filter countries.

| Metric | Value |
|--------|-------|
| Render duration | 150.2 ms |
| Commit duration | ~150 ms |
| Caused by | App |

**Flame chart analysis:**
- `App` — 4.1 ms self, 150.2 ms total
- `CountryList` — 5.1 ms self, 134.4 ms total (~89% of render time)
- All country row components re-render on every keystroke

**Screenshot:**

![Search baseline](./screenshots/searching-country.jpg)

**Bottleneck:** Full `CountryList` re-render on search; no memoization or virtualization.

---

### 2. Sorting countries

**Interaction:** Changed sort field from Population to Name.

| Metric | Value |
|--------|-------|
| Render duration | 273.6 ms |
| Commit duration | ~274 ms |
| Caused by | App |

**Flame chart analysis:**
- `App` — 4.6 ms self, 273.6 ms total
- `CountryList` — 18.8 ms self, 254.9 ms total (~93% of render time)
- Entire country list re-renders after sort change

**Screenshot:**

![Sort baseline](./screenshots/sorting-countries.jpg)

**Bottleneck:** Sorting triggers full list re-render; filter/sort not memoized.

---

### 3. Selecting a different year

**Interaction:** Selected a different year in the year selector.

| Metric | Value |
|--------|-------|
| Render duration | 147.5 ms |
| Commit duration | ~148 ms |
| Caused by | App |

**Flame chart analysis:**
- `App` — 3.2 ms self, 147.5 ms total
- `CountryList` — 5.5 ms self, 131.6 ms total (~89% of render time)
- `YearSelector` also re-rendered

**Screenshot:**

![Year baseline](./screenshots/selecting-year.jpg)

**Bottleneck:** Year change in App causes full CountryList re-render.

---

### 4. Toggling columns

**Interaction:** Opened column modal and toggled a column.

| Metric | Value |
|--------|-------|
| Render duration | 142.3 ms |
| Commit duration | ~142 ms |
| Caused by | App |

**Flame chart analysis:**
- `App` — 4.0 ms self, 142.3 ms total
- `CountryList` — 4.7 ms self, 125.1 ms total (~88% of render time)
- Column toggle re-renders all country cards and tables

**Screenshot:**

![Columns baseline](./screenshots/toggling-columns.jpg)

**Bottleneck:** Column state change re-renders entire list instead of affected rows only.
import styles from './searchInput.module.css';

interface Props{
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  valueSearch:string;
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5.5" cy="5.5" r="4" stroke="#9ca3af" strokeWidth="1.5" />
      <path d="M9 9L12.5 12.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export const SearchInput = ({onChange,valueSearch}:Props) => {

  return (
    <div className={styles["search-input"]}>
      <span className={styles["search-input__icon"]}>
        <SearchIcon />
      </span>
      <input
        value={valueSearch}
        onChange={onChange}
        placeholder="Buscar..."
        className={styles["search-input__field"]}
      />
    </div>
  );
};

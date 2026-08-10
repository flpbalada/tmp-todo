export interface TodoToolbarProps {
	searchQuery: string;
	activeFiltersCount: number;
	showFilters: boolean;
	showForm: boolean;
	onSearchChange: (query: string) => void;
	onToggleFilters: () => void;
	onToggleForm: () => void;
}

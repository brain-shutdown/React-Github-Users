import { useState, useEffect } from 'react';

export default function useDebounce(value, wait) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const id = setTimeout(() => setDebouncedValue(value), wait);
		return () => clearTimeout(id);
	}, [value, wait]);

	return debouncedValue;
}

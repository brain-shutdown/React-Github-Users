import { useCallback, useState } from 'react';
import axios from 'axios';

const useFetch = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [data, setData] = useState(null);

	function errorHandling(error) {
		switch (error.response.status) {
			case 403:
				setError("API Requests' limit exceeded");
				break;
			case 404:
				setError('User Not Found');
				break;
			default:
				setError('An Error Occurred. Try again later.');
				break;
		}
	}

	const fetchData = useCallback(async (url) => {
		setError(false);
		setLoading('Loading...');
		try {
			// If multiple HTTP requests, process them all
			if (Array.isArray(url)) {
				Promise.all(url.map(async (endpoint) => await axios.get(endpoint)))
					.then(
						axios.spread(({ data: user }, { data: repos }, { data: followers }) => {
							setData({ user, repos, followers });
							setLoading(false);
						})
					)
					.catch((error) => {
						errorHandling(error);
					});
			} else {
				const response = await axios.get(url);
				response.data && setData(response.data);
				response.data.items && setData(response.data.items);
				setLoading(false);
			}
		} catch (error) {
			errorHandling(error);
			setLoading(false);
		}
	}, []);
	return { loading, error, data, fetchData };
};

export default useFetch;

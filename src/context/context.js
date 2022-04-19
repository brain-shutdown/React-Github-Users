import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import useFetch from '../useFetch';

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
	const [user, setUser] = useState('brain-shutdown');
	const [githubUser, setGithubUser] = useState(mockUser);
	const [followers, setFollowers] = useState(mockFollowers);
	const [repos, setRepos] = useState(mockRepos);
	const { fetchData, data, loading, error: userError } = useFetch();

	useEffect(() => {
		let endpoints = [`https://api.github.com/users/${user}`, `https://api.github.com/users/${user}/repos?per_page=100`, `https://api.github.com/users/${user}/followers`];
		fetchData(endpoints);
	}, [user, fetchData]);

	useEffect(() => {
		if (!loading && !userError && data) {
			const { user, followers, repos } = data;
			setGithubUser(user);
			setFollowers(followers);
			setRepos(repos);
		}
	}, [data, loading, userError]);

	return (
		<GithubContext.Provider
			value={{
				githubUser,
				followers,
				repos,
				setUser,
				userError,
				loading,
			}}>
			{children}
		</GithubContext.Provider>
	);
};

export { GithubContext, GithubProvider };

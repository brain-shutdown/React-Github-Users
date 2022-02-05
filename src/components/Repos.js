import React, { useContext } from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { Pie2D, Column2D, Bar2D, Doughnut2D } from './Charts';

const Repos = () => {
	const { repos } = useContext(GithubContext);

	const languages = reduceRepoData(repos, 'language');
	const totalStars = filterRepoData(repos, 'name', 'stargazers_count');
	const starsPerLanguage = reduceRepoData(repos, 'language', 'stargazers_count');
	const mostForkedRepo = filterRepoData(repos, 'name', 'forks');

	return (
		<section className='section section-center'>
			<Wrapper>
				<Pie2D data={languages} />
				<Column2D data={totalStars} />
				<Doughnut2D data={starsPerLanguage} />
				<Bar2D data={mostForkedRepo} />
			</Wrapper>
		</section>
	);
};

function reduceRepoData(repos, searchProperty, searchValue = undefined) {
	let data = repos.reduce((prevVal, curVal) => {
		let { [searchProperty]: label, [searchValue]: value } = curVal;

		// Check if label and value exist in Repos
		if (!label) return prevVal;
		if (!value) value = 1;

		// If already available, add to it, otherwise create new object
		if (prevVal[label]) {
			prevVal[label] = { ...prevVal[label], value: prevVal[label].value + value };
		} else {
			prevVal[label] = { label, value };
		}

		return prevVal;
	}, {});

	data = Object.values(data)
		.sort((a, b) => b.value - a.value)
		.slice(0, 5);

	return data;
}

function filterRepoData(repos, searchProperty, searchValue) {
	const data = repos
		.map((repo) => {
			const { [searchProperty]: label, [searchValue]: value } = repo;
			return { label, value };
		})
		.sort((a, b) => b.value - a.value)
		.slice(0, 5);

	return data;
}

const Wrapper = styled.div`
	display: grid;
	justify-items: center;
	gap: 2rem;
	@media (min-width: 980px) {
		grid-template-columns: 1fr 1fr;
	}

	@media (min-width: 1200px) {
		grid-template-columns: 2fr 3fr;
	}

	div {
		width: 100%;
	}
	.fusioncharts-container {
		width: 100%;
	}
	svg {
		width: 100%;
		border-radius: var(--radius) !important;
	}
`;

export default Repos;

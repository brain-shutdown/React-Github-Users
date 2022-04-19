import React, { useContext, useEffect, useState } from 'react';
import { GithubContext } from '../context/context';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { useAutocomplete } from '@mui/base/AutocompleteUnstyled';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

import useFetch from '../useFetch';
import useDebounce from '../useDebounce';

const Search = () => {
	const { setUser, userError } = useContext(GithubContext);
	const [options, setOptions] = useState([]);
	const { fetchData, data, loading, error } = useFetch();
	const { getRootProps, getInputProps, getListboxProps, getClearProps, getOptionProps, groupedOptions, focused, setAnchorEl, popupOpen, inputValue } = useAutocomplete({
		id: 'customized-hook-demo',
		options: options,
		getOptionLabel: (option) => (option.login === undefined ? option : option.login),
		isOptionEqualToValue: (option, value) => option.login === value.login,
		filterOptions: (x) => x,
		freeSolo: true,
	});
	const debouncedValue = useDebounce(inputValue, 500);

	function handleSubmit(event) {
		event.preventDefault();
		setUser(inputValue);
	}

	useEffect(() => {
		if (popupOpen) {
			if (!debouncedValue) {
				fetchData('https://api.github.com/users?per_page=5');
			} else {
				fetchData(`https://api.github.com/search/users?q=${debouncedValue}&per_page=5`);
			}
		}
	}, [popupOpen, fetchData, debouncedValue]);

	useEffect(() => {
		if (!loading && popupOpen && data) {
			setOptions([...data]);
		}
	}, [loading, data, popupOpen]);

	return (
		<section className='section section-center'>
			{userError && (
				<div>
					<p className='error'>{userError}</p>
				</div>
			)}
			<Wrapper>
				<Root>
					<div {...getRootProps()}>
						<InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
							<input {...getInputProps()} />
							{inputValue.length > 0 ? <FontAwesomeIcon icon={faXmark} size='lg' {...getClearProps()} className='clearSearch' /> : null}
						</InputWrapper>
					</div>
					{popupOpen ? (
						<Listbox {...getListboxProps()}>
							{loading && !error && (
								<div className='loading'>
									<CircularProgress color='inherit' size={30} />
								</div>
							)}
							{!loading && error && (
								<div className='loading'>
									<h3>{error}</h3>
								</div>
							)}
							{!loading && groupedOptions.length === 0 && (
								<div className='loading'>
									<h3>No Results</h3>
								</div>
							)}
							{!loading &&
								!error &&
								groupedOptions.length > 0 &&
								groupedOptions.map((option, index) => (
									<li {...getOptionProps({ option, index })}>
										<div onClick={() => setUser(option.login)}>
											<img src={option.avatar_url} alt='' />
											<span>{option.login}</span>
										</div>
									</li>
								))}
						</Listbox>
					) : null}
				</Root>
				<button className='btn' onClick={(e) => handleSubmit(e)}>
					<FontAwesomeIcon icon={faMagnifyingGlass} className='searchIcon' />
					Submit
				</button>
			</Wrapper>
		</section>
	);
};

const Wrapper = styled('form')`
	position: relative;
	display: grid;
	gap: 1rem 1.75rem;

	h3 {
		margin-bottom: 0;
		color: var(--clr-grey-5);
		font-weight: 400;
	}
	.searchIcon {
		padding-right: 1rem;
	}
	@media (min-width: 768px) {
		grid-template-columns: 1fr max-content;
		align-items: center;
		h3 {
			padding: 0 0.5rem;
			font-size: 1.3rem;
		}
	}
`;

const Root = styled('div')`
	color: rgba(0, 0, 0, 0.85);
	font-size: 14px;
	position: relative;
`;

const InputWrapper = styled('div')`
	width: 100%;
	border: 1px solid #d9d9d9;
	background-color: #fff;
	border-radius: 4px;
	padding: 1px;
	display: flex;
	flex-wrap: wrap;
	align-items: center;

	&:hover {
		border-color: #40a9ff;
	}

	&.focused {
		border-color: #40a9ff;
		box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
	}

	& input {
		background-color: #fff;
		color: rgba(0, 0, 0, 0.85);
		height: 30px;
		box-sizing: border-box;
		padding: 4px 6px;
		width: 0;
		min-width: 30px;
		flex-grow: 1;
		border: 0;
		margin: 0;
		outline: 0;
	}

	& svg {
		color: var(--clr-grey-5);
		padding: 0 0.5rem;
		&.clearSearch:hover {
			color: var(--clr-grey-7);
			cursor: pointer;
		}
	}
`;

const Listbox = styled('ul')`
	width: 100%;
	margin: 2px 0 0;
	padding: 0;
	position: absolute;
	list-style: none;
	background-color: #fff;
	overflow: auto;
	max-height: 200px;
	border-radius: 4px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	z-index: 1;

	& div {
		padding: 5px 12px;
		display: flex;
		align-items: center;

		& span {
			flex-grow: 1;
		}

		& svg {
			color: transparent;
		}

		& img {
			width: 30px;
			height: 30px;
			border-radius: 50%;
			margin-right: 0.5rem;
		}
	}

	& li:hover {
		background: rgba(0, 0, 0, 0.04);
		cursor: pointer;
	}

	& li[aria-selected='true'] {
		background-color: #fafafa;
		font-weight: 600;

		& svg {
			color: #1890ff;
		}
	}

	& li[data-focus='true'] {
		background-color: #e6f7ff;
		cursor: pointer;

		& svg {
			color: currentColor;
		}
	}
`;

export default Search;

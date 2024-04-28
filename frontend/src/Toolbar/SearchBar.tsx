import {Search} from "@mui/icons-material";
import {Autocomplete, CircularProgress, styled, TextField} from "@mui/material";
import React, {Dispatch, useState} from "react";
import { api } from "../api";
import {Song} from "../types";

const SearchField = styled(TextField)(({theme}) => `
  min-width: 30em;
    
  && {
    .MuiInputBase-root {
      border-radius: 10em;
      background: ${theme.palette.background.paper};
      padding: 0.5em 1em;
      gap: 0.5em;
    }
  }
`);

export type SearchBarProps = {
    onSearch: Dispatch<Song>
};

function SearchBar({onSearch}: SearchBarProps) {
    const [inputValue, setInputValue] = useState<string>('');
    const {data, isFetching} = api.useSearchQuery({free_text: inputValue}, {skip: inputValue.length < 3});

    return <Autocomplete<Song>
        options={data ?? []}
        getOptionLabel={([,{title, artist}]) => `${title} - ${artist}`}
        renderInput={params => <SearchField
            {...params}
            size="small"
            InputProps={{
                ...params.InputProps,
                startAdornment: <Search/>,
                endAdornment: isFetching
                    ? <CircularProgress color="inherit" size={20}/>
                    : params.InputProps.endAdornment
            }}
            placeholder="Search songs"
        />}
        onChange={(event, value) => value ? onSearch(value) : undefined}
        inputValue={inputValue}
        onInputChange={(event, value) => setInputValue(value)}
        filterOptions={options => options}
        loading={isFetching}
    />
}

export default SearchBar;

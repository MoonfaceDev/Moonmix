import logo from "../Assets/logo.png";
import {styled, Toolbar as MuiToolbar} from "@mui/material";
import ThemeSwitch from "./ThemeSwitch";
import React, {useContext} from "react";
import {ColorModeContext} from "../ColorModeContext";
import SearchBar, {SearchBarProps} from "./SearchBar";
import AddSongButton from "./AddSongButton";

const LogoImage = styled('img')`
  width: 2em;
  height: 2em;
`;

const ToolbarLayout = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

const ToolbarSection = styled('div')`
  display: flex;
  align-items: center;
  gap: 1em;
`;

export type ToolbarProps = {
    searchBarProps: SearchBarProps
}

function Toolbar({searchBarProps}: ToolbarProps) {
    const {toggleColorMode} = useContext(ColorModeContext);

    return <MuiToolbar>
        <ToolbarLayout>
            <ToolbarSection>
                <LogoImage src={logo} alt="logo"/>
                <SearchBar {...searchBarProps} />
                <AddSongButton/>
            </ToolbarSection>
            <ToolbarSection>
                <ThemeSwitch onChange={toggleColorMode}/>
            </ToolbarSection>
        </ToolbarLayout>
    </MuiToolbar>
}

export default Toolbar;

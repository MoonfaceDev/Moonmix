import React, {useMemo, useState} from 'react';
import {Box, createTheme, CssBaseline, Divider, PaletteMode, Theme, ThemeProvider} from "@mui/material";
import Toolbar from "./Toolbar/Toolbar";
import {ColorModeContext} from "./ColorModeContext";
import {Provider} from "react-redux";
import {store} from "./store";
import {Song} from "./types";
import MainContent from "./MainContent/MainContent";
import {SnackbarProvider} from "notistack";

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            paper: '#e5e5e5'
        }
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            paper: '#2a2a2a'
        }
    },
});

const THEMES: Record<PaletteMode, Theme> = {
    light: lightTheme,
    dark: darkTheme,
}

function App() {
    const [colorMode, setColorMode] = useState<PaletteMode>('light');
    const colorModeContext = useMemo(
        () => ({
            toggleColorMode: () => {
                setColorMode(prev => prev === 'light' ? 'dark' : 'light');
            },
        }),
        [],
    );
    const [songHistory, setSongHistory] = useState<Song[]>([]);

    return <Provider store={store}>
        <ColorModeContext.Provider value={colorModeContext}>
            <ThemeProvider theme={THEMES[colorMode]}>
                <CssBaseline/>
                <SnackbarProvider>
                    <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
                        <Toolbar searchBarProps={{onSearch: value => setSongHistory(prev => [...prev, value])}}/>
                        <Divider/>
                        <MainContent songHistory={songHistory} setSongHistory={setSongHistory}/>
                    </Box>
                </SnackbarProvider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    </Provider>;
}

export default App;

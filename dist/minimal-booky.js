// ==UserScript==
// @name         Minimal Booky
// @namespace    http://booky.io/
// @version      2.1
// @updateURL    https://www.lbfalvy.com/minimal-booky/dist/minimal-booky.js
// @downloadURL  https://www.lbfalvy.com/minimal-booky/dist/minimal-booky.js
// @description  Hide the header and footer on Booky.io by default, enable toggling it by clicking on the header and extend search functionality
// @author       Lawrence Bethlenfalvy <lbfalvy@protonmail.com>
// @match        https://booky.io/
// @match        https://booky.io/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=booky.io
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';
    console.log('Compact script loaded');

    // ================================
    // Globals
    // ================================

    // === Element selectors ===
    // DO NOT STORE RESULT
    const header = () => document.querySelector('header.header');
    const footer = () => document.querySelector('footer.footer');
    const headline = () => document.querySelector('h1.headline');
    const search = () => document.getElementById('search-desktop');

    // === Hooks ===
    const setupStyles = sheet => { // Stylesheet initialization
        // General styles
        sheet.insertRule(`header.header.closed, footer.footer.closed { display: none; }`); // Rather self-explanatory
        sheet.insertRule(`main.page { padding-bottom: 0rem; }`); // No idea why this was here to begin with
        // Titlebar styles
        sheet.insertRule(`
            h1.headline {
                width: 264px !important;
                flex-grow: 0;
            }
        `); // The sidebar is 300px and the toolbar's left padding is 36px
        sheet.insertRule(`
            h1.headline:hover {
                cursor: pointer;
                color: white;
            }
        `);
        sheet.insertRule(`.search-field { flex-grow: 1; }`); // Search form
        sheet.insertRule(`.search-field__input { width: 100% !important; }`); // Search input
    }
    const setupEvents = () => { // Event listeners must not depend on the persistence of selector results
        document.body.addEventListener('click', e => {
            if (e.target !== headline()) return;
            console.log('Toggling compact mode');
            if (header().classList.contains('closed')) {
                header().classList.remove('closed');
                footer().classList.remove('closed');
            } else {
                header().classList.add('closed');
                footer().classList.add('closed');
            }
        });
        document.body.addEventListener('keydown', e => {
            if (e.target !== search()) return;
            console.log('Search input');
            if (e.key !== 'Enter') return;
            console.log('Accepted command');
            execCommand(search().value);
        });
    }
    const setupRepeat = async () => { // Setup ops that may be repeated to ensure that they're applied early but also override React.
        header()?.classList.add('closed');
        footer()?.classList.add('closed');
        await new Promise(r => setTimeout(r, 100));
        if (search()) search().placeholder = 'Search bookmarks, or press Enter to navigate or search the web with a / prefix'
    }
    const setupNorepeat = async () => { // Setup ops that should not be repeated
        search().focus()
    }
    // === Procedures ===
    const execCommand = cmd => { // Interpret string as command
        if (cmd[0] == '/') webSearch(cmd.slice(1));
        else window.location.href = `https://${cmd}`;
    }
    const webSearch = q => { // Search for string with DDG
        let sp = new URLSearchParams({ q });
        window.location.href = `https://duckduckgo.com/?${sp}`
    }

    // ================================
    // Initialization logic
    // ================================
    await Promise.resolve(); // Defer
    // Add styles to header
    const style = document.createElement('style');
    document.head.appendChild(style);
    const sheet = style.sheet;
    setupStyles(sheet);
    // Call various setup functions from payload
    setupEvents();
    if (1 < location.pathname.length) return; // Ensure none of the following is enacted on non-start pages
    setTimeout(setupNorepeat, 500); // If the page can't load in half a second, this part will just fail
    for (let i = 0; i < 10; i++) await setupRepeat(); // This is quite possibly the dirtiest hack I've ever written.
})();

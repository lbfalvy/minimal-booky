// ==UserScript==
// @name         Minimal Booky
// @namespace    http://booky.io/
// @version      1.0
// @updateURL    https://lbfalvy.github.io/minimal-booky/dist/minimal-booky.js
// @downloadURL  https://lbfalvy.github.io/minimal-booky/dist/minimal-booky.js
// @description  Hide the header and footer on Booky.io by default, enable toggling it by clicking on the header
// @author       Lawrence Bethlenfalvy <lbfalvy@protonmail.com>
// @match        https://booky.io/
// @match        https://booky.io/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=booky.io
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';
    console.log('Compact script loaded');

    const header = () => document.querySelector('header.header');
    const footer = () => document.querySelector('footer.footer');
    const headline = () => document.querySelector('h1.headline');

    // Wait for render
    await Promise.resolve();

    // Construct stylesheet
    const style = document.createElement('style');
    document.head.appendChild(style);
    const sheet = style.sheet;
    sheet.insertRule(`
        header.header.closed, footer.footer.closed {
            display: none;
        }
    `);
    sheet.insertRule(`
        main.page {
            padding-bottom: 0rem;
        }
    `);
    sheet.insertRule(`
        h1.headline:hover {
            cursor: pointer;
            color: white;
        }
    `);

    // Add evnt listener and class
    document.body.addEventListener('click', e => {
        if (e.target !== headline()) return;
        console.log('Toggling compact mode');
        header().classList.toggle('closed');
        footer().classList.toggle('closed');
    });
    if (1 < location.pathname.length) return;
    for (let i = 0; i < 10; i++) { // This is quite possibly the dirtiest hack I've ever written.
        header()?.classList.add('closed');
        footer()?.classList.add('closed');
        await new Promise(r => setTimeout(r, 100));
    }
})();

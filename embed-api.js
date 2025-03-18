// SIGMA SERVER-SIDE EMBED API - SECURE QUICKSTART

// 1: Require necessary Node.js modules
const express = require('express');
const crypto = require('crypto');

// 2: Initialize an Express application
const app = express();

// 3: Manually set your configuration variables here (example values shown)
const EMBED_PATH = 'https://app.sigmacomputing.com/embed/1-2wDc2M6GqIrajkSwjkl0az';
const EMBED_SECRET = '509b9d5db4b99779fb6e5601aa9f5ee6eb7dd9bb1fbcdf3ac8e6562ef33215aefd986da30e050bcba808238c596122868fcae5d52ce8a7f5d46ac31dd5ab6708';
const CLIENT_ID = '5ce8a8751bbab522adb392eb3abdabf539ad1b34d4d5abfe1dac8e3dc0a5a79c';
const PORT = 3000; // Feel free to change the port number as needed

// 4: Server Setup
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`); // Serve the main HTML file for the root path
});

// 5: Define a route handler for generating Sigma embed URLs
app.get('/api/generate-embed-url', (req, res) => {
    try {
        // Generate a unique nonce using crypto's UUID
        const nonce = crypto.randomUUID();
        let searchParams = `?:nonce=${nonce}`;

        // 6: Construct required search parameters
        searchParams += `&:client_id=${CLIENT_ID}`;
        searchParams += '&:email=neil.coleman+embed@sigmacomputing.com';
        searchParams += '&:external_user_id=neil.coleman+embed@sigmacomputing.com';
        searchParams += '&:external_user_team=Sales_Managers';
        searchParams += '&:ua_Region=Midwest';
        searchParams += '&:account_type=Creator';
        searchParams += '&:mode=userbacked';
        searchParams += '&:session_length=600';
        searchParams += `&:time=${Math.floor(new Date().getTime() / 1000)}`;

        // 7: Construct the URL with search parameters and generate a signature
        const URL_WITH_SEARCH_PARAMS = EMBED_PATH + searchParams;
        const SIGNATURE = crypto
            .createHmac('sha256', Buffer.from(EMBED_SECRET, 'utf8'))
            .update(Buffer.from(URL_WITH_SEARCH_PARAMS, 'utf8'))
            .digest('hex');
        const URL_TO_SEND = `${URL_WITH_SEARCH_PARAMS}&:signature=${SIGNATURE}`;

        // 8: Send the final URL to the requester
        res.status(200).json({ url: URL_TO_SEND });
    } catch (error) {
        console.error('Error generating embed URL:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// 9: Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});



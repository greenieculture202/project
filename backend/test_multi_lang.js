const http = require('http');

function postRequest(url, data) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const postData = JSON.stringify(data);

        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let resData = '';
            res.on('data', (chunk) => {
                resData += chunk;
            });
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        data: JSON.parse(resData)
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: resData
                    });
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

async function testMultiLang() {
    const baseUrl = 'http://localhost:5000/api/ai-assistant';
    const testCases = [
        {
            lang: 'Hindi',
            message: "Mera money plant fungus jesa lag raha hai, kya karun?"
        },
        {
            lang: 'Gujarati',
            message: "મારા મની પ્લાન્ટમાં ફૂગ લાગી છે, મારે શું કરવું જોઈએ?"
        },
        {
            lang: 'English',
            message: "My snake plant leaves are turning yellow, why?"
        }
    ];

    for (const test of testCases) {
        try {
            console.log(`\nTesting Language: ${test.lang}`);
            console.log(`Message: ${test.message}`);
            
            const response = await postRequest(baseUrl, {
                message: test.message
            });

            console.log('Status:', response.status);
            console.log('AI Response Text:', response.data.text);
            console.log('Recommendations:', response.data.recommendations);
            console.log('Plant Name:', response.data.plantName);
            
            // Basic validation
            if (test.lang === 'Hindi' && !/[\u0900-\u097F]/.test(response.data.text)) {
                console.log('❌ ERROR: Response text does not seem to contain Hindi characters.');
            } else if (test.lang === 'Gujarati' && !/[\u0A80-\u0AFF]/.test(response.data.text)) {
                console.log('❌ ERROR: Response text does not seem to contain Gujarati characters.');
            } else if (test.lang === 'English' && !/[a-zA-Z]/.test(response.data.text)) {
                console.log('❌ ERROR: Response text does not seem to contain English characters.');
            } else {
                console.log('✅ SUCCESS: Language matching looks correct.');
            }

        } catch (error) {
            console.error(`Error testing ${test.lang}:`, error.message);
        }
    }
}

testMultiLang();

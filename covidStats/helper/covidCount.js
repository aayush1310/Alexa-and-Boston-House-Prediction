var axios = require('axios');

getCovidCount = (country) => {
    return new Promise((resolve, reject) => {
        var config = {
            method: 'get',
            url: `https://corona.lmao.ninja/v2/countries/${country}?yesterday=true&strict=true&query =`,
            headers: {}
        };

        axios(config)
            .then(function (response) {
                let data = {
                    total_cases: response.data.cases,
                    active_cases: response.data.active
                }
                resolve(data);
            })
            .catch(function (error) {
                console.log(error);
                reject(error)
            });
    })
}

module.exports = {
    getCovidCount
}
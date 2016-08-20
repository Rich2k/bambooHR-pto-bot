'use strict';

const request = require('request-promise-native')
    // const Botkit = require('botkit')
const parseXml = require('xml2js').parseString
const moment = require('moment')
require('moment-range')

// I am going to loop through the xml data and parse out the names, and dates of the requests. I need to format the requests, add multiple requests from the same person into a single line, and send a string to botkit
// When MVP of this would be just parsing the name and date of a single request

function whosOut() {
    const options = {
        url: 'https://545bd8cff15256e49319d84abed36c6c0c7e44e4:x@api.bamboohr.com/api/gateway.php/indica/v1/time_off/whos_out'
    }
    request(options).then(function(xml) {
        parseXml(xml, function(err, result) {
            // console.log(result)
            const resultArr = [{
                name: 'Steve Church',
                days: ['Monday']
            },{
                name: 'Jon Church',
                days: ['Monday']
            }]
            const weekStart = moment().startOf('isoweek')
            const weekEnd = moment().endOf('isoweek').subtract('2', 'days')
            const weekRange = moment.range(weekStart, weekEnd)
            for (let i = 0; i < result.calendar.item.length; i += 1) {
                const index = result.calendar.item[i]
                const startDate = moment(index.start[0])
                const endDate = moment(index.end[0])
                const requestRange = moment.range(startDate, endDate)
                const resObj = {
                    name: index.employee[0]._,
                    days: []
                }
                if (requestRange.overlaps(weekRange)) {
                    const daysOffArray = weekRange.intersect(requestRange).toArray('days')


                    for (let j = 0; j < daysOffArray.length; j += 1) {
                        resObj.days.push(daysOffArray[j].format('dddd'))

                    }

                    //if user found
                    if (resultArr.some(function(el){
                      console.log(el)
                      return el.name === resObj.name
                    })) {
                      

                    }


                    //If user not found
                    resultArr.push(resObj)
                }
            }
            // console.log('result array', resultArr)


        })
    })
}

whosOut()

function checkAndAdd(name, arr) {
    var id = arr.length + 1;
    var found = arr.some(function(el) {
        return el.username === name;
    });
    if (!found) {
        arr.push();
    }
}

/**
 * This is the entry point to the program
 *
 * @param {array} input Array of student objects
 */
function classifier(input) {

    var workobj;

    //function to calculate age
    function calculateAge(birthday) {

        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs);
        var today = new Date(Date.now());
        var birthDate = new Date(birthday.getTime());

        var ageYear = Math.abs(ageDate.getUTCFullYear() - 1970);
        if (birthDate.getUTCMonth() > today.getUTCMonth()) {
            ageYear = ageYear + 1
        }

        return ageYear;
    }

    //loop through to get the age for each object in array
    for (var i = 0; i < input.length; i++) {
        var birthDate = new Date(input[i].dob);
        input[i].age = calculateAge(birthDate);
    }

    //sort the object array by the age property
    workobj = input.slice().sort(function (a, b) {
        return a.age - b.age
    });

    var result = {};
    var group = {};
    var tempAge = 0;
    var tempAge2 = 0;
    var ageSum = 0;
    var groupCount = 0;
    for (var i = 0; i < workobj.length; i++) {
        var membersArr = [];
        var regNoArr = [];
        var ageArr = [];
        //check difference between i and i-1 AND i and i-2 is less than 5
        //check a key exists and the number of objects in the member group array the key holds is not more than 3
        if ((workobj[i].age - tempAge) <= 5 && (workobj[i].age - tempAge2) <= 5 && group["members" + groupCount] && group["members" + groupCount].length < 3) {
            //add to the current group
            group["members" + groupCount].push({
                "name": workobj[i].name,
                "dob": workobj[i].dob,
                "regNo": workobj[i].regNo,
                "age": workobj[i].age
            });
            group["regNos" + groupCount].push(parseInt(workobj[i].regNo));
        } else {
            //create a new group
            groupCount++;
            membersArr.push({
                "name": workobj[i].name,
                "dob": workobj[i].dob,
                "regNo": workobj[i].regNo,
                "age": workobj[i].age
            });
            group["members" + groupCount] = membersArr;
            regNoArr.push(parseInt(workobj[i].regNo));
            group["regNos" + groupCount] = regNoArr;
            ageSum = 0;
        }
        ageSum += workobj[i].age;
        ageArr.push(workobj[i].age);

        //array index checks
        if (typeof group["members" + groupCount][group["members" + groupCount].length - 1] !== 'undefined') {
            //store the value in i-1 index
            tempAge = group["members" + groupCount][group["members" + groupCount].length - 1].age;
        }

        if (typeof group["members" + groupCount][group["members" + groupCount].length - 2] !== 'undefined') {
            //store the value in i-2 index
            tempAge2 = group["members" + groupCount][group["members" + groupCount].length - 2].age;
        } else {
            //store the value in temp1 in temp2
            tempAge2 = tempAge;
        }

        //final result object
        result["noOfGroups"] = groupCount;
        result["group" + groupCount] = {
            "members": group["members" + groupCount],
            "oldest": Math.max(null, ageArr),
            "sum": ageSum,
            "regNos": group["regNos" + groupCount].sort(function (a, b) {
                return a - b
            }),
        }

    }

    // failsafe for empty array input
    if (groupCount == 0) {
        result["noOfGroups"] = groupCount;
    }

    return result;

}

module.exports = classifier;

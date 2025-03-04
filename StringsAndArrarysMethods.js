
function stringMethods() {
    console.log("--- All JavaScript String Methods That i Found During My Reserach on Internet, Iam Alos mentioning No with all mehtods ---");
    
    let str = "This is, My First Class Assignment of The MAD! SUbject, Iam Student oF COMSATS University Islamabad";
    
    
    console.log("1. length:", str.length);
    
    
    console.log("2. toLowerCase():", str.toLowerCase());
    console.log("3. toUpperCase():", str.toUpperCase());
    
    
    let paddedStr = "  Hello, World!  ";
    console.log("4. trim():", paddedStr.trim());
    console.log("5. trimStart():", paddedStr.trimStart());
    console.log("6. trimEnd():", paddedStr.trimEnd());
    
    console.log("7. charAt(7):", str.charAt(7));
    console.log("8. charCodeAt(7):", str.charCodeAt(7));
    console.log("9. indexOf('World'):", str.indexOf("World"));
    console.log("10. lastIndexOf('a'):", str.lastIndexOf("a"));
    

    console.log("11. slice(0, 5):", str.slice(0, 5));
    console.log("12. substring(0, 5):", str.substring(0, 5));
    console.log("13. substr(0, 5):", str.substr(0, 5)); 
    
    
    console.log("14. replace('Class', 'Project'):", str.replace("Class", " Project"));
    console.log("15. replaceAll('a', 'A'):", str.replaceAll("a", "A"));
    
    
    console.log("16. includes('MAD'):", str.includes("MAD"));
    console.log("17. startsWith('This'):", str.startsWith("This"));
    console.log("18. endsWith('Islamabad'):", str.endsWith("Islamabad"));
    
    
    console.log("19. split(' '):", str.split(" "));
    console.log("20. repeat(2):", "is".repeat(2));
    
    
    console.log("21. padStart(10, '0'):", "5".padStart(10, '0'));
    console.log("22. padEnd(10, '0'):", "5".padEnd(10, '0'));
    
    
    let regex = /a/g;
    console.log("23. match(regex):", str.match(regex));
    console.log("24. search('a'):", str.search('a'));
    
    
    console.log("25. concat(' More text'):", str.concat(" More text"));
    
    
    console.log("26. normalize():", str.normalize());
    
    
    console.log("27. localeCompare('Another String'):", str.localeCompare("Another String"));
}


function arrayMethods() {
    console.log("\n--- All JavaScript Array Methods That i Found During My Reserach on Internet  ---");
    
    let arr = [34, 22, 45, 89, 23, 98, 12, 33, 99, 87];
    
    
    console.log("1. length:", arr.length);
    
    
    let pushArr = [...arr];
    pushArr.push(11);
    console.log("2. push(11):", pushArr);
    
    let popArr = [...arr];
    let popped = popArr.pop();
    console.log("3. pop():", popped, "Remaining array:", popArr);
    
    let unshiftArr = [...arr];
    unshiftArr.unshift(0);
    console.log("4. unshift(0):", unshiftArr);
    
    let shiftArr = [...arr];
    let shifted = shiftArr.shift();
    console.log("5. shift():", shifted, "Remaining array:", shiftArr);
    
    
    console.log("6. map(x => x * 2):", arr.map(x => x * 2));
    console.log("7. filter(x => x % 2 === 0):", arr.filter(x => x % 2 === 0));
    console.log("8. reduce((acc, curr) => acc + curr, 0):", arr.reduce((acc, curr) => acc + curr, 0));
    console.log("9. reduceRight((acc, curr) => acc + curr, 0):", arr.reduceRight((acc, curr) => acc + curr, 0));
    
    
    console.log("10. find(x => x > 5):", arr.find(x => x > 5));
    console.log("11. findIndex(x => x > 5):", arr.findIndex(x => x > 5));
    console.log("12. some(x => x > 5):", arr.some(x => x > 5));
    console.log("13. every(x => x > 0):", arr.every(x => x > 0));
    
    
    console.log("14. forEach demonstration:");
    arr.forEach(x => console.log(x));
    
    
    console.log("15. slice(2, 6):", arr.slice(2, 6));
    
    let spliceArr = [...arr];
    spliceArr.splice(2, 2, 20, 30);
    console.log("16. splice(2, 2, 20, 30):", spliceArr);
    
    
    console.log("17. join('-'):", arr.join('-'));
    
    
    console.log("18. includes(5):", arr.includes(5));
    console.log("19. indexOf(5):", arr.indexOf(5));
    console.log("20. lastIndexOf(5):", arr.lastIndexOf(5));
    
    
    let sortArr = [...arr];
    sortArr.sort((a, b) => b - a);
    console.log("21. sort(descending):", sortArr);
    
    let reverseArr = [...arr];
    reverseArr.reverse();
    console.log("22. reverse():", reverseArr);
    
    
    let concatArr = arr.concat([11, 12, 13]);
    console.log("23. concat([11, 12, 13]):", concatArr);
    
    let spreadArr = [...arr, 11, 12, 13];
    console.log("24. Spread operator [...arr, 11, 12, 13]:", spreadArr);
    
    
    let flatArr = [1, [2, 3], [4, [5, 6]]];
    console.log("25. flat():", flatArr.flat());
    console.log("26. flatMap(x => [x, x * 2]):", arr.flatMap(x => [x, x * 2]));
    
    
    console.log("27. Array.from('hello'):", Array.from('hello'));
    console.log("28. Array.of(1, 2, 3):", Array.of(1, 2, 3));
    
    
    let fillArr = new Array(5);
    fillArr.fill(1);
    console.log("29. fill(1):", fillArr);
}


stringMethods();
arrayMethods();

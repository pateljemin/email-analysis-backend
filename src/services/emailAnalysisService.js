const similarity = require('string-similarity');

/**
 * This function is responsible to find repeat paragraphs from given emails. 
 * It uses string-similarity lib to compare two string and it gives similarity between 0 to 1.
 * 0 means not mathing anything between two strings and 1 means two strings are identical. 
 * 
 * @param {*} emails : List of emails in array form, from which repeat paragraphs need to find.
 * @param {*} threshold : User can decide threshold between 0 to 1 to consider two strings are identical. Default value is 0.5
 * @returns : return list of repeat paragraphs in decending sorted order by their repeat count.
 */

const findRepeatedParagraphSortedByCount = (emails, threshold = 0.5, snippetCount = 3) => {

    try {
        // Store email contents in an object
        const allEmailsContents = {};

        // Store repeat snippets with their count.
        const snippetsVsCount = new Map();

        emails.forEach((content, i) => {
            allEmailsContents[i] = content.split('\n').filter(para => para.trim() !== '');
        });

        // Calculate similarity between paragraphs

        // Iterate through each emails
        Object.keys(allEmailsContents).forEach(doc => {
            // Compare paragraphs within the same email
            const paragraphs = allEmailsContents[doc];
            for (let i = 0; i < paragraphs.length; i++) {
                for (let j = i + 1; j < paragraphs.length; j++) {
                    const similarityScore = similarity.compareTwoStrings(paragraphs[i], paragraphs[j]);
                    if (similarityScore >= threshold) { // Adjust the similarity threshold as needed
                        const count = snippetsVsCount.get(paragraphs[i]);
                        if (count) {
                            snippetsVsCount.set(paragraphs[i], count + 1);
                        } else {
                            snippetsVsCount.set(paragraphs[i], 1);
                        }
                    }
                }
            }

            // Compare paragraphs across different emails
            Object.keys(allEmailsContents).forEach(otherDoc => {
                if (doc !== otherDoc) {
                    const otherParagraphs = allEmailsContents[otherDoc];
                    paragraphs.forEach(para => {
                        otherParagraphs.forEach(otherPara => {
                            const similarityScore = similarity.compareTwoStrings(para, otherPara);
                            if (similarityScore >= threshold) { // Adjust the similarity threshold as needed
                                const count = snippetsVsCount.get(para);
                                if (count) {
                                    snippetsVsCount.set(para, count + 1);
                                } else {
                                    snippetsVsCount.set(para, 1);
                                }
                            }
                        });
                    });
                }
            });
        });

        // sort the result based on count
        const sortedsnippetsVsCount = new Map([...snippetsVsCount.entries()].sort((a, b) => b[1] - a[1]));

        const snippets = Array.from(sortedsnippetsVsCount.keys());
        const topSnippets = snippets.slice(0, snippetCount);
        return { isSuccess: true, snippets: topSnippets };
    } catch (e) {
        console.error(`[emailAnalysisService][findRepeatedParagraphSortedByCount] Error:`, e);
        return { isSuccess: false, message: 'Something went wrong' }
    }
}
module.exports = {
    findRepeatedParagraphSortedByCount
}